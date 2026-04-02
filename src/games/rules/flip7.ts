export const flip7Rules = {
  gameId: "flip7",
  gameName: { fr: "Flip 7", en: "Flip 7" },
  tagline: {
    fr: "Stop ou encore — collectionnez 7 numéros différents ou perdez tout !",
    en: "Stop or go — collect 7 different numbers or lose everything!",
  },
  players: { min: 2, max: 18 },
  duration: { fr: "20 min", en: "20 min" },
  objective: {
    fr: "Jouez manche après manche jusqu'à ce qu'un joueur atteigne 200 points. À chaque manche, collectionnez des cartes Numéro pour marquer des points égaux à leur valeur totale — mais stoppez avant de recevoir un numéro que vous avez déjà, sinon vous sautez et ne gagnez rien. Si vous collectionnez 7 numéros différents, vous réalisez un Flip 7 et gagnez 15 points supplémentaires.",
    en: "Play round after round until a player reaches 200 points. Each round, collect Number cards to score points equal to their total value — but stop before receiving a number you already have, or you bust and score nothing. Collect 7 different numbers to achieve a Flip 7 and earn 15 bonus points.",
  },
  setup: {
    fr: [
      "Mélangez le paquet de cartes.",
      "Désignez aléatoirement un premier Donneur.",
      "Si vous jouez à plus de 18 personnes, utilisez un second paquet.",
    ],
    en: [
      "Shuffle the deck.",
      "Randomly designate the first Dealer.",
      "If playing with more than 18 players, use a second deck.",
    ],
  },
  cards: {
    fr: {
      number: "79 cartes Numéro numérotées de 0 à 12. La carte 0 est une carte Numéro mais ne vaut pas de point. Il y a 12 exemplaires du 12, 11 du 11, 10 du 10... et 1 seul exemplaire du 0 et du 1.",
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
    en: {
      number: "79 Number cards numbered 0 to 12. The 0 card is a Number card but scores no points. There are 12 copies of 12, 11 of 11, 10 of 10... and only 1 copy each of 0 and 1.",
      special: [
        "Stop (×3): Immediate effect — target a player still in the round. They exit immediately and flip their cards face down. Their points will be counted at the end of the round.",
        "Three in a Row (×3): Immediate effect — target any player (including yourself). The Dealer gives them the next 3 cards from the deck. If a Special card appears during this effect, it only applies after all 3 cards are dealt.",
        "Second Chance (×3): Keep this card in front of you. If you receive a number that would make you bust, discard that number and the Second Chance — you avoid busting. A player can only have one Second Chance; if they receive a second one, they give it to another player still in the round. Discarded at the end of the round.",
      ],
      bonus: [
        "×2 (×1): Double your total Number card points (does not double Bonus cards or the 15-pt Flip 7 bonus).",
        "+2 (×1), +4 (×1), +6 (×1), +8 (×1), +10 (×1): Add the indicated value to your score. Bonus cards are not Numbers — they cannot make you bust or contribute to a Flip 7.",
      ],
    },
  },
  gameplay: {
    fr: [
      "En commençant par le joueur à sa gauche, le Donneur offre à chaque joueur le choix entre STOP ou ENCORE.",
      "STOP : vous sortez de la manche. Retournez vos cartes face cachée. Vos points seront comptés en fin de manche.",
      "ENCORE : le Donneur vous distribue une nouvelle carte face visible.",
      "Si vous recevez un Numéro que vous n'aviez pas encore : parfait, vous restez dans la manche.",
      "Si vous recevez un Numéro que vous possédez déjà : vous sautez. Retournez vos cartes face cachée, vous ne gagnez aucun point cette manche.",
      "Si vous recevez une carte Spéciale : appliquez immédiatement son effet.",
      "Si vous recevez un Bonus : placez-le au-dessus de votre ligne de cartes Numéro. Il sera compté si vous ne sautez pas.",
      "Conseil : disposez vos cartes Numéro en une ligne devant vous pour en tenir facilement le compte.",
    ],
    en: [
      "Starting with the player to their left, the Dealer offers each player the choice: STOP or GO.",
      "STOP: you exit the round. Flip your cards face down. Your points will be counted at the end of the round.",
      "GO: the Dealer deals you one new card face up.",
      "If you receive a Number you didn't already have: great, you stay in the round.",
      "If you receive a Number you already have: you bust. Flip your cards face down and score no points this round.",
      "If you receive a Special card: apply its effect immediately.",
      "If you receive a Bonus card: place it above your Number card row. It will count if you don't bust.",
      "Tip: lay your Number cards in a row in front of you so you can easily count them.",
    ],
  },
  flip7: {
    fr: "Si vous collectionnez 7 cartes Numéro DIFFÉRENTES, vous réalisez un Flip 7 : la manche s'arrête pour tout le monde. Les joueurs n'ayant pas sauté comptent leurs points. Vous gagnez 15 points supplémentaires en récompense.",
    en: "If you collect 7 DIFFERENT Number cards, you achieve a Flip 7: the round ends for everyone. Players who didn't bust count their points. You earn 15 bonus points as a reward.",
  },
  endRound: {
    fr: [
      "La manche se termine quand : tous les joueurs sont sortis (stop ou saut) OU un joueur réalise un Flip 7.",
      "Les joueurs qui n'ont pas sauté calculent leur score :",
      "1. Totalisez la valeur de vos cartes Numéro.",
      "2. Si vous avez la carte Bonus ×2, doublez ce total.",
      "3. Ajoutez les points des autres cartes Bonus.",
      "4. Si vous avez réalisé un Flip 7, ajoutez 15 points.",
      "Mettez toutes les cartes utilisées de côté (ne les remélangez pas). Le Donneur passe le restant du paquet au joueur à sa gauche, qui devient le nouveau Donneur.",
      "Quand le paquet est vide, mélangez toutes les cartes défaussées pour former un nouveau paquet.",
    ],
    en: [
      "The round ends when: all players have exited (stop or bust) OR a player achieves a Flip 7.",
      "Players who didn't bust calculate their score:",
      "1. Total the value of your Number cards.",
      "2. If you have the ×2 Bonus card, double that total.",
      "3. Add points from other Bonus cards.",
      "4. If you achieved a Flip 7, add 15 points.",
      "Set aside all used cards (do not reshuffle yet). The Dealer passes the remaining deck to the player on their left, who becomes the new Dealer.",
      "When the deck runs out, shuffle all discarded cards to form a new deck.",
    ],
  },
  endGame: {
    fr: "À la fin d'une manche, si au moins un joueur a atteint ou dépassé 200 points, la partie prend fin. Le joueur avec le score le plus élevé est vainqueur. En cas d'égalité, jouez une nouvelle manche pour départager.",
    en: "At the end of a round, if at least one player has reached or exceeded 200 points, the game ends. The player with the highest score wins. In case of a tie, play one more round to break it.",
  },
};
