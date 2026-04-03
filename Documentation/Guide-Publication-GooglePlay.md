# ScoreKeeper — Guide de publication Google Play

*Dernière mise à jour : mars 2026*

---

## Prérequis

- Compte **Google Play Console** actif (25 $ one-time, paiement unique)
  → [play.google.com/console](https://play.google.com/console)
- **Keystore signé** : fichier `.keystore` ou `.jks` généré une fois et conservé précieusement
- **AAB (Android App Bundle)** généré depuis le projet (voir `Guide-Builds.md`)
- **Icône** : PNG 512×512 px, fond uni ou avec transparence autorisée
- **Feature graphic** : PNG/JPEG 1024×500 px (bandeau affiché en haut de la fiche)
- **Captures d'écran** : minimum 2 par format (voir ci-dessous)
- **Politique de confidentialité** : URL publique obligatoire

---

## Formats de captures d'écran requis

| Format | Résolution min. | Remarque |
|---|---|---|
| Téléphone *(obligatoire)* | 320×568 px min, ratio 16:9 ou 9:16 | Recommandé : 1080×1920 px |
| Tablette 7" | 1024×600 px | Optionnel si app phone-only |
| Tablette 10" | 1280×800 px | Optionnel |

**Comment capturer :**
1. Lancer l'app sur un émulateur Android (Android Studio → AVD)
2. Prendre une capture depuis Android Studio → Device → Screenshot
3. Ou connecter un device physique et `adb exec-out screencap -p > screen.png`

---

## Étapes dans Google Play Console

### 1. Créer l'application

1. Aller sur [play.google.com/console](https://play.google.com/console)
2. **Créer une application**
3. Remplir :
   - Langue par défaut : **Français (France)**
   - Titre : `ScoreKeeper`
   - Application ou jeu : **Jeu**
   - Gratuit ou payant : **Gratuit**
4. Accepter les politiques développeur → **Créer l'application**

---

### 2. Configurer la fiche Play Store

Aller dans **Présence sur le Play Store → Fiche principale du Play Store** :

#### Textes
*(voir `Contenu-GooglePlay.md` pour les textes rédigés)*

| Champ | Limite | Remarque |
|---|---|---|
| Titre | 50 car. | Visible sous l'icône |
| Description courte | 80 car. | Résumé affiché dans les résultats de recherche |
| Description complète | 4 000 car. | Les mots-clés doivent être intégrés naturellement dans le texte |

#### Visuels
- **Icône** : 512×512 px PNG (Play Console l'arrondit automatiquement)
- **Feature graphic** : 1024×500 px
- **Captures d'écran téléphone** : minimum 2, maximum 8

#### Catégorie
- **Type** : Jeux
- **Catégorie** : Cartes

#### Coordonnées
- Email : ton adresse email (obligatoire, visible publiquement)
- Site web : URL GitHub ou page personnelle (optionnel)
- Politique de confidentialité : URL obligatoire

---

### 3. Déclarations de contenu

Aller dans **Politique → Contenu de l'application** :

#### Évaluations du contenu (PEGI / IARC)
1. Cliquer **Commencer le questionnaire**
2. Catégorie : **Jeux de société, cartes ou trivia**
3. Répondre aux questions :
   - Violence : Non
   - Contenu sexuel : Non
   - Langage : Non
   - Substances : Non
   - Achats intégrés : Non
4. Résultat attendu : **PEGI 3** (tous publics)

#### Déclaration sur les publicités
→ **Cette application ne contient pas de publicités**

#### Accès à l'application
→ **Toutes les fonctionnalités sont accessibles sans restriction** (pas de login requis)

---

### 4. Déclaration de données (Data Safety)

Aller dans **Politique → Sécurité des données** :

ScoreKeeper **ne collecte, ne partage et ne vend aucune donnée utilisateur** à des tiers.

| Section | Réponse |
|---|---|
| Votre app collecte-t-elle des données ? | **Non** |
| Votre app partage-t-elle des données ? | **Non** |
| Chiffrement des données | **Oui** — données chiffrées en transit (HTTPS / Android standard) |
| Possibilité de demander suppression des données | **Oui** — désinstaller l'app supprime toutes les données |

Cliquer **Enregistrer** puis **Soumettre**.

---

### 5. Tarification et disponibilité

Aller dans **Distribution → Pays / Régions** :
- Sélectionner **Tous les pays disponibles** (ou une sélection manuelle)
- Prix : **Gratuit** (non modifiable vers payant une fois publié)

---

### 6. Générer et uploader le AAB signé

Sur le Mac :
```bash
cd ~/Downloads/ScoreKeeper/android
./gradlew bundleRelease
```

Fichier généré :
```
android/app/build/outputs/bundle/release/app-release.aab
```

Dans Google Play Console → **Test et publication → Production → Créer une version** :
1. Cliquer **Charger** → sélectionner `app-release.aab`
2. Notes de version → saisir les notes (voir `Contenu-GooglePlay.md`)
3. **Enregistrer** → **Vérifier la version** → **Déployer en production**

> **Option alternative — tests internes d'abord** : avant de passer en production, créer une version dans **Test interne** pour vérifier sur tes devices sans review Google.

---

### 7. Soumettre pour review

Après avoir rempli toutes les sections (une coche verte doit apparaître sur chaque section) :
1. Aller dans **Production → Vérifier la version**
2. Corriger les éventuelles erreurs signalées
3. **Déployer en production**

---

## Délai et processus de review

| Étape | Délai estimé |
|---|---|
| Première publication | 3–7 jours |
| Mises à jour ultérieures | Quelques heures à 3 jours |
| Apps avec historique positif | Souvent < 24h |

**Résultats possibles :**
- ✅ **Approuvée** → app visible sur le Play Store
- ❌ **Rejetée** → email de notification avec motif dans la Play Console

---

## Rejets courants et solutions

| Motif | Solution |
|---|---|
| Politique de confidentialité manquante ou inaccessible | Vérifier que l'URL est publique, pas derrière un login |
| Métadonnées trompeuses | Captures d'écran doivent correspondre à l'app réelle |
| Permission déclarée non justifiée | Supprimer les permissions inutilisées dans `AndroidManifest.xml` |
| AAB non signé | Vérifier la configuration `signingConfigs` dans `build.gradle` |
| Package name déjà utilisé | Le `applicationId` dans `build.gradle` doit être unique (`com.roman.scorekeeper`) |

---

## Mises à jour ultérieures

```bash
# 1. Incrémenter versionCode et versionName dans android/app/build.gradle
#    versionCode: entier, doit augmenter à chaque release (ex. 1 → 2)
#    versionName: string lisible (ex. "1.0" → "1.1")

# 2. Générer le nouveau AAB
cd ~/Downloads/ScoreKeeper/android
./gradlew bundleRelease

# 3. Dans Play Console → Production → Créer une version → Charger le AAB
```

---

## Liens utiles

- Google Play Console : https://play.google.com/console
- Politique de contenu Google Play : https://support.google.com/googleplay/android-developer/answer/9904549
- Android App Bundle : https://developer.android.com/guide/app-bundle
- Data Safety : https://support.google.com/googleplay/android-developer/answer/10787469
