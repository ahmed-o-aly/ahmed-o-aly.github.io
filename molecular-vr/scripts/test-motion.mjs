import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import * as THREE from 'three';
import { SnapshotPlayback } from '../src/motion-state.js';

test('snapshot playback uses observed endpoints, pauses, and stops without wrapping', () => {
  const playback = new SnapshotPlayback(6, 4);
  assert.equal(playback.interpolate, false);
  playback.toggle();
  for (const delta of [0.15, 0.4, 0.7, 1.5]) {
    playback.update(delta);
    assert.equal(playback.position, 0);
  }
  playback.toggle();
  playback.update(60);
  assert.equal(playback.position, 0, 'paused updates cannot advance');
  playback.toggle();
  const observed = [];
  for (let i = 0; i < 24; i++) {
    playback.update(1.37);
    observed.push(playback.position);
    assert.ok(Number.isInteger(playback.position), 'default playback must never synthesize a fractional state');
  }
  assert.ok(observed.includes(1) && observed.includes(4));
  assert.equal(playback.position, 5);
  assert.equal(playback.playing, false);
  playback.update(1000);
  assert.equal(playback.position, 5, 'last state cannot automatically wrap');
  playback.toggle();
  assert.equal(playback.position, 0, 'explicit replay may restart');
  assert.equal(playback.playing, true);
});

test('seeking clamps positions, ignores invalid numbers, and disabling interpolation snaps', () => {
  const playback = new SnapshotPlayback(6);
  playback.seek(-100); assert.equal(playback.position, 0);
  playback.seek(100); assert.equal(playback.position, 5);
  playback.seek(2.3); assert.equal(playback.position, 2);
  for (const value of [NaN, Infinity, -Infinity]) playback.seek(value);
  assert.equal(playback.position, 2);
  playback.setInterpolation(true);
  playback.seek(2.7); assert.equal(playback.position, 2.7);
  playback.setInterpolation(false); assert.equal(playback.position, 3);
  playback.step(-10); assert.equal(playback.position, 0);
  playback.step(10); assert.equal(playback.position, 5);
  assert.equal(playback.playing, false);
});

test('illustrative playback advances continuously but still stops at the final endpoint', () => {
  const playback = new SnapshotPlayback(6, 2);
  playback.setInterpolation(true); playback.toggle();
  playback.update(1); assert.equal(playback.position, 0.5);
  playback.toggle(); playback.update(30); assert.equal(playback.position, 0.5);
  playback.toggle(); playback.update(30);
  assert.equal(playback.position, 5);
  assert.equal(playback.playing, false);
});

test('next and previous from an illustration select the nearest endpoint in that direction', () => {
  const playback = new SnapshotPlayback(6);
  playback.setInterpolation(true);
  playback.seek(1.8); playback.step(1);
  assert.equal(playback.position, 2, 'next must not skip the upcoming observed endpoint');
  playback.seek(1.2); playback.step(-1);
  assert.equal(playback.position, 1, 'previous must not skip the preceding observed endpoint');
  playback.seek(2); playback.step(1); assert.equal(playback.position, 3);
  playback.step(-1); assert.equal(playback.position, 2);
});

test('published data keeps observed counts, correspondence, gaps, and unassigned substrate separate', async () => {
  const data = JSON.parse(await readFile(new URL('../public/data/motion/motion.json', import.meta.url)));
  assert.deepEqual(data.states.map(state => state.pdbId), ['7W3A', '7W3B', '7W3C', '7W3F', '7W3G', '7W3H']);
  assert.deepEqual(data.states.map(state => state.label), ['ED4', 'ED5', 'ED0', 'ED1', 'ED2.0', 'ED2.1']);
  assert.equal(data.playbackTerminatesAfterLastState, true);
  const counts = Array(6).fill(0);
  for (const chain of data.chains) {
    assert.equal(chain.observedFrames.length, 6);
    assert.equal(chain.frames.length, 6);
    for (const [state, frame] of chain.observedFrames.entries()) {
      counts[state] += frame.points.length;
      assert.equal(frame.points.length, frame.residueNumbers.length);
      assert.equal(frame.points.length, frame.residueNames.length);
      assert.ok(frame.points.every(point => point.length === 3 && point.every(Number.isFinite)));
      let covered = 0;
      for (const [start, end] of frame.segments) {
        assert.equal(start, covered);
        assert.ok(end > start && end <= frame.points.length);
        for (let j = start + 1; j < end; j++) {
          const a = frame.points[j - 1], b = frame.points[j];
          assert.ok(Math.hypot(...a.map((v, k) => v - b[k])) <= 5.002, 'rendered segments must not bridge missing coordinates');
        }
        covered = end;
      }
      assert.equal(covered, frame.points.length);
      if (chain.interpolationAllowed) {
        assert.equal(chain.sequenceVerified, true);
        assert.equal(chain.frames[state].length, chain.frames[0].length);
        const indices = new Map(frame.residueNumbers.map((number, i) => [`${number}:${frame.insertionCodes[i]}`, i]));
        for (let j = 0; j < chain.frames[state].length; j++) {
          const index = indices.get(`${chain.residueNumbers[j]}:${chain.insertionCodes[j]}`);
          assert.notEqual(index, undefined);
          assert.equal(frame.residueNames[index], chain.residueNames[j]);
          assert.deepEqual(frame.points[index], chain.frames[state][j], 'common coordinates must be actual observed endpoint coordinates');
        }
      }
    }
  }
  assert.deepEqual(counts, data.states.map(state => state.observedResidueCount));
  const substrate = data.chains.find(chain => chain.authId === 'v');
  assert.equal(substrate.interpolationAllowed, false);
  assert.equal(substrate.sequenceVerified, false);
  assert.ok(substrate.frames.every(frame => frame.length === 0));
  assert.ok(substrate.observedFrames.every(frame => frame.points.length > 0));
  const usp14 = data.chains.find(chain => chain.authId === 'x');
  assert.equal(usp14.observedFrames[1].points.length, 392, 'ED5 preserves its deposited missing UBL domain');
  assert.equal(usp14.observedFrames[0].points.length, 494);
});

