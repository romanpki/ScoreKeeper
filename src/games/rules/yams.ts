export const yamsRules = {
  gameId: "yams",
  gameName: "Yams (Yahtzee)",
  tagline: "Lancez 5 dés jusqu'à 3 fois — réalisez les meilleures combinaisons !",
  players: { min: 2, max: 10 },
  duration: "30 min",
  objective:
    "Marquer le plus de points en remplissant toutes les cases de la feuille de score grâce à des combinaisons de dés. La partie se termine quand toutes les cases sont remplies. Le joueur avec le total le plus élevé gagne.",

  setup: [
    "Chaque joueur dispose d'une feuille de score et d'un stylo.",
    "Le matériel : 5 dés standards.",
    "Déterminez l'ordre de jeu (par exemple le plus âgé en premier, ou tirage au dé).",
  ],

  gameplay: [
    "À son tour, le joueur lance les 5 dés. Il dispose de 3 lancers maximum par tour.",
    "Après chaque lancer, il peut garder tout ou partie des dés et relancer les autres, selon son gré.",
    "Il n'est pas obligé de relancer — il peut s'arrêter après le 1er ou le 2e lancer.",
    "À la fin de son tour (3 lancers ou arrêt volontaire), le joueur doit obligatoirement inscrire son résultat dans une case de la feuille de score, soit en notant les points obtenus, soit en barrant la case (0 point). Une case barrée ne peut plus être utilisée.",
    "Si le résultat ne correspond à aucune case intéressante, le joueur peut choisir de barrer une case de son choix pour l'éliminer stratégiquement.",
  ],

  combinations: {
    topSection: [
      "As (1) : total des faces 1",
      "Deux (2) : total des faces 2",
      "Trois (3) : total des faces 3",
      "Quatre (4) : total des faces 4",
      "Cinq (5) : total des faces 5",
      "Six (6) : total des faces 6",
      "Bonus section haute : si le total des 6 cases est ≥ 63 points, bonus de 37 points supplémentaires.",
    ],
    bottomSection: [
      "Brelan : 3 dés identiques → total des 5 dés",
      "Carré : 4 dés identiques → total des 5 dés",
      "Full House (Full) : un brelan + une paire → 25 points",
      "Petite Suite : 4 dés consécutifs (ex. 1-2-3-4) → 30 points",
      "Grande Suite : 5 dés consécutifs (ex. 1-2-3-4-5 ou 2-3-4-5-6) → 40 points",
      "Yams : 5 dés identiques → 50 points",
      "Chance : n'importe quelle combinaison → total des 5 dés",
    ],
  },

  bonusSection:
    "Bonus section haute : si la somme des 6 cases de la section haute (As à Six) est égale ou supérieure à 63 points, le joueur reçoit 37 points supplémentaires. Soyez stratégique : 63 points correspondent à 3 fois chaque valeur en moyenne.",

  endGame:
    "La partie se termine quand tous les joueurs ont rempli toutes les cases de leur feuille de score (13 cases + éventuel bonus). Le joueur avec le total le plus élevé gagne. En cas d'égalité, un tour supplémentaire peut départager.",
};
