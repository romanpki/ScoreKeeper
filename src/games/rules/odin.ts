export const odinRules = {
  gameId: "odin",
  gameName: { fr: "Odin", en: "Odin" },
  tagline: {
    fr: "Défaussez toutes vos cartes avant les autres — les Vikings n'attendent pas !",
    en: "Get rid of all your cards before the others — Vikings don't wait!",
  },
  players: { min: 2, max: 6 },
  duration: { fr: "15 min", en: "15 min" },
  objective: {
    fr: "Soyez le premier à vous défausser de toutes les cartes de votre main et cumulez le moins de points à la fin de la partie.",
    en: "Be the first to discard all the cards from your hand and accumulate the fewest points by the end of the game.",
  },
  setup: {
    fr: [
      "Mélangez les 54 cartes (numérotées de 1 à 9 en 6 couleurs).",
      "Distribuez 9 cartes face cachée à chaque joueur.",
      "Choisissez aléatoirement un premier joueur. Le jeu se déroule dans le sens des aiguilles d'une montre.",
    ],
    en: [
      "Shuffle the 54 cards (numbered 1 to 9 in 6 colors).",
      "Deal 9 cards face down to each player.",
      "Randomly choose the first player. Play proceeds clockwise.",
    ],
  },
  gameplay: {
    fr: [
      "La partie se joue en plusieurs manches, chaque manche divisée en tours.",
      "Au début d'un tour, le premier joueur pose une carte face visible au centre de la table.",
      "Ensuite, chaque joueur peut à son tour de jeu :",
      "1. Jouer une ou plusieurs cartes : la valeur jouée doit être STRICTEMENT supérieure à celle au centre. Pour jouer plusieurs cartes, elles doivent être de la même valeur ou de la même couleur. La valeur d'une combinaison correspond au plus grand nombre formé en accolant les chiffres (ex. un 2 et un 8 = valeur 82 ; un 2, un 4 et un 9 = valeur 942). On peut jouer le même nombre de cartes que celles au centre, ou une carte de plus (mais pas moins).",
      "2. Passer : on ne joue pas de carte, le tour passe au joueur suivant. On peut rejouer normalement au tour suivant.",
      "Après avoir joué, récupérez une carte parmi celles qui étaient au centre avant votre jeu. S'il y en avait plusieurs, choisissez-en une et défaussez les autres.",
      "Si tout le monde passe sauf un joueur, le tour se termine. Les cartes restantes au centre sont défaussées. La dernière personne à avoir joué commence un nouveau tour.",
    ],
    en: [
      "The game is played over several rounds, each round divided into turns.",
      "At the start of a turn, the first player places one card face up in the center of the table.",
      "Then each player may on their turn:",
      "1. Play one or more cards: the played value must be STRICTLY higher than the one in the center. To play multiple cards, they must share the same value or the same color. The value of a combination is the largest number formed by concatenating the digits (e.g. a 2 and an 8 = value 82; a 2, 4, and 9 = value 942). You may play the same number of cards as those in the center, or one more (but not fewer).",
      "2. Pass: play no card, the turn moves to the next player. You may play normally on your next turn.",
      "After playing, take one card from those that were in the center before your play. If there were several, choose one and discard the others.",
      "If everyone passes except one player, the turn ends. Remaining center cards are discarded. The last person to have played starts a new turn.",
    ],
  },
  endRound: {
    fr: [
      "Une manche se termine dans deux cas :",
      "1. Si vous démarrez un nouveau tour et que toutes vos cartes en main ont la même valeur ou la même couleur : vous pouvez toutes les jouer et la manche s'arrête.",
      "2. À n'importe quel moment, si vous jouez une ou plusieurs cartes et que votre main est vide : ne prenez pas de carte au centre, la manche s'arrête immédiatement.",
      "À la fin de chaque manche, vous marquez autant de points que le nombre de cartes restant en main.",
      "Pour la manche suivante, redistribuez 9 cartes à chaque joueur. Le joueur à la gauche du premier joueur de la manche précédente commence en posant 1 carte.",
    ],
    en: [
      "A round ends in two cases:",
      "1. If you start a new turn and all your hand cards share the same value or color: you may play them all and the round ends.",
      "2. At any time, if you play one or more cards and your hand is empty: do not take a card from the center, the round ends immediately.",
      "At the end of each round, you score points equal to the number of cards remaining in your hand.",
      "For the next round, deal 9 cards to each player again. The player to the left of the previous first player starts by playing 1 card.",
    ],
  },
  scoring: {
    fr: [
      "Chaque carte en main en fin de manche = 1 point.",
      "Pour votre première partie, nous recommandons de jouer en 15 points : la partie s'arrête dès qu'un joueur atteint ou dépasse 15 points.",
      "Adaptez le seuil : +5 points pour des parties plus longues, -5 pour des parties courtes.",
      "Vous pouvez également jouer en une seule manche pour une partie très rapide.",
    ],
    en: [
      "Each card remaining in hand at the end of a round = 1 point.",
      "For your first game, we recommend playing to 15 points: the game ends as soon as a player reaches or exceeds 15 points.",
      "Adjust the threshold: +5 points for longer games, -5 for shorter games.",
      "You can also play a single round for a very quick game.",
    ],
  },
  endGame: {
    fr: "Quand un joueur atteint ou dépasse le score limite fixé en début de partie, la partie s'arrête. Le joueur avec le moins de points gagne. En cas d'égalité, partagez la victoire.",
    en: "When a player reaches or exceeds the score limit set at the start of the game, play stops. The player with the fewest points wins. In case of a tie, share the victory.",
  },
  cardValues: {
    fr: "54 cartes numérotées de 1 à 9, en 6 couleurs inspirées des archétypes vikings : soigneuse, scalde (poète), espionne, seidmadr (mage), völva (prêtresse), hirdmen (garde), berserker (guerrier), styrimadr (capitaine) et jarl (noble).",
    en: "54 cards numbered 1 to 9 in 6 colors inspired by Viking archetypes: healer, skald (poet), spy, seidmadr (mage), völva (priestess), hirdmen (guard), berserker (warrior), styrimadr (captain), and jarl (noble).",
  },
};
