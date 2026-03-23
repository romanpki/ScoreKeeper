# ScoreKeeper — État du projet
*Dernière mise à jour : mars 2026*

---

## Stack technique

| Composant | Choix | Version |
|---|---|---|
| Framework | React Native + Expo (bare workflow) | SDK 54 |
| Langage | TypeScript | ~5.9.2 |
| Navigation | React Navigation (native stack) | ^7.x |
| Stockage local | AsyncStorage | 2.2.0 |
| Stockage cloud | iCloud KVS (module natif Swift custom) | — |
| Build / IDE | Xcode (SSD externe Hagibis) + VS Code | — |
| Device cible | iPhone 17 Pro Max, iOS 26.3.1 | — |

**Repo GitHub :** https://github.com/romanpki/ScoreKeeper
**Bundle Identifier :** `com.roman.scorekeeper`
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

### Futur — Android

- Le projet est en bare workflow Expo → une version Android est possible
- Commande : `npx expo run:android`
- Le module iCloud KVS est iOS uniquement → prévoir une alternative pour Android (ex: Google Drive API ou désactivation conditionnelle par plateforme)
- À traiter comme un chantier séparé

---

## Architecture — rappels clés pour Claude Code

- Ne pas modifier `ios/Pods/` (généré automatiquement)
- Les fichiers Swift custom sont dans `ios/ScoreKeeper/` et survivent aux rebuilds Expo
- `package.json` : `"main": "index.js"` — ne pas modifier
- Xcode : `/Volumes/Hagibis/Applications/Xcode.app`
- Couleur principale : `const PURPLE = '#6c63ff'` (défini localement dans chaque écran)
- Pour ajouter un jeu avec scores à 0 par défaut : chercher les 2 occurrences de `papayoo || flip7 || odin` dans GameScreen
- Tout nouveau jeu `inputType: 'simple'` = juste ajouter la config dans `src/games/index.ts`

---

## Commandes essentielles

```bash
# Dev avec Metro (debug)
cd ~/Downloads/ScoreKeeper && npx expo start --ios

# Build Release sur iPhone physique (production)
cd ~/Downloads/ScoreKeeper && npx expo run:ios --configuration Release --device

# Ouvrir Xcode
open -a /Volumes/Hagibis/Applications/Xcode.app ~/Downloads/ScoreKeeper/ios/ScoreKeeper.xcworkspace

# Git push
cd ~/Downloads/ScoreKeeper && git add . && git commit -m "..." && git push
```
