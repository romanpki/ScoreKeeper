export const beloteRules = {
  gameId: "belote",
  gameName: "Belote",
  tagline: "Jeu de plis en équipes — prenez l'atout, remportez la donne !",
  players: { min: 4, max: 4 },
  duration: "30–60 min",
  objective:
    "La Belote se joue à 4 joueurs répartis en 2 équipes de 2 (Nord/Sud contre Est/Ouest). Les preneurs s'engagent à marquer plus de points que la défense. La partie se termine quand une équipe atteint le nombre de points fixé au départ.",

  setup: [
    "Le premier donneur est tiré au sort. Pour les donnes suivantes, le donneur est son voisin de droite.",
    "Le donneur mélange obligatoirement les 32 cartes. Le joueur à sa gauche coupe en deux (minimum 3 cartes par tas).",
    "Distribution dans le sens inverse des aiguilles d'une montre, en commençant par le voisin de droite : 3 cartes puis 2, ou 2 puis 3.",
    "Le donneur retourne la première carte du paquet restant face visible — c'est la couleur proposée pour l'atout.",
  ],

  bidding: [
    "Les joueurs s'expriment à partir du voisin de droite du donneur. Chacun peut passer (« je passe ») ou prendre en désignant la couleur d'atout.",
    "Premier tour : l'atout ne peut être que la couleur de la carte retournée.",
    "Si les 4 joueurs passent, second tour : l'atout peut être choisi parmi les 3 autres couleurs.",
    "Si les 4 joueurs passent de nouveau, la donne est annulée (0 point). Le donneur passe la main à son voisin de droite.",
    "Dès qu'un joueur prend, il engage son équipe (les preneurs) à marquer plus de points que la défense.",
    "Fin de distribution : le donneur distribue 3 cartes supplémentaires à chacun. Le preneur reçoit la carte retournée parmi ses 3 cartes. Chaque joueur a au total 8 cartes.",
  ],

  cardValues: {
    atout: [
      "Valet : 20 points (le plus fort)",
      "Neuf : 14 points",
      "As : 11 points",
      "Dix : 10 points",
      "Roi : 4 points",
      "Dame : 3 points",
      "Huit : 0 point",
      "Sept : 0 point",
    ],
    horsAtout: [
      "As : 11 points",
      "Dix : 10 points",
      "Roi : 4 points",
      "Dame : 3 points",
      "Valet : 2 points",
      "Neuf : 0 point",
      "Huit : 0 point",
      "Sept : 0 point",
    ],
  },

  gameplay: [
    "8 plis de 4 cartes. Le joueur à droite du donneur entame (joue la première carte).",
    "Règle 1 : on doit toujours fournir la couleur demandée à l'entame si on en possède.",
    "Règle 2a : si on n'a pas la couleur demandée ET que son partenaire tient le pli, on peut jouer n'importe quelle carte (défausse ou atout).",
    "Règle 2b : si on n'a pas la couleur demandée ET que son partenaire ne tient pas le pli, on est obligé de couper (jouer atout). Si on n'a pas d'atout, on se défausse.",
    "Règle 3 : quand on joue atout (couleur demandée ou coupe), on doit jouer un atout plus fort que ceux déjà présents. Si impossible, on peut jouer un atout plus faible (pisser).",
    "Exception : si son partenaire maître a coupé et qu'on n'a plus que de l'atout, on n'est pas obligé de monter.",
    "Le pli est remporté par le joueur ayant joué la plus forte carte à l'atout, ou à défaut la plus forte dans la couleur demandée.",
    "Les plis sont ramassés du même côté dans chaque équipe pendant toute la donne. Le dernier pli peut être consulté tant que le suivant n'a pas été ramassé.",
  ],

  beloteRebelote: [
    "Un joueur possédant le Roi et la Dame d'atout a la Belote : +20 points pour son équipe.",
    "Annoncer « Belote » en jouant la première de ces deux cartes, « Rebelote » en jouant la seconde.",
    "Si « Rebelote » est annoncé sans « Belote » préalable : pas de bonus.",
  ],

  announcements: [
    "Les annonces (combinaisons de cartes) sont optionnelles selon le tournoi.",
    "Carré de Valets : 200 points | Carré de Neufs : 150 points | Carré d'As/Dix/Rois/Dames : 100 points chacun.",
    "Cent (5 cartes qui se suivent dans la même couleur) : 100 points.",
    "Cinquante (4 cartes qui se suivent dans la même couleur) : 50 points.",
    "Tierce (3 cartes qui se suivent dans la même couleur) : 20 points.",
    "Déclaration au 1er pli. Résolution au 2e pli : seul le camp ayant l'annonce la plus haute voit ses annonces validées. En cas d'égalité, la carte la plus haute l'emporte, puis la couleur d'atout est prioritaire.",
  ],

  scoring: [
    "Chaque camp totalise ses points (points de plis + dix de der + belote + annonces éventuelles). Total du jeu = 162 points (+ dix de der de 10 pts).",
    "Dix de der : +10 points à l'équipe qui réalise le dernier pli.",
    "Capot (8 plis par la même équipe) : le dix de der vaut 100 points → total = 252 points.",
    "Contrat réussi : les preneurs ont plus de points → chaque camp marque son total.",
    "Chute : la défense a plus de points → les preneurs ne marquent rien (sauf belote imprenable). La défense marque 162 pts + ses annonces + la belote éventuelle + les annonces des preneurs.",
    "Litige (81-81) : la défense marque son total, le total des preneurs est offert en bonus aux vainqueurs de la donne suivante.",
  ],

  variants: {
    sansAtoutToutAtout: [
      "Sans Atout : aucun atout. Impossible de couper. Pas de Belote/Rebelote. Ordre des cartes : As (19 pts) > Dix (10) > Roi (4) > Dame (3) > Valet (2) > Neuf/Huit/Sept (0).",
      "Tout Atout : toutes les couleurs sont atout. Ordre : Valet (13) > Neuf (9) > As (6) > Dix (5) > Roi (3) > Dame (2) > Huit/Sept (0). Jusqu'à 4 Belotes possibles (80 pts). On doit toujours monter si possible.",
      "En variante Sans Atout / Tout Atout : le tour d'enchère ne s'arrête pas immédiatement après une prise — on peut surenchérir (couleur → Sans Atout → Tout Atout). Impossible de surenchérir sur soi-même.",
    ],
  },

  endGame:
    "Le premier camp atteignant ou dépassant le nombre de points fixé au départ remporte la partie. Si les deux camps dépassent simultanément, le plus avancé gagne. En cas d'égalité, une dernière donne départage.",
};
