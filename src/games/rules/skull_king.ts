export const skullKingRules = {
  gameId: "skull_king",
  gameName: { fr: "Skull King", en: "Skull King" },
  tagline: {
    fr: "Jeu de plis avec paris — Devenez Capitaine des Sept Mers !",
    en: "Trick-taking with bids — Become Captain of the Seven Seas!",
  },
  players: { min: 2, max: 8 },
  duration: { fr: "30–60 min", en: "30–60 min" },
  objective: {
    fr: "Skull King est un jeu de plis dans lequel vous pariez sur le nombre exact de plis que vous pensez réaliser à chaque manche. Le pirate avec le score le plus élevé à la fin de la partie remporte la victoire et le titre de Capitaine des Sept Mers.",
    en: "Skull King is a trick-taking game in which you bid on the exact number of tricks you think you will win each round. The pirate with the highest score at the end of the game wins the title of Captain of the Seven Seas.",
  },
  setup: {
    fr: [
      "Retirez les 8 cartes avancées pour une partie standard : les cartes vierges (4), les cartes Butin (2), le Kraken (1) et la Baleine blanche (1).",
      "Distribuez à chaque joueur les aides de jeu et un set de cartes de rappel des mises.",
      "Mélangez les cartes. La partie se joue en 10 manches : 1 carte distribuée à la 1ère manche, 2 à la 2ème, et ainsi de suite jusqu'à 10 cartes à la 10ème manche.",
    ],
    en: [
      "Remove the 8 advanced cards for a standard game: blank cards (4), Loot cards (2), the Kraken (1), and the White Whale (1).",
      "Give each player a player aid and a set of bid reminder cards.",
      "Shuffle the cards. The game is played over 10 rounds: 1 card dealt in round 1, 2 in round 2, and so on up to 10 cards in round 10.",
    ],
  },
  gameplay: {
    fr: [
      "Après avoir reçu vos cartes, estimez le nombre exact de plis que vous comptez remporter. Frappez trois fois du poing en criant « Yo-ho-ho ! » et révélez simultanément votre mise (nombre de doigts, ou poing fermé pour zéro).",
      "Le joueur à la gauche du donneur ouvre le premier pli. Dans le sens horaire, chaque joueur pose une carte face visible. La carte la plus forte remporte le pli.",
      "La couleur de la première carte jouée doit être suivie si possible. Les cartes spéciales peuvent être jouées en dehors de la règle de couleur.",
      "La partie continue jusqu'à la 10ème manche. Le joueur avec le score le plus élevé gagne.",
    ],
    en: [
      "After receiving your cards, estimate the exact number of tricks you plan to win. Knock three times while shouting 'Yo-ho-ho!' then simultaneously reveal your bid (number of fingers, or fist for zero).",
      "The player to the left of the dealer leads the first trick. Clockwise, each player plays a card face up. The highest card wins the trick.",
      "The suit of the first card played must be followed if possible. Special cards may be played regardless of suit.",
      "Play continues through round 10. The player with the highest score wins.",
    ],
  },
  cards: {
    fr: {
      colored: [
        "56 cartes de couleur numérotées de 1 à 14 en 4 familles : Perroquet (vert), Coffre (jaune), Carte au trésor (violet), Drapeau pirate (noir — l'atout).",
        "La couleur noire (Drapeau pirate) est l'atout : elle surpasse toutes les autres couleurs, quelle que soit la valeur.",
      ],
      special: [
        "Fuite (×5) : Perd contre toutes les autres cartes. Utilisée pour ne pas remporter de pli. Si tous jouent une Fuite, la première jouée gagne.",
        "Pirate (×5) : Bat toutes les cartes numérotées. Si plusieurs Pirates sont joués, le premier joué gagne.",
        "Tigresse (×1) : Choix au moment du jeu — agit comme un Pirate ou comme une Fuite.",
        "Skull King (×1) : Bat tous les Pirates et toutes les cartes numérotées. Seules les Sirènes peuvent le vaincre.",
        "Sirène (×2) : Bat toutes les cartes numérotées mais perd contre les Pirates. Exception : une Sirène bat Skull King. Si deux Sirènes s'affrontent, la première jouée gagne.",
      ],
    },
    en: {
      colored: [
        "56 numbered color cards from 1 to 14 in 4 suits: Parrot (green), Treasure Chest (yellow), Treasure Map (purple), Jolly Roger (black — trump).",
        "The black suit (Jolly Roger) is trump: it beats all other suits regardless of value.",
      ],
      special: [
        "Escape (×5): Loses to all other cards. Used to avoid winning a trick. If everyone plays an Escape, the first one played wins.",
        "Pirate (×5): Beats all numbered cards. If multiple Pirates are played, the first one played wins.",
        "Tigress (×1): Choice when played — acts as a Pirate or as an Escape.",
        "Skull King (×1): Beats all Pirates and all numbered cards. Only Mermaids can defeat it.",
        "Mermaid (×2): Beats all numbered cards but loses to Pirates. Exception: a Mermaid beats Skull King. If two Mermaids clash, the first one played wins.",
      ],
    },
  },
  scoring: {
    fr: {
      systemSkullKing: [
        "Mise correcte (1 pli ou plus) : +20 points par pli réalisé.",
        "Mise incorrecte : -10 points par pli d'écart, aucun point pour les plis réalisés.",
        "Mise zéro réussie : +10 points × numéro de manche (ex. manche 7 = 70 pts).",
        "Mise zéro ratée : -10 points × nombre de cartes distribuées cette manche.",
      ],
      bonusPoints: [
        "Carte 14 classique (jaune, violet, vert) dans vos plis : +10 points chacune.",
        "Carte 14 noire dans vos plis : +20 points.",
        "Pirater capturé par Skull King : +30 points pour Skull King.",
        "Sirène capturée par un Pirate : +20 points pour le Pirate.",
        "Sirène capturant Skull King : +40 points pour la Sirène.",
      ],
      systemRascal: [
        "Chaque joueur peut gagner 10 points × nombre de cartes distribuées, quelle que soit sa mise.",
        "Coup direct (mise exacte) : tous les points de la manche.",
        "Frappe à revers (écart de 1) : la moitié des points.",
        "Échec cuisant (écart de 2+) : 0 point.",
      ],
    },
    en: {
      systemSkullKing: [
        "Correct bid (1 trick or more): +20 points per trick won.",
        "Incorrect bid: -10 points per trick difference, no points for tricks won.",
        "Successful zero bid: +10 points × round number (e.g. round 7 = 70 pts).",
        "Failed zero bid: -10 points × number of cards dealt this round.",
      ],
      bonusPoints: [
        "Standard 14 card (yellow, purple, green) in your tricks: +10 points each.",
        "Black 14 card in your tricks: +20 points.",
        "Pirate captured by Skull King: +30 points for Skull King.",
        "Mermaid captured by a Pirate: +20 points for the Pirate.",
        "Mermaid capturing Skull King: +40 points for the Mermaid.",
      ],
      systemRascal: [
        "Each player can earn 10 points × number of cards dealt, regardless of bid.",
        "Direct hit (exact bid): full round points.",
        "Glancing blow (off by 1): half the points.",
        "Crushing defeat (off by 2+): 0 points.",
      ],
    },
  },
  advancedRules: {
    fr: [
      "Kraken : quand il est joué, le pli est entièrement détruit, personne ne le remporte.",
      "Baleine blanche : détruit les cartes spéciales du pli ; seules les valeurs numériques comptent, la plus haute gagne.",
      "Butin (×2) : alliance avec le joueur qui remporte ce pli ; +20 pts bonus si tous les deux misent juste.",
      "Règle 2 joueurs : 3 paquets sont mélangés, un troisième joueur fictif « Barbe Grise » joue sa carte en deuxième position à chaque pli (retourner la carte du dessus de sa pile).",
    ],
    en: [
      "Kraken: when played, the entire trick is destroyed — nobody wins it.",
      "White Whale: destroys all special cards in the trick; only numeric values count, highest wins.",
      "Loot (×2): alliance with the player who wins this trick; +20 bonus pts if both bid correctly.",
      "2-player rule: 3 decks are shuffled together, a fictional third player 'Gray Beard' plays their card second in each trick (flip the top card of their pile).",
    ],
  },
  endGame: {
    fr: "Au terme de la 10ème manche, les scores finaux sont calculés. Le joueur avec le score le plus élevé est déclaré vainqueur — Capitaine des Sept Mers !",
    en: "After the 10th round, final scores are tallied. The player with the highest score is declared the winner — Captain of the Seven Seas!",
  },
};
