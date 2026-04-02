// ─── Joueur ───────────────────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

// ─── Configuration d'un jeu ───────────────────────────────────────────────────

export type ScoreDirection = 'low' | 'high';
export type EndCondition = 'threshold' | 'fixed' | 'rounds';
export type InputType = 'simple' | 'bid' | 'bonus' | 'wins';

export interface GameConfig {
  id: string;
  name: string;
  emoji?: string;
  themeColor?: string;
  minPlayers: number;
  maxPlayers: number;
  scoreDirection: ScoreDirection;
  endCondition: EndCondition;
  endValue: number | null;
  orderMatters: boolean;
  inputType: InputType;
  specialRules: Record<string, unknown>;
}

// ─── Partie ───────────────────────────────────────────────────────────────────

export type GameStatus = 'playing' | 'finished';

// ─── Formes de rawInput selon le type de saisie ──────────────────────────────

export interface SimpleRawInput {
  value: number;
  first: boolean;
  doubled: boolean;
  original: number;
  flip7: boolean;
}

export interface BidRawInput {
  bid: number;
  tricks: number;
  bonus14: number;
  bonusPirate: number;
  bonusSK: boolean;
}

export interface WinsRawInput {
  winner: boolean;
}

export type RawInput = SimpleRawInput | BidRawInput | WinsRawInput;

export function isSimpleRawInput(r: RawInput): r is SimpleRawInput {
  return 'value' in r;
}
export function isBidRawInput(r: RawInput): r is BidRawInput {
  return 'bid' in r;
}
export function isWinsRawInput(r: RawInput): r is WinsRawInput {
  return 'winner' in r && !('value' in r) && !('bid' in r);
}

// ─── Score d'un joueur pour une manche ───────────────────────────────────────

export interface RoundScore {
  rawInput: RawInput;
  computed: number;
  cumulative: number;
}

export interface Round {
  roundNumber: number;
  scores: Record<string, RoundScore>;
  timestamp: number;
}

export interface Game {
  id: string;
  gameConfigId: string;
  playerIds: string[];
  rounds: Round[];
  status: GameStatus;
  winnerId: string | null;
  startedAt: number;
  finishedAt: number | null;
  metadata: { targetScore?: number | null };
}