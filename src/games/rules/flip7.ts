export const flip7Rules = {
  gameId: "flip7",
  gameName: "Flip 7",
  tagline: "Stop ou encore — collectionnez 7 numéros différents ou perdez tout !",
  players: { min: 2, max: 18 },
  duration: "20 min",
  objective:
    "Jouez manche après manche jusqu'à ce qu'un joueur atteigne 200 points. À chaque manche, collectionnez des cartes Numéro pour marquer des points égaux à leur valeur totale — mais stoppez avant de recevoir un numéro que vous avez déjà, sinon vous sautez et ne gagnez rien. Si vous collectionnez 7 numéros différents, vous réalisez un Flip 7 et gagnez 15 points supplémentaires.",

  setup: [
    "Mélangez le paquet de cartes.",
    "Désignez aléatoirement un premier Donneur.",
    "Si vous jouez à plus de 18 personnes, utilisez un second paquet.",
  ],

  cards: {
    number:
      "79 cartes Numéro numérotées de 0 à 12. La carte 0 est une carte Numéro mais ne vaut pas de point. Il y a 12 exemplaires du 12, 11 du 11, 10 du 10... et 1 seul exemplaire du 0 et du 1.",
    special: [
      "Stop (×3) : Effet immédiat — ciblez un joueur encore dans la manche. Il sort immédiatement et retourne ses cartes face cachée. Il ajoutera ses points en fin de manche.",
      "Trois à la suite (×3) : Effet immédiat — ciblez un joueur (peut être vous-même). Le Donneur lui distribue les 3 prochaines cartes du paquet. Si une carte spéciale apparaît pendant cet effet, elle ne s'applique qu'après les 3 distributions.",
      "Seconde Chance (×3) : Conservez cette carte devant vous. Si vous recevez un numéro qui vous ferait sauter, défaussez ce numéro ainsi que la Seconde Chance — vous évitez de sauter. Un joueur ne peut avoir qu'une seule Seconde Chance ; s'il en reçoit une deuxième, il la donne à un autre joueur encore en jeu. Défaussée en fin de manche.",
    ],
    bonus: [
      "×2 (×1) : Doublez le total de vos cartes Numéro (ne double pas les Bonus ni les 15 pts Flip 7).",
      "+2 (×1), +4 (×1), +6 (×1), +8 (×1), +10 (×1) : Ajoutez la valeur indiquée à votre score. Les Bonus ne sont pas des Numéros et ne peuvent pas vous faire sauter ni contribuer au Flip 7.",
    ],
  },

  gameplay: [
    "En commençant par le joueur à sa gauche, le Donneur offre à chaque joueur le choix entre STOP ou ENCORE.",
    "STOP : vous sortez de la manche. Retournez vos cartes face cachée. Vos points seront comptés en fin de manche.",
    "ENCORE : le Donneur vous distribue une nouvelle carte face visible.",
    "Si vous recevez un Numéro que vous n'aviez pas encore : parfait, vous restez dans la manche.",
    "Si vous recevez un Numéro que vous possédez déjà : vous sautez. Retournez vos cartes face cachée, vous ne gagnez aucun point cette manche.",
    "Si vous recevez une carte Spéciale : appliquez immédiatement son effet.",
    "Si vous recevez un Bonus : placez-le au-dessus de votre ligne de cartes Numéro. Il sera compté si vous ne sautez pas.",
    "Conseil : disposez vos cartes Numéro en une ligne devant vous pour en tenir facilement le compte.",
  ],

  flip7:
    "Si vous collectionnez 7 cartes Numéro DIFFÉRENTES, vous réalisez un Flip 7 : la manche s'arrête pour tout le monde. Les joueurs n'ayant pas sauté comptent leurs points. Vous gagnez 15 points supplémentaires en récompense.",

  endRound: [
    "La manche se termine quand : tous les joueurs sont sortis (stop ou saut) OU un joueur réalise un Flip 7.",
    "Les joueurs qui n'ont pas sauté calculent leur score :",
    "1. Totalisez la valeur de vos cartes Numéro.",
    "2. Si vous avez la carte Bonus ×2, doublez ce total.",
    "3. Ajoutez les points des autres cartes Bonus.",
    "4. Si vous avez réalisé un Flip 7, ajoutez 15 points.",
    "Mettez toutes les cartes utilisées de côté (ne les remélangez pas). Le Donneur passe le restant du paquet au joueur à sa gauche, qui devient le nouveau Donneur.",
    "Quand le paquet est vide, mélangez toutes les cartes défaussées pour former un nouveau paquet.",
  ],

  endGame:
    "À la fin d'une manche, si au moins un joueur a atteint ou dépassé 200 points, la partie prend fin. Le joueur avec le score le plus élevé est vainqueur. En cas d'égalité, jouez une nouvelle manche pour départager.",
};
