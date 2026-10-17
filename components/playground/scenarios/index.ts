/**
 * The scenario lineup, in picker order. To add one, build scenarios/<id>.tsx (see docs/PLAYGROUND_SCENARIO_GUIDE.md),
 * import it here and add it to LINEUP. An `Upcoming` entry ({ id, name, task, label, swatch, soon: true }) shows a coming-soon card.
 */
import type { Scenario, Upcoming } from "../engine/types";
import { marsa } from "./marsa";
import { noor } from "./noor";
import { souq } from "./souq";

export const LINEUP: (Scenario | Upcoming)[] = [
  noor,
  marsa,
  souq,
];

export const isLive = (x: Scenario | Upcoming): x is Scenario => !("soon" in x);
export const SCENARIOS: Scenario[] = LINEUP.filter(isLive);
export const scenarioById = (id: string) => SCENARIOS.find((s) => s.id === id);
