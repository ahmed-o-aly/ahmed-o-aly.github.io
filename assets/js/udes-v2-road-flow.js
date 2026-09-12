/* Directional rendering of assigned road demand. This layer never creates trips. */
((scope) => {
  "use strict";

  function directionalStreams(features, links) {
    const byId = new Map(links.map((link) => [String(link.id || link.linkId), link]));
    const streams = [];
    for (const feature of features) {
      const properties = feature.properties || {};
      const link = byId.get(String(properties.id || feature.id));
      if (!link || properties.contextOnly || link.contextOnly || link.loadBearing === false) continue;
      const coordinates = feature.geometry?.type === "LineString" ? feature.geometry.coordinates : null;
      if (!coordinates || coordinates.length < 2) continue;
      for (const direction of [1, -1]) {
        const forward = direction === 1;
        const volume = Number(forward ? link.loadABVehicles : link.loadBAVehicles) || 0;
        const allowed = forward ? link.allowAB ?? properties.allowAB : link.allowBA ?? properties.allowBA;
        // Geometry orientation is arbitrary: a one-way road may legally run B→A.
        // Positive assigned volume is sufficient when a legacy snapshot omits flags.
        if (volume <= 0 || allowed === false) continue;
        const duration = Number(forward ? link.travelTimeABMin : link.travelTimeBAMin) || Number(link.freeFlowMinutes) || 1;
        streams.push({
          id: `${properties.id || feature.id}:${direction}`,
          coordinates,
          direction,
          volume,
          load: Math.max(0, Number(forward ? link.volumeCapacityAB : link.volumeCapacityBA) || 0),
          speedKmh: Math.max(1, Math.min(120, ((Number(link.distanceKm) || 0.1) * 60) / duration)),
        });
      }
    }
    return streams;
  }

  function measurePath(points) {
    const lengths = [0];
    for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
    return { points, lengths, total: lengths.at(-1) || 0 };
  }

  function pointAlong(path, fraction) {
    if (path.total <= 0 || path.points.length < 2) return null;
    const target = Math.max(0, Math.min(1, fraction)) * path.total;
    let low = 1;
    let high = path.lengths.length - 1;
    while (low < high) {
      const middle = (low + high) >> 1;
      if (path.lengths[middle] < target) low = middle + 1;
      else high = middle;
    }
    const a = path.points[low - 1];
    const b = path.points[low];
    const ratio = (target - path.lengths[low - 1]) / Math.max(0.00001, path.lengths[low] - path.lengths[low - 1]);
    return { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio, angle: Math.atan2(b.y - a.y, b.x - a.x) };
  }

  // Clip only the displayed sample, preserving distances and direction along
  // the original road. Offscreen road length must not consume the symbol budget.
  function visiblePathRanges(path, viewport) {
    const ranges = [];
    for (let i = 1; i < path.points.length; i++) {
      const a = path.points[i - 1];
      const b = path.points[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      let enter = 0;
      let leave = 1;
      let visible = true;
      for (const [direction, distance] of [
        [-dx, a.x],
        [dx, viewport.width - a.x],
        [-dy, a.y],
        [dy, viewport.height - a.y],
      ]) {
        if (direction === 0) {
          if (distance < 0) {
            visible = false;
            break;
          }
        } else {
          const fraction = distance / direction;
          if (direction < 0) enter = Math.max(enter, fraction);
          else leave = Math.min(leave, fraction);
          if (enter > leave) {
            visible = false;
            break;
          }
        }
      }
      if (!visible) continue;
      const segmentLength = path.lengths[i] - path.lengths[i - 1];
      const start = path.lengths[i - 1] + enter * segmentLength;
      const end = path.lengths[i - 1] + leave * segmentLength;
      if (end <= start) continue;
      if (ranges.length && Math.abs(ranges.at(-1).end - start) < 0.00001) ranges.at(-1).end = end;
      else ranges.push({ start, end });
    }
    return { visibleRanges: ranges, visibleLength: ranges.reduce((total, range) => total + range.end - range.start, 0) };
  }

  function pointAlongVisible(path, fraction) {
    let remaining = Math.max(0, Math.min(1, fraction)) * path.visibleLength;
    for (const range of path.visibleRanges) {
      const length = range.end - range.start;
      if (remaining <= length) return pointAlong(path, (range.start + remaining) / path.total);
      remaining -= length;
    }
    return path.visibleRanges.length ? pointAlong(path, path.visibleRanges.at(-1).end / path.total) : null;
  }

  function stablePhase(id) {
    let hash = 2166136261;
    for (const letter of String(id)) hash = Math.imul(hash ^ letter.charCodeAt(0), 16777619);
    hash = Math.imul(hash ^ (hash >>> 16), 0x7feb352d);
    hash = Math.imul(hash ^ (hash >>> 15), 0x846ca68b);
    return ((hash ^ (hash >>> 16)) >>> 0) / 4294967296;
  }

  function allocateFlowSymbols(paths, viewport, options = {}) {
    const requestedBudget = options.maxSymbols ?? Math.min(80, Math.floor((viewport.width * viewport.height) / 18000));
    const budget = Number.isFinite(requestedBudget) ? Math.max(0, Math.floor(requestedBudget)) : 0;
    if (!budget) return [];
    const candidates = paths
      .filter((path) => Number.isFinite(path.volume) && path.volume > 0)
      .map((path) => ({ ...path, ...visiblePathRanges(path, viewport), phase: stablePhase(path.id) }))
      .filter((path) => path.visibleLength >= 40);
    const maximum = Math.max(1, ...candidates.map((path) => path.volume));
    for (const path of candidates) {
      // Relative demand controls density; no symbol represents one vehicle.
      path.desiredSymbols = Math.min(6, (path.visibleLength / 180) * (0.25 + 0.75 * Math.sqrt(path.volume / maximum)));
    }
    const totalDesired = candidates.reduce((total, path) => total + path.desiredSymbols, 0);
    const target = Math.min(budget, Math.round(totalDesired));
    if (!target) return [];
    for (const path of candidates) {
      const quota = (path.desiredSymbols * target) / totalDesired;
      path.symbolCount = Math.floor(quota);
      path.remainder = quota - path.symbolCount;
    }
    let remaining = target - candidates.reduce((total, path) => total + path.symbolCount, 0);
    // Stable tie-breaking scatters the sparse sample across road IDs without
    // changing positions each frame or privileging the first district in data.
    const ranked = [...candidates].sort((a, b) => b.remainder - a.remainder || a.phase - b.phase || String(a.id).localeCompare(String(b.id)));
    for (const path of ranked) {
      if (remaining <= 0) break;
      path.symbolCount += 1;
      remaining -= 1;
    }
    return candidates.filter((path) => path.symbolCount > 0);
  }

  function flowPixelsPerSecond(speedKmh) {
    const speed = Number.isFinite(speedKmh) ? Math.max(1, Math.min(120, speedKmh)) : 1;
    return 0.35 * (12 + speed * 0.36);
  }

  function createLayer(L) {
    return new (L.Layer.extend({
      initialize() {
        this.streams = [];
        this.paths = [];
        this.enabled = true;
        this.elapsed = 0;
        this.motion = matchMedia("(prefers-reduced-motion: reduce)");
        this.onMotionChange = () => this.restart();
      },
      onAdd(map) {
        this.map = map;
        const pane = map.getPane("udesV2RoadFlow") || map.createPane("udesV2RoadFlow");
        pane.style.zIndex = "440";
        pane.style.pointerEvents = "none";
        this.canvas = L.DomUtil.create("canvas", "udes-v2-road-flow", pane);
        this.canvas.setAttribute("aria-hidden", "true");
        this.context = this.canvas.getContext("2d");
        map.on("movestart zoomstart", this.suspend, this);
        map.on("moveend zoomend resize", this.project, this);
        this.onVisibilityChange = () => this.restart();
        document.addEventListener("visibilitychange", this.onVisibilityChange);
        this.motion.addEventListener("change", this.onMotionChange);
        this.project();
      },
      onRemove(map) {
        cancelAnimationFrame(this.frame);
        map.off("movestart zoomstart", this.suspend, this);
        map.off("moveend zoomend resize", this.project, this);
        document.removeEventListener("visibilitychange", this.onVisibilityChange);
        this.motion.removeEventListener("change", this.onMotionChange);
        this.canvas.remove();
        this.map = null;
      },
      setData(features, links) {
        this.streams = directionalStreams(features, links);
        this.project();
      },
      setEnabled(enabled) {
        this.enabled = Boolean(enabled);
        this.restart();
      },
      suspend() {
        cancelAnimationFrame(this.frame);
        if (this.canvas) this.canvas.hidden = true;
      },
      project() {
        if (!this.map) return;
        const size = this.map.getSize();
        // Keep container-pixel paths aligned inside Leaflet's moving map pane.
        // The dedicated pane places flow below agent markers and district labels.
        L.DomUtil.setPosition(this.canvas, this.map.containerPointToLayerPoint([0, 0]));
        const ratio = Math.min(devicePixelRatio || 1, 2);
        this.canvas.width = Math.round(size.x * ratio);
        this.canvas.height = Math.round(size.y * ratio);
        this.canvas.style.width = `${size.x}px`;
        this.canvas.style.height = `${size.y}px`;
        this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
        const projected = this.streams.map((stream) => ({
          ...stream,
          ...measurePath(stream.coordinates.map(([lng, lat]) => this.map.latLngToContainerPoint([lat, lng]))),
        }));
        this.paths = allocateFlowSymbols(projected, { width: size.x, height: size.y });
        this.restart();
      },
      restart() {
        cancelAnimationFrame(this.frame);
        if (!this.canvas) return;
        this.canvas.hidden = !this.enabled;
        if (!this.enabled || document.hidden) return;
        this.previousTime = null;
        this.draw(performance.now());
      },
      draw(now) {
        if (!this.map || !this.enabled) return;
        if (this.previousTime !== null) this.elapsed += Math.min(now - this.previousTime, 100) / 1000;
        this.previousTime = now;
        const ctx = this.context;
        const size = this.map.getSize();
        ctx.clearRect(0, 0, size.x, size.y);
        for (const path of this.paths) {
          // Bounded symbol density encodes relative assigned demand, not individual vehicles.
          const count = path.symbolCount;
          const travel = this.motion.matches ? 0 : (this.elapsed * flowPixelsPerSecond(path.speedKmh)) / path.visibleLength;
          for (let i = 0; i < count; i++) {
            let fraction = (i / count + path.phase + travel) % 1;
            if (path.direction === -1) fraction = 1 - fraction;
            const point = pointAlongVisible(path, fraction);
            if (!point || point.x < -10 || point.y < -10 || point.x > size.x + 10 || point.y > size.y + 10) continue;
            const angle = point.angle + (path.direction === -1 ? Math.PI : 0);
            const offset = 1.9 * path.direction;
            ctx.save();
            ctx.translate(point.x - Math.sin(point.angle) * offset, point.y + Math.cos(point.angle) * offset);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(-3.5, -2.4);
            ctx.lineTo(1, 0);
            ctx.lineTo(-3.5, 2.4);
            ctx.strokeStyle = "rgba(255,255,255,0.93)";
            ctx.lineWidth = 1.7;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();
            ctx.restore();
          }
        }
        if (!this.motion.matches) this.frame = requestAnimationFrame((time) => this.draw(time));
      },
    }))();
  }

  const api = {
    directionalStreams,
    measurePath,
    pointAlong,
    visiblePathRanges,
    pointAlongVisible,
    allocateFlowSymbols,
    flowPixelsPerSecond,
    createLayer,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else scope.UdesRoadFlow = api;
})(typeof window !== "undefined" ? window : {});
