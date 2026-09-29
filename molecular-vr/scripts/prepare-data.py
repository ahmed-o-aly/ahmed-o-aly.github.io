#!/usr/bin/env python3
"""Prepare true PDB 7W38 / EMDB 32273 data for the portable WebXR viewer.

Requires numpy, scipy, scikit-image, gemmi, msgpack.
Density is the PDBe VolumeServer sampled experimental map, not a molecular
surface or simulated density. No mesh smoothing or decimation is applied.
"""
from pathlib import Path
import hashlib
import json
import urllib.request

import gemmi
import msgpack
import numpy as np
from scipy.ndimage import map_coordinates
from skimage.measure import marching_cubes

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'public' / 'data'
DATA.mkdir(parents=True, exist_ok=True)
SOURCES = {
    'coordinates': 'https://files.rcsb.org/download/7W38.cif',
    'entry': 'https://www.rcsb.org/structure/7W38',
    'emdb': 'https://www.ebi.ac.uk/emdb/EMD-32273',
    'originalMap': 'https://ftp.ebi.ac.uk/pub/databases/emdb/structures/EMD-32273/map/emd_32273.map.gz',
    'sampledMap': 'https://www.ebi.ac.uk/pdbe/densities/emd/emd-32273/cell?detail=3',
}


def download(name, url):
    path = DATA / name
    if not path.exists():
        with urllib.request.urlopen(url, timeout=120) as response:
            path.write_bytes(response.read())
    return path


def write_json(name, content):
    (DATA / name).write_text(json.dumps(content, separators=(',', ':')) + '\n')


def unquote(value):
    return gemmi.cif.as_string(value)


def decode(encoded):
    """Decode the BinaryCIF encodings actually used by PDBe VolumeServer."""
    a = encoded['data']
    for e in reversed(encoded['encoding']):
        kind = e['kind']
        if kind == 'ByteArray':
            dtype = {1: 'i1', 2: '<i2', 3: '<i4', 4: 'u1', 5: '<u2', 6: '<u4', 32: '<f4', 33: '<f8'}[e['type']]
            a = np.frombuffer(a, dtype=dtype)
        elif kind == 'IntervalQuantization':
            a = (e['min'] + a.astype(np.float32) * ((e['max'] - e['min']) / (e['numSteps'] - 1))).astype(np.float32)
        elif kind == 'Delta':
            a = np.cumsum(a, dtype=np.int64) + e['origin']
        elif kind == 'IntegerPacking':
            if len(a) != e['srcSize']:
                hi = (2 ** (8 * e['byteCount'])) - 1 if e['isUnsigned'] else (2 ** (8 * e['byteCount'] - 1)) - 1
                lo = None if e['isUnsigned'] else -hi - 1
                out, value = [], 0
                for n in a:
                    value += int(n)
                    if n != hi and n != lo:
                        out.append(value)
                        value = 0
                a = np.array(out, dtype=np.int64)
        elif kind == 'StringArray':
            offsets = decode({'data': e['offsets'], 'encoding': e['offsetEncoding']})
            ids = decode({'data': a, 'encoding': e['dataEncoding']})
            strings = [e['stringData'][offsets[i]:offsets[i + 1]] for i in range(len(offsets) - 1)]
            a = [strings[i] if i >= 0 else '' for i in ids]
        elif kind == 'RunLength':
            a = np.repeat(a[::2], a[1::2])
        elif kind == 'FixedPoint':
            a = a / e['factor']
        else:
            raise ValueError(f'Unsupported BinaryCIF encoding: {kind}')
    return a


