export const skullKingRules = {
  gameId: "skull_king",
  gameName: "Skull King",
  tagline: "Jeu de plis avec paris — Devenez Capitaine des Sept Mers !",
  players: { min: 2, max: 8 },
  duration: "30–60 min",
  objective:
    "Skull King est un jeu de plis dans lequel vous pariez sur le nombre exact de plis que vous pensez réaliser à chaque manche. Le pirate avec le score le plus élevé à la fin de la partie remporte la victoire et le titre de Capitaine des Sept Mers.",

  setup: [
    "Retirez les 8 cartes avancées pour une partie standard : les cartes vierges (4), les cartes Butin (2), le Kraken (1) et la Baleine blanche (1).",
    "Distribuez à chaque joueur les aides de jeu et un set de cartes de rappel des mises.",
    "Mélangez les cartes. La partie se joue en 10 manches : 1 carte distribuée à la 1ère manche, 2 à la 2ème, et ainsi de suite jusqu'à 10 cartes à la 10ème manche.",
  ],

  gameplay: [
    "Après avoir reçu vos cartes, estimez le nombre exact de plis que vous comptez remporter. Frappez trois fois du poing en criant « Yo-ho-ho ! » et révélez simultanément votre mise (nombre de doigts, ou poing fermé pour zéro).",
    "Le joueur à la gauche du donneur ouvre le premier pli. Dans le sens horaire, chaque joueur pose une carte face visible. La carte la plus forte remporte le pli.",
    "La couleur de la première carte jouée doit être suivie si possible. Les cartes spéciales peuvent être jouées en dehors de la règle de couleur.",
    "La partie continue jusqu'à la 10ème manche. Le joueur avec le score le plus élevé gagne.",
  ],

  cards: {
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

  scoring: {
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

  advancedRules: [
    "Kraken : quand il est joué, le pli est entièrement détruit, personne ne le remporte.",
    "Baleine blanche : détruit les cartes spéciales du pli ; seules les valeurs numériques comptent, la plus haute gagne.",
    "Butin (×2) : alliance avec le joueur qui remporte ce pli ; +20 pts bonus si tous les deux misent juste.",
    "Règle 2 joueurs : 3 paquets sont mélangés, un troisième joueur fictif « Barbe Grise » joue sa carte en deuxième position à chaque pli (retourner la carte du dessus de sa pile).",
  ],

  endGame:
    "Au terme de la 10ème manche, les scores finaux sont calculés. Le joueur avec le score le plus élevé est déclaré vainqueur — Capitaine des Sept Mers !",
};
