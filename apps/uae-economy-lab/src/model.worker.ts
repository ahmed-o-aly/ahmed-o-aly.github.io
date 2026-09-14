import { solveScenario } from './model/engine';
import type { EconomyData } from './model/engine';
import type { Scenario } from './viewTypes';
self.onmessage = (event: MessageEvent<{ data: EconomyData; scenario: Scenario }>) => {
  try {
    const { data, scenario } = event.data;
    const result = solveScenario(data, scenario, {
      laborShare: scenario.laborShare / 100,
      armingtonElasticity: scenario.substitution,
      exportElasticity: scenario.exportElasticity,
    });
    self.postMessage({ result });
  } catch (e) { self.postMessage({ error: e instanceof Error ? e.message : 'The model could not solve this scenario.' }); }
};
