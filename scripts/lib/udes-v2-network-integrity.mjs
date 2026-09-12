/** Validate the physical road union without inventing missing geometry or links. */
export function validateRoadNetwork(zones, nodes, edges, routes, roadFeatures, turnRestrictions = []) {
  const fail = (message) => {
    throw new Error(`Road network integrity: ${message}`);
  };
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
  if (nodeById.size !== nodes.length || edgeById.size !== edges.length) fail("duplicate node or edge IDs");
  const next = new Map(nodes.map((node) => [node.id, new Set()]));
  const previous = new Map(nodes.map((node) => [node.id, new Set()]));
  const incident = new Map(nodes.map((node) => [node.id, new Set()]));
  const gatewayIds = new Set(zones.map((zone) => zone.networkNodeId));
  const used = new Set();
  const turnKey = (incomingEdgeId, incomingDirection, outgoingEdgeId, outgoingDirection) =>
    `${incomingEdgeId}:${incomingDirection}>${outgoingEdgeId}:${outgoingDirection}`;
  const prohibitedTurns = new Set();
  for (const restriction of turnRestrictions) {
    const incoming = edgeById.get(restriction.incomingEdgeId),
      outgoing = edgeById.get(restriction.outgoingEdgeId);
    if (!incoming || !outgoing || ![1, -1].includes(restriction.incomingDirection) || ![1, -1].includes(restriction.outgoingDirection))
      fail("invalid turn restriction edges or directions");
    if (
      !(restriction.incomingDirection === 1 ? incoming.allowAB : incoming.allowBA) ||
      !(restriction.outgoingDirection === 1 ? outgoing.allowAB : outgoing.allowBA)
    )
      fail("turn restriction references an unavailable directed edge");
    if (
      (restriction.incomingDirection === 1 ? incoming.to : incoming.from) !== restriction.viaNodeId ||
      (restriction.outgoingDirection === 1 ? outgoing.from : outgoing.to) !== restriction.viaNodeId
    )
      fail("turn restriction does not meet at its declared junction");
    const key = turnKey(restriction.incomingEdgeId, restriction.incomingDirection, restriction.outgoingEdgeId, restriction.outgoingDirection);
    if (prohibitedTurns.has(key)) fail("duplicate turn restriction");
    prohibitedTurns.add(key);
  }
  const samePoint = (left, right) =>
    left?.length === 2 && right?.length === 2 && left.every((value, index) => Math.abs(value - right[index]) < 0.0000011);
  const add = (from, to) => {
    next.get(from).add(to);
    previous.get(to).add(from);
  };

  for (const edge of edges) {
    if (!nodeById.has(edge.from) || !nodeById.has(edge.to)) fail(`missing endpoint on ${edge.id}`);
    const coordinates = edge.geometry?.coordinates;
    if (edge.geometry?.type !== "LineString" || !Array.isArray(coordinates) || coordinates.length < 2) fail(`missing road geometry on ${edge.id}`);
    if (coordinates.some((point) => point.length !== 2 || point.some((value) => !Number.isFinite(value)))) fail(`non-finite geometry on ${edge.id}`);
    if (!samePoint(coordinates[0], nodeById.get(edge.from).coord) || !samePoint(coordinates.at(-1), nodeById.get(edge.to).coord))
      fail(`geometry does not meet node endpoints on ${edge.id}`);
    if (edge.sourceClass !== "derived" || edge.contextOnly || edge.hidden || !edge.modelVisible)
      fail(`non-physical, hidden or context-only road ${edge.id}`);
    if (!edge.candidateRouteIds?.length) fail(`road without a district-to-district purpose: ${edge.id}`);
    if (!edge.allowAB && !edge.allowBA) fail(`closed road ${edge.id}`);
    if (!(edge.distanceKm > 0) || !(edge.freeFlowMinutes >= 0)) fail(`invalid distance/duration on ${edge.id}`);
    if (edge.allowAB) add(edge.from, edge.to);
    if (edge.allowBA) add(edge.to, edge.from);
    incident.get(edge.from).add(edge.id);
    incident.get(edge.to).add(edge.id);
  }

  for (const route of routes) {
    let node = route.fromNodeId;
    if (!nodeById.has(node) || !nodeById.has(route.toNodeId)) fail(`missing district gateway on ${route.id}`);
    if (!route.traversals?.length) fail(`empty district route ${route.id}`);
    let previousTraversal = null;
    for (const traversal of route.traversals) {
      const edge = edgeById.get(traversal.edgeId);
      if (!edge) fail(`route ${route.id} references missing ${traversal.edgeId}`);
      const forward = traversal.direction === 1;
      const start = forward ? edge.from : edge.to;
      const end = forward ? edge.to : edge.from;
      if (node !== start) fail(`discontinuous route ${route.id} at ${edge.id}: ${node} != ${start}`);
      if (!(forward ? edge.allowAB : edge.allowBA)) fail(`illegal direction in ${route.id} on ${edge.id}`);
      if (!edge.candidateRouteIds.includes(route.id)) fail(`missing route purpose on ${edge.id}`);
      if (
        previousTraversal &&
        prohibitedTurns.has(turnKey(previousTraversal.edgeId, previousTraversal.direction, traversal.edgeId, traversal.direction))
      )
        fail(`source route ${route.id} violates a turn restriction`);
      used.add(edge.id);
      node = end;
      previousTraversal = traversal;
    }
    if (node !== route.toNodeId) fail(`route ${route.id} does not end at its destination gateway`);
  }
  if (used.size !== edges.length) fail(`${edges.length - used.size} unused road edges`);

  const walk = (start, adjacency) => {
    const seen = new Set([start]),
      queue = [start];
    for (let i = 0; i < queue.length; i += 1) {
      for (const target of adjacency.get(queue[i]) || [])
        if (!seen.has(target)) {
          seen.add(target);
          queue.push(target);
        }
    }
    return seen;
  };
  let reachableDistrictPairs = 0;
  for (const origin of zones) {
    const reachable = walk(origin.networkNodeId, next);
    for (const destination of zones) {
      if (origin.id === destination.id) continue;
      if (!reachable.has(destination.networkNodeId)) fail(`${origin.id} cannot reach ${destination.id}`);
      reachableDistrictPairs += 1;
    }
  }
  const first = zones[0]?.networkNodeId;
  if (!first || walk(first, next).size !== nodes.length || walk(first, previous).size !== nodes.length)
    fail("the retained graph is not one strongly connected directed component");
  const danglingNodes = nodes.filter((node) => incident.get(node.id).size <= 1 && !gatewayIds.has(node.id));
  if (danglingNodes.length) fail(`dangling non-gateway endpoints: ${danglingNodes.map((node) => node.id).join(", ")}`);
  const featureById = new Map(roadFeatures.map((feature) => [feature.id, feature]));
  if (featureById.size !== edges.length) fail("visible geometry is not one-to-one with the physical graph");
  for (const edge of edges) {
    const feature = featureById.get(edge.id);
    if (!feature || JSON.stringify(feature.geometry) !== JSON.stringify(edge.geometry)) fail(`visible geometry mismatch on ${edge.id}`);
  }
  return {
    status: "passed",
    directedDistrictPairs: reachableDistrictPairs,
    requiredDirectedDistrictPairs: zones.length * (zones.length - 1),
    stronglyConnectedComponents: 1,
    orphanEdges: 0,
    danglingNonGatewayNodes: 0,
    gatewayTerminalNodes: nodes.filter((node) => incident.get(node.id).size === 1 && gatewayIds.has(node.id)).map((node) => node.id),
    syntheticRoadEdges: 0,
    contextOnlyEdges: 0,
    hiddenRoadEdges: 0,
    turnRestrictionCount: turnRestrictions.length,
    routeContinuity: "Every candidate follows legal edge directions and declared turn restrictions continuously between its two district gateways.",
    visibleGeometry: "Every physical road edge is rendered with identical geometry and endpoint coordinates.",
    junctionRule: "Only shared routed geometry vertices join paths; arbitrary line crossings are not converted into intersections.",
  };
}
