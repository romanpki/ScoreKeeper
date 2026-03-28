export const odinRules = {
  gameId: "odin",
  gameName: "Odin",
  tagline: "Défaussez toutes vos cartes avant les autres — les Vikings n'attendent pas !",
  players: { min: 2, max: 6 },
  duration: "15 min",
  objective:
    "Soyez le premier à vous défausser de toutes les cartes de votre main et cumulez le moins de points à la fin de la partie.",

  setup: [
    "Mélangez les 54 cartes (numérotées de 1 à 9 en 6 couleurs).",
    "Distribuez 9 cartes face cachée à chaque joueur.",
    "Choisissez aléatoirement un premier joueur. Le jeu se déroule dans le sens des aiguilles d'une montre.",
  ],

  gameplay: [
    "La partie se joue en plusieurs manches, chaque manche divisée en tours.",
    "Au début d'un tour, le premier joueur pose une carte face visible au centre de la table.",
    "Ensuite, chaque joueur peut à son tour de jeu :",
    "1. Jouer une ou plusieurs cartes : la valeur jouée doit être STRICTEMENT supérieure à celle au centre. Pour jouer plusieurs cartes, elles doivent être de la même valeur ou de la même couleur. La valeur d'une combinaison correspond au plus grand nombre formé en accolant les chiffres (ex. un 2 et un 8 = valeur 82 ; un 2, un 4 et un 9 = valeur 942). On peut jouer le même nombre de cartes que celles au centre, ou une carte de plus (mais pas moins).",
    "2. Passer : on ne joue pas de carte, le tour passe au joueur suivant. On peut rejouer normalement au tour suivant.",
    "Après avoir joué, récupérez une carte parmi celles qui étaient au centre avant votre jeu. S'il y en avait plusieurs, choisissez-en une et défaussez les autres.",
    "Si tout le monde passe sauf un joueur, le tour se termine. Les cartes restantes au centre sont défaussées. La dernière personne à avoir joué commence un nouveau tour.",
  ],

  endRound: [
    "Une manche se termine dans deux cas :",
    "1. Si vous démarrez un nouveau tour et que toutes vos cartes en main ont la même valeur ou la même couleur : vous pouvez toutes les jouer et la manche s'arrête.",
    "2. À n'importe quel moment, si vous jouez une ou plusieurs cartes et que votre main est vide : ne prenez pas de carte au centre, la manche s'arrête immédiatement.",
    "À la fin de chaque manche, vous marquez autant de points que le nombre de cartes restant en main.",
    "Pour la manche suivante, redistribuez 9 cartes à chaque joueur. Le joueur à la gauche du premier joueur de la manche précédente commence en posant 1 carte.",
  ],

  scoring: [
    "Chaque carte en main en fin de manche = 1 point.",
    "Pour votre première partie, nous recommandons de jouer en 15 points : la partie s'arrête dès qu'un joueur atteint ou dépasse 15 points.",
    "Adaptez le seuil : +5 points pour des parties plus longues, -5 pour des parties courtes.",
    "Vous pouvez également jouer en une seule manche pour une partie très rapide.",
  ],

  endGame:
    "Quand un joueur atteint ou dépasse le score limite fixé en début de partie, la partie s'arrête. Le joueur avec le moins de points gagne. En cas d'égalité, partagez la victoire.",

  cardValues:
    "54 cartes numérotées de 1 à 9, en 6 couleurs inspirées des archétypes vikings : soigneuse, scalde (poète), espionne, seidmadr (mage), völva (prêtresse), hirdmen (garde), berserker (guerrier), styrimadr (capitaine) et jarl (noble).",
};
