# ScoreKeeper — État du projet
*Dernière mise à jour : mars 2026 — Android ajouté*

---

## Stack technique

| Composant | Choix | Version |
|---|---|---|
| Framework | React Native + Expo (bare workflow) | SDK 54 |
| Langage | TypeScript | ~5.9.2 |
| Navigation | React Navigation (native stack) | ^7.x |
| Stockage local | AsyncStorage | 2.2.0 |
| Stockage cloud | iCloud KVS (module natif Swift custom) | — |
| Build / IDE | Xcode (SSD externe Hagibis) + VS Code + Android Studio | — |
| Device cible iOS | iPhone 17 Pro Max, iOS 26.3.1 | — |
| Device cible Android | Tout device Android API 24+ | — |

**Repo GitHub :** https://github.com/romanpki/ScoreKeeper
**Bundle Identifier (iOS) :** `com.roman.scorekeeper`
**Package Android :** `com.roman.scorekeeper`
**Compte Apple Developer payant :** actif depuis mars 2026

---

## Ce qui est fait ✅

### Application (code)

- **7 écrans** complets : Home, NewGame, Game, EndGame, History, Players, PlayerDetail
- **Navigation** React Navigation native stack, `headerShown: false` partout
- **Modèle de données** TypeScript complet : Player, Game, Round, RoundScore
- **StorageService** : CRUD complet AsyncStorage + double écriture iCloud KVS
- **Sync iCloud au démarrage** dans App.tsx (avec spinner, silencieux si iCloud indisponible)
- **Module natif iCloud KVS** en Swift + bridge Objective-C (ICloudKVS.swift, ICloudKVS.m, bridging header)
- **Capability iCloud Key-value storage** activée dans Xcode

### Jeux implémentés (5/7)

| Jeu | Direction | Fin | Règles spéciales |
|---|---|---|---|
| **Skyjo** | Low | Score ≥ 100 | Doublement si 1er ≠ min, sélecteur "A terminé en 1er", scores doublés en rouge |
| **Flip 7** | High | Score ≥ 200 | Sélecteur "Flip 7 réalisé par", ★ doré dans tableau, scores init à 0 |
| **UNO** | High | Score ≥ 500 | Simple |
| **Papayoo** | Low | N manches (N = nb joueurs) | Auto-complétion dernier joueur, total live / 250, validation bloquée si ≠ 250 |
| **Odin** | Low | Score ≥ cible (définie par joueurs) | Champ "Points cible" en NewGame, stocké dans metadata.targetScore |

### UX polish

- Noms des joueurs dans les cartes "Parties en cours" (HomeScreen)
- Tri alphabétique joueurs (PlayersScreen, NewGameScreen)
- Bouton "Abandonner" dans GameScreen
- Durée de partie en temps réel dans l'en-tête GameScreen
- Correction grammaticale "manche/manches" dans EndGameScreen
- Gestion des égalités dans le podium
- Bouton "Voir l'historique" dans EndGameScreen

### Distribution

- App buildée en Release et uploadée sur TestFlight (build "Internal Only")
- Compte Apple Developer payant actif
- Privacy policy hébergée sur GitHub : https://github.com/romanpki/ScoreKeeper/blob/main/privacy-policy.md
- Groupe TestFlight "Famille" (interne) et "Amis" (externe) créés

---

## Ce qui reste à faire 🔄

### Priorité immédiate — TestFlight externe

- [ ] **Re-archiver** dans Xcode → Distribute → **TestFlight & App Store** (le build actuel est "Internal Only", inaccessible aux testeurs externes)
- [ ] **Ajouter l'URL privacy policy** dans App Store Connect → Informations sur l'app
- [ ] **Ajouter le nouveau build** au groupe "Amis" (externe) dans TestFlight
- [ ] Attendre la **Beta App Review Apple** (~24-48h)
- [ ] Activer le **lien public** dans le groupe "Amis" pour partager sans gérer les emails
- [ ] Changer le rôle de Damien : "Assistance client" → **Developer** (ou le basculer en testeur externe)

### Infrastructure iCloud

