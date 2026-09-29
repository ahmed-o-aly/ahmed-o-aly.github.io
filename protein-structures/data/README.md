# 7W38 / EMD-32273 data

The coordinates and density are experimental archive data for the USP14-bound human 26S proteasome, state EA2.0_UBL, determined by single-particle cryo-EM at 3.1 Å reported resolution.

- PDB entry: https://www.rcsb.org/structure/7W38
- EMDB entry: https://www.ebi.ac.uk/emdb/EMD-32273
- Original coordinates: https://files.rcsb.org/download/7W38.cif
- Original density: https://ftp.ebi.ac.uk/pub/databases/emdb/structures/EMD-32273/map/emd_32273.map.gz
- Publication: Zhang et al., Nature 605, 567–574 (2022), https://doi.org/10.1038/s41586-022-04671-8

## Coordinate model

`7w38.cif` is the complete downloaded coordinate file (106,178 atoms). `backbone.json` contains the 13,539 Cα atoms in 48 protein chains. Each chain includes its PDB label and author chain IDs, entity name, residue identifiers, secondary-structure assignments from the deposited CIF, and segments split at missing residues or Cα separations greater than 5 Å. Segment endpoints are exclusive. The viewer's backbone representation is a simplification of the full atomic coordinate model.

## Experimental density

The original map is a 640³ float32 grid with 0.685 Å voxels; its compressed download is about 930 MB. The browser assets use the official PDBe VolumeServer response at https://www.ebi.ac.uk/pdbe/densities/emd/emd-32273/cell?detail=3. This is the experimental map downsampled by four to 160³ with 2.74 Å voxels and interval-quantized by the server to 255 values. `density-sampled.bcif` preserves that response. These meshes are for interactive overview/VR viewing, not full-resolution quantitative density inspection.

`density-manifest.json` records all source URLs, downloaded sampled-map SHA256, sampling, normalization, exact contour levels, geometry counts, and alignment checks. Contours are measured in standard deviations (σ) above the full-resolution source mean. They do not represent opacity, probability or map resolution. The depositor's suggested absolute contour is 0.005, approximately 3.196σ using this server's source statistics. The requested 0.5σ contour is deliberately more inclusive. Display opacity is a separate setting.

Isosurfaces at 0.3, 0.5, 0.8, 1, 1.5, 2 and 3.2σ are extracted with marching cubes. No mesh smoothing or decimation is applied. They are not computed molecular surfaces or simulated atom density.

Both model and mesh coordinates retain the deposited Cartesian XYZ frame in Ångströms. No fitting or separate centering is performed. Any display transform must be applied to model and map together. At 0.5σ, 99.9926% of modeled Cα positions fall inside the sampled density; at 3.2σ, 96.19% do. These checks support the coordinate alignment, not model validation at full resolution.

The mesh files have no headers: `*.positions.bin` is little-endian float32 XYZ triplets; `*.indices.bin` is little-endian uint32 triangle indices. Triangles use outward face winding for Three.js. Vertex normals can be computed from faces.

## Regenerate

From the `molecular-vr` directory, install `scripts/requirements-data.txt` into a Python environment and run `python scripts/prepare-data.py`. Existing source downloads are reused. Generation uses the downloaded source statistics and writes the coordinate JSON, seven meshes and manifest.
