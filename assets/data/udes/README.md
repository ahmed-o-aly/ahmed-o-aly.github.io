# Abu Dhabi UDES map data

`abu-dhabi-corridors.json` contains a small, committed snapshot of eleven representative driving routes between eight emirate-wide study-zone centroids used by the browser simulation. The zones cover metropolitan Abu Dhabi, Al Ain, and Al Dhafra / Ruwais.

- Source geometry: OpenStreetMap road data routed through the public OSRM route service
- Retrieved: 2026-08-27
- Request format: `/route/v1/driving/{lon},{lat};{lon},{lat}?overview=simplified&geometries=geojson&steps=false`
- Coordinate order: GeoJSON longitude, latitude
- Licence: OpenStreetMap data is available under the Open Database License (ODbL)
- Attribution: © OpenStreetMap contributors

The lines are representative model corridors, not official road, traffic, or public-transport datasets. They are stored with the site so visitors do not generate repeated routing requests. The live basemap remains a normal viewport-only OpenStreetMap tile layer with visible attribution.