// Import the production module in Node with only its bundler URL substituted.
// The actual scene/geometry and interaction code is tested, without a WebGL device.
let moduleSource = await readFile(new URL('../src/motion.js', import.meta.url), 'utf8');
moduleSource = moduleSource
  .replace("from 'three'", `from '${import.meta.resolve('three')}'`)
  .replace("from 'three/addons/utils/BufferGeometryUtils.js'", `from '${import.meta.resolve('three/addons/utils/BufferGeometryUtils.js')}'`)
  .replace("from './motion-state.js'", `from '${new URL('../src/motion-state.js', import.meta.url)}'`)
  .replaceAll('import.meta.env.BASE_URL', "'/'");
const { createMotionComparison } = await import(`data:text/javascript;base64,${Buffer.from(moduleSource).toString('base64')}`);

class Element {
  constructor() {
    this.children = []; this.dataset = {}; this.attributes = {}; this.checked = false;
    this.value = ''; this.classList = { toggle() {} };
  }
  appendChild(child) { this.children.push(child); }
  setAttribute(name, value) { this.attributes[name] = value; }
  getContext() { return { clearRect() {}, fillRect() {}, fillText() {} }; }
}
function fixture() {
  // Change both orientation and length so linkage tests catch axial-only or
  // cross-section scaling mistakes as well as choosing the wrong source state.
  const frames = Array.from({ length: 6 }, (_, i) => [[i, 0, 0], [i + i * 0.2, 2 + i * 0.1, i * 0.3], [i - i * 0.1, 4 + i * 0.05, i * 0.4]]);
  const chain = (authId) => ({ authId, name: authId, interpolationAllowed: authId !== 'v', frames: authId === 'v' ? frames.map(() => []) : frames, segments: [[0, 3]], observedFrames: frames.map((points, i) => {
    const full = authId === 'x' && i !== 1 ? [...points, [i, 6, 0]] : points;
    return { points: full, segments: [[0, full.length]] };
  }) });
  return { states: ['ED4', 'ED5', 'ED0', 'ED1', 'ED2.0', 'ED2.1'].map((label, i) => ({ label, pdbId: ['7W3A', '7W3B', '7W3C', '7W3F', '7W3G', '7W3H'][i], resolution: 3.5, coreRmsd: 0.8 })), chains: ['A', 'x', 'v'].map(chain) };
}
function environment({ manualFrames = false } = {}) {
  const elements = new Map();
  const element = id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
  globalThis.document = { getElementById: element, createElement: () => new Element() };
  const frames = [];
  globalThis.requestAnimationFrame = callback => manualFrames ? frames.push(callback) : queueMicrotask(callback);
  globalThis.fetch = async () => ({ ok: true, json: async () => fixture() });
  const parent = new THREE.Group(), changes = [], modes = [];
  const motion = createMotionComparison({ parent, onChange: change => changes.push(change), onMode: mode => modes.push(mode) });
  return { parent, motion, changes, modes, element, frames };
}

