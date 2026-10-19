import * as THREE from "three";
import { mm, SIGNAL, SURFACE, CAP_MM } from "../design/tokens.js";
import { Panel, title, legend, micro, readout, window_, detents, figure, signed } from "../hardware/panel.js";

/**
 * The four instruments, built to the design system's elevations.
 *
 * Each one is stripped to the controls this experiment uses. A real bench supply
 * has forty; this has three, because the experiment turns three. That is the
 * direct answer to "a jumbled mess", and it is a design rule, not an omission.
 *
 * Panel art is drawn in MILLIMETRES, so every legend really is the 6 mm cap height
 * the headset needs at the distance the instrument stands.
 */

/** Canvas millimetres (origin top-left) to panel metres (origin centre). */
const place = (panelW, panelH, x, y) => [mm(x - panelW / 2), mm(panelH / 2 - y), 0];

export function createInstruments({ parts, materials, register }) {
  const built = new Map();

  /**
   * Mount one instrument: a case, its printed face, and the hardware on it.
   * `spec.jacks` and `spec.controls` are registered as interaction targets so the
   * pointer and the controllers find them through one path.
   */
  function build(id, { widthMM, heightMM, depthMM, draw, jacks = [], controls = [], indicators = [] }) {
    const group = new THREE.Group();
    group.name = id;
    const shell = parts.instrumentCase(widthMM, heightMM, { depthMM });
    group.add(shell);
    const face = shell.userData.face;

    const panel = new Panel(widthMM, heightMM, draw);
    face.add(parts.printedFace(panel, widthMM, heightMM));

    const mounted = { jacks: new Map(), controls: new Map(), indicators: new Map() };

    for (const jack of jacks) {
      const socket = parts.jack(jack.color);
      socket.position.set(...place(widthMM, heightMM, jack.x, jack.y));
      socket.position.z = mm(2.2);
      face.add(socket);
      socket.userData = { ...socket.userData, kind: "terminal", id: jack.terminal, instrument: id };
      register(socket, socket.userData);
      mounted.jacks.set(jack.terminal, socket);
    }

    for (const control of controls) {
      const object =
        control.kind === "key"
          ? parts.key({ width: mm(control.width ?? 26), height: mm(control.height ?? 20), color: control.color ?? SURFACE.trim, glyph: control.glyph })
          : parts.knob({ radius: mm(control.radius ?? 16), color: control.color ?? SURFACE.trim });
      object.position.set(...place(widthMM, heightMM, control.x, control.y));
      object.position.z = mm(2.2);
      face.add(object);
      object.userData = { ...object.userData, kind: control.kind === "key" ? "key" : "knob", id: control.id, instrument: id, control };
      register(object, object.userData);
      mounted.controls.set(control.id, object);
    }

    for (const indicator of indicators) {
      const lamp = parts.led(indicator.color, false);
      lamp.position.set(...place(widthMM, heightMM, indicator.x, indicator.y));
      lamp.position.z = mm(2.2);
      face.add(lamp);
      mounted.indicators.set(indicator.id, lamp);
    }

    const entry = { id, group, face, panel, ...mounted, widthMM, heightMM };
    built.set(id, entry);
    return entry;
  }

  // ---- DC supply ---------------------------------------------------------
  // 220 x 130 mm. Selectable +/-8, +/-12, +/-15 with clear +V, GND and -V, which
  // is item 1 of the engineer's brief.
  const supply = build("supply", {
    widthMM: 220,
    heightMM: 140,
    depthMM: 230,
    draw(c, w, h, state = {}) {
      title(c, "DC SUPPLY", 12, 20);

      // Each rail's figure sits directly above the terminal of the same colour,
      // so the display and the panel teach the same thing twice.
      window_(c, 12, 30, 134, 48);
      const rails = [
        ["+V", state.powered ? signed(state.rail, 1) : "– – –", "#e8766c", 34],
        ["GND", state.powered ? "0.0" : "– – –", "#e9eef0", 79],
        ["−V", state.powered ? signed(-state.rail, 1) : "– – –", "#74a9da", 124],
      ];
      for (const [label, value, colour, x] of rails) {
        micro(c, label, x, 42);
        readout(c, value, x, 63, { align: "center", cap: CAP_MM.readoutLG, color: colour });
        micro(c, "VOLTS", x, 74);
      }

      detents(c, 180, 60, 26, [
        { angle: 180, label: "±8" },
        { angle: 270, label: "±12" },
        { angle: 0, label: "±15" },
      ]);
      legend(c, "OUTPUT", 180, 100);
      micro(c, "POWER", 196, 134);

      for (const [label, x] of [
        ["+V", 34],
        ["GND", 79],
        ["−V", 124],
      ])
        legend(c, label, x, 134);
    },
    jacks: [
      { terminal: "supply.pos", color: SIGNAL.supplyPos, x: 34, y: 112 },
      { terminal: "supply.gnd", color: SIGNAL.ground, x: 79, y: 112 },
      { terminal: "supply.neg", color: SIGNAL.supplyNeg, x: 124, y: 112 },
    ],
    controls: [
      { id: "rail", kind: "knob", x: 180, y: 60, radius: 17.5, detent: [8, 12, 15] },
      { id: "power", kind: "key", x: 186, y: 116, width: 13, height: 13 },
    ],
    indicators: [{ id: "power", color: "#43e08a", x: 207, y: 116 }],
  });

  // ---- function generator ------------------------------------------------
  // 280 x 130 mm: the busiest panel, because the brief asks for waveform,
  // amplitude and frequency as separate controls, and they all need 6 mm labels.
  const generator = build("generator", {
    widthMM: 280,
    heightMM: 140,
    depthMM: 230,
    draw(c, w, h, state = {}) {
      title(c, "GENERATOR", 12, 20);
      micro(c, "10 Hz – 100 kHz", 268, 19, { align: "right" });
      window_(c, 12, 30, 150, 48);
      const source = state.sources?.[0] ?? { waveform: "sine", amplitude: 1, frequency: 1000 };

      // The displayed wave is the selected waveform, from the same maths the bench
      // runs; a decorative squiggle would teach the wrong shape.
      c.strokeStyle = SIGNAL.input;
      c.lineWidth = 1.1;
      c.lineJoin = "round";
      c.beginPath();
      for (let i = 0; i <= 96; i += 1) {
        const phase = (i / 96) * 2;
        const p = phase % 1;
        const unit =
          source.waveform === "dc"
            ? 0
            : source.waveform === "square"
              ? (p < 0.5 ? 1 : -1)
              : source.waveform === "triangle"
                ? (p < 0.25 ? 4 * p : p < 0.75 ? 2 - 4 * p : 4 * p - 4)
                : Math.sin(phase * Math.PI * 2);
        const x = 22 + (i / 96) * 52;
        const y = 54 - unit * 14;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();

      readout(c, figure(source.amplitude, 2), 136, 50, { align: "right", cap: CAP_MM.readoutLG });
      micro(c, source.waveform === "dc" ? "V DC" : "Vpp", 140, 50, { align: "left" });
      readout(c, figure(source.frequency / 1000, 2), 136, 72, { align: "right", cap: CAP_MM.readoutLG });
      micro(c, "kHz", 140, 72, { align: "left" });

      legend(c, "AMPLITUDE", 196, 92);
      legend(c, "FREQUENCY", 250, 92);
      legend(c, "WAVEFORM", 12, 100, { align: "left" });
      legend(c, "Vin", 196, 134);
      legend(c, "GND", 248, 134);
    },
    jacks: [
      { terminal: "gen.out1", color: SIGNAL.input, x: 196, y: 116 },
      { terminal: "gen.gnd", color: SIGNAL.ground, x: 248, y: 116 },
      { terminal: "gen.out2", color: SIGNAL.inputB, x: 164, y: 116 },
    ],
    controls: [
      { id: "amplitude", kind: "knob", x: 196, y: 54, radius: 16 },
      { id: "frequency", kind: "knob", x: 250, y: 54, radius: 16 },
      { glyph: "dc", id: "wave.dc", kind: "key", x: 28, y: 118, width: 24, height: 18 },
      { glyph: "sine", id: "wave.sine", kind: "key", x: 60, y: 118, width: 24, height: 18, color: SIGNAL.input },
      { glyph: "square", id: "wave.square", kind: "key", x: 92, y: 118, width: 24, height: 18 },
      { glyph: "triangle", id: "wave.triangle", kind: "key", x: 124, y: 118, width: 24, height: 18 },
    ],
  });

  // ---- multimeter --------------------------------------------------------
  // 180 x 130 mm. This instrument exists to show one number, so the number takes
  // the panel: 15 mm cap, readable from anywhere in the room.
  const meter = build("meter", {
    widthMM: 180,
    heightMM: 140,
    depthMM: 200,
    draw(c, w, h, state = {}) {
      title(c, "MULTIMETER", 12, 20);
      window_(c, 12, 28, 156, 50);
      const reading = state.meter;
      micro(c, `${(state.meterMode ?? "dc").toUpperCase()} VOLTAGE`, 20, 41, { align: "left" });
      micro(c, state.meterMode === "ac" ? "TRUE RMS" : "AUTO", 160, 41, { align: "right" });
      if (reading?.error) {
        readout(c, "– – . – –", 160, 66, { align: "right", cap: CAP_MM.readoutXL, color: "#c05621" });
        micro(c, reading.error, 160, 75, { align: "right", color: "#c05621" });
      } else {
        readout(c, signed(reading?.value, 2), 160, 66, { align: "right", cap: CAP_MM.readoutXL });
        micro(c, reading?.unit ?? "V", 160, 75, { align: "right" });
      }
      detents(c, 44, 104, 24, [
        { angle: 180, label: "OFF" },
        { angle: 270, label: "DC V" },
        { angle: 0, label: "AC V" },
      ]);
      legend(c, "V", 116, 134);
      legend(c, "COM", 152, 134);
      micro(c, "INPUT", 134, 90);
    },
    jacks: [
      { terminal: "meter.v", color: SIGNAL.supplyPos, x: 116, y: 112 },
      { terminal: "meter.com", color: SIGNAL.ground, x: 152, y: 112 },
    ],
    controls: [{ id: "meterMode", kind: "knob", x: 44, y: 104, radius: 16 }],
  });

  // ---- oscilloscope ------------------------------------------------------
  // 300 x 200 mm. CH1 carries Vin in the same amber as the input lead, CH2 Vout:
  // a student can look at a trace and know which wire made it.
  const scope = build("scope", {
    widthMM: 300,
    heightMM: 200,
    depthMM: 150,
    draw(c, w, h, state = {}) {
      title(c, "OSCILLOSCOPE", 12, 18);
      const X = 12;
      const Y = 26;
      const W = 208;
      const H = 112;
      window_(c, X, Y, W, H);
      const strip = 14;
      const plot = H - strip;

      c.strokeStyle = SURFACE.graticule;
      c.lineWidth = 0.25;
      for (let i = 1; i < 10; i += 1) {
        c.beginPath();
        c.moveTo(X + (W * i) / 10, Y);
        c.lineTo(X + (W * i) / 10, Y + plot);
        c.stroke();
      }
      for (let i = 1; i < 8; i += 1) {
        c.beginPath();
        c.moveTo(X, Y + (plot * i) / 8);
        c.lineTo(X + W, Y + (plot * i) / 8);
        c.stroke();
      }

      const perDiv = state.scale ?? { ch1: 1, ch2: 2, time: 200 };
      const trace = (samples, vdiv, colour) => {
        if (!samples || !samples.length) return;
        c.strokeStyle = colour;
        c.lineWidth = 0.6;
        c.lineJoin = "round";
        c.beginPath();
        const div = plot / 8;
        const mid = Y + plot / 2;
        for (let i = 0; i < samples.length; i += 1) {
          const x = X + (i / (samples.length - 1)) * W;
          const y = Math.max(Y + 0.5, Math.min(Y + plot - 0.5, mid - (samples[i] / vdiv) * div));
          if (i === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();
      };
      trace(state.ch1, perDiv.ch1, SURFACE.traceA);
      trace(state.ch2, perDiv.ch2, SURFACE.traceB);

      // Scale factors live on the screen, as on a real scope. The gain is in these
      // numbers, not in the trace heights.
      c.fillStyle = "rgba(11,14,16,0.88)";
      c.fillRect(X, Y + plot, W, strip);
      c.fillStyle = SURFACE.traceA;
      c.fillRect(X + 4, Y + plot + 4.5, 4, 4);
      micro(c, `CH1  ${figure(perDiv.ch1, 2)} V`, X + 11, Y + plot + 9, { align: "left", color: SURFACE.traceA });
      c.fillStyle = SURFACE.traceB;
      c.fillRect(X + 72, Y + plot + 4.5, 4, 4);
      micro(c, `CH2  ${figure(perDiv.ch2, 2)} V`, X + 79, Y + plot + 9, { align: "left", color: SURFACE.traceB });
      micro(c, `${perDiv.time} µs`, X + W - 5, Y + plot + 9, { align: "right", color: SURFACE.readoutPrimary });

      legend(c, "VOLTS/DIV", 258, 34);
      legend(c, "TIME/DIV", 258, 108);
      for (const [label, x] of [
        ["CH1", 44],
        ["⏚", 86],
        ["CH2", 148],
        ["⏚", 190],
      ])
        legend(c, label, x, 160);
    },
    jacks: [
      { terminal: "scope.ch1", color: SIGNAL.input, x: 44, y: 180 },
      { terminal: "scope.ch1gnd", color: SIGNAL.ground, x: 86, y: 180 },
      { terminal: "scope.ch2", color: SIGNAL.output, x: 148, y: 180 },
      { terminal: "scope.ch2gnd", color: SIGNAL.ground, x: 190, y: 180 },
    ],
    controls: [
      { id: "voltsPerDiv", kind: "knob", x: 258, y: 58, radius: 16 },
      { id: "timePerDiv", kind: "knob", x: 258, y: 132, radius: 16 },
    ],
  });

  return {
    all: built,
    supply,
    generator,
    meter,
    scope,
    get(id) {
      return built.get(id);
    },
    dispose() {
      for (const entry of built.values()) entry.panel.dispose();
      built.clear();
    },
  };
}
