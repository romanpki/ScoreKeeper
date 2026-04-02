export const trioRules = {
  gameId: "trio",
  gameName: { fr: "Trio", en: "Trio" },
  tagline: {
    fr: "Dévoilez des cartes chez vos adversaires pour compléter vos trios !",
    en: "Reveal cards from your opponents to complete your trios!",
  },
  players: { min: 3, max: 6 },
  duration: { fr: "15–30 min", en: "15–30 min" },
  objective: {
    fr: "Gagner des trios (un trio = 3 cartes identiques) avant ses adversaires. La victoire revient au premier joueur à compléter 3 trios (ou 2 trios liés en mode Picante), ou à celui qui obtient le trio de 7.",
    en: "Win trios (a trio = 3 identical cards) before your opponents. The first player to complete 3 trios (or 2 linked trios in Picante mode), or the one who obtains the trio of 7, wins.",
  },
  setup: {
    fr: {
      cardDistribution: [
        "3 joueurs : 9 cartes par joueur + 9 cartes au centre",
        "4 joueurs : 7 cartes par joueur + 8 cartes au centre",
        "5 joueurs : 6 cartes par joueur + 6 cartes au centre",
        "6 joueurs : 5 cartes par joueur + 6 cartes au centre",
      ],
      steps: [
        "Mélangez et distribuez les cartes face cachée selon le tableau. Placez les cartes restantes face cachée au centre de la table, les unes à côté des autres.",
        "Chaque joueur prend ses cartes en main sans les montrer, et les classe du plus petit numéro au plus grand.",
        "Choisissez le mode de jeu : SIMPLE ou PICANTE.",
        "Le joueur ayant mangé de l'avocat le plus récemment commence (ou aléatoirement).",
      ],
    },
    en: {
      cardDistribution: [
        "3 players: 9 cards per player + 9 cards in the center",
        "4 players: 7 cards per player + 8 cards in the center",
        "5 players: 6 cards per player + 6 cards in the center",
        "6 players: 5 cards per player + 6 cards in the center",
      ],
      steps: [
        "Shuffle and deal cards face down according to the chart. Place remaining cards face down in the center of the table, side by side.",
        "Each player picks up their cards without showing them, and sorts them from lowest to highest.",
        "Choose the game mode: SIMPLE or PICANTE.",
        "The player who most recently ate avocado goes first (or choose randomly).",
      ],
    },
  },
  modes: {
    fr: {
      simple: "Mode SIMPLE : gagner 3 trios (n'importe lesquels) ou le trio de 7.",
      picante: "Mode PICANTE : gagner 2 trios liés (les numéros liés sont indiqués dans les coins inférieurs des cartes — ex. trios 2 et 5, ou trios 2 et 9) ou le trio de 7.",
    },
    en: {
      simple: "SIMPLE mode: win 3 trios (any) or the trio of 7.",
      picante: "PICANTE mode: win 2 linked trios (linked numbers are shown in the bottom corners of the cards — e.g. trios 2 and 5, or trios 2 and 9) or the trio of 7.",
    },
  },
  gameplay: {
    fr: [
      "Les joueurs jouent chacun leur tour en sens horaire.",
      "À son tour, un joueur dévoile des numéros un par un. Il doit s'arrêter dès que 2 numéros successifs sont différents. S'ils sont identiques, il continue jusqu'à avoir dévoilé 3 numéros identiques (= trio complété).",
      "Pour chaque numéro à dévoiler, le joueur choisit entre deux options :",
      "A) Au centre de la table : il retourne face visible la carte de son choix.",
      "B) De la main d'un joueur (lui inclus) : il dévoile le plus petit ou le plus grand numéro de ce joueur. La carte est posée face visible sur la table. Quand on dévoile sa propre main, c'est forcément le plus petit ou le plus grand numéro (JAMAIS un numéro du milieu).",
      "Important : on peut effectuer plusieurs fois exactement la même action (ex. demander au même adversaire son plus grand numéro deux fois de suite).",
      "Si un joueur n'a plus de cartes en main à son tour, il joue quand même avec les cartes au centre et celles des adversaires.",
    ],
    en: [
      "Players take turns clockwise.",
      "On their turn, a player reveals numbers one at a time. They must stop as soon as 2 successive numbers are different. If they match, they continue until they have revealed 3 identical numbers (= trio completed).",
      "For each number to reveal, the player chooses between two options:",
      "A) From the center of the table: flip any face-down card face up.",
      "B) From a player's hand (including themselves): reveal that player's lowest or highest number. The card is placed face up on the table. When revealing your own hand, it must be your lowest or highest number (NEVER a middle number).",
      "Important: you may repeat the exact same action multiple times (e.g. ask the same opponent for their highest number twice in a row).",
      "If a player has no cards in hand on their turn, they still play using center cards and opponents' cards.",
    ],
  },
  endTurn: {
    fr: [
      "Le tour d'un joueur se termine de deux façons :",
      "1. Le joueur complète un trio : il prend les 3 cartes face visible devant lui et les garde. On passe au joueur suivant.",
      "2. Un numéro dévoilé est différent du précédent : tous les numéros dévoilés sont remis en place (faces cachées au centre et/ou rendus à leur(s) propriétaire(s)). On passe au joueur suivant.",
    ],
    en: [
      "A player's turn ends in two ways:",
      "1. The player completes a trio: they take the 3 face-up cards in front of them and keep them. Play passes to the next player.",
      "2. A revealed number differs from the previous: all revealed numbers are put back in place (face down in the center and/or returned to their owner(s)). Play passes to the next player.",
    ],
  },
  endGame: {
    fr: "Un joueur remporte la partie dès qu'il a gagné 3 trios (mode Simple) ou 2 trios liés (mode Picante), OU dès qu'il obtient le trio de 7 — ce trio donne toujours la victoire immédiate, quel que soit le mode.",
    en: "A player wins the game as soon as they have won 3 trios (Simple mode) or 2 linked trios (Picante mode), OR as soon as they obtain the trio of 7 — this trio always grants immediate victory regardless of the mode.",
  },
  teamRules: {
    fr: {
      players_team: "4 ou 6 joueurs uniquement.",
      setup: [
        "Formez des équipes de 2 : 2 équipes à 4 joueurs, 3 équipes à 6 joueurs.",
        "Asseyez-vous à l'opposé de votre partenaire autour de la table (pas côte à côte).",
        "Distribuez TOUTES les cartes face cachée. Il n'y a pas de cartes au centre.",
        "Après avoir trié vos cartes, vous pouvez faire un échange avec votre partenaire : choisissez secrètement une carte, échangez-la simultanément face cachée, et rangez-la secrètement.",
      ],
      gameplay: [
        "Le jeu se déroule comme en individuel.",
        "À chaque fois qu'un trio est gagné par une équipe, les équipes adverses peuvent procéder à un nouvel échange avec leur partenaire.",
        "Les 2 partenaires mettent en commun les trios gagnés.",
        "Communication : les échanges sont les seuls moyens de communiquer avec son partenaire. Toute autre forme est interdite (œillades, coups sous la table, montrer l'endroit où on range une carte reçue...).",
      ],
      endGame: "Une équipe remporte la partie dès qu'elle a gagné 3 trios ou 2 trios liés (selon le mode), ou le trio de 7.",
    },
    en: {
      players_team: "4 or 6 players only.",
      setup: [
        "Form teams of 2: 2 teams with 4 players, 3 teams with 6 players.",
        "Sit opposite your partner around the table (not side by side).",
        "Deal ALL cards face down. There are no center cards.",
        "After sorting your cards, you may exchange one with your partner: secretly choose a card, exchange it simultaneously face down, and put it away secretly.",
      ],
      gameplay: [
        "The game proceeds as in individual play.",
        "Each time a team wins a trio, opposing teams may perform a new exchange with their partner.",
        "Both partners pool their won trios.",
        "Communication: exchanges are the only way to communicate with your partner. All other forms are forbidden (winks, kicks under the table, showing where you put a received card...).",
      ],
      endGame: "A team wins as soon as they have won 3 trios or 2 linked trios (depending on the mode), or the trio of 7.",
    },
  },
  cards: {
    fr: "36 cartes. Chaque numéro de 1 à 12 existe en 3 exemplaires identiques. Le trio de 7 est spécial : il donne la victoire immédiate dans tous les modes.",
    en: "36 cards. Each number from 1 to 12 exists in 3 identical copies. The trio of 7 is special: it grants immediate victory in all modes.",
  },
};
