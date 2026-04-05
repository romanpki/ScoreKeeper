export const rummyRules = {
  gameId: "rummy",
  gameName: "Rummy",
  tagline: "Formez des combinaisons et déposez-les — le premier sans pièces gagne !",
  players: { min: 2, max: 4 },
  duration: "30–45 min",
  objective:
    "Faire « RUMMY », c'est-à-dire se débarrasser de toutes ses pièces en premier en formant des combinaisons valides. La partie se joue généralement en plusieurs manches.",

  material:
    "106 pièces : 104 pièces numérotées de 1 à 13 en 4 couleurs (2 exemplaires de chaque) + 2 pièces Étoile (jokers). 4 supports. 1 sablier.",

  combinations: [
    "Séquence (suite) : 3 pièces ou plus qui se suivent dans la même couleur. Ex : 2, 3, 4 noir ou 7, 8, 9, 10, 11 rouge.",
    "Série : 3 pièces (Brelan) ou 4 pièces (Carré) de même valeur dans des couleurs différentes. Ex : quatre 5 de couleurs différentes.",
    "L'As (1) vient uniquement avant le 2 — il ne peut pas être placé après le 13.",
    "L'Étoile (joker) peut remplacer n'importe quelle pièce et prend alors sa valeur. Une fois exposée, elle reste toujours sur la table dans une combinaison.",
  ],

  setup: [
    "Retourner toutes les pièces face cachée et les mélanger.",
    "Chaque joueur tire une pièce : celui qui obtient la plus petite valeur commence et distribue.",
    "Distribuer 14 pièces à chaque joueur en commençant par la gauche. Les pièces restantes forment la pioche.",
    "Chacun range ses pièces sur son support, cachées aux autres.",
  ],

  gameplay: [
    "On joue dans le sens des aiguilles d'une montre. Le 1er joueur retourne le sablier — il peut réfléchir jusqu'à l'écoulement de son temps.",
    "Première mise en jeu : si un joueur peut former des combinaisons totalisant 30 points ou plus, il peut les déposer sur la table. Sinon, il échange une pièce de son support contre une pièce de la pioche (sans la montrer).",
    "Une fois ses 30 points déposés, à chaque tour le joueur peut :",
    "SOIT déposer une ou plusieurs pièces en modifiant les combinaisons déjà exposées (les siennes ou celles d'un adversaire), ou déposer de nouvelles combinaisons.",
    "SOIT échanger une de ses pièces contre une pièce de la pioche.",
    "L'Étoile exposée peut être échangée contre la pièce qu'elle remplace — à condition que cette pièce prenne sa place dans la combinaison.",
    "Si la pioche est vide et qu'aucun joueur ne peut déposer de pièce, la partie est terminée (tous marquent en négatif les points restants sur leur support).",
  ],

  scoring: [
    "Le gagnant (premier à se défaire de toutes ses pièces) marque en positif le total des points restants des autres joueurs.",
    "Les autres joueurs marquent en négatif la valeur des pièces restées sur leur support.",
    "Chaque pièce a la valeur de son chiffre. L'Étoile non utilisée vaut 25 points (comptés en négatif).",
    "Rummy pur : si un joueur se défait de toutes ses pièces en une fois sans avoir jamais déposé de combinaison auparavant, les points comptent double.",
  ],

  variants: {
    ginRummy: [
      "2 à 4 joueurs. Retirer les 2 Étoiles. Distribution : 10 pièces chacun + 1 au joueur à gauche du donneur (11 pièces).",
      "Le joueur à 11 pièces commence en rejetant une pièce face visible. Le suivant prend soit l'écart, soit une pièce de la pioche, puis rejette une pièce.",
      "Fin de partie — 3 façons : Grand Gin (11 pièces en combinaisons) : bonus 50 pts | Petit Gin (10 pièces sans avoir pioché) : bonus 25 pts | Exposer 8 ou 9 pièces avec les pièces restantes < 10 pts : bonus 20 pts.",
      "Le joueur avec le moins de points restants marque les points de la différence + 20 pts. Si c'est le second à avoir étalé, bonus supplémentaire de 10 pts.",
    ],
    otherVariants: [
      "Plus difficile : jouer sans Étoile, augmenter le minimum de la première mise, n'accepter que les séries ou que les séquences.",
      "Plus facile : augmenter le temps de réflexion, accepter l'As avant le 2 et après le 13, supprimer le minimum de la première mise, accepter des suites avec couleurs mélangées.",
    ],
  },

  endGame:
    "La partie se joue en plusieurs manches. À chaque manche, le gagnant marque les points des autres en positif. Les autres marquent leurs pièces restantes en négatif. Le joueur avec le total le plus élevé à la fin des manches convenues gagne la partie.",
};
