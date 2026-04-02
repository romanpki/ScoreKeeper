import { computeFlip7Score } from '../flip7';

describe('computeFlip7Score', () => {
  const base = { bonusX2: false, bonusPlus: 0, flip7Achieved: false, busted: false };

  it('retourne 0 si le joueur a sauté (bust)', () => {
    const score = computeFlip7Score({ numbers: [5, 8, 12], bonusX2: true, bonusPlus: 10, flip7Achieved: true, busted: true });
    expect(score).toBe(0);
  });

  it('totalise simplement les cartes Numéro', () => {
    expect(computeFlip7Score({ ...base, numbers: [3, 7, 11] })).toBe(21);
  });

  it('double le total des cartes Numéro avec le bonus ×2', () => {
    expect(computeFlip7Score({ ...base, numbers: [5, 10], bonusX2: true })).toBe(30);
  });

  it('ajoute les bonus + APRÈS le doublement', () => {
    // (5 + 10) × 2 + 8 = 38
    expect(computeFlip7Score({ ...base, numbers: [5, 10], bonusX2: true, bonusPlus: 8 })).toBe(38);
  });

  it('ajoute 15 pts pour un Flip 7 réalisé', () => {
    // 21 + 15 = 36
    expect(computeFlip7Score({ ...base, numbers: [3, 7, 11], flip7Achieved: true })).toBe(36);
  });

  it('calcul complet : numéros + ×2 + bonus+ + Flip7', () => {
    // (3 + 5) × 2 + 4 + 15 = 35
    expect(computeFlip7Score({ numbers: [3, 5], bonusX2: true, bonusPlus: 4, flip7Achieved: true, busted: false })).toBe(35);
  });

  it('la carte 0 est comptée comme Numéro mais vaut 0 point', () => {
    expect(computeFlip7Score({ ...base, numbers: [0, 5, 9] })).toBe(14);
  });

  it('score nul sans cartes Numéro et sans bonus', () => {
    expect(computeFlip7Score({ ...base, numbers: [] })).toBe(0);
  });

  it('ne modifie pas le tableau numbers original', () => {
    const numbers = [4, 7];
    computeFlip7Score({ ...base, numbers, bonusX2: true });
    expect(numbers).toEqual([4, 7]);
  });
});
