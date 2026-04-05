export const tarotRules = {
  gameId: "tarot",
  gameName: "Tarot",
  tagline: "Jeu de plis avec enchères — le preneur seul contre trois défenseurs.",
  players: { min: 3, max: 5 },
  duration: "30–60 min",
  objective:
    "Le Tarot se joue à 3, 4 ou 5 joueurs. Un joueur (le preneur) s'engage à atteindre un nombre de points défini contre les autres (la Défense). Le nombre de points requis dépend du nombre d'Oudlers (cartes maîtresses) détenus en fin de partie.",

  cards: {
    composition:
      "78 cartes : 4 couleurs (Pique, Cœur, Carreau, Trèfle) de 14 cartes chacune (As à 10, Valet, Cavalier, Dame, Roi) + 21 Atouts numérotés de 1 (le Petit) à 21 + l'Excuse (joker marqué d'une étoile).",
    oudlers:
      "Les 3 Oudlers (ou Bouts) sont les pièces stratégiques : le 21, le Petit (Atout 1) et l'Excuse. Ils déterminent le score minimum à atteindre pour gagner.",
    values: [
      "1 Oudler + 1 petite carte = 5 points",
      "1 Roi + 1 petite carte = 5 points",
      "1 Dame + 1 petite carte = 4 points",
      "1 Cavalier + 1 petite carte = 3 points",
      "1 Valet + 1 petite carte = 2 points",
      "2 petites cartes = 1 point",
      "Total = 91 points",
    ],
    pointsRequired: [
      "Sans Oudler : 56 points requis",
      "Avec 1 Oudler : 51 points requis",
      "Avec 2 Oudlers : 41 points requis",
      "Avec 3 Oudlers : 36 points requis",
    ],
  },

  setup: [
    "Tirage au sort pour désigner le donneur (la plus petite carte). Le jeu doit être battu par le joueur en face du donneur et coupé par le voisin de gauche.",
    "Distribution à 4 joueurs : 3 cartes par 3, dans le sens inverse des aiguilles d'une montre. Le donneur constitue au passage un talon de 6 cartes (le Chien). Première et dernière carte du paquet interdites au Chien. Chaque joueur reçoit 18 cartes.",
    "Les joueurs ne ramassent leurs cartes qu'une fois la distribution entièrement terminée.",
    "Attention : un joueur possédant le Petit sec (seul atout, sans l'Excuse) doit l'annoncer, étaler son jeu et annuler la donne.",
  ],

  bidding: [
    "Le joueur à droite du donneur parle en premier. Si tous passent, nouvelle distribution.",
    "Les enchères par ordre croissant :",
    "Prise (Petite) : jeu moyen, ~50% de chances. Le preneur prend le Chien et écarte 6 cartes.",
    "Garde : jeu solide, chances supérieures aux risques. Même procédure que la Prise.",
    "Garde Sans le Chien : très beau jeu. Le preneur ne regarde pas le Chien, mais ses points lui sont comptés.",
    "Garde Contre le Chien : jeu exceptionnel. Les points du Chien vont à la Défense.",
    "Chaque joueur ne peut parler qu'une seule fois. Un surenchère couvre la précédente.",
  ],

  chienAndEcart: [
    "Sur Prise ou Garde : le donneur tend le Chien au preneur qui le retourne pour que tous voient les 6 cartes. Il les intègre à son jeu puis écarte 6 cartes (qui restent secrètes et comptent dans ses levées).",
    "Interdictions : on ne peut pas écarter un Roi ni un Bout. On n'écarte des Atouts que si indispensable, en les montrant à la Défense.",
    "Une fois l'Écart constitué et dit « Jeu », il ne peut plus être modifié ni consulté.",
  ],

  gameplay: [
    "L'entame est effectuée par le joueur à droite du donneur. Le jeu tourne dans le sens inverse des aiguilles d'une montre.",
    "À l'Atout : on est obligé de monter sur le plus fort Atout déjà en jeu, même s'il appartient à un partenaire. Si impossible, jouer l'Atout le plus faible (pisser).",
    "À la couleur : on doit fournir la couleur demandée (sans obligation de monter). Si on n'a pas la couleur, on doit couper (jouer Atout). Si un adversaire a déjà coupé, on doit surcouper ou pisser si on ne peut pas.",
    "Si on n'a ni la couleur ni d'Atout, on se défausse librement.",
    "L'Excuse : ne permet pas de remporter une levée (sauf Chelem). Elle reste la propriété du camp qui la détient. Si jouée, le camp qui l'a jouée récupère l'Excuse et donne en échange une carte sans valeur au camp qui a remporté le pli.",
    "Si la première carte d'une levée est l'Excuse, c'est la carte suivante qui détermine la couleur jouée.",
  ],

  bonuses: {
    poignee: [
      "Un joueur possédant 10, 13 ou 15 Atouts peut l'annoncer avant sa première carte (Simple Poignée = 20 pts, Double = 30 pts, Triple = 40 pts).",
      "La prime est acquise au camp vainqueur de la donne, quel que soit l'annonceur.",
    ],
    petitAuBout:
      "Si le Petit (Atout 1) fait partie de la dernière levée, le camp qui réalise cette levée gagne une prime de 10 points (multipliée par le coefficient du contrat).",
    chelem: [
      "Chelem = remporter toutes les levées.",
      "Chelem annoncé et réalisé : prime supplémentaire de 400 points.",
      "Chelem non annoncé mais réalisé : prime de 200 points.",
      "Chelem annoncé mais non réalisé : 200 points déduits.",
    ],
  },

  scoring: [
    "Le preneur doit atteindre le nombre de points requis selon ses Oudlers. Tout contrat vaut arbitrairement 25 points de base.",
    "Score = (25 + points d'écart) × coefficient du contrat ± primes.",
    "Coefficients : Prise ×1 | Garde ×2 | Garde Sans ×4 | Garde Contre ×6.",
    "En donnes libres à 4 joueurs : chaque défenseur marque le même montant (négatif si le preneur gagne). Le preneur marque 3× ce total (positif s'il gagne). La somme des 4 scores est toujours 0.",
    "À 3 joueurs : le preneur marque 2× le total des défenseurs.",
    "À 5 joueurs : le preneur appelle un Roi avant de voir le Chien. Le détenteur de ce Roi devient son partenaire (associé). Répartition : 2/3 des points pour le preneur, 1/3 pour l'associé.",
  ],

  variants: {
    threePlayer:
      "Distribution : 4 cartes par 4, Chien de 6 cartes, chaque joueur reçoit 24 cartes. Poignées : Simple = 13 Atouts, Double = 15, Triple = 18.",
    fivePlayer:
      "Distribution : 3 par 3, Chien de 3 cartes, chaque joueur reçoit 15 cartes. Le preneur appelle un Roi avant de retourner le Chien. Poignées : Simple = 8, Double = 10, Triple = 13.",
  },

  endGame:
    "La partie se joue en un nombre de donnes convenu. À l'issue, le joueur avec le plus de points gagne. En tournoi, le classement s'établit par cumul des scores de chaque donne.",
};