test('comparison scene shows full observed endpoints and explicitly limited interpolation', async () => {
  const { parent, motion, changes, modes, element } = environment();
  await motion.activate();
  const root = parent.children[0];
  const visibleGroup = () => root.children.find(child => child.isGroup && child.visible);
  assert.equal(motion.active, true);
  assert.equal(changes.at(-1).exact, true);
  assert.equal(visibleGroup().children.length, 3, 'observed endpoint includes substrate');
  motion.action('toggle-playback'); motion.update(4);
  assert.equal(changes.at(-1).position, 1);
  assert.equal(visibleGroup().children.find(mesh => mesh.userData.chain.authId === 'x').userData.frame.points.length, 3);
  motion.action('toggle-playback'); motion.update(30);
  assert.equal(changes.at(-1).position, 1, 'VR pause callback stops playback');
  element('motion-ghost').checked = true; element('motion-ghost').onchange();
  const ghost = root.children.find(child => child.isGroup && child.children[0]?.material.transparent);
  assert.equal(ghost.visible, true, 'the ED4 reference may overlay observed endpoints');
  element('motion-smooth').checked = true; await element('motion-smooth').onchange();
  element('motion-position').value = '1.5'; element('motion-position').oninput();
  assert.equal(changes.at(-1).exact, false);
  assert.equal(ghost.visible, false, 'reference substrate and unmatched residues must not reappear through the ghost during interpolation');
  const morph = visibleGroup();
  assert.equal(morph.children.length, 2, 'interpolation excludes unassigned substrate');
  for (const mesh of morph.children) {
    assert.equal(mesh.isInstancedMesh, true, 'illustrative links use independently oriented fixed-radius cylinders');
    assert.equal(mesh.count, mesh.userData.edges.length);
    assert.equal(mesh.geometry.parameters.radiusTop, 0.55);
    assert.equal(mesh.geometry.parameters.radiusBottom, 0.55);
    assert.equal(mesh.geometry.parameters.height, 1);
    const chain = mesh.userData.chain;
    for (const [index, [start, end]] of mesh.userData.edges.entries()) {
      assert.ok(chain.segments.some(([a, b]) => start >= a && end < b), 'links cannot bridge a sequence gap');
      const expectedStart = new THREE.Vector3(...chain.frames[1][start]).lerp(new THREE.Vector3(...chain.frames[2][start]), 0.5);
      const expectedEnd = new THREE.Vector3(...chain.frames[1][end]).lerp(new THREE.Vector3(...chain.frames[2][end]), 0.5);
      const transform = new THREE.Matrix4(); mesh.getMatrixAt(index, transform);
      const bottom = new THREE.Vector3(0, -0.5, 0).applyMatrix4(transform);
      const top = new THREE.Vector3(0, 0.5, 0).applyMatrix4(transform);
      const error = Math.min(bottom.distanceTo(expectedStart) + top.distanceTo(expectedEnd), bottom.distanceTo(expectedEnd) + top.distanceTo(expectedStart));
      assert.ok(error < 1e-5, 'both cylinder ends must equal linearly blended neighboring measured C-alpha coordinates');
      const midpoint = new THREE.Vector3().applyMatrix4(transform);
      for (const offset of [[0.55, 0, 0], [0, 0, 0.55]]) {
        const radius = new THREE.Vector3(...offset).applyMatrix4(transform).distanceTo(midpoint);
        assert.ok(Math.abs(radius - 0.55) < 1e-6, 'cylinder cross-section must retain its radius while endpoints move');
      }
    }
  }
  element('motion-smooth').checked = false; await element('motion-smooth').onchange();
  assert.equal(changes.at(-1).exact, true);
  assert.equal(changes.at(-1).position, 2);
  assert.equal(visibleGroup().children.length, 3, 'turning interpolation off restores the full observed snapshot');
  motion.action('toggle-playback'); motion.deactivate();
  assert.equal(root.visible, false);
  assert.equal(motion.active, false);
  const last = changes.at(-1).position; motion.update(100); await motion.activate();
  assert.equal(changes.at(-1).position, last);
  assert.equal(changes.at(-1).playing, false);
  assert.deepEqual(modes, [true, false, true]);
});

test('repeated activation waits for preparation and cannot reveal an incomplete scene', async () => {
  const { motion, changes, frames, element } = environment({ manualFrames: true });
  const first = motion.activate();
  for (let i = 0; i < 5; i++) await Promise.resolve();
  assert.ok(frames.length > 0, 'fixture must pause inside asynchronous scene preparation');
  const second = motion.activate();
  for (let i = 0; i < 5; i++) await Promise.resolve();
  assert.equal(motion.active, false, 'second activation must await the same preparation promise');
  for (let i = 0; i < 20; i++) {
    while (frames.length) frames.shift()(0);
    await Promise.resolve();
  }
  await Promise.all([first, second]);
  assert.equal(motion.active, true);
  assert.equal(changes.at(-1).position, 0);
  assert.equal(element('motion-loading').hidden, true);
});
