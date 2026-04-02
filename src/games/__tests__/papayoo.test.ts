import { GAME_CONFIGS } from '../index';

// ─── Config ────────────────────────────────────────────────────────────────────

describe('Configuration Papayoo', () => {
  const cfg = GAME_CONFIGS.find(g => g.id === 'papayoo')!;

  it('existe dans les configs', () => {
    expect(cfg).toBeDefined();
  });

  it('scoreDirection = low (moins de points = meilleur)', () => {
    expect(cfg.scoreDirection).toBe('low');
  });

  it('endCondition = rounds (nombre de manches fixé en début de partie)', () => {
    expect(cfg.endCondition).toBe('rounds');
  });

  it('orderMatters = true (le donneur change à chaque manche)', () => {
    expect(cfg.orderMatters).toBe(true);
  });

  it('total des points par manche = 250', () => {
    expect((cfg.specialRules as Record<string, unknown>)['roundTotal']).toBe(250);
  });

  it('min 3 joueurs', () => {
    expect(cfg.minPlayers).toBe(3);
  });

  it('max 8 joueurs', () => {
    expect(cfg.maxPlayers).toBe(8);
  });
});

// ─── Règle : total par manche = 250 ───────────────────────────────────────────

function papayooRoundIsValid(scores: Record<string, number>): boolean {
  return Object.values(scores).reduce((sum, s) => sum + s, 0) === 250;
}

describe('papayooRoundIsValid', () => {
  it('valide une manche dont le total est exactement 250', () => {
    // Payoo 1-20 = 210, Papayoo = 40
    const scores = { alice: 40, bob: 110, clara: 100 };
    expect(papayooRoundIsValid(scores)).toBe(true);
  });

  it('rejette une manche avec un total différent de 250', () => {
    const scores = { alice: 40, bob: 100, clara: 90 };
    expect(papayooRoundIsValid(scores)).toBe(false);
  });

  it('valide si un seul joueur a pris tous les points', () => {
    const scores = { alice: 250, bob: 0, clara: 0 };
    expect(papayooRoundIsValid(scores)).toBe(true);
  });

  it('valide avec 4 joueurs répartis', () => {
    const scores = { alice: 40, bob: 80, clara: 70, dave: 60 };
    expect(papayooRoundIsValid(scores)).toBe(true);
  });
});
