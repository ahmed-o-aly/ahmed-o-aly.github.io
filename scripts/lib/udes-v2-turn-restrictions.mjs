/** Derive only turn prohibitions supported by consistent frozen OSRM entry flags. */
export function deriveTurnRestrictions(nodes, edges, sourceRoutes, candidates) {
  const pointKey = (point) => point.map((value) => Number(value).toFixed(5)).join(",");
  const rad = (value) => (value * Math.PI) / 180;
  const distance = (a, b) => ((Math.hypot((b[0] - a[0]) * Math.cos(rad((a[1] + b[1]) / 2)), b[1] - a[1]) * Math.PI) / 180) * 6371000;
  const bearing = (a, b) => ((Math.atan2((b[0] - a[0]) * Math.cos(rad((a[1] + b[1]) / 2)), b[1] - a[1]) * 180) / Math.PI + 360) % 360;
  const gap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
  const directionKey = (item) => `${item.edgeId}:${item.direction}`;
  const transitionKey = (entry, exit) => `${directionKey(entry)}>${directionKey(exit)}`;
  const witnessedTransitions = new Set(
    candidates.flatMap((route) => route.traversals.slice(1).map((item, index) => transitionKey(route.traversals[index], item)))
  );
  const observations = new Map();
  for (const route of sourceRoutes) {
    for (const step of route.steps)
      for (const intersection of step.intersections || []) {
        const key = pointKey(intersection.location);
        if (!observations.has(key)) observations.set(key, []);
        observations.get(key).push({ ...intersection, sourceRouteId: route.id, sourceSnapshotFile: route.sourceSnapshotFile });
      }
  }
  const incoming = new Map(nodes.map((node) => [node.id, []]));
  const outgoing = new Map(nodes.map((node) => [node.id, []]));
  for (const edge of edges)
    for (const direction of [1, -1]) {
      if (!(direction === 1 ? edge.allowAB : edge.allowBA)) continue;
      const points = direction === 1 ? edge.geometry.coordinates : [...edge.geometry.coordinates].reverse();
      const item = { edgeId: edge.id, direction, points };
      incoming.get(direction === 1 ? edge.to : edge.from).push(item);
      outgoing.get(direction === 1 ? edge.from : edge.to).push(item);
    }
  const heading = (points) => {
    const origin = points[0];
    const target = points.slice(1).find((point) => distance(origin, point) >= 10) || points.at(-1);
    return { bearing: bearing(origin, target), span: distance(origin, target) };
  };
  const restrictions = [];
  const conflicts = [];
  let ambiguousCandidateTurns = 0;
  for (const node of nodes) {
    const records = observations.get(pointKey(node.coord)) || [];
    for (const entry of incoming.get(node.id))
      for (const exit of outgoing.get(node.id)) {
        const inbound = heading([...entry.points].reverse()),
          outbound = heading(exit.points);
        if (inbound.span < 5 || outbound.span < 5) continue;
        const matches = records
          .filter((record) => Number.isInteger(record.in) && gap(record.bearings[record.in], inbound.bearing) <= 15)
          .map((record) => {
            const exits = record.bearings
              .map((value, index) => ({ index, difference: gap(value, outbound.bearing) }))
              .sort((a, b) => a.difference - b.difference);
            return { record, first: exits[0], second: exits[1] };
          })
          .filter(({ first, second }) => first.difference <= 15 && (!second || second.difference - first.difference >= 10));
        if (!matches.length || !matches.some(({ record, first }) => record.entry[first.index] === false)) continue;
        if (matches.some(({ record, first }) => record.entry[first.index] !== false)) {
          ambiguousCandidateTurns++;
          continue;
        }
        if (witnessedTransitions.has(transitionKey(entry, exit))) {
          conflicts.push({
            viaNodeId: node.id,
            incomingEdgeId: entry.edgeId,
            incomingDirection: entry.direction,
            outgoingEdgeId: exit.edgeId,
            outgoingDirection: exit.direction,
          });
          continue;
        }
        restrictions.push({
          viaNodeId: node.id,
          incomingEdgeId: entry.edgeId,
          incomingDirection: entry.direction,
          outgoingEdgeId: exit.edgeId,
          outgoingDirection: exit.direction,
          sourceClass: "derived",
          source: "frozen-osrm-intersection-entry-flags",
          sourceRouteIds: [...new Set(matches.map(({ record }) => record.sourceRouteId))].sort(),
          evidence: matches.slice(0, 3).map(({ record, first }) => ({
            sourceRouteId: record.sourceRouteId,
            sourceSnapshotFile: record.sourceSnapshotFile,
            location: record.location,
            bearings: record.bearings,
            entry: record.entry,
            incomingIndex: record.in,
            prohibitedOutgoingIndex: first.index,
          })),
        });
      }
  }
  return {
    restrictions,
    evidence: {
      source: "Frozen OSRM route-step intersection entry flags; https://project-osrm.org/docs/v5.24.0/api/#intersection-object",
      rule: "At a shared geometry junction, match the incoming and outgoing road bearings within 15 degrees with an unambiguous outgoing match (10-degree separation) and at least 5 metres of geometry. Prohibit only when every matched incoming observation says entry=false and no complete source route uses the transition.",
      restrictionCount: restrictions.length,
      ambiguousCandidateTurns,
      sourceCandidateConflicts: conflicts,
      limitation:
        "Restrictions are a conservatively derived subset from observed source-route approaches; unobserved approaches remain unknown. Geometry-only crossings do not establish legal turns.",
    },
  };
}
