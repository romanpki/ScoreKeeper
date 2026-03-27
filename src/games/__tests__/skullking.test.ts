import { computeSkullKingScore } from '../skullking';

describe('computeSkullKingScore', () => {
  describe('bid = 0', () => {
    it('bid=0, tricks=0 → +10 × round', () => {
      expect(computeSkullKingScore(0, 0, 0, 0, false, 1)).toBe(10);
      expect(computeSkullKingScore(0, 0, 0, 0, false, 5)).toBe(50);
      expect(computeSkullKingScore(0, 0, 0, 0, false, 10)).toBe(100);
    });

    it('bid=0, tricks>0 → -10 × round', () => {
      expect(computeSkullKingScore(0, 1, 0, 0, false, 1)).toBe(-10);
      expect(computeSkullKingScore(0, 3, 0, 0, false, 5)).toBe(-50);
    });

    it('bid=0 : les bonus sont ignorés', () => {
      expect(computeSkullKingScore(0, 0, 5, 3, true, 3)).toBe(30);
    });
  });

  describe('bid > 0, réussi (bid === tricks)', () => {
    it('sans bonus → +20 × bid', () => {
      expect(computeSkullKingScore(3, 3, 0, 0, false, 5)).toBe(60);
      expect(computeSkullKingScore(1, 1, 0, 0, false, 1)).toBe(20);
    });

    it('avec bonus 14 → +10 par carte', () => {
      expect(computeSkullKingScore(2, 2, 2, 0, false, 4)).toBe(40 + 20);
    });

    it('avec pirates capturés par SK → +30 chacun', () => {
      expect(computeSkullKingScore(2, 2, 0, 1, false, 4)).toBe(40 + 30);
    });

    it('avec SK capturé par sirène → +50', () => {
      expect(computeSkullKingScore(2, 2, 0, 0, true, 4)).toBe(40 + 50);
    });

    it('combinaison de tous les bonus', () => {
      expect(computeSkullKingScore(3, 3, 2, 1, true, 7)).toBe(60 + 20 + 30 + 50);
    });
  });

  describe('bid > 0, raté (bid !== tricks)', () => {
    it('→ -10 × |bid - tricks|', () => {
      expect(computeSkullKingScore(3, 2, 0, 0, false, 5)).toBe(-10);
      expect(computeSkullKingScore(3, 0, 0, 0, false, 5)).toBe(-30);
      expect(computeSkullKingScore(1, 3, 0, 0, false, 5)).toBe(-20);
    });

    it('raté : les bonus sont ignorés', () => {
      expect(computeSkullKingScore(3, 2, 5, 3, true, 5)).toBe(-10);
    });
  });

  describe('manche 1 (edge case)', () => {
    it('bid=0, tricks=0, round=1 → +10', () => {
      expect(computeSkullKingScore(0, 0, 0, 0, false, 1)).toBe(10);
    });
  });
});
