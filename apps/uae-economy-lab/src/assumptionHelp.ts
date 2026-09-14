export const ASSUMPTION_HELP = {
  laborShare: 'How value added is split between workers and capital. Value added is output minus purchased goods and services.',
  substitution: 'How easily buyers switch between imported and UAE-made versions of a product. Higher values mean more switching.',
  exportElasticity: 'How strongly foreign demand responds to UAE export prices. Higher values mean a stronger response.',
} as const;

export type AssumptionKey = keyof typeof ASSUMPTION_HELP;
const number = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });

export function assumptionExample(key: AssumptionKey, value: number): string {
  if (key === 'laborShare') {
    return `At baseline, $${number(value)} of every $100 of value added pays labor; $${number(100 - value)} pays capital.`;
  }
  if (key === 'substitution') {
    return value === 0
      ? 'At 0, each buyer keeps the same mix of imported and UAE-made products as prices change.'
      : `At ${number(value)}, imports becoming 1% cheaper relative to UAE goods raises the ratio of imported to UAE-made quantities by about ${number(value)}%.`;
  }
  return `At ${number(value)}, a 1% fall in a sector’s UAE export price raises foreign demand for its products by about ${number(value)}%.`;
}

export function workforceExplanation(closure: 'fixed' | 'elastic'): string {
  return closure === 'fixed'
    ? 'Total employment stays fixed. Workers move between sectors and wages adjust.'
    : 'Employment can expand or contract while wages keep pace with consumer prices.';
}
