export const papayooRules = {
  gameId: "papayoo",
  gameName: { fr: "Papayoo", en: "Papayoo" },
  tagline: {
    fr: "Évitez les plis qui font mal — et surtout, évitez le Papayoo !",
    en: "Avoid the painful tricks — and above all, avoid the Papayoo!",
  },
  players: { min: 3, max: 8 },
  duration: { fr: "30 min", en: "30 min" },
  objective: {
    fr: "Terminer la partie avec le moins de points possible en évitant de ramasser les cartes qui valent des points. La couleur du Papayoo change à chaque manche grâce à un dé, ce qui rend chaque manche unique.",
    en: "Finish the game with as few points as possible by avoiding picking up scoring cards. The Papayoo color changes each round via a die, making every round unique.",
  },
  setup: {
    fr: {
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
    en: {
      cardDistribution: [
        "3 players: 20 cards each + 5 cards set aside",
        "4 players: 15 cards each + 5 cards set aside",
        "5 players: 12 cards each + 4 cards set aside",
        "6 players: 10 cards each + 3 cards set aside",
        "7 players: remove the 4 '1' cards → 8 cards each + 3 cards set aside",
        "8 players: remove the 4 '1' cards → 7 cards each + 3 cards set aside",
      ],
      steps: [
        "The dealer (rotates each round) deals cards in packets of 3 up to each player's quota.",
        "Exchange: each player secretly selects the required number of cards and places them face down in front of their left neighbor. Golden rule: give your cards before looking at the ones received.",
        "Once the exchange is done, the dealer rolls the 8-sided die. The result designates the Papayoo color (Spades, Hearts, Diamonds, or Clubs). The 7 of that color becomes the Papayoo and is worth 40 points.",
      ],
    },
  },
  cards: {
    fr: {
      classic: "40 cartes classiques numérotées de 1 à 10 dans 4 couleurs (Pique, Cœur, Carreau, Trèfle). Elles valent 0 point sauf le 7 de la couleur désignée par le dé (le Papayoo).",
      payoo: "20 cartes Payoo numérotées de 1 à 20. Chaque carte Payoo vaut sa valeur en points (Payoo 1 = 1 pt, Payoo 15 = 15 pts, etc.). Elles forment une cinquième couleur à part entière.",
      papayoo: "Le Papayoo est le 7 de la couleur tirée au dé. Il vaut 40 points à lui seul. Sa couleur change à chaque manche.",
      total: "Le total des points distribuables est toujours de 250 points par manche (Payoo 1 à 20 = 210 pts + Papayoo = 40 pts).",
    },
    en: {
      classic: "40 classic cards numbered 1 to 10 in 4 colors (Spades, Hearts, Diamonds, Clubs). Worth 0 points except the 7 of the color designated by the die (the Papayoo).",
      payoo: "20 Payoo cards numbered 1 to 20. Each Payoo card is worth its face value in points (Payoo 1 = 1 pt, Payoo 15 = 15 pts, etc.). They form a fifth color of their own.",
      papayoo: "The Papayoo is the 7 of the color rolled on the die. It is worth 40 points on its own. Its color changes every round.",
      total: "The total scoreable points is always 250 per round (Payoo 1 to 20 = 210 pts + Papayoo = 40 pts).",
    },
  },
  gameplay: {
    fr: [
      "Le donneur commence en posant la carte de son choix face visible au centre de la table.",
      "Les joueurs jouent dans le sens horaire. La règle de base : suivre la couleur de la première carte jouée.",
      "Si tu n'as pas la couleur demandée, tu te défausses librement de n'importe quelle carte — c'est le moment idéal pour se débarrasser des cartes à points !",
      "Les cartes Payoo forment une cinquième couleur : si la première carte jouée est un Payoo, les autres doivent jouer un Payoo s'ils en ont un.",
      "Le joueur qui a joué la carte la plus forte dans la couleur demandée remporte le pli et ouvre le suivant.",
      "Si aucun joueur n'a pu suivre la couleur, c'est le joueur qui a ouvert le pli qui le remporte.",
    ],
    en: [
      "The dealer starts by playing any card of their choice face up in the center of the table.",
      "Players play clockwise. The basic rule: follow the suit of the first card played.",
      "If you don't have the required suit, you may freely discard any card — the perfect opportunity to get rid of scoring cards!",
      "Payoo cards form a fifth suit: if the first card played is a Payoo, others must play a Payoo if they have one.",
      "The player who played the highest card of the led suit wins the trick and leads the next one.",
      "If no player could follow suit, the player who led the trick wins it.",
    ],
  },
  scoring: {
    fr: [
      "À la fin de chaque manche, chaque joueur retourne ses plis et compte ses points.",
      "Cartes Payoo : valeur indiquée (de 1 à 20 points).",
      "Papayoo (le 7 de la couleur tirée) : 40 points.",
      "Toutes les autres cartes : 0 point.",
      "Le total de la manche doit obligatoirement être de 250 points — si ce n'est pas le cas, il y a une erreur de comptage.",
      "Les points de la manche s'ajoutent aux scores cumulés.",
    ],
    en: [
      "At the end of each round, each player turns over their tricks and counts their points.",
      "Payoo cards: face value (1 to 20 points).",
      "Papayoo (the 7 of the rolled color): 40 points.",
      "All other cards: 0 points.",
      "The round total must always equal 250 points — if not, there is a counting error.",
      "Round points are added to cumulative scores.",
    ],
  },
  endGame: {
    fr: "Avant de commencer, les joueurs décident du nombre de manches (4 manches ≈ 30 minutes est une bonne durée). À la fin de la dernière manche, le joueur avec le moins de points remporte la partie.",
    en: "Before starting, players agree on the number of rounds (4 rounds ≈ 30 minutes is a good length). At the end of the last round, the player with the fewest points wins.",
  },
  tips: {
    fr: [
      "Vider totalement une couleur de sa main peut sembler malin pour se défausser, mais attention à recevoir via l'écart un 7 ou des cartes fortes dans cette couleur.",
      "Parfois mieux vaut ramasser un pli sans points tôt pour conserver ses petites cartes et éviter les gros plis plus tard.",
    ],
    en: [
      "Emptying a suit from your hand might seem smart for discarding, but beware of receiving a 7 or high cards in that suit via the exchange.",
      "Sometimes it's better to take a scoreless trick early to keep your low cards and avoid big scoring tricks later.",
    ],
  },
};
