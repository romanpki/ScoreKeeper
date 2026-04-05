export const farkleRules = {
  gameId: "farkle",
  gameName: "Farkle",
  tagline: "Lancez les dés, cumulez les points — mais attention au Farkle !",
  players: { min: 2, max: 8 },
  duration: "20–40 min",
  objective:
    "Le premier joueur à atteindre ou dépasser 10 000 points remporte la partie. Dans la version Farkle Frenzy, tout le monde joue simultanément et la partie s'arrête dès qu'un joueur atteint 10 000 points.",

  setup: [
    "Version Farkle Frenzy : placez le lanceur au centre de la table. Chaque joueur relie son escalier à dés au lanceur, dirigé vers lui.",
    "Chaque joueur reçoit 5 dés de la même couleur.",
    "Un joueur tient les comptes sur une feuille.",
    "Le propriétaire du jeu active le lanceur au début de chaque tour pour obtenir le dé commun (partagé par tous).",
  ],

  combinations: [
    "1 (Un) seul = 100 points",
    "5 (Cinq) seul = 50 points",
    "Brelan de 1 (111) = 300 points",
    "Brelan de 2 (222) = 200 points",
    "Brelan de 3 (333) = 300 points",
    "Brelan de 4 (444) = 400 points",
    "Brelan de 5 (555) = 500 points",
    "Brelan de 6 (666) = 600 points",
    "4 dés identiques = 1 000 points",
    "5 dés identiques = 2 000 points",
    "6 dés identiques = 3 000 points",
    "Suite de 1 à 6 = 1 500 points",
    "Trois paires = 1 500 points",
    "Carré + paire = 1 500 points",
    "Deux brelans = 2 500 points",
  ],

  rules: [
    "Les 1 et les 5 sont les seules valeurs qui peuvent rapporter des points isolément.",
    "Les autres valeurs ne rapportent des points que combinées en séries ou séquences.",
    "Une combinaison n'est valable que si elle est obtenue lors d'un seul et même lancé. On ne peut pas associer des dés de tirages successifs.",
    "On doit marquer (mettre de côté) au moins un dé après chaque lancé avant de relancer les autres.",
  ],

  gameplay: [
    "À chaque tour, le joueur lance ses 5 dés (+ le dé commun en Farkle Frenzy).",
    "Après le lancé, il place les dés qui rapportent le meilleur score sur son escalier (ou devant lui), puis relance les dés restants.",
    "Il doit ajouter au moins un dé à son score à chaque lancé pour pouvoir relancer.",
    "Il peut s'arrêter quand il le souhaite pour marquer les points cumulés du tour.",
    "Le Farkle : si aucune combinaison n'est obtenue après un lancé, c'est un Farkle — le joueur perd TOUS les points accumulés pendant ce tour (mais pas les points des tours précédents).",
    "Pour commencer à marquer sur la feuille de score, il faut atteindre au moins 400 points lors d'un tour. Après ce premier seuil, il n'y a plus de minimum requis.",
    "Une fois des points inscrits sur la feuille, ils ne peuvent plus être perdus.",
  ],

  commonDie: [
    "Le dé commun (blanc) a pour faces : 1, 1, 5, 5, Wild, 2X.",
    "Faces 1 ou 5 : peut être utilisé comme un dé normal du tirage.",
    "Face 2X : double tous les points du tour en cours.",
    "Face Wild : le lanceur choisit après son premier lancer la valeur du dé commun pour tout le tour. Tous les joueurs (en Frenzy) utilisent cette même valeur.",
  ],

  endTurn:
    "Un tour se termine quand tous les joueurs ont arrêté volontairement ou subi un Farkle, ou quand un joueur a placé ses 5 dés sur son escalier. Ce dernier peut choisir de relancer (le dé commun reste disponible mais garde sa valeur assignée) ou de s'arrêter.",

  endGame:
    "Le premier joueur à atteindre ou dépasser 10 000 points gagne. En cas d'égalité (plusieurs joueurs atteignent 10 000 en même temps), celui avec le total le plus élevé l'emporte. Si égalité parfaite, un tour supplémentaire départage.",
};
