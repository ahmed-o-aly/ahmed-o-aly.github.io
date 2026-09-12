// Evidence coverage counts describe inputs, not fitted behavior or accuracy.
export function summarizeEvidence(baseline) {
  const zoneFieldClasses = {};
  for (const zone of baseline.zones || []) {
    for (const [field, sourceClass] of Object.entries(zone.sourceClassByField || {})) {
      zoneFieldClasses[field] ||= {};
      zoneFieldClasses[field][sourceClass] = (zoneFieldClasses[field][sourceClass] || 0) + 1;
    }
  }
  const edges = baseline.roadGraph?.segments || baseline.roadGraph?.edges || [];
  const assignmentEdges = edges.filter((edge) => edge.loadBearing !== false && edge.contextOnly !== true);
  return {
    status: "mixed-observed-derived-and-synthetic-inputs",
    empiricalBehavioralCalibration: "not-performed",
    frozenSourceSnapshotId: baseline.sourceSnapshot?.id || null,
    frozenResponseCount: baseline.sourceSnapshot?.requests?.length || 0,
    populationReferenceYear: baseline.baseYear || 2024,
    zoneFieldClasses,
    roadInputs: {
      physicalEdges: edges.length,
      assignmentEdges: assignmentEdges.length,
      observedLaneEdges: assignmentEdges.filter((edge) => edge.sourceClassByField?.lanesPerDirection === "observed").length,
      capacityThroughput: "synthetic",
      trafficCountCalibration: "not-performed",
      geometry: "derived from routed OpenStreetMap geometry",
    },
    transitInputs: { stops: "observed", serviceTopologyAndTimetable: "synthetic", capacity: "synthetic" },
    interpretation: "Coverage counts apply to fields, not to model validity. Historical all-trip shares do not calibrate work-trip mode choices.",
  };
}
