import { GAME_CONFIGS } from '../index';

const cfg = GAME_CONFIGS.find(g => g.id === 'odin')!;

describe('Configuration Odin', () => {
  it('existe dans les configs', () => {
    expect(cfg).toBeDefined();
  });

  it('scoreDirection = low (moins de points = meilleur)', () => {
    expect(cfg.scoreDirection).toBe('low');
  });

  it('endCondition = threshold à 15 pts par défaut', () => {
    expect(cfg.endCondition).toBe('threshold');
    expect(cfg.endValue).toBe(15);
  });

  it('inputType = simple (score = nombre de cartes en main)', () => {
    expect(cfg.inputType).toBe('simple');
  });

  it('2 à 6 joueurs', () => {
    expect(cfg.minPlayers).toBe(2);
    expect(cfg.maxPlayers).toBe(6);
  });
});

// ─── Logique des points ────────────────────────────────────────────────────────

/** Chaque carte en main = 1 point */
function odinRoundScore(cardsInHand: number): number {
  return cardsInHand;
}

function odinIsGameOver(scores: Record<string, number>, threshold = 15): boolean {
  return Object.values(scores).some(s => s >= threshold);
}

function odinWinner(scores: Record<string, number>): string {
  return Object.entries(scores).reduce((best, [id, s]) => s < best[1] ? [id, s] : best, ['', Infinity])[0];
}

describe('odinRoundScore', () => {
  it('0 carte en main = 0 point (vide sa main = fin de manche)', () => {
    expect(odinRoundScore(0)).toBe(0);
  });

  it('3 cartes en main = 3 points', () => {
    expect(odinRoundScore(3)).toBe(3);
  });

  it('9 cartes en main (main complète) = 9 points', () => {
    expect(odinRoundScore(9)).toBe(9);
  });
});

describe('odinIsGameOver', () => {
  it('partie terminée quand un joueur atteint 15 pts', () => {
    expect(odinIsGameOver({ alice: 15, bob: 8 })).toBe(true);
  });

  it('partie non terminée si personne n\'atteint 15', () => {
    expect(odinIsGameOver({ alice: 14, bob: 12 })).toBe(false);
  });

  it('partie terminée dès qu\'un joueur dépasse 15', () => {
    expect(odinIsGameOver({ alice: 18, bob: 6 })).toBe(true);
  });

  it('respecte un seuil personnalisé', () => {
    expect(odinIsGameOver({ alice: 20, bob: 10 }, 20)).toBe(true);
    expect(odinIsGameOver({ alice: 19, bob: 10 }, 20)).toBe(false);
  });
});

describe('odinWinner', () => {
  it('le gagnant est le joueur avec le moins de points', () => {
    expect(odinWinner({ alice: 12, bob: 5 })).toBe('bob');
  });

  it('fonctionne avec plusieurs joueurs', () => {
    expect(odinWinner({ alice: 14, bob: 15, clara: 6 })).toBe('clara');
  });
});
