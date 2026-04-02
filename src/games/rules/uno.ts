export const unoRules = {
  gameId: "uno",
  gameName: { fr: "UNO", en: "UNO" },
  tagline: {
    fr: "Videz votre main en premier et criez UNO — le classique absolu !",
    en: "Empty your hand first and shout UNO — the ultimate classic!",
  },
  players: { min: 2, max: 10 },
  duration: { fr: "30 min", en: "30 min" },
  objective: {
    fr: "Être le premier à se débarrasser de toutes ses cartes à chaque manche et marquer des points pour les cartes que les adversaires ont encore en main. Les points s'accumulent d'une manche à l'autre et le premier joueur qui atteint 500 points gagne la partie.",
    en: "Be the first to get rid of all your cards each round and score points for the cards your opponents still hold. Points accumulate across rounds and the first player to reach 500 points wins the game.",
  },
  setup: {
    fr: [
      "Chaque joueur tire une carte ; celui qui obtient le chiffre le plus élevé est le donneur (les cartes Action comptent pour zéro).",
      "Le donneur distribue 7 cartes à chaque joueur.",
      "Le reste des cartes forme la Pioche (face cachée).",
      "La carte du dessus de la Pioche est retournée pour constituer le Talon. Si c'est une carte Action, voir la section cartes Action.",
      "Le joueur à la gauche du donneur commence.",
    ],
    en: [
      "Each player draws one card; the player with the highest number is the dealer (Action cards count as zero).",
      "The dealer deals 7 cards to each player.",
      "The remaining cards form the Draw Pile (face down).",
      "The top card of the Draw Pile is turned face up to start the Discard Pile. If it's an Action card, see the Action cards section.",
      "The player to the left of the dealer goes first.",
    ],
  },
  gameplay: {
    fr: [
      "À son tour, le joueur doit poser une carte de même couleur, de même numéro ou de même symbole que la carte visible du Talon.",
      "Si le joueur ne peut pas jouer, il pioche une carte dans la Pioche. S'il peut jouer cette carte immédiatement, il le fait. Sinon, il passe son tour.",
      "Un joueur peut choisir de ne PAS jouer une carte qu'il a en main — il pige alors une carte. S'il peut jouer cette carte piochée, il peut le faire, mais il ne peut pas jouer une carte qu'il avait déjà en main.",
      "Quand la Pioche est épuisée, mélangez le Talon (sauf la dernière carte) pour reformer la Pioche.",
    ],
    en: [
      "On their turn, the player must play a card matching the color, number, or symbol of the top card on the Discard Pile.",
      "If the player cannot play, they draw a card from the Draw Pile. If they can play it immediately, they do. Otherwise, they pass their turn.",
      "A player may choose NOT to play a card they already hold — they draw instead. If they can play the drawn card, they may, but they cannot play a card already in their hand.",
      "When the Draw Pile runs out, shuffle the Discard Pile (except the last card) to form a new Draw Pile.",
    ],
  },
  actionCards: {
    fr: [
      "+2 : Le joueur suivant pioche 2 cartes et passe son tour. Ne peut être jouée que sur la même couleur ou un autre +2.",
      "Inversion : Inverse le sens du jeu. Ne peut être jouée que sur la même couleur ou une autre Inversion. Si retournée en début de jeu, le donneur joue en premier et le jeu part vers la droite.",
      "Passer : Le joueur suivant passe son tour. Ne peut être jouée que sur la même couleur ou un autre Passer.",
      "Carte blanche (Joker) : Peut être jouée après n'importe quelle carte, même si le joueur a d'autres options. Le joueur choisit la nouvelle couleur.",
      "Carte blanche +4 : Le joueur change la couleur ET le joueur suivant pioche 4 cartes et passe son tour. Ne peut être jouée légalement que si le joueur n'a AUCUNE carte de la couleur actuelle (les cartes Action ou numéros identiques sont autorisés). Si retournée en début de jeu, la remettre dans la pioche et en retourner une autre.",
      "Mélanger les mains : Le joueur récupère TOUTES les cartes de CHAQUE joueur, mélange l'ensemble et redistribue équitablement en commençant à sa gauche. Compte aussi comme une carte blanche — le joueur choisit la couleur.",
      "Carte à personnaliser (×3) : À remplir avant la partie avec une règle maison acceptée par tous. Agit comme une carte blanche (peut être jouée sur n'importe quoi). Le joueur choisit la couleur suivante.",
    ],
    en: [
      "+2: The next player draws 2 cards and skips their turn. Can only be played on the same color or another +2.",
      "Reverse: Reverses the direction of play. Can only be played on the same color or another Reverse. If revealed at the start of the game, the dealer plays first and play goes to the right.",
      "Skip: The next player skips their turn. Can only be played on the same color or another Skip.",
      "Wild (Joker): Can be played on any card, even if the player has other options. The player chooses the new color.",
      "Wild +4: The player changes the color AND the next player draws 4 cards and skips their turn. Can only be played legally if the player has NO card of the current color (Action cards or matching numbers are allowed). If revealed at the start of the game, put it back in the deck and reveal another.",
      "Shuffle Hands: The player collects ALL cards from EVERY player, shuffles them all together and redistributes evenly starting to their left. Also counts as a Wild — the player chooses the color.",
      "Customizable Card (×3): Fill in a house rule agreed on before the game. Acts like a Wild (can be played on anything). The player chooses the next color.",
    ],
  },
  challenge: {
    fr: "Si un joueur pense qu'une carte blanche +4 a été jouée illégalement (l'adversaire avait une carte de la couleur demandée), il peut lancer un défi. Si le défi est fondé, l'adversaire pioche les 4 cartes. Si le défi est infondé, le joueur qui a lancé le défi pioche 4 + 2 cartes supplémentaires (6 au total).",
    en: "If a player thinks a Wild +4 was played illegally (the opponent had a card of the called color), they can challenge it. If the challenge is valid, the opponent draws the 4 cards. If the challenge is invalid, the challenger draws 4 + 2 extra cards (6 total).",
  },
  uno: {
    fr: "Quand un joueur pose son avant-dernière carte, il doit immédiatement crier « UNO ! ». S'il oublie et qu'un adversaire le signale avant que le joueur suivant n'ait joué, il pioche 2 cartes.",
    en: "When a player plays their second-to-last card, they must immediately shout 'UNO!'. If they forget and an opponent calls it out before the next player has played, they draw 2 cards.",
  },
  endRound: {
    fr: "La manche se termine quand un joueur pose sa dernière carte. Si sa dernière carte est un +2 ou un +4, le joueur suivant pioche quand même les cartes (elles comptent dans le calcul des points).",
    en: "The round ends when a player plays their last card. If their last card is a +2 or +4, the next player still draws those cards (they count toward the score calculation).",
  },
  scoring: {
    fr: {
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
      alternative: "Variante : noter les points en main de chaque joueur à la fin de chaque manche. Quand un joueur atteint ou dépasse 500 points, le joueur avec le MOINS de points est déclaré vainqueur.",
    },
    en: {
      winner: "The first player to play their last card scores points for the cards remaining in opponents' hands:",
      cardValues: [
        "Numbered cards 0–9: face value",
        "+2 card: 20 points",
        "Reverse card: 20 points",
        "Skip card: 20 points",
        "Wild card: 50 points",
        "Wild +4 card: 50 points",
        "Shuffle Hands card: 50 points",
        "Customizable card: 50 points",
      ],
      alternative: "Variant: record each player's hand points at the end of each round. When a player reaches or exceeds 500 points, the player with the FEWEST points is declared the winner.",
    },
  },
  endGame: {
    fr: "Le premier joueur à atteindre 500 points (système classique) ou le joueur avec le moins de points quand un autre atteint 500 (variante) est déclaré vainqueur.",
    en: "The first player to reach 500 points (classic system) or the player with the fewest points when another reaches 500 (variant) is declared the winner.",
  },
};
