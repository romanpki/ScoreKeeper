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

export interface RoundScore {
  rawInput: Record<string, unknown>;
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
  metadata: Record<string, unknown>;
}