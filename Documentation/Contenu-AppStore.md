# ScoreKeeper — Contenus App Store iOS

*Textes à copier-coller dans App Store Connect*
*Dernière mise à jour : mars 2026*

---

## Nom de l'app

```
ScoreKeeper
```
*(11 car. / 30 max)*

---

## Sous-titre

```
Compteur de points pour jeux de cartes
```
*(39 car. — à raccourcir si refusé : "Scores pour jeux de cartes" = 26 car.)*

Version courte (26 car.) :
```
Scores pour jeux de cartes
```

---

## Description (4 000 car. max)

```
ScoreKeeper est l'application de référence pour gérer les scores de vos parties de jeux de cartes en famille ou entre amis.

Plus de papier, plus de calculs fastidieux : ScoreKeeper s'occupe de tout.

── JEUX INCLUS ──

• Skull King ☠️ — Saisie des mises, plis et bonus. Calcul automatique selon les règles officielles.
• Skyjo ❄️ — Détection automatique du doublement de score. Tableau en temps réel.
• Flip 7 🃏 — Gestion des bonus (+4, +8, +15, ×2) et du Flip 7.
• Papayoo 🥝 — Total automatique à 250 pts par manche. Saisie guidée.
• Uno 🎴 — Comptage des points jusqu'à 500.
• À Odin ⚡ — Suivi du seuil de points.
• Trio 3️⃣ — Comptage de victoires par manche.
• Et vos propres jeux personnalisés !

── FONCTIONNALITÉS ──

• Tableau des scores en temps réel, manche par manche
• Classement automatique (le plus haut ou le plus bas gagne selon le jeu)
• Podium animé avec confettis à la fin de chaque partie
• Historique complet de toutes vos parties
• Statistiques par joueur : victoires, parties jouées, taux de victoire
• Export et import CSV de l'historique
• Règles de chaque jeu intégrées (bouton ? dans chaque partie)
• Retour haptique à chaque validation
• Chronomètre de partie

── VOS JOUEURS ──

Créez un carnet de joueurs avec avatar coloré. ScoreKeeper conserve leurs statistiques au fil des parties et affiche un classement global entre tous les joueurs.

── CONFIDENTIALITÉ ──

Aucune inscription, aucun compte, aucune donnée envoyée sur internet. Toutes vos données restent sur votre appareil et dans votre iCloud personnel.

── CRÉER VOS PROPRES JEUX ──

Ajoutez n'importe quel jeu personnalisé : choisissez si le plus haut ou le plus bas score gagne, définissez la condition de fin (seuil de points, nombre de manches fixe…).

Téléchargez ScoreKeeper et ne perdez plus jamais le fil de vos scores !
```

*(Environ 1 650 car. — bien en dessous de la limite de 4 000)*

---

## Mots-clés (100 car. max, séparés par virgules)

```
jeux cartes,scores,compteur,skull king,skyjo,uno,papayoo,flip7,points,famille,multijoueur
```
*(97 car.)*

> **Règles Apple :** ne pas répéter le nom de l'app, ne pas inclure de noms de concurrents, pas d'espaces après les virgules.

---

## URL de support

```
https://github.com/romanpki/ScoreKeeper
```

*(ou une adresse email : `mailto:ton@email.com`)*

---

## URL de confidentialité

Utiliser le fichier existant `Politique de confidentialité — ScoreKeeper.rtf` converti en page web, ou héberger le texte sur GitHub Pages.

URL temporaire acceptable pour la review :
```
https://github.com/romanpki/ScoreKeeper/blob/main/Documentation/Politique%20de%20confidentialit%C3%A9%20%E2%80%94%20ScoreKeeper.rtf
```

---

## Notes de version — v1.0

```
Première version de ScoreKeeper !

• 7 jeux préconfigurés : Skull King, Skyjo, Flip 7, Papayoo, Uno, À Odin, Trio
• Jeux personnalisés illimités
• Historique complet des parties
• Statistiques et classement des joueurs
• Export CSV
• Synchronisation iCloud
```

---

## Informations de review (pour Apple, non publiques)

**Notes pour le reviewer :**
```
ScoreKeeper est une application de comptage de points pour jeux de cartes.
Elle ne nécessite aucune inscription ni connexion — tout fonctionne localement
sur l'appareil. Les données sont optionnellement synchronisées via le compte
iCloud de l'utilisateur (aucun serveur tiers).

Pour tester : créer une partie en appuyant sur "+ Nouvelle partie",
sélectionner un jeu (ex. Skyjo), ajouter 2 joueurs, et saisir des scores.
```

---

## Déclaration App Privacy

| Type de données | Collecté ? | Envoyé à des tiers ? | Lié à l'identité ? |
|---|---|---|---|
| Nom des joueurs | Oui (saisi par l'utilisateur) | Non | Non |
| Scores et parties | Oui | Non | Non |
| Données analytiques | Non | — | — |
| Localisation | Non | — | — |
| Contacts | Non | — | — |

**Réponse dans App Store Connect :** "Nous ne collectons aucune donnée" — toutes les données restent sur l'appareil de l'utilisateur et dans son propre iCloud.

---

## Questions de conformité export (Export Compliance)

**"Votre app utilise-t-elle un algorithme de chiffrement non standard ?"**
→ **Non**

ScoreKeeper utilise uniquement les API iOS standard (AsyncStorage, iCloud KVS). Aucun algorithme de chiffrement personnalisé. La communication réseau est limitée à iCloud via les API Apple officielles.

---

## Catégorie et classification

| Champ | Valeur |
|---|---|
| Catégorie principale | **Jeux** → **Cartes** |
| Catégorie secondaire | **Utilitaires** |
| Âge minimum | **4+** |
| Classement de contenu | Aucun contenu sensible |
| Copyright | `© 2026 Roman Pki` |

---

## Captures d'écran recommandées (ordre d'affichage)

1. **Accueil** — Parties en cours, liste des jeux avec emojis
2. **Partie en cours — Skull King** — Interface de saisie mise/plis avec preview du score
3. **Tableau des scores** — Partie multi-joueurs avec historique des manches
4. **Fin de partie** — Podium animé avec confettis et stats
5. **Historique** — Liste filtrée avec classement global des joueurs

> Format : **1290 × 2796 px** (iPhone 15 Pro Max / 16 Pro Max)
> Outil : Simulateur Xcode → Cmd+S
