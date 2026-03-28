// ─────────────────────────────────────────────
// ScoreKeeper — Règles complètes des jeux
// ─────────────────────────────────────────────

export { skullKingRules } from "./skull_king";
export { skyjoRules } from "./skyjo";
export { odinRules } from "./odin";
export { flip7Rules } from "./flip7";
export { unoRules } from "./uno";
export { papayooRules } from "./papayoo";
export { trioRules } from "./trio";

import { skullKingRules } from "./skull_king";
import { skyjoRules } from "./skyjo";
import { odinRules } from "./odin";
import { flip7Rules } from "./flip7";
import { unoRules } from "./uno";
import { papayooRules } from "./papayoo";
import { trioRules } from "./trio";

export const ALL_GAME_RULES = {
  skullking: skullKingRules,
  skyjo: skyjoRules,
  odin: odinRules,
  flip7: flip7Rules,
  uno: unoRules,
  papayoo: papayooRules,
  trio: trioRules,
} as const;

export type GameId = keyof typeof ALL_GAME_RULES;
