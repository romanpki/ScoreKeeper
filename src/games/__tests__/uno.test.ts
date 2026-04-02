import { GAME_CONFIGS } from '../index';

const cfg = GAME_CONFIGS.find(g => g.id === 'uno')!;

describe('Configuration UNO', () => {
  it('existe dans les configs', () => {
    expect(cfg).toBeDefined();
  });

  it('scoreDirection = high (plus de points = meilleur)', () => {
    expect(cfg.scoreDirection).toBe('high');
  });

  it('endCondition = threshold à 500 pts', () => {
    expect(cfg.endCondition).toBe('threshold');
    expect(cfg.endValue).toBe(500);
  });

  it('inputType = simple', () => {
    expect(cfg.inputType).toBe('simple');
  });

  it('2 à 10 joueurs', () => {
    expect(cfg.minPlayers).toBe(2);
    expect(cfg.maxPlayers).toBe(10);
  });
});

// ─── Logique de fin de partie ──────────────────────────────────────────────────

function unoIsGameOver(scores: Record<string, number>, threshold = 500): boolean {
  return Object.values(scores).some(s => s >= threshold);
}

function unoWinner(scores: Record<string, number>): string {
  return Object.entries(scores).reduce((best, [id, s]) => s > best[1] ? [id, s] : best, ['', -Infinity])[0];
}

describe('unoIsGameOver', () => {
  it('partie terminée si un joueur atteint 500', () => {
    expect(unoIsGameOver({ alice: 500, bob: 320 })).toBe(true);
  });

  it('partie non terminée si personne n\'atteint 500', () => {
    expect(unoIsGameOver({ alice: 499, bob: 320 })).toBe(false);
  });

  it('partie terminée dès qu\'un joueur dépasse 500', () => {
    expect(unoIsGameOver({ alice: 501, bob: 200 })).toBe(true);
  });

  it('respecte le seuil personnalisé', () => {
    expect(unoIsGameOver({ alice: 300, bob: 200 }, 300)).toBe(true);
    expect(unoIsGameOver({ alice: 299, bob: 200 }, 300)).toBe(false);
  });
});

describe('unoWinner', () => {
  it('le gagnant est le joueur avec le plus de points', () => {
    expect(unoWinner({ alice: 510, bob: 320 })).toBe('alice');
  });

  it('fonctionne avec plus de 2 joueurs', () => {
    expect(unoWinner({ alice: 200, bob: 510, clara: 480 })).toBe('bob');
  });
});
