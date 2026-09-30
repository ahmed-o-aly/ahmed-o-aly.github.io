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
    clear() {
      assignments.clear();
    },
  };
}