def load_volume(path):
    bcif = msgpack.unpackb(path.read_bytes(), raw=False)
    block = next(b for b in bcif['dataBlocks'] if b['header'] == 'EM')
    info = next(c for c in block['categories'] if c['name'] == '_volume_data_3d_info')
    info = {c['name']: decode(c['data'])[0] for c in info['columns']}
    vector = lambda name: np.array([info[f'{name}[{i}]'] for i in range(3)])
    assert (vector('axis_order') == [0, 1, 2]).all(), 'This preparation expects XYZ-fast order.'
    assert (vector('spacegroup_cell_angles') == 90).all(), 'This preparation expects an orthogonal cell.'
    count = vector('sample_count').astype(int)
    size = vector('spacegroup_cell_size')
    origin = vector('origin') * size
    spacing = vector('dimensions') * size / count
    values = next(c for c in block['categories'] if c['name'] == '_volume_data_3d')
    flat = decode(next(c for c in values['columns'] if c['name'] == 'values')['data'])
    # VolumeServer flat data has X fastest, i.e. NumPy shape (Z, Y, X).
    volume = flat.reshape(tuple(count[::-1])).astype(np.float32)
    return volume, origin, spacing, info


def prepare_model():
    block = gemmi.cif.read_file(str(download('7w38.cif', SOURCES['coordinates']))).sole_block()
    entities = {r[0]: unquote(r[1]) for r in block.find(['_entity.id', '_entity.pdbx_description'])}
    chains = {}
    atoms = []
    atom_chains = []
    elements = []
    sec = {}
    for category, label in [('_struct_conf.', 'helix'), ('_struct_sheet_range.', 'sheet')]:
        for r in block.find([category + 'beg_label_asym_id', category + 'beg_label_seq_id', category + 'end_label_seq_id']):
            for n in range(int(r[1]), int(r[2]) + 1):
                sec[(r[0], n)] = label
    names = ['group_PDB', 'label_atom_id', 'label_alt_id', 'label_comp_id', 'label_asym_id', 'label_entity_id', 'label_seq_id', 'Cartn_x', 'Cartn_y', 'Cartn_z', 'auth_seq_id', 'auth_asym_id', 'type_symbol', 'pdbx_PDB_model_num']
    for r in block.find(['_atom_site.' + x for x in names]):
        if r[13] != '1' or r[2] not in ('.', 'A'):
            continue
        xyz = [float(r[7]), float(r[8]), float(r[9])]
        atoms.append(xyz)
        atom_chains.append(r[4])
        elements.append(r[12])
        if r[0] != 'ATOM' or unquote(r[1]) != 'CA':
            continue
        chain = chains.setdefault(r[4], {'id': r[4], 'authId': r[11], 'entityId': r[5], 'name': entities[r[5]], 'points': [], 'residueNumbers': [], 'labelResidueNumbers': [], 'residueNames': [], 'secondaryStructure': []})
        chain['points'].append(xyz)
        chain['residueNumbers'].append(int(r[10]))
        chain['labelResidueNumbers'].append(int(r[6]))
        chain['residueNames'].append(r[3])
        chain['secondaryStructure'].append(sec.get((r[4], int(r[6])), 'coil'))
    for chain in chains.values():
        starts = [0]
        pts = np.array(chain['points'])
        numbers = chain['labelResidueNumbers']
        for i in range(1, len(pts)):
            if np.linalg.norm(pts[i] - pts[i - 1]) > 5.0 or numbers[i] != numbers[i - 1] + 1:
                starts.append(i)
        chain['segments'] = [[s, e] for s, e in zip(starts, starts[1:] + [len(pts)])]
    coords = np.array(atoms)
    lower, upper = coords.min(axis=0), coords.max(axis=0)
    model = {
        'pdbId': '7W38', 'emdbId': 'EMD-32273',
        'title': 'USP14-bound human 26S proteasome', 'state': 'EA2.0_UBL',
        'method': 'Single-particle cryo-EM', 'resolutionAngstrom': 3.1,
        'atomCount': len(atoms), 'residueCount': sum(len(c['points']) for c in chains.values()),
        'chainCount': len(chains), 'entityCount': len(set(c['entityId'] for c in chains.values())),
        'coordinateUnits': 'angstrom', 'center': ((lower + upper) / 2).tolist(),
        'bounds': {'min': lower.tolist(), 'max': upper.tolist()},
        'chains': list(chains.values()), 'sources': SOURCES,
        'representation': 'C-alpha backbone coordinates. Segment endpoints are exclusive; split at missing residues or C-alpha distances over 5 angstrom.',
    }
    write_json('backbone.json', model)
    print(f'Model: {len(chains)} chains, {model["residueCount"]} C-alpha atoms; bounds {lower} -> {upper}', flush=True)
    return model


