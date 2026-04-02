/**
 * Flip 7 — logique de calcul du score d'une manche.
 *
 * Ordre de calcul :
 *  1. Totaliser les cartes Numéro
 *  2. Si bonus ×2, doubler ce total
 *  3. Ajouter les bonus +
 *  4. Si Flip 7 réalisé, ajouter 15 pts
 *  5. Si saut (bust), score = 0
 */
export function computeFlip7Score({
  numbers,
  bonusX2,
  bonusPlus,
  flip7Achieved,
  busted,
}: {
  numbers: number[];
  bonusX2: boolean;
  bonusPlus: number;
  flip7Achieved: boolean;
  busted: boolean;
}): number {
  if (busted) return 0;
  let total = numbers.reduce((sum, n) => sum + n, 0);
  if (bonusX2) total *= 2;
  total += bonusPlus;
  if (flip7Achieved) total += 15;
  return total;
}
