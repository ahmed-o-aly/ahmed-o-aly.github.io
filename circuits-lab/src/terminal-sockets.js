export function wireSocketKey(a, b, terminalId) {
  return `wire:${[a, b].sort().join("|")}:${terminalId}`;
}

export function commonSocketPosition(id, index) {
  if (id === "gnd") return { x: -1.1 + (index % 8) * 0.3, z: 0.79 - Math.floor(index / 8) * 0.16 };
  if (id === "out") return { x: 0.53 + (index % 3) * 0.27, z: -0.22 - Math.floor(index / 3) * 0.18 };
  return null;
}

/** Stable physical posts for one electrical node. Removing a lead never shifts other leads. */
export function createTerminalSocketAllocator() {
  const assignments = new Map();
  function sync(id, resources) {
    const keys = [...new Set(resources)].sort((a, b) => {
      const order = Number(!a.startsWith("wire:")) - Number(!b.startsWith("wire:"));
      return order || a.localeCompare(b);
    });
    let mapping = assignments.get(id);
    if (!mapping) {
      mapping = new Map();
      assignments.set(id, mapping);
    }
    for (const key of mapping.keys()) if (!keys.includes(key)) mapping.delete(key);
    const occupied = new Set(mapping.values());
    for (const key of keys) {
      if (mapping.has(key)) continue;
      let slot = 0;
      while (occupied.has(slot)) slot++;
      mapping.set(key, slot);
      occupied.add(slot);
    }
    return mapping;
  }
  return {
    resolve(id, resource, resources) {
      const mapping = sync(id, resource ? [...resources, resource] : resources);
      return resource ? mapping.get(resource) : 0;
    },
    prefer(id, resource, slot, resources) {
      const mapping = sync(id, [...resources, resource]);
      if (Number.isInteger(slot) && slot >= 0 && ![...mapping].some(([key, occupied]) => key !== resource && occupied === slot))
        mapping.set(resource, slot);
      return mapping.get(resource);
    },
    /** Rename a reconnected lead at its fixed end before synchronizing the changed resource list. */
    transfer(id, fromResource, toResource, resources) {
      const mapping = assignments.get(id);
      const slot = mapping?.get(fromResource);
      // A duplicate connection must not steal another lead's socket.
      if (slot === undefined || !toResource || (fromResource !== toResource && mapping.has(toResource))) return null;
      if (fromResource !== toResource) {
        mapping.delete(fromResource);
        mapping.set(toResource, slot);
      }
      // Callers may still have the old pair, already have the new pair, or contain both during a handoff.
      sync(id, [...resources.filter((resource) => resource !== fromResource), toResource]);
      return slot;
    },
    clear() {
      assignments.clear();
    },
  };
}
