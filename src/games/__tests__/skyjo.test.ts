import { computeSkyjoDoubling } from '../skyjo';

describe('computeSkyjoDoubling', () => {
  const players = { p1: 10, p2: 5, p3: 8 };

  it('aucun doublement si firstPlayerId est null', () => {
    const { values, doubled } = computeSkyjoDoubling(players, null);
    expect(values).toEqual(players);
    expect(doubled).toEqual({});
  });

  it('pas de doublement si le premier joueur a le plus bas score', () => {
    const raw = { p1: 5, p2: 10, p3: 8 };
    const { values, doubled } = computeSkyjoDoubling(raw, 'p1');
    expect(values).toEqual(raw);
    expect(doubled).toEqual({});
  });

  it('doublement si le premier joueur n\'a PAS le plus bas score', () => {
    const { values, doubled } = computeSkyjoDoubling(players, 'p1');
    expect(doubled).toEqual({ p1: true });
    expect(values.p1).toBe(20);
    expect(values.p2).toBe(5);
    expect(values.p3).toBe(8);
  });

  it('ne modifie pas le rawValues original', () => {
    const raw = { p1: 10, p2: 5 };
    const original = { ...raw };
    computeSkyjoDoubling(raw, 'p1');
    expect(raw).toEqual(original);
  });

  it('doublement si ex-aequo pour le plus bas et firstPlayer n\'est pas l\'un d\'eux', () => {
    const raw = { p1: 5, p2: 5, p3: 8 };
    const { values, doubled } = computeSkyjoDoubling(raw, 'p3');
    expect(doubled).toEqual({ p3: true });
    expect(values.p3).toBe(16);
  });

  it('pas de doublement si firstPlayer est l\'un des ex-aequo avec le plus bas', () => {
    const raw = { p1: 5, p2: 5, p3: 8 };
    const { values, doubled } = computeSkyjoDoubling(raw, 'p1');
    expect(doubled).toEqual({});
    expect(values).toEqual(raw);
  });
});
