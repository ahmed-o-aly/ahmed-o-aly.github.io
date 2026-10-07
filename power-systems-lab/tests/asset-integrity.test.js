import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { createHash } from "node:crypto";
const root = new URL("../public/data/substation/", import.meta.url);
const file = (name) => readFileSync(new URL(name, root));
const provenance = JSON.parse(file("provenance.json")),
  catalog = JSON.parse(file("equipment.json"));
const blob = gunzipSync(file("substation.glb.gz")),
  jsonLength = blob.readUInt32LE(12),
  doc = JSON.parse(blob.toString("utf8", 20, 20 + jsonLength));
const binary = blob.subarray(28 + jsonLength),
  p = doc.meshes[0].primitives[0];
function attribute(i) {
  const a = doc.accessors[i],
    v = doc.bufferViews[a.bufferView];
  const b = binary.subarray(v.byteOffset, v.byteOffset + v.byteLength);
  return a.componentType === 5126
    ? new Float32Array(b.buffer, b.byteOffset, b.byteLength / 4)
    : new Uint32Array(b.buffer, b.byteOffset, b.byteLength / 4);
}
const ids = attribute(p.attributes._SOURCE_PIECE),
  index = attribute(p.indices);
test("public model is the reviewed conversion, with all triangles and corner IDs", () => {
  assert.equal(createHash("sha256").update(blob).digest("hex"), provenance.glb_sha256);
  assert.equal(index.length / 3, 665472);
  assert.equal(provenance.corner_attributes_bit_identical, true);
  assert.equal(provenance.triangle_order_preserved, true);
  assert.equal(ids.length, provenance.packed_vertices);
  for (let i = 0; i < index.length; i += 3) {
    assert.equal(ids[index[i]], ids[index[i + 1]]);
    assert.equal(ids[index[i]], ids[index[i + 2]]);
  }
});
test("whole-device selectors contain their actual source parts", () => {
  const groups = [...catalog.equipment, ...catalog.aliases];
  assert.equal(catalog.equipment.length, 11);
  assert.equal(catalog.aliases.length, 20);
  const count = new Uint32Array(provenance.geometric_pieces);
  for (let i = 0; i < index.length; i += 3) count[ids[index[i]]]++;
  for (const g of groups) {
    assert.equal(new Set(g.pieces).size, g.pieces.length, g.id);
    assert.ok(
      g.pieces.every((id) => Number.isInteger(id) && id >= 0 && id < count.length),
      g.id
    );
    if (g.triangles)
      assert.equal(
        g.pieces.reduce((sum, id) => sum + count[id], 0),
        g.triangles,
        g.id
      );
  }
  assert.ok(catalog.equipment.find((g) => g.id === "breaker").pieces.includes(3773));
  assert.ok(catalog.equipment.find((g) => g.id === "transformer").pieces.includes(3834));
  assert.ok(catalog.equipment.find((g) => g.id === "bus").pieces.includes(4228));
});
test("public licence, confidence and undecided units remain explicit", () => {
  assert.equal(provenance.creator, "One80 Solar");
  assert.match(provenance.license, /CC BY 4.0/);
  assert.match(provenance.units, /Not declared/);
  assert.match(catalog.equipment.find((g) => g.id === "disconnect").title, /candidate/i);
  assert.match(catalog.equipment.find((g) => g.id === "arrester").title, /candidate/i);
  assert.match(catalog.equipment.find((g) => g.id === "column").evidence, /unresolved/i);
});
test("BVH preserves source triangle order and has exactly one indirect slot per triangle", () => {
  const info = JSON.parse(file("bvh.json")),
    data = gunzipSync(file("bvh.bin.gz"));
  assert.equal(info.triangleOrderPreserved, true);
  assert.equal(
    info.sizes.reduce((a, b) => a + b, 0),
    data.length
  );
  assert.equal(info.sizes.at(-1) / 4, 665472);
  const offset = info.sizes.slice(0, -1).reduce((a, b) => a + b, 0);
  const list = new Uint32Array(data.buffer, data.byteOffset + offset, 665472);
  assert.equal(new Set(list).size, 665472);
  assert.equal(Math.min(...list.subarray(0, 1000)) >= 0, true);
  assert.ok(list.every((x) => x < 665472));
});
test("approved transformer retains the reviewed GLB, source occurrences and placed triangles", () => {
  const root = new URL("../public/data/transformer/", import.meta.url);
  const blob = readFileSync(new URL("transformer.glb", root));
  const provenance = JSON.parse(readFileSync(new URL("provenance.json", root), "utf8"));
  assert.equal(createHash("sha256").update(blob).digest("hex"), "8f9978d7266a19c06845a7c3f86b54e066ead091166a2a7226d4b3c5e93585a2");
  assert.equal(provenance.glb_sha256, createHash("sha256").update(blob).digest("hex"));
  const doc = JSON.parse(blob.toString("utf8", 20, 20 + blob.readUInt32LE(12)));
  assert.equal(doc.nodes.length, 248);
  const triangles = doc.nodes.reduce(
    (sum, node) => sum + (node.mesh === undefined ? 0 : doc.meshes[node.mesh].primitives.reduce((n, p) => n + doc.accessors[p.indices].count / 3, 0)),
    0
  );
  assert.equal(triangles, 838253);
  assert.equal(provenance.placed_triangles, triangles);
});
test("transformer public metadata has attribution and permission without local paths or a reassigned licence", () => {
  const text = readFileSync(new URL("../public/data/transformer/provenance.json", import.meta.url), "utf8");
  const p = JSON.parse(text);
  assert.equal(p.creator, "Patrick Kayter");
  assert.match(p.drawing_credit, /Jonathan Lucas/);
  assert.match(p.permission, /creator permission confirmed/);
  assert.doesNotMatch(text, /\/Users\/|__private__|source_file|CC BY/);
});
