export const skyjoRules = {
  gameId: "skyjo",
  gameName: "Skyjo",
  tagline: "Retournez les cartes, minimisez votre score, évitez les 100 points !",
  players: { min: 2, max: 8 },
  duration: "30 min",
  objective:
    "Skyjo se joue en plusieurs manches et se termine dès qu'un joueur atteint 100 points ou plus. Celui qui a obtenu le moins de points à ce moment-là gagne la partie.",

  setup: [
    "Chaque joueur reçoit 12 cartes distribuées face cachée, qu'il dispose en 4 colonnes de 3 cartes devant lui.",
    "Une carte est retournée face visible au centre pour constituer la défausse. Le reste forme la pioche.",
    "Chaque joueur retourne face visible 2 cartes de son choix.",
    "Le joueur dont la somme des deux cartes visibles est la plus élevée commence.",
  ],

  gameplay: [
    "À son tour, le joueur choisit entre deux actions :",
    "Choix 1 — Prendre la carte visible du dessus de la défausse : il doit immédiatement l'échanger avec l'une de ses 12 cartes (visible ou cachée). La carte échangée rejoint la défausse face visible.",
    "Choix 2 — Tirer la carte du dessus de la pioche : il peut l'échanger avec l'une de ses cartes (visible ou cachée), ou la défausser. S'il la défausse, il doit retourner face visible l'une de ses cartes cachées.",
    "Règle spéciale — Colonne triple : si un joueur révèle ou place 3 cartes identiques dans une même colonne, ces 3 cartes sont immédiatement défaussées (éliminées de son jeu). Cette règle s'applique aussi lors du décompte final.",
  ],

  endRound: [
    "Quand un joueur a retourné toutes ses cartes, il joue son dernier tour. Tous les autres joueurs jouent encore une fois.",
    "Les joueurs ayant encore des cartes cachées les retournent. Chaque joueur totalise ses points.",
    "Attention : si le joueur qui a terminé en premier n'obtient pas strictement le score le plus bas de la manche, ses points pour cette manche sont doublés (uniquement si le total est positif).",
  ],

  scoring: [
    "Le total de chaque joueur est ajouté à son score cumulé.",
    "Les points négatifs se soustraient au total.",
    "La partie se termine dès qu'un joueur atteint 100 points ou plus en fin de manche.",
    "Le joueur avec le score le plus bas gagne.",
  ],

  cardValues:
    "Les cartes vont de -2 à 12. Les cartes à valeur négative ou faible font baisser le score, les cartes élevées le font monter. L'objectif est d'avoir le total le plus bas possible.",

  endGame:
    "À la fin de la manche où un joueur atteint 100 points ou plus, le joueur avec le score total le plus faible remporte la partie.",
};
