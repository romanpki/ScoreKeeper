export const trioRules = {
  gameId: "trio",
  gameName: "Trio",
  tagline: "Dévoilez des cartes chez vos adversaires pour compléter vos trios !",
  players: { min: 3, max: 6 },
  duration: "15–30 min",
  objective:
    "Gagner des trios (un trio = 3 cartes identiques) avant ses adversaires. La victoire revient au premier joueur à compléter 3 trios (ou 2 trios liés en mode Picante), ou à celui qui obtient le trio de 7.",

  setup: {
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

  modes: {
    simple:
      "Mode SIMPLE : gagner 3 trios (n'importe lesquels) ou le trio de 7.",
    picante:
      "Mode PICANTE : gagner 2 trios liés (les numéros liés sont indiqués dans les coins inférieurs des cartes — ex. trios 2 et 5, ou trios 2 et 9) ou le trio de 7.",
  },

  gameplay: [
    "Les joueurs jouent chacun leur tour en sens horaire.",
    "À son tour, un joueur dévoile des numéros un par un. Il doit s'arrêter dès que 2 numéros successifs sont différents. S'ils sont identiques, il continue jusqu'à avoir dévoilé 3 numéros identiques (= trio complété).",
    "Pour chaque numéro à dévoiler, le joueur choisit entre deux options :",
    "A) Au centre de la table : il retourne face visible la carte de son choix.",
    "B) De la main d'un joueur (lui inclus) : il dévoile le plus petit ou le plus grand numéro de ce joueur. La carte est posée face visible sur la table. Quand on dévoile sa propre main, c'est forcément le plus petit ou le plus grand numéro (JAMAIS un numéro du milieu).",
    "Important : on peut effectuer plusieurs fois exactement la même action (ex. demander au même adversaire son plus grand numéro deux fois de suite).",
    "Si un joueur n'a plus de cartes en main à son tour, il joue quand même avec les cartes au centre et celles des adversaires.",
  ],

  endTurn: [
    "Le tour d'un joueur se termine de deux façons :",
    "1. Le joueur complète un trio : il prend les 3 cartes face visible devant lui et les garde. On passe au joueur suivant.",
    "2. Un numéro dévoilé est différent du précédent : tous les numéros dévoilés sont remis en place (faces cachées au centre et/ou rendus à leur(s) propriétaire(s)). On passe au joueur suivant.",
  ],

  endGame:
    "Un joueur remporte la partie dès qu'il a gagné 3 trios (mode Simple) ou 2 trios liés (mode Picante), OU dès qu'il obtient le trio de 7 — ce trio donne toujours la victoire immédiate, quel que soit le mode.",

  teamRules: {
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
    endGame:
      "Une équipe remporte la partie dès qu'elle a gagné 3 trios ou 2 trios liés (selon le mode), ou le trio de 7.",
  },

  cards:
    "36 cartes. Chaque numéro de 1 à 12 existe en 3 exemplaires identiques. Le trio de 7 est spécial : il donne la victoire immédiate dans tous les modes.",
};
