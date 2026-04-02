import { GAME_CONFIGS } from '../index';

const cfg = GAME_CONFIGS.find(g => g.id === 'trio')!;

describe('Configuration Trio', () => {
  it('existe dans les configs', () => {
    expect(cfg).toBeDefined();
  });

  it('scoreDirection = high (plus de trios = meilleur)', () => {
    expect(cfg.scoreDirection).toBe('high');
  });

  it('endCondition = threshold à 3 trios', () => {
    expect(cfg.endCondition).toBe('threshold');
    expect(cfg.endValue).toBe(3);
  });

  it('inputType = wins', () => {
    expect(cfg.inputType).toBe('wins');
  });

  it('3 à 6 joueurs', () => {
    expect(cfg.minPlayers).toBe(3);
    expect(cfg.maxPlayers).toBe(6);
  });
});

// ─── Logique de victoire ───────────────────────────────────────────────────────

function trioHasWon(triosWon: number, target = 3): boolean {
  return triosWon >= target;
}

function trioLeader(scores: Record<string, number>): string {
  return Object.entries(scores).reduce((best, [id, s]) => s > best[1] ? [id, s] : best, ['', -Infinity])[0];
}

describe('trioHasWon', () => {
  it('victoire à 3 trios (mode Simple)', () => {
    expect(trioHasWon(3)).toBe(true);
  });

  it('pas encore gagné avec 2 trios en mode Simple', () => {
    expect(trioHasWon(2)).toBe(false);
  });

  it('victoire à 2 trios en mode Picante (target = 2)', () => {
    expect(trioHasWon(2, 2)).toBe(true);
  });

  it('le trio de 7 donne victoire immédiate (modélisé comme target = 1)', () => {
    expect(trioHasWon(1, 1)).toBe(true);
  });

  it('0 trio = pas de victoire', () => {
    expect(trioHasWon(0)).toBe(false);
  });
});

describe('trioLeader', () => {
  it('le joueur avec le plus de trios est en tête', () => {
    expect(trioLeader({ alice: 2, bob: 1, clara: 0 })).toBe('alice');
  });

  it('fonctionne avec 4 joueurs', () => {
    expect(trioLeader({ alice: 1, bob: 3, clara: 2, dave: 1 })).toBe('bob');
  });
});
