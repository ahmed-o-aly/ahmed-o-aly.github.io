// Descriptive statistics for simulation replications. These functions do not
// infer empirical parameter uncertainty or predictive confidence intervals.
export function summarizeReplications(values) {
  if (!Array.isArray(values) || !values.length || values.some((value) => !Number.isFinite(value))) {
    throw new Error("Replication summaries require at least one finite observation and never discard invalid runs.");
  }
  const count = values.length;
  const mean = values.reduce((total, value) => total + value, 0) / count;
  const squaredDifferences = values.reduce((total, value) => total + (value - mean) ** 2, 0);
  return {
    count,
    mean,
    minimum: Math.min(...values),
    maximum: Math.max(...values),
    sampleStandardDeviation: count > 1 ? Math.sqrt(squaredDifferences / (count - 1)) : null,
    positiveCount: values.filter((value) => value > 1e-9).length,
    zeroCount: values.filter((value) => Math.abs(value) <= 1e-9).length,
    negativeCount: values.filter((value) => value < -1e-9).length,
  };
}

export function pairedDifference(reference, intervention, metricKeys) {
  return Object.fromEntries(
    metricKeys.map((key) => {
      const before = reference[key];
      const after = intervention[key];
      if (!Number.isFinite(before) || !Number.isFinite(after)) throw new Error(`Invalid paired metric: ${key}`);
      return [key, after - before];
    })
  );
}

export function summarizePairedDifferences(pairs, metricKeys) {
  if (new Set(pairs.map((pair) => pair.seed)).size !== pairs.length) throw new Error("Replication seeds must be unique.");
  return Object.fromEntries(metricKeys.map((key) => [key, summarizeReplications(pairs.map((pair) => pair.delta[key]))]));
}
