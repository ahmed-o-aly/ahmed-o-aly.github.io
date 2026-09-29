#!/usr/bin/env python3
"""Prepare matched experimental 7W3* cryo-EM conformations, not a trajectory.

Uses the same Python requirements as prepare-data.py. Only public/data/motion
is written; the original 7W38 coordinates/density are read without modification.
"""
from pathlib import Path
import gzip
import hashlib
import json
import urllib.request

import gemmi
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'data' / 'motion'
OUT.mkdir(exist_ok=True)
STATE_SPECS = [('7W3A', 'ED4'), ('7W3B', 'ED5'), ('7W3C', 'ED0'), ('7W3F', 'ED1'), ('7W3G', 'ED2.0'), ('7W3H', 'ED2.1')]
CORE_CHAINS = set('GHIJKLMNOPQRSTghijklmnopqrst')
ALPHA_CHAINS = set('GHIJKLMghijklm')
MOTOR_NAMES = {'A': 'RPT1', 'B': 'RPT2', 'C': 'RPT6', 'D': 'RPT3', 'E': 'RPT4', 'F': 'RPT5'}
PAPER = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9117149/'


def unquote(value):
    return gemmi.cif.as_string(value)


def source_file(pdb):
    plain = OUT / f'{pdb.lower()}.cif'
    compressed = OUT / f'{pdb.lower()}.cif.gz'
    if not plain.exists() and not compressed.exists():
        plain.write_bytes(urllib.request.urlopen(f'https://files.rcsb.org/download/{pdb}.cif', timeout=120).read())
    if plain.exists():
        source = plain.read_bytes()
        compressed.write_bytes(gzip.compress(source, compresslevel=9, mtime=0))
        plain.unlink()
    return compressed


def read_model(path, pdb, label):
    data = gzip.decompress(path.read_bytes()) if path.suffix == '.gz' else path.read_bytes()
    block = gemmi.cif.read_string(data.decode()).sole_block()
    names = {r[0]: unquote(r[1]) for r in block.find(['_entity.id', '_entity.pdbx_description'])}
    sequences = {r[0]: unquote(r[1]).replace('\n', '').replace(' ', '') for r in block.find(['_entity_poly.entity_id', '_entity_poly.pdbx_seq_one_letter_code_can'])}
    secondary = {}
    for category, kind in [('_struct_conf.', 'helix'), ('_struct_sheet_range.', 'sheet')]:
        for r in block.find([category + 'beg_auth_asym_id', category + 'beg_auth_seq_id', category + 'end_auth_seq_id']):
            for n in range(int(r[1]), int(r[2]) + 1):
                secondary[(r[0], n)] = kind
    columns = ['group_PDB', 'label_atom_id', 'label_alt_id', 'label_comp_id', 'label_asym_id', 'label_entity_id', 'label_seq_id', 'Cartn_x', 'Cartn_y', 'Cartn_z', 'auth_seq_id', 'auth_asym_id', 'pdbx_PDB_ins_code', 'pdbx_PDB_model_num', 'occupancy']
    chains = {}
    for row in block.find(['_atom_site.' + c for c in columns]):
        r = list(row)
        if r[0] != 'ATOM' or unquote(r[1]) != 'CA' or r[2] not in ('.', 'A') or r[13] != '1':
            continue
        if float(r[14]) <= 0:
            continue
        auth = r[11]
        chain = chains.setdefault(auth, {'id': r[4], 'authId': auth, 'entityId': r[5], 'name': names[r[5]], 'sequence': sequences[r[5]], 'residues': {}})
        insertion = '' if r[12] in ('.', '?') else r[12]
        key = (int(r[10]), insertion)
        assert key not in chain['residues'], f'Duplicate C-alpha key: {pdb}, {auth}, {key}'
        chain['residues'][key] = {'point': np.array([float(r[7]), float(r[8]), float(r[9])]), 'name': r[3], 'labelSeq': int(r[6]), 'secondary': secondary.get((auth, int(r[10])), 'coil')}
    resolution = float(next(iter(block.find_values('_em_3d_reconstruction.resolution'))))
    return {'pdbId': pdb, 'label': label, 'resolution': resolution, 'title': unquote(block.find_value('_struct.title')), 'chains': chains, 'sourceSHA256': hashlib.sha256(data).hexdigest(), 'sourceBytes': len(data), 'sourceLocal': path.name}


def all_keys(chain):
    return list(chain['residues'])


def is_unknown(sequence):
    return set(sequence) <= {'X'}


