export const papayooRules = {
  gameId: "papayoo",
  gameName: "Papayoo",
  tagline: "Évitez les plis qui font mal — et surtout, évitez le Papayoo !",
  players: { min: 3, max: 8 },
  duration: "30 min",
  objective:
    "Terminer la partie avec le moins de points possible en évitant de ramasser les cartes qui valent des points. La couleur du Papayoo change à chaque manche grâce à un dé, ce qui rend chaque manche unique.",

  setup: {
    cardDistribution: [
      "3 joueurs : 20 cartes chacun + 5 cartes à l'écart",
      "4 joueurs : 15 cartes chacun + 5 cartes à l'écart",
      "5 joueurs : 12 cartes chacun + 4 cartes à l'écart",
      "6 joueurs : 10 cartes chacun + 3 cartes à l'écart",
      "7 joueurs : retirer les 4 cartes « 1 » → 8 cartes chacun + 3 cartes à l'écart",
      "8 joueurs : retirer les 4 cartes « 1 » → 7 cartes chacun + 3 cartes à l'écart",
    ],
    steps: [
      "Le donneur (qui tourne à chaque manche) distribue les cartes par paquets de 3 jusqu'au quota de chaque joueur.",
      "Écart : chaque joueur choisit en secret le nombre de cartes prévu, les pose face cachée devant son voisin de gauche. Règle d'or : donner ses cartes avant de regarder celles reçues.",
      "Une fois l'écart terminé, le donneur lance le dé à 8 faces. Le résultat désigne la couleur du Papayoo (Pique, Cœur, Carreau ou Trèfle). Le 7 de cette couleur devient le Papayoo et vaut 40 points.",
    ],
  },

  cards: {
    classic:
      "40 cartes classiques numérotées de 1 à 10 dans 4 couleurs (Pique, Cœur, Carreau, Trèfle). Elles valent 0 point sauf le 7 de la couleur désignée par le dé (le Papayoo).",
    payoo:
      "20 cartes Payoo numérotées de 1 à 20. Chaque carte Payoo vaut sa valeur en points (Payoo 1 = 1 pt, Payoo 15 = 15 pts, etc.). Elles forment une cinquième couleur à part entière.",
    papayoo:
      "Le Papayoo est le 7 de la couleur tirée au dé. Il vaut 40 points à lui seul. Sa couleur change à chaque manche.",
    total:
      "Le total des points distribuables est toujours de 250 points par manche (Payoo 1 à 20 = 210 pts + Papayoo = 40 pts).",
  },

  gameplay: [
    "Le donneur commence en posant la carte de son choix face visible au centre de la table.",
    "Les joueurs jouent dans le sens horaire. La règle de base : suivre la couleur de la première carte jouée.",
    "Si tu n'as pas la couleur demandée, tu te défausses librement de n'importe quelle carte — c'est le moment idéal pour se débarrasser des cartes à points !",
    "Les cartes Payoo forment une cinquième couleur : si la première carte jouée est un Payoo, les autres doivent jouer un Payoo s'ils en ont un.",
    "Le joueur qui a joué la carte la plus forte dans la couleur demandée remporte le pli et ouvre le suivant.",
    "Si aucun joueur n'a pu suivre la couleur, c'est le joueur qui a ouvert le pli qui le remporte.",
  ],

  scoring: [
    "À la fin de chaque manche, chaque joueur retourne ses plis et compte ses points.",
    "Cartes Payoo : valeur indiquée (de 1 à 20 points).",
    "Papayoo (le 7 de la couleur tirée) : 40 points.",
    "Toutes les autres cartes : 0 point.",
    "Le total de la manche doit obligatoirement être de 250 points — si ce n'est pas le cas, il y a une erreur de comptage.",
    "Les points de la manche s'ajoutent aux scores cumulés.",
  ],

  endGame:
    "Avant de commencer, les joueurs décident du nombre de manches (4 manches ≈ 30 minutes est une bonne durée). À la fin de la dernière manche, le joueur avec le moins de points remporte la partie.",

  tips: [
    "Vider totalement une couleur de sa main peut sembler malin pour se défausser, mais attention à recevoir via l'écart un 7 ou des cartes fortes dans cette couleur.",
    "Parfois mieux vaut ramasser un pli sans points tôt pour conserver ses petites cartes et éviter les gros plis plus tard.",
  ],
};
