export const skyjoRules = {
  gameId: "skyjo",
  gameName: { fr: "Skyjo", en: "Skyjo" },
  tagline: {
    fr: "Retournez les cartes, minimisez votre score, évitez les 100 points !",
    en: "Flip your cards, minimize your score, avoid hitting 100 points!",
  },
  players: { min: 2, max: 8 },
  duration: { fr: "30 min", en: "30 min" },
  objective: {
    fr: "Skyjo se joue en plusieurs manches et se termine dès qu'un joueur atteint 100 points ou plus. Celui qui a obtenu le moins de points à ce moment-là gagne la partie.",
    en: "Skyjo is played over several rounds and ends as soon as a player reaches 100 points or more. The player with the fewest points at that moment wins.",
  },
  setup: {
    fr: [
      "Chaque joueur reçoit 12 cartes distribuées face cachée, qu'il dispose en 4 colonnes de 3 cartes devant lui.",
      "Une carte est retournée face visible au centre pour constituer la défausse. Le reste forme la pioche.",
      "Chaque joueur retourne face visible 2 cartes de son choix.",
      "Le joueur dont la somme des deux cartes visibles est la plus élevée commence.",
    ],
    en: [
      "Each player receives 12 cards dealt face down, arranged in 4 columns of 3 in front of them.",
      "One card is turned face up in the center to start the discard pile. The rest forms the draw pile.",
      "Each player flips 2 cards of their choice face up.",
      "The player whose two visible cards have the highest total goes first.",
    ],
  },
  gameplay: {
    fr: [
      "À son tour, le joueur choisit entre deux actions :",
      "Choix 1 — Prendre la carte visible du dessus de la défausse : il doit immédiatement l'échanger avec l'une de ses 12 cartes (visible ou cachée). La carte échangée rejoint la défausse face visible.",
      "Choix 2 — Tirer la carte du dessus de la pioche : il peut l'échanger avec l'une de ses cartes (visible ou cachée), ou la défausser. S'il la défausse, il doit retourner face visible l'une de ses cartes cachées.",
      "Règle spéciale — Colonne triple : si un joueur révèle ou place 3 cartes identiques dans une même colonne, ces 3 cartes sont immédiatement défaussées (éliminées de son jeu). Cette règle s'applique aussi lors du décompte final.",
    ],
    en: [
      "On their turn, the player chooses between two actions:",
      "Choice 1 — Take the top visible card from the discard pile: they must immediately swap it with one of their 12 cards (face up or face down). The swapped card goes to the discard pile face up.",
      "Choice 2 — Draw the top card from the draw pile: they can swap it with one of their cards (face up or face down), or discard it. If they discard it, they must flip one of their face-down cards face up.",
      "Special rule — Triple column: if a player reveals or places 3 identical cards in the same column, those 3 cards are immediately discarded (removed from their game). This rule also applies during the final scoring.",
    ],
  },
  endRound: {
    fr: [
      "Quand un joueur a retourné toutes ses cartes, il joue son dernier tour. Tous les autres joueurs jouent encore une fois.",
      "Les joueurs ayant encore des cartes cachées les retournent. Chaque joueur totalise ses points.",
      "Attention : si le joueur qui a terminé en premier n'obtient pas strictement le score le plus bas de la manche, ses points pour cette manche sont doublés (uniquement si le total est positif).",
    ],
    en: [
      "When a player has flipped all their cards, they play their last turn. All other players play one more time.",
      "Players who still have face-down cards flip them. Each player totals their points.",
      "Important: if the player who finished first does not have the strictly lowest score of the round, their points for that round are doubled (only if the total is positive).",
    ],
  },
  scoring: {
    fr: [
      "Le total de chaque joueur est ajouté à son score cumulé.",
      "Les points négatifs se soustraient au total.",
      "La partie se termine dès qu'un joueur atteint 100 points ou plus en fin de manche.",
      "Le joueur avec le score le plus bas gagne.",
    ],
    en: [
      "Each player's total is added to their cumulative score.",
      "Negative points are subtracted from the total.",
      "The game ends as soon as a player reaches 100 points or more at the end of a round.",
      "The player with the lowest score wins.",
    ],
  },
  cardValues: {
    fr: "Les cartes vont de -2 à 12. Les cartes à valeur négative ou faible font baisser le score, les cartes élevées le font monter. L'objectif est d'avoir le total le plus bas possible.",
    en: "Cards range from -2 to 12. Negative or low-value cards lower your score, high cards raise it. The goal is to have the lowest total possible.",
  },
  endGame: {
    fr: "À la fin de la manche où un joueur atteint 100 points ou plus, le joueur avec le score total le plus faible remporte la partie.",
    en: "At the end of the round in which a player reaches 100 points or more, the player with the lowest total score wins.",
  },
};
