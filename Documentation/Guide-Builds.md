# ScoreKeeper — Guide de build iOS & Android

*Dernière mise à jour : mars 2026*

---

## Prérequis communs

- Projet situé dans `~/Downloads/ScoreKeeper`
- Compte Apple Developer actif (`com.roman.scorekeeper`)
- Xcode installé sur le SSD externe Hagibis
- Node.js installé (`node --version` pour vérifier)

---

## Build iOS (TestFlight & App Store)

### 1. Mettre le code à jour

```bash
cd ~/Downloads/ScoreKeeper
git pull origin main
```

### 2. Installer / mettre à jour les dépendances

```bash
# Si de nouveaux paquets Expo ont été ajoutés :
npx expo install

# Toujours refaire les pods après un npm install ou un changement de dépendances
npm install
cd ios && pod install && cd ..
```

> **Signe que les pods sont à jour :** le terminal affiche `Pod installation complete! There are X dependencies from the Podfile...` sans erreur.

### 3. Ouvrir le workspace Xcode

```bash
open ios/ScoreKeeper.xcworkspace
```

> ⚠️ Toujours ouvrir `.xcworkspace`, **jamais** `.xcodeproj`.

### 4. Configurer la destination

Dans la barre en haut de Xcode :
- Scheme : **ScoreKeeper**
- Destination : **Any iOS Device (arm64)**
  *(si un iPhone physique est connecté, il apparaît dans la liste — les deux fonctionnent)*

### 5. Vérifier la signature

`Signing & Capabilities` → `ScoreKeeper` target :
- Team : **Roman Pki** (ou ton nom de compte Developer)
- Bundle Identifier : `com.roman.scorekeeper`
- Signing : **Automatically manage signing** ✓

### 6. Archiver

Menu **Product → Archive**

- Durée : ~5–10 min selon la machine
- Une fois terminé, l'**Organizer** s'ouvre automatiquement

### 7. Distribuer via TestFlight

Dans l'Organizer :
1. Sélectionner l'archive la plus récente
2. **Distribute App**
3. **TestFlight & App Store** → Next
4. **Upload** → Next
5. Sélectionner le Team Account → Next
6. Laisser Xcode gérer les profils → Next → **Upload**

### 8. Attendre le traitement Apple

- Dans **App Store Connect → TestFlight**, la build apparaît sous ~5–10 min
- Statut : "En cours de traitement" → "Prêt à tester"
- Ajouter la build au groupe de testeurs → les testeurs reçoivent une notification

### Erreurs courantes

| Erreur | Cause | Solution |
|---|---|---|
| `getPathPermissions` manquant | Version expo-file-system incompatible | `npx expo install expo-file-system expo-haptics expo-notifications expo-sharing` |
| `No provisioning profile` | Profil expiré ou non configuré | Signing → Automatically manage signing, vérifier le Team |
| `Undefined symbol` | Pod manquant | `cd ios && pod install && cd ..` |
| Build rouge sans erreur claire | Cache Xcode corrompu | **Product → Clean Build Folder** (⇧⌘K) puis Archive |

---

## Build Android (APK / AAB release)

### Prérequis Android

- Android Studio installé
- Java 17+ (`java --version`)
- Un device Android connecté en mode développeur **ou** un émulateur actif

### Option A — APK direct (distribution hors Play Store)

```bash
cd ~/Downloads/ScoreKeeper/android
./gradlew assembleRelease
```

APK généré dans :
```
android/app/build/outputs/apk/release/app-release.apk
```

Installer sur un device :
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Option B — AAB (Android App Bundle pour le Play Store)

```bash
cd ~/Downloads/ScoreKeeper/android
./gradlew bundleRelease
```

AAB généré dans :
```
android/app/build/outputs/bundle/release/app-release.aab
```

C'est ce fichier `.aab` qu'on upload dans Google Play Console.

### Option C — Via Expo CLI

```bash
cd ~/Downloads/ScoreKeeper
npx expo run:android --variant release
```

### Signature

La signature est configurée dans `android/app/build.gradle` :
- Keystore : `android/app/scorekeeper.keystore` *(ou chemin configuré)*
- Alias : voir `build.gradle` → `signingConfigs.release`

> ⚠️ Ne jamais committer le fichier keystore dans Git. Il doit rester local ou dans un coffre sécurisé.

### Erreurs courantes Android

| Erreur | Cause | Solution |
|---|---|---|
| `SDK location not found` | Android SDK non configuré | Créer `android/local.properties` avec `sdk.dir=/Users/<toi>/Library/Android/sdk` |
| `Duplicate class` | Conflits de dépendances | `./gradlew clean` puis relancer |
| `App not installed` | APK signé différemment que l'APK existant | Désinstaller l'app du device puis réinstaller |

---

## Workflow complet (récapitulatif rapide)

```bash
# 1. Récupérer les dernières modifs
git pull origin main

# 2. Dépendances
npm install && cd ios && pod install && cd ..

# 3. iOS → Xcode → Archive → TestFlight
open ios/ScoreKeeper.xcworkspace

# 4. Android → APK
cd android && ./gradlew assembleRelease && cd ..
```