def prepare_density(model):
    path = download('density-sampled.bcif', SOURCES['sampledMap'])
    volume, origin, spacing, info = load_volume(path)
    # Use full-resolution source statistics, not statistics of the sampled map.
    mean, sigma = float(info['mean_source']), float(info['sigma_source'])
    levels = []
    for contour in [0.3, 0.5, 0.8, 1, 1.5, 2, 3.2]:
        absolute = mean + contour * sigma
        # Ascent gives outward right-handed triangle winding for a high-density
        # interior. skimage's default descent uses the opposite face winding.
        verts, faces, _, _ = marching_cubes(volume, level=absolute, spacing=spacing[::-1], gradient_direction='ascent', allow_degenerate=False)
        # Swapping X/Z reverses handedness; reverse triangle winding as well.
        verts = np.ascontiguousarray(verts[:, ::-1] + origin, dtype='<f4')
        faces = np.ascontiguousarray(faces[:, ::-1], dtype='<u4')
        stem = f'density-{contour:g}'
        verts.tofile(DATA / f'{stem}.positions.bin')
        faces.tofile(DATA / f'{stem}.indices.bin')
        item = {'sigma': contour, 'absolute': absolute, 'positions': f'{stem}.positions.bin', 'indices': f'{stem}.indices.bin', 'vertexCount': len(verts), 'triangleCount': len(faces), 'bounds': {'min': verts.min(axis=0).tolist(), 'max': verts.max(axis=0).tolist()}}
        levels.append(item)
        print(f'Density {contour:g} sigma: {len(verts):,} vertices, {len(faces):,} triangles', flush=True)
    ca = np.array([p for c in model['chains'] for p in c['points']])
    samples = map_coordinates(volume, ((ca - origin) / spacing).T[::-1], order=1, mode='constant')
    validation = {
        'caSampleCount': len(ca), 'meanDensityAtCA': float(samples.mean()),
        'medianDensityAtCA': float(np.median(samples)),
        'fractionCAAboveHalfSigma': float((samples > mean + 0.5 * sigma).mean()),
        'fractionCAAboveThreePointTwoSigma': float((samples > mean + 3.2 * sigma).mean()),
        'coordinateTransform': 'No fitting, registration or recentering. Model and density remain in deposited Cartesian XYZ angstrom coordinates. Volume index is Z,Y,X; mesh positions are X,Y,Z.',
    }
    manifest = {
        'pdbId': '7W38', 'emdbId': 'EMD-32273', 'units': 'angstrom',
        'sourceMean': mean, 'sourceSigma': sigma, 'contourUnits': 'sigma above full-resolution source mean',
        'recommendedAbsoluteContour': 0.005, 'recommendedSigma': (0.005 - mean) / sigma,
        'defaultSigma': 0.5, 'sampleGrid': list(map(int, volume.shape[::-1])),
        'spacingAngstrom': spacing.tolist(), 'originAngstrom': origin.tolist(),
        'sampleRate': int(info['sample_rate']), 'originalGrid': [640, 640, 640],
        'originalSpacingAngstrom': [0.685, 0.685, 0.685],
        'originalMapCompressedBytes': 930067531,
        'processing': 'PDBe VolumeServer 4x downsampled experimental cryo-EM map (2.74 angstrom grid), 8-bit interval quantization from server, followed by marching cubes. No mesh smoothing, decimation, molecular surface generation, or density simulation.',
        'binaryFormat': {'positions': 'Little-endian float32 xyz triplets in angstrom, no header', 'indices': 'Little-endian uint32 triangle triplets, no header'},
        'levels': levels, 'validation': validation, 'sources': SOURCES,
        'sampledMapSHA256': hashlib.sha256(path.read_bytes()).hexdigest(),
    }
    write_json('density-manifest.json', manifest)
    print('Alignment validation:', json.dumps(validation), flush=True)


if __name__ == '__main__':
    prepare_density(prepare_model())