- [ ] **Tester la sync iCloud end-to-end** entre deux appareils (la capability est activée, le code est en place, mais jamais testé en conditions réelles)
- [ ] Vérifier que `NSUbiquitousKeyValueStore` reçoit bien les notifications de changement distant

### Phase 4 — Jeux manquants

#### Skull King (complexe)
- `inputType: 'bid'` — nécessite une interface de saisie dédiée dans GameScreen
- Saisie par joueur : mise annoncée + plis réalisés + bonus (14, sirène, pirate, Skull King)
- Calcul : +20/pli si réussi, -10/pli d'écart si raté
- 10 manches fixes, donneur tournant

#### Trio (tracker de victoires)
- Pas de score numérique — tracker de victoires par manche
- Condition de fin : premier à X victoires
- `endValue: null` dans la config actuelle — à définir (configurable en NewGame comme Odin ?)

### Phase 5 — Stats avancées (basse priorité)

- [ ] Stats par jeu dans la fiche joueur (PlayerDetailScreen)
- [ ] Moyenne de score, meilleure partie, série de victoires
- [ ] Cache de stats avec invalidation incrémentale si > 200 parties

### Android ✅ (chantier initial terminé)

- Dossier `android/` généré via `npx expo prebuild --platform android`
- `src/storage/ICloudKVS.ts` : conditionnel `Platform.OS === 'ios'` → sur Android, toutes les opérations iCloud sont des no-ops silencieux
- Sur Android : stockage **AsyncStorage uniquement** (offline-first, pas de sync cloud)
- `App.tsx` : `<StatusBar style="auto" />` ajouté pour le bon rendu Android
- `app.json` : `package: "com.roman.scorekeeper"`, `versionCode: 1`, icône adaptative configurée

**Pour builder Android :**
```bash
# Dev (émulateur ou device)
cd ~/Downloads/ScoreKeeper && npx expo run:android

# Build Release
cd ~/Downloads/ScoreKeeper/android && ./gradlew bundleRelease
```

**Prochaines étapes Android (optionnel) :**
- [ ] Tester sur un vrai device Android
- [ ] Créer un keystore de signature pour la production
- [ ] Distribution Google Play (25 USD one-time) ou APK direct

---

## Architecture — rappels clés pour Claude Code

- Ne pas modifier `ios/Pods/` (généré automatiquement)
- Ne pas modifier `android/` manuellement — généré par `expo prebuild`, relancer si besoin
- Les fichiers Swift custom sont dans `ios/ScoreKeeper/` et survivent aux rebuilds Expo
- `package.json` : `"main": "index.js"` — ne pas modifier
- Xcode : `/Volumes/Hagibis/Applications/Xcode.app`
- Couleur principale : `const PURPLE = '#6c63ff'` (défini localement dans chaque écran)
- Pour ajouter un jeu avec scores à 0 par défaut : chercher les 2 occurrences de `papayoo || flip7 || odin` dans GameScreen
- Tout nouveau jeu `inputType: 'simple'` = juste ajouter la config dans `src/games/index.ts`
- Code spécifique iOS : utiliser `Platform.OS === 'ios'` (voir `ICloudKVS.ts` comme exemple)

---

## Commandes essentielles

```bash
# Dev iOS avec Metro (debug)
cd ~/Downloads/ScoreKeeper && npx expo start --ios

# Dev Android (émulateur ou device connecté)
cd ~/Downloads/ScoreKeeper && npx expo run:android

# Build Release iOS sur iPhone physique (production)
cd ~/Downloads/ScoreKeeper && npx expo run:ios --configuration Release --device

# Build Release Android (Google Play)
cd ~/Downloads/ScoreKeeper/android && ./gradlew bundleRelease

# Régénérer le dossier android/ (si app.json modifié)
cd ~/Downloads/ScoreKeeper && npx expo prebuild --platform android --no-install

# Ouvrir Xcode
open -a /Volumes/Hagibis/Applications/Xcode.app ~/Downloads/ScoreKeeper/ios/ScoreKeeper.xcworkspace

# Git push
cd ~/Downloads/ScoreKeeper && git add . && git commit -m "..." && git push
```
