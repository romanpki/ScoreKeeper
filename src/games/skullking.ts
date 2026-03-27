/**
 * Skull King — logique de calcul des scores.
 *
 * Règles :
 *  - bid=0 et tricks=0       → +10 × manche
 *  - bid=0 et tricks>0       → -10 × manche
 *  - bid>0 et bid===tricks   → +20×bid + bonus14×10 + bonusPirate×30 + (bonusSK ? 50 : 0)
 *  - bid>0 et bid!==tricks   → -10 × |bid - tricks|
 *  Les bonus ne comptent QUE si bid > 0 ET bid === tricks.
 */
export function computeSkullKingScore(
  bid: number,
  tricks: number,
  bonus14: number,
  bonusPirate: number,
  bonusSK: boolean,
  roundNumber: number,
): number {
  if (bid === 0) {
    return tricks === 0 ? 10 * roundNumber : -10 * roundNumber;
  }
  if (bid === tricks) {
    return 20 * bid + bonus14 * 10 + bonusPirate * 30 + (bonusSK ? 50 : 0);
  }
  return -10 * Math.abs(bid - tricks);
}
