import { readFile, writeFile } from "node:fs/promises";
import { gunzipSync, gzipSync } from "node:zlib";
import { BufferGeometry, BufferAttribute } from "three";
import { MeshBVH } from "three-mesh-bvh";
const root = new URL("../public/data/substation/", import.meta.url);
const bytes = gunzipSync(await readFile(new URL("substation.glb.gz", root)));
const length = bytes.readUInt32LE(12),
  doc = JSON.parse(bytes.toString("utf8", 20, 20 + length));
const bin = bytes.subarray(28 + length);
function read(i) {
  const a = doc.accessors[i],
    v = doc.bufferViews[a.bufferView];
  const view = bin.subarray(v.byteOffset, v.byteOffset + v.byteLength);
  return a.componentType === 5126
    ? new Float32Array(view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength))
    : new Uint32Array(view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength));
}
const g = new BufferGeometry(),
  primitive = doc.meshes[0].primitives[0];
g.setAttribute("position", new BufferAttribute(read(primitive.attributes.POSITION), 3));
g.setIndex(new BufferAttribute(read(primitive.indices), 1));
const bvh = new MeshBVH(g, { indirect: true, maxLeafSize: 10 });
const serial = MeshBVH.serialize(bvh),
  chunks = [...serial.roots, serial.indirectBuffer.buffer];
const sizes = chunks.map((x) => x.byteLength);
await writeFile(new URL("bvh.bin.gz", root), gzipSync(Buffer.concat(chunks.map((x) => Buffer.from(x))), { level: 9 }));
await writeFile(
  new URL("bvh.json", root),
  JSON.stringify({ version: serial.version, sizes, indirectType: serial.indirectBuffer.constructor.name, triangleOrderPreserved: true })
);
console.log(JSON.stringify({ triangles: g.index.count / 3, bvh_bytes: sizes.reduce((a, b) => a + b, 0), indirect: true }));
