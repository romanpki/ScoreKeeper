export const unoRules = {
  gameId: "uno",
  gameName: "UNO",
  tagline: "Videz votre main en premier et criez UNO — le classique absolu !",
  players: { min: 2, max: 10 },
  duration: "30 min",
  objective:
    "Être le premier à se débarrasser de toutes ses cartes à chaque manche et marquer des points pour les cartes que les adversaires ont encore en main. Les points s'accumulent d'une manche à l'autre et le premier joueur qui atteint 500 points gagne la partie.",

  setup: [
    "Chaque joueur tire une carte ; celui qui obtient le chiffre le plus élevé est le donneur (les cartes Action comptent pour zéro).",
    "Le donneur distribue 7 cartes à chaque joueur.",
    "Le reste des cartes forme la Pioche (face cachée).",
    "La carte du dessus de la Pioche est retournée pour constituer le Talon. Si c'est une carte Action, voir la section cartes Action.",
    "Le joueur à la gauche du donneur commence.",
  ],

  gameplay: [
    "À son tour, le joueur doit poser une carte de même couleur, de même numéro ou de même symbole que la carte visible du Talon.",
    "Si le joueur ne peut pas jouer, il pioche une carte dans la Pioche. S'il peut jouer cette carte immédiatement, il le fait. Sinon, il passe son tour.",
    "Un joueur peut choisir de ne PAS jouer une carte qu'il a en main — il pige alors une carte. S'il peut jouer cette carte piochée, il peut le faire, mais il ne peut pas jouer une carte qu'il avait déjà en main.",
    "Quand la Pioche est épuisée, mélangez le Talon (sauf la dernière carte) pour reformer la Pioche.",
  ],

  actionCards: [
    "+2 : Le joueur suivant pioche 2 cartes et passe son tour. Ne peut être jouée que sur la même couleur ou un autre +2.",
    "Inversion : Inverse le sens du jeu. Ne peut être jouée que sur la même couleur ou une autre Inversion. Si retournée en début de jeu, le donneur joue en premier et le jeu part vers la droite.",
    "Passer : Le joueur suivant passe son tour. Ne peut être jouée que sur la même couleur ou un autre Passer.",
    "Carte blanche (Joker) : Peut être jouée après n'importe quelle carte, même si le joueur a d'autres options. Le joueur choisit la nouvelle couleur.",
    "Carte blanche +4 : Le joueur change la couleur ET le joueur suivant pioche 4 cartes et passe son tour. Ne peut être jouée légalement que si le joueur n'a AUCUNE carte de la couleur actuelle (les cartes Action ou numéros identiques sont autorisés). Si retournée en début de jeu, la remettre dans la pioche et en retourner une autre.",
    "Mélanger les mains : Le joueur récupère TOUTES les cartes de CHAQUE joueur, mélange l'ensemble et redistribue équitablement en commençant à sa gauche. Compte aussi comme une carte blanche — le joueur choisit la couleur.",
    "Carte à personnaliser (×3) : À remplir avant la partie avec une règle maison acceptée par tous. Agit comme une carte blanche (peut être jouée sur n'importe quoi). Le joueur choisit la couleur suivante.",
  ],

  challenge:
    "Si un joueur pense qu'une carte blanche +4 a été jouée illégalement (l'adversaire avait une carte de la couleur demandée), il peut lancer un défi. Si le défi est fondé, l'adversaire pioche les 4 cartes. Si le défi est infondé, le joueur qui a lancé le défi pioche 4 + 2 cartes supplémentaires (6 au total).",

  uno: "Quand un joueur pose son avant-dernière carte, il doit immédiatement crier « UNO ! ». S'il oublie et qu'un adversaire le signale avant que le joueur suivant n'ait joué, il pioche 2 cartes.",

  endRound:
    "La manche se termine quand un joueur pose sa dernière carte. Si sa dernière carte est un +2 ou un +4, le joueur suivant pioche quand même les cartes (elles comptent dans le calcul des points).",

  scoring: {
    winner: "Le premier joueur à poser sa dernière carte marque les points des cartes restantes chez les adversaires :",
    cardValues: [
      "Cartes numérotées 0–9 : valeur du chiffre indiqué",
      "Carte +2 : 20 points",
      "Carte Inversion : 20 points",
      "Carte Passer : 20 points",
      "Carte blanche : 50 points",
      "Carte blanche +4 : 50 points",
      "Carte Mélanger les mains : 50 points",
      "Carte à personnaliser : 50 points",
    ],
    alternative:
      "Variante : noter les points en main de chaque joueur à la fin de chaque manche. Quand un joueur atteint ou dépasse 500 points, le joueur avec le MOINS de points est déclaré vainqueur.",
  },

  endGame:
    "Le premier joueur à atteindre 500 points (système classique) ou le joueur avec le moins de points quand un autre atteint 500 (variante) est déclaré vainqueur.",
};
