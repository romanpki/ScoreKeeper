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

  farkle:
    "Objectif : atteindre 10 000 points en premier.\n\n" +
    "Lance 5 dés, mets de côté les combinaisons gagnantes et relance les autres.\n" +
    "• 1 seul = 100 pts  •  5 seul = 50 pts  •  Brelan = valeur × 100 (111 = 300)\n" +
    "• 4 identiques = 1 000 pts  •  5 identiques = 2 000 pts  •  Suite 1–6 = 1 500 pts\n\n" +
    "Farkle : si aucun dé ne rapporte de points → perte de tous les points du tour.\n" +
    "Minimum 400 pts lors d'un tour pour commencer à inscrire son score.",

  rummy:
    "Objectif : se débarrasser de toutes ses pièces en formant des combinaisons.\n\n" +
    "Séquence : 3+ pièces qui se suivent dans la même couleur.\n" +
    "Série : 3 ou 4 pièces de même valeur, couleurs différentes.\n\n" +
    "Première mise : minimum 30 pts en une fois. " +
    "Gagnant : +total des pièces restantes des autres. Perdants : −valeur de leurs pièces.\n" +
    "Rummy pur (tout en une fois, sans dépôt préalable) : points doublés.",

  yams:
    "Objectif : marquer le plus de points en 13 tours.\n\n" +
    "Lance 5 dés jusqu'à 3 fois par tour, puis inscris ton résultat dans une case :\n" +
    "• Section haute (1–6) : somme des dés correspondants\n" +
    "• Brelan / Carré : total des 5 dés  •  Full = 25 pts\n" +
    "• Petite suite = 30 pts  •  Grande suite = 40 pts  •  Yams = 50 pts\n\n" +
    "Chaque case ne peut être remplie qu'une fois (barre si inutilisable = 0 pt).\n" +
    "Bonus +37 pts si la section haute totalisée ≥ 63 pts. Le plus de points gagne.",

  belote:
    "Jeu d'équipes à 4 joueurs (2 vs 2) — ici chaque « joueur » représente une équipe.\n\n" +
    "Le preneur s'engage à marquer plus de points que la défense (total = 162 pts).\n" +
    "Chute : les preneurs marquent 0, la défense récupère tout.\n" +
    "Belote/Rebelote (Roi + Dame d'atout) : +20 pts pour l'équipe.\n\n" +
    "L'équipe qui atteint le score cible en premier remporte la partie.",

  tarot:
    "3 à 5 joueurs. Le preneur (seul contre tous) s'engage selon ses Oudlers :\n" +
    "• 3 Oudlers : atteindre 36 pts  •  2 : 41 pts  •  1 : 51 pts  •  0 : 56 pts\n\n" +
    "Score = (25 + points d'écart) × coefficient du contrat :\n" +
    "Prise ×1 | Garde ×2 | Garde Sans ×4 | Garde Contre ×6\n\n" +
    "Somme nulle entre joueurs. Petit au bout, Poignée et Chelem donnent des primes.\n" +
    "Le plus de points accumulés sur l'ensemble des donnes gagne.",
};