def fit_core(model, reference, keys):
    moving = np.array([model['chains'][c]['residues'][key]['point'] for c, key in keys])
    target = np.array([reference['chains'][c]['residues'][key]['point'] for c, key in keys])
    mp, tp = moving.mean(axis=0), target.mean(axis=0)
    u, _, vh = np.linalg.svd((moving - mp).T @ (target - tp))
    correction = np.eye(3)
    correction[-1, -1] = np.linalg.det(u @ vh)
    rotation = u @ correction @ vh
    translation = tp - mp @ rotation
    assert abs(np.linalg.det(rotation) - 1) < 1e-9
    fitted = moving @ rotation + translation
    rmsd = float(np.sqrt(np.mean(np.sum((fitted - target) ** 2, axis=1))))
    for chain in model['chains'].values():
        for residue in chain['residues'].values():
            residue['point'] = residue['point'] @ rotation + translation
    return rmsd, rotation, translation


def segments_for(models, auth, keys):
    if not keys:
        return []
    starts = [0]
    for i in range(1, len(keys)):
        previous, current = keys[i - 1], keys[i]
        broken = current[0] != previous[0] + 1 or current[1] != '' or previous[1] != ''
        for model in models:
            residues = model['chains'][auth]['residues']
            if residues[current]['labelSeq'] != residues[previous]['labelSeq'] + 1:
                broken = True
            if np.linalg.norm(residues[current]['point'] - residues[previous]['point']) > 5:
                broken = True
        if broken:
            starts.append(i)
    return [[a, b] for a, b in zip(starts, starts[1:] + [len(keys)])]


def point_list(residues, keys):
    # Rounding to .001 angstrom matches the precision of deposited coordinates.
    return [np.round(residues[k]['point'], 3).tolist() for k in keys]


def chain_group(auth):
    if auth in CORE_CHAINS:
        return 'core'
    if auth in MOTOR_NAMES:
        return 'motor'
    return {'x': 'usp14', 'v': 'substrate'}.get(auth, 'regulatory')


def displacement_stats(p, q):
    d = np.linalg.norm(p - q, axis=1)
    return {'atomCount': len(d), 'rmsd': round(float(np.sqrt(np.mean(d ** 2))), 4), 'meanDisplacement': round(float(d.mean()), 4), 'medianDisplacement': round(float(np.median(d)), 4), 'maxDisplacement': round(float(d.max()), 4)}


