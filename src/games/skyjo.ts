/**
 * Skyjo — logique de doublement de score.
 *
 * Règle : si le joueur qui a retourné sa dernière carte en premier
 * n'a PAS le score le plus bas de la manche, son score est doublé.
 */
export function computeSkyjoDoubling(
  rawValues: Record<string, number>,
  firstPlayerId: string | null,
): { values: Record<string, number>; doubled: Record<string, boolean> } {
  const values = { ...rawValues };
  const doubled: Record<string, boolean> = {};

  if (firstPlayerId) {
    const minScore = Math.min(...Object.values(rawValues));
    if (rawValues[firstPlayerId] !== minScore) {
      doubled[firstPlayerId] = true;
      values[firstPlayerId] = rawValues[firstPlayerId] * 2;
    }
  }

  return { values, doubled };
}
