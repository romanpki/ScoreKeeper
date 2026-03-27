export const GAME_RULES: Record<string, string> = {
  skyjo:
    "Objectif : finir avec le moins de points possible.\n\n" +
    "Chaque joueur retourne ses cartes une par une. Quand un joueur retourne sa dernière carte, " +
    "les autres jouent encore un tour chacun. Si ce joueur n'avait pas le score le plus bas, " +
    "son score est doublé.\n\n" +
    "Fin : quand un joueur atteint 100 points ou plus. Le moins de points gagne.",

  skullking:
    "10 manches. Chaque joueur annonce sa mise (nombre de plis qu'il pense remporter).\n\n" +
    "Scoring :\n" +
    "• Mise 0 réussie (0 pli) : +10 × numéro de manche\n" +
    "• Mise 0 ratée (≥1 pli) : −10 × numéro de manche\n" +
    "• Mise > 0 réussie : +20 × mise + bonus\n" +
    "• Mise > 0 ratée : −10 × |différence|\n\n" +
    "Bonus (si mise réussie) :\n" +
    "• Carte 14 capturée : +10 chacune\n" +
    "• Pirate capturé par Skull King : +30 chacun\n" +
    "• Skull King capturé par Sirène : +50\n\n" +
    "Le plus de points après 10 manches gagne.",

  flip7:
    "Objectif : atteindre 200 points en premier.\n\n" +
    "Chaque manche, les joueurs jouent des cartes. Le joueur qui réalise un Flip 7 " +
    "(7 cartes différentes face visible) marque des points bonus.\n\n" +
    "Les cartes spéciales permettent de gagner des points supplémentaires (+4, +8, +15) " +
    "ou de multiplier son score (×2).\n\n" +
    "Premier à 200 points gagne.",

  uno:
    "Objectif : marquer 500 points en premier.\n\n" +
    "Quand un joueur pose sa dernière carte, les autres joueurs comptent leurs cartes en main :\n" +
    "• Cartes numérotées : valeur faciale\n" +
    "• Cartes d'action (Passe ton tour, Sens inverse, +2) : 20 pts\n" +
    "• Cartes +4, Joker : 50 pts\n\n" +
    "Ces points sont crédités au gagnant de la manche. Premier à 500 gagne.",

  papayoo:
    "Objectif : finir avec le moins de points possible.\n\n" +
    "Le nombre de manches = nombre de joueurs. Un joueur distribue toutes les cartes, " +
    "et avant chaque manche les joueurs s'échangent 3 cartes.\n\n" +
    "Les cartes Payoo (7 de chaque couleur) valent des points. " +
    "Le Papayoo (7 de la couleur désignée) vaut son multiplicateur.\n\n" +
    "Total obligatoire : 250 points par manche. Le moins de points gagne.",

  odin:
    "Objectif : ne pas atteindre le seuil de points (défini au lancement).\n\n" +
    "Jeu de cartes où chaque manche les joueurs marquent des points. " +
    "Le premier à atteindre ou dépasser le seuil perd la partie.\n\n" +
    "Le moins de points à la fin gagne.",

  trio:
    "Objectif : remporter le nombre de manches définies (3 par défaut).\n\n" +
    "À chaque manche, un seul joueur gagne. Le premier à atteindre " +
    "le nombre de victoires cible remporte la partie.",
};