def main():
    reference = read_model(ROOT / 'public' / 'data' / '7w38.cif', '7W38', 'EA2.0_UBL')
    models = [read_model(source_file(pdb), pdb, label) for pdb, label in STATE_SPECS]
    common_chains = set.intersection(*[set(m['chains']) for m in models])
    for auth in common_chains:
        seq = [m['chains'][auth]['sequence'] for m in models]
        assert all(is_unknown(s) for s in seq) or len(set(seq)) == 1, f'Polymer sequence mismatch: author chain {auth}'
    core_keys = []
    for auth in sorted(CORE_CHAINS):
        chains = [m['chains'][auth] for m in models + [reference]]
        assert len(set(c['sequence'] for c in chains)) == 1
        keys = set.intersection(*[set(c['residues']) for c in chains])
        for key in sorted(keys):
            # Alpha gate N termini are excluded from the rigid alignment anchor.
            if auth in ALPHA_CHAINS and key[0] < 31:
                continue
            assert len({c['residues'][key]['name'] for c in chains}) == 1
            core_keys.append((auth, key))
    assert len(core_keys) > 5000
    states = []
    for model in models:
        rmsd, rotation, translation = fit_core(model, reference, core_keys)
        state = {k: model[k] for k in ['pdbId', 'label', 'resolution', 'title', 'sourceSHA256', 'sourceBytes', 'sourceLocal']}
        state.update({'coreRmsd': round(rmsd, 6), 'coreFitAtomCount': len(core_keys), 'sourceURL': f'https://files.rcsb.org/download/{model["pdbId"]}.cif', 'entryURL': f'https://www.rcsb.org/structure/{model["pdbId"]}', 'observedResidueCount': sum(len(c['residues']) for c in model['chains'].values()), 'transform': {'rotation': rotation.tolist(), 'translation': translation.tolist(), 'convention': 'aligned row-vector XYZ = deposited XYZ @ rotation + translation'}})
        states.append(state)
        print(model['label'], model['pdbId'], 'core fit', len(core_keys), 'C-alpha atoms', f'{rmsd:.4f} angstrom RMSD', flush=True)
    base = json.loads((ROOT / 'public' / 'data' / 'backbone.json').read_text())
    base_by_auth = {c['authId']: c for c in base['chains']}
    chain_order = [c['authId'] for c in base['chains'] if c['authId'] in common_chains]
    chain_order += sorted(common_chains - set(chain_order))
    chains = []
    verified_pairs = 0
    for auth in chain_order:
        source_chains = [m['chains'][auth] for m in models]
        first = source_chains[0]
        unknown = is_unknown(first['sequence'])
        keys = set.intersection(*[set(c['residues']) for c in source_chains])
        # All-X substrate residue registry is unassigned. Its shared numeric
        # indices are never treated as molecular correspondence for morphing.
        keys = [] if unknown else [k for k in all_keys(first) if k in keys]
        for key in keys:
            assert len({c['residues'][key]['name'] for c in source_chains}) == 1, f'Residue identity mismatch {auth}/{key}'
            assert len({c['residues'][key]['labelSeq'] for c in source_chains}) == 1, f'Sequence-position mismatch {auth}/{key}'
        verified_pairs += len(keys)
        base_chain = base_by_auth.get(auth)
        base_indices = {(number, ''): i for i, number in enumerate(base_chain['residueNumbers'])} if base_chain else {}
        reference_indices = []
        for key in keys:
            index = base_indices.get(key, -1)
            if index >= 0 and base_chain['residueNames'][index] != first['residues'][key]['name']:
                raise ValueError(f'7W38 correspondence mismatch {auth}/{key}')
            reference_indices.append(index)
        observed_frames = []
        for model, source_chain in zip(models, source_chains):
            observed = all_keys(source_chain)
            observed_frames.append({'points': point_list(source_chain['residues'], observed), 'residueNumbers': [k[0] for k in observed], 'insertionCodes': [k[1] for k in observed], 'residueNames': [source_chain['residues'][k]['name'] for k in observed], 'segments': segments_for([model], auth, observed), 'secondaryStructure': [source_chain['residues'][k]['secondary'] for k in observed]})
        chain = {
            'id': base_chain['id'] if base_chain else f'motion-{auth}', 'authId': auth, 'name': first['name'],
            'group': chain_group(auth), 'motorName': MOTOR_NAMES.get(auth),
            'interpolationAllowed': not unknown, 'sequenceVerified': not unknown,
            'sequenceSHA256': None if unknown else hashlib.sha256(first['sequence'].encode()).hexdigest(),
            'residueNumbers': [k[0] for k in keys], 'insertionCodes': [k[1] for k in keys],
            'residueNames': [first['residues'][k]['name'] for k in keys],
            'secondaryStructure': [first['residues'][k]['secondary'] for k in keys],
            'segments': segments_for(models, auth, keys), 'referenceIndices': reference_indices,
            'frames': [point_list(c['residues'], keys) for c in source_chains],
            'observedFrames': observed_frames, 'observedCounts': [len(c['residues']) for c in source_chains],
            'excludedCounts': [len(c['residues']) - len(keys) for c in source_chains],
            'excludedResidueNumbers': [[k[0] for k in c['residues'] if k not in keys] for c in source_chains],
            'sourceLabelIds': [c['id'] for c in source_chains], 'sourceEntityIds': [c['entityId'] for c in source_chains],
        }
        if unknown:
            chain['correspondenceNote'] = 'Unassigned substrate sequence: all deposited residues are UNK. Author residue numbers do not establish the same material residue across states. Render observedFrames at experimental endpoints only; exclude from interpolation and displacement metrics.'
        else:
            chain['correspondenceNote'] = 'Matched by author chain, author residue number and insertion code; verified against identical complete entity polymer sequence, label sequence position and residue identity in every state.'
        chains.append(chain)
    groups = ['protein', 'core', 'motor', 'usp14', 'regulatory', 'ubiquitin']
    metrics = []
    for i, state in enumerate(states):
        group_metrics = {}
        for group in groups:
            selected = [c for c in chains if c['sequenceVerified'] and (group == 'protein' or c['group'] == group or (group == 'ubiquitin' and c['authId'] == 'y')) and c['residueNumbers']]
            target = np.concatenate([np.array(c['frames'][0]) for c in selected])
            current = np.concatenate([np.array(c['frames'][i]) for c in selected])
            group_metrics[group] = displacement_stats(target, current)
        state['commonVerifiedResidueCount'] = verified_pairs
        state['excludedFromInterpolationCount'] = state['observedResidueCount'] - verified_pairs
        state['relativeToFirstState'] = group_metrics
        metrics.append(group_metrics)
    transitions = []
    for i in range(len(states) - 1):
        selected = [c for c in chains if c['sequenceVerified'] and c['residueNumbers']]
        p = np.concatenate([np.array(c['frames'][i]) for c in selected])
        q = np.concatenate([np.array(c['frames'][i + 1]) for c in selected])
        transitions.append({'from': states[i]['label'], 'to': states[i + 1]['label'], 'matchedProtein': displacement_stats(p, q)})
    for chain in chains:
        if chain['sequenceVerified'] and chain['residueNumbers']:
            chain['rmsdFromFirst'] = [displacement_stats(np.array(chain['frames'][0]), np.array(frame))['rmsd'] for frame in chain['frames']]
    data = {
        'version': 1, 'referencePdb': '7W38', 'referenceState': 'EA2.0_UBL', 'units': 'angstrom',
        'title': 'Six observed substrate-engaged proteasome conformations',
        'stateOrderPurpose': 'Published inferred order for structural comparison; not a measured continuous trajectory or timing.',
        'stateOrder': [s['label'] for s in states], 'playbackTerminatesAfterLastState': True,
        'states': states, 'chains': chains,
        'alignment': {'method': 'Least-squares Kabsch rigid-body alignment, without reflection, onto deposited 7W38.', 'reference': '7W38', 'coreFitAtomCount': len(core_keys), 'fitAuthChains': sorted(CORE_CHAINS), 'selection': 'Identity-verified C-alpha positions common to all six structures and 7W38 in all 28 20S core chains G–T,g–t. Alpha-subunit residues 1–30 are excluded to avoid fitting moving N-terminal gates.', 'fitResiduesByChain': {auth: [key[0] for c, key in core_keys if c == auth] for auth in sorted(CORE_CHAINS)}, 'coordinateStatus': 'All exported frame coordinates are already aligned; do not apply the saved transform again.'},
        'correspondence': {'matchedProteinResidues': verified_pairs, 'matchedProteinChains': sum(c['sequenceVerified'] for c in chains), 'substrateAuthorChain': 'v', 'substrateInterpolation': False, 'missingResidues': 'Full observedFrames preserve every positive-occupancy deposited C-alpha atom. Common frames contain only identity-verified residues present in all six states. Both representations split at sequence gaps or C-alpha distances greater than 5 angstrom. No missing positions are created.', 'usp14Note': 'ED5 models USP14 residues 103–494; the other five states model residues 1–494. The common USP14 comparison contains 392 residues, and the additional 102 residues are shown only in observed endpoint frames.'},
        'metrics': {'units': 'angstrom', 'referenceState': 'ED4', 'selection': 'Only sequence-verified residues common to all six states, after alignment to 7W38. Unassigned substrate excluded. Displacements compare modeled C-alpha coordinates and do not measure speed, force, or per-residue physical trajectories.', 'byState': metrics, 'adjacentComparisons': transitions},
        'limitations': ['Experimental structures are ensemble snapshots from separate cryo-EM classes, not frames of one tracked molecule.', 'Published state ordering is mechanistic inference. Playback intervals and optional interpolated coordinates have no experimental kinetic meaning.', 'Linear interpolation is a geometric illustration and can distort protein geometry; it is not molecular dynamics or an energy-minimized pathway.', 'Only C-alpha atoms are displayed. Full deposited atomic coordinates remain available in the source files.', 'The EMD-32273 density belongs to 7W38 and must not be shown as density evidence for these six conformations.'],
        'sources': {'paper': PAPER, 'doi': 'https://doi.org/10.1038/s41586-022-04671-8', 'dataAvailability': PAPER, 'orderBasis': 'Article section “Asymmetric ATP hydrolysis around ATPase ring”, Fig. 3c and Extended Data Fig. 7i,j; six-state segment ED4→ED5→ED0→ED1→ED2.0→ED2.1.', 'reference': 'https://www.rcsb.org/structure/7W38', 'RPT1_PSMC2': 'https://www.uniprot.org/uniprotkb/P35998/entry', 'RPT5_PSMC3': 'https://www.uniprot.org/uniprotkb/P17980/entry'},
    }
    (OUT / 'motion.json').write_text(json.dumps(data, separators=(',', ':')) + '\n')
    # Save a small inspectable report without the large point arrays.
    summary = {k: v for k, v in data.items() if k != 'chains'}
    summary['chainSummary'] = [{k: c[k] for k in ['id', 'authId', 'name', 'group', 'motorName', 'sequenceVerified', 'interpolationAllowed', 'observedCounts', 'excludedCounts']} | {'commonCount': len(c['residueNumbers'])} for c in chains]
    (OUT / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
    print('Verified common protein residues:', verified_pairs, 'in', sum(c['sequenceVerified'] for c in chains), 'chains', flush=True)
    print('Written', OUT / 'motion.json', (OUT / 'motion.json').stat().st_size, 'bytes', flush=True)
    for state in states:
        print(state['label'], 'motor RMSD vs ED4', state['relativeToFirstState']['motor']['rmsd'], 'USP14 RMSD', state['relativeToFirstState']['usp14']['rmsd'], flush=True)


if __name__ == '__main__':
    main()
