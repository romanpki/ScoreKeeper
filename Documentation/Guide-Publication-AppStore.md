# ScoreKeeper — Guide de publication App Store iOS

*Dernière mise à jour : mars 2026*

---

## Prérequis

- Compte **Apple Developer** actif (~99 $/an)
- Bundle Identifier configuré : `com.roman.scorekeeper`
- Build archivée et uploadée sur App Store Connect (voir `Guide-Builds.md`)
- **Icône app** : 1 fichier PNG 1024×1024 px, fond uni (pas de transparence, pas de coins arrondis — Apple les ajoute automatiquement)
- **Captures d'écran** : minimum 1 par format requis (voir ci-dessous)
- **URL de confidentialité** : obligatoire depuis 2020 — voir `Politique de confidentialité — ScoreKeeper.rtf`

---

## Formats de captures d'écran requis

Apple exige des captures pour au moins **un format de chaque catégorie** :

| Format | Résolution | Device de référence |
|---|---|---|
| iPhone 6.7" *(obligatoire)* | 1290 × 2796 px | iPhone 15 Pro Max / 16 Pro Max |
| iPhone 6.5" | 1242 × 2688 px | iPhone 11 Pro Max |
| iPad Pro 12.9" *(si universel)* | 2048 × 2732 px | iPad Pro M2 |

> Conseil : seul le format **6.7"** est actuellement obligatoire pour une app iPhone-only. Commencer par celui-là.

**Comment capturer dans le simulateur Xcode :**
1. Lancer sur simulateur iPhone 15 Pro Max
2. Naviguer vers l'écran à capturer
3. **Cmd+S** → la capture est enregistrée sur le Bureau

---

## Étapes dans App Store Connect

### 1. Créer la fiche de l'app

1. Aller sur [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. **Mes Apps → +** (bouton bleu en haut à gauche)
3. **Nouvelle app**
4. Remplir :
   - Plateformes : **iOS**
   - Nom : `ScoreKeeper` *(30 car. max — modifiable plus tard)*
   - Langue principale : **Français**
   - Bundle ID : `com.roman.scorekeeper`
   - SKU : `scorekeeper-ios-001` *(identifiant interne, non public)*

### 2. Informations de la version

Aller dans **1.0 Prepare for Submission** :

#### Captures d'écran
- Onglet **iPhone 6.7"**
- Glisser-déposer les captures (minimum 1, recommandé 5-10)
- Les captures s'affichent dans l'ordre de téléchargement → les réorganiser par drag

#### Textes de la fiche
*(voir `Contenu-AppStore.md` pour les textes rédigés)*

| Champ | Limite | Remarque |
|---|---|---|
| Nom | 30 car. | Visible sous l'icône |
| Sous-titre | 30 car. | Visible sous le nom |
| Description | 4 000 car. | Premier paragraphe = le plus important |
| Mots-clés | 100 car. | Séparés par des virgules, pas d'espaces |
| URL de support | — | Peut être une page GitHub ou un email `mailto:` |
| URL de confidentialité | — | Obligatoire |

#### Informations de review
- **Coordonnées** : nom, prénom, téléphone, email (visible uniquement par Apple)
- **Notes pour le reviewer** : préciser que l'app ne nécessite pas de compte, tout est local

#### Informations de l'app
- Catégorie principale : **Jeux** → **Cartes**
- Catégorie secondaire : **Utilitaires** (optionnel)
- Âge minimum : **4+** (aucun contenu sensible)
- Copyright : `2026 Roman Pki`

### 3. Tarification et disponibilité

- **Prix : Gratuit** (ou tarif si app payante)
- **Disponibilité** : Tous les pays (ou sélection manuelle)

### 4. Conformité et déclarations

Apple pose une série de questions obligatoires :

| Question | Réponse pour ScoreKeeper |
|---|---|
| Algorithme de chiffrement (Export Compliance) | **Non** — l'app utilise uniquement le chiffrement standard d'iOS (HTTPS/TLS) via les APIs système |
| Contenu de tiers | **Non** |
| Publicités | **Non** |
| Données de santé | **Non** |
| Collecte de données | Voir section App Privacy ci-dessous |

### 5. App Privacy (déclaration de données)

Dans **App Privacy → Gérer** :

ScoreKeeper **ne collecte aucune donnée utilisateur** envoyée vers des serveurs tiers. Les données (joueurs, scores, parties) restent sur l'appareil et dans iCloud du compte de l'utilisateur.

- **Données collectées** : Aucune
- Cliquer **Publier** pour valider la déclaration

### 6. Associer la build

Dans **Build** → cliquer le **+** → sélectionner la build uploadée depuis Xcode

### 7. Soumettre pour review

1. Vérifier qu'il n'y a aucune alerte rouge dans la sidebar
2. Cliquer **Ajouter à la review** (en haut à droite)
3. Confirmer la soumission

---

## Délai et processus de review

| Étape | Délai estimé |
|---|---|
| Attente avant attribution d'un reviewer | 6–24h |
| Review active | 24–48h |
| Notification de décision | Email + notification App Store Connect |

**Résultats possibles :**
- ✅ **Approuvée** → l'app passe en statut "Prête pour distribution", disponible immédiatement ou à une date programmée
- ❌ **Rejetée** → Apple envoie un motif détaillé dans le Resolution Center

---

## Rejets courants et solutions

| Motif | Solution |
|---|---|
| Guideline 4.0 — Design : boutons trop petits | Zones tactiles minimum 44×44 pt |
| Guideline 2.1 — Performance : crash au lancement | Tester sur un vrai device avant de soumettre |
| Guideline 5.1.1 — Données : politique manquante | Ajouter l'URL de confidentialité dans la fiche |
| Metadata rejected : captures trompeuses | Utiliser de vraies captures de l'app sans mockups |
| Export Compliance : mauvaise réponse | Si l'app utilise HTTPS standard, répondre "Non" à l'algorithme de chiffrement personnalisé |

---

## Mises à jour ultérieures

Pour chaque nouvelle version :
1. Incrémenter le `version` dans `app.json` (ex. `"1.0.1"`)
2. Incrémenter le `buildNumber` (ex. `"2"`)
3. Archiver et uploader depuis Xcode
4. Dans App Store Connect → **+ Version** → saisir le nouveau numéro
5. Rédiger les **notes de version**
6. Associer la nouvelle build → Soumettre

---

## Liens utiles

- App Store Connect : https://appstoreconnect.apple.com
- Human Interface Guidelines : https://developer.apple.com/design/human-interface-guidelines/
- App Store Review Guidelines : https://developer.apple.com/app-store/review/guidelines/
- Status des systèmes Apple : https://developer.apple.com/system-status/
