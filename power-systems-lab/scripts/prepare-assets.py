"""Pack a reviewed CC BY asset without changing triangle/corner attributes.

Usage: python3 scripts/prepare-assets.py /path/to/reviewed/substation-third
The input is the reviewed OBJ conversion, not an arbitrary download directory.
"""
import argparse, gzip, hashlib, json, pathlib, shutil, struct
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('reviewed', type=pathlib.Path)
args = parser.parse_args()
source = args.reviewed
out = pathlib.Path(__file__).resolve().parents[1] / 'public/data/substation'
out.mkdir(parents=True, exist_ok=True)
blob = (source / 'substation-third.glb').read_bytes()
jl = struct.unpack_from('<I', blob, 12)[0]
doc = json.loads(blob[20:20+jl])
binary = blob[28+jl:]
def attribute(i):
    a = doc['accessors'][i]
    v = doc['bufferViews'][a['bufferView']]
    dim = {'SCALAR':1,'VEC2':2,'VEC3':3}[a['type']]
    dtype = '<f4' if a['componentType'] == 5126 else '<u4'
    return np.frombuffer(binary, dtype=dtype, count=a['count']*dim, offset=v.get('byteOffset',0)+a.get('byteOffset',0)).reshape(-1,dim)
attributes = [attribute(i) for i in range(4)]
normals = np.fromfile(source/'presentation_normals.bin', dtype='<f4').reshape(-1,3)
assert normals.shape == attributes[0].shape
joined = np.ascontiguousarray(np.concatenate([*attributes,normals],axis=1))
# Compare raw bytes, including normals, UVs, source IDs and signed zero.
keys = joined.view(np.dtype((np.void, joined.dtype.itemsize*joined.shape[1]))).ravel()
_, representatives, inverse = np.unique(keys, return_index=True, return_inverse=True)
indices = attribute(4).ravel()
packed_indices = inverse[indices].astype('<u4')
packed = joined[representatives]
assert np.array_equal(packed[packed_indices].view('<u4'), joined[indices].view('<u4'))
assert len(packed_indices) == 665472*3
data = bytearray(); views=[]; accessors=[]
for values,dim,ctype,target in [(packed[:,0:3],3,5126,34962),(packed[:,3:6],3,5126,34962),(packed[:,6:8],2,5126,34962),(packed[:,8:9],1,5126,34962),(packed[:,9:12],3,5126,34962),(packed_indices,1,5125,34963)]:
    values = np.ascontiguousarray(values)
    views.append({'buffer':0,'byteOffset':len(data),'byteLength':values.nbytes,'target':target})
    data.extend(values.tobytes())
    accessors.append({'bufferView':len(views)-1,'componentType':ctype,'count':len(values),'type':{1:'SCALAR',2:'VEC2',3:'VEC3'}[dim]})
accessors[0].update(min=attributes[0].min(axis=0).tolist(),max=attributes[0].max(axis=0).tolist())
doc['asset']['generator'] = 'Power Systems Lab: exact attribute packing of reviewed conversion'
doc['bufferViews']=views; doc['accessors']=accessors; doc['buffers']=[{'byteLength':len(data)}]
prim=doc['meshes'][0]['primitives'][0];prim['attributes']['_PRESENTATION_NORMAL']=4;prim['indices']=5
j=json.dumps(doc,separators=(',',':')).encode();j+=b' ' *((-len(j))%4)
data+=b'\0' *((-len(data))%4)
result=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(data))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(data),0x004e4942)+data
(out/'substation.glb.gz').write_bytes(gzip.compress(result,compresslevel=9,mtime=0))
shutil.copyfile(source/'Substation_Diffuse.png',out/'Substation_Diffuse.png')
pieces=json.loads((source/'pieces.json').read_text())
np.array([p['bounds_min']+p['bounds_max'] for p in pieces],dtype='<f4').tofile(out/'piece-bounds.bin')
np.array([p['triangles'] for p in pieces],dtype='<u4').tofile(out/'piece-triangles.bin')
np.array(json.loads((source/'surface_classes.json').read_text()),dtype='u1').tofile(out/'surface-classes.bin')
equipment=json.loads((source/'locations.json').read_text())
aliases=json.loads((source/'assembly_aliases.json').read_text())
for group in equipment:
    group['evidence']=group.get('evidence','').replace(' Part 3773 is one tank-shell mesh within it.','')
(out/'equipment.json').write_text(json.dumps({'equipment':equipment,'aliases':aliases},separators=(',',':')))
manifest=json.loads((source/'manifest.json').read_text())
manifest.update(glb_sha256=hashlib.sha256(result).hexdigest(),reviewed_glb_sha256=hashlib.sha256(blob).hexdigest(),packed_vertices=len(packed),corner_attributes_bit_identical=True,triangle_order_preserved=True,presentation='Representative steel, ceramic and painted finishes; optional smoothed normals. Original appearance remains selectable. No electrical operating mechanism or rating inferred.')
(out/'provenance.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'input_vertices':len(joined),'packed_vertices':len(packed),'triangles':len(packed_indices)//3,'bytes':len(result),'exact_corner_comparison':True}))
