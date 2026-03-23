# ScoreKeeper — Documentation technique & fonctionnelle
*Document de référence pour la continuité du développement*
*Dernière mise à jour : mars 2026*

---

## 1. Vue d'ensemble du projet

ScoreKeeper est une application iOS de comptage de points pour jeux de cartes, développée en React Native + Expo. Elle fonctionne entièrement hors-ligne avec stockage local (AsyncStorage), et dispose d'un module iCloud KVS natif pour la synchronisation entre appareils (en cours d'activation).

**Objectifs fonctionnels :**
- Gérer plusieurs jeux de cartes préconfigurés avec leurs règles propres
- Créer et gérer un carnet de joueurs avec statistiques
- Sauvegarder l'historique complet de chaque partie
- Synchroniser les données via iCloud entre appareils du même compte Apple

---

## 2. Stack technique

| Composant | Choix | Version |
|---|---|---|
| Framework | React Native + Expo | SDK 54 |
| Langage | TypeScript | ~5.9.2 |
| Navigation | React Navigation (native stack) | ^7.x |
| Stockage local | AsyncStorage | 2.2.0 |
| Stockage cloud | iCloud KVS (module natif Swift custom) | — |
| IDE | VS Code | — |
| Build | Xcode (sur SSD externe Hagibis) | — |
| Device | iPhone 17 Pro Max, iOS 26.3.1 | — |

**Emplacement du projet :** `~/Downloads/ScoreKeeper`
*(déplacé hors du Bureau pour éviter les conflits avec iCloud Drive)*

**Commandes essentielles :**
```bash
# Dev server + simulateur iOS
cd ~/Downloads/ScoreKeeper && npx expo start --ios

# Build et installer sur iPhone physique
cd ~/Downloads/ScoreKeeper && npx expo run:ios --device

# Ouvrir dans Xcode
open -a Xcode ~/Downloads/ScoreKeeper/ios/ScoreKeeper.xcworkspace
```

---

## 3. Architecture de l'application

### 3.1 Structure des dossiers

```
ScoreKeeper/
├── App.tsx                               ← Point d'entrée, sync iCloud au démarrage
├── index.js                              ← Registre du composant racine
├── ios/
│   └── ScoreKeeper/
│       ├── ICloudKVS.swift               ← Module natif iCloud KVS
│       ├── ICloudKVS.m                   ← Bridge Objective-C vers React Native
│       └── ScoreKeeper-Bridging-Header.h ← Header pour les imports RCT
└── src/
    ├── navigation/
    │   └── AppNavigator.tsx              ← Toutes les routes (React Navigation)
    ├── screens/
    │   ├── HomeScreen.tsx
    │   ├── NewGameScreen.tsx
    │   ├── GameScreen.tsx
    │   ├── EndGameScreen.tsx
    │   ├── HistoryScreen.tsx
    │   ├── PlayersScreen.tsx
    │   └── PlayerDetailScreen.tsx
    ├── games/
    │   └── index.ts                      ← Configurations des 7 jeux (GameConfig)
    ├── storage/
    │   ├── StorageService.ts             ← CRUD AsyncStorage + sync iCloud
    │   └── ICloudKVS.ts                 ← Wrapper TypeScript du module natif
    └── types/
        └── index.ts                      ← Modèle de données TypeScript
```

### 3.2 Navigation

7 routes dans `AppNavigator.tsx` avec `createNativeStackNavigator`, `headerShown: false` partout :

```typescript
export type RootStackParamList = {
  Home: undefined;
  NewGame: undefined;
  Game: { gameId: string };
  EndGame: { gameId: string };
  History: undefined;
  Players: undefined;
  PlayerDetail: { playerId: string };
};
```

Note : `id={undefined}` est requis sur `Stack.Navigator` pour contourner un bug de typage avec React Navigation SDK 55+.

### 3.3 Modèle de données (src/types/index.ts)

```typescript
interface Player {
  id: string;          // UUID
  name: string;
  color: string;       // hex ex: "#E74C3C"
  createdAt: number;   // timestamp ms
}

interface Game {
  id: string;
  gameConfigId: string;
  playerIds: string[];
  rounds: Round[];
  status: 'playing' | 'finished';
  winnerId: string | null;
  startedAt: number;
  finishedAt: number | null;
  metadata: Record<string, unknown>; // ex: { targetScore: 15 } pour Odin
}

interface Round {
  roundNumber: number;
  scores: Record<string, RoundScore>; // clé = playerId
  timestamp: number;
}

interface RoundScore {
  rawInput: Record<string, unknown>; // métadonnées spécifiques au jeu
  computed: number;
  cumulative: number;
}
```

**Utilisation de `rawInput` par jeu :**
- Skyjo : `{ value, first, doubled, original }` — tracé du doublement
- Flip 7 : `{ value, flip7: boolean }` — tracé du Flip 7 réalisé

---

## 4. StorageService (src/storage/StorageService.ts)

Couche d'abstraction unique pour toutes les opérations de persistance. Toute écriture écrit à la fois en AsyncStorage (local) ET sur iCloud KVS (cloud).

**Clés de stockage :**
```
scorekeeper_players
scorekeeper_games
```

**Fonctions exportées :**
- `getPlayers()` / `savePlayers()` / `addPlayer()` / `updatePlayer()` / `deletePlayer()`
- `getGames()` / `saveGames()` / `getGameById()` / `upsertGame()`
- `getCurrentGame()` — première partie `status === 'playing'`
- `getCurrentGames()` — toutes les parties `status === 'playing'`, triées par `startedAt` décroissant
- `syncFromCloud()` — synchronisation iCloud → local

**Stratégie de merge iCloud ("last write wins") :**
La fonction `mergeById<T>` compare par `id`. En cas de conflit, la version avec le timestamp le plus récent (`startedAt` pour Game, `createdAt` pour Player) gagne. Les entités inconnues localement sont simplement ajoutées.

---

## 5. Module iCloud KVS natif

### Pourquoi un module natif custom ?
Aucun package npm stable n'existe pour `NSUbiquitousKeyValueStore` avec Expo SDK 54. Le module est codé directement en Swift avec bridge Objective-C.

### ICloudKVS.swift
```swift
@objc(ICloudKVS)
class ICloudKVS: NSObject {
  private let store = NSUbiquitousKeyValueStore.default
  // setString, getString (Promise), removeValue, synchronize (Promise)
}
```

### ICloudKVS.m
```objc
RCT_EXTERN_MODULE(ICloudKVS, NSObject)
RCT_EXTERN_METHOD(setString:(NSString *)value forKey:(NSString *)key)
RCT_EXTERN_METHOD(getString:(NSString *)key resolver:... rejecter:...)
RCT_EXTERN_METHOD(removeValue:(NSString *)key)
RCT_EXTERN_METHOD(synchronize:... rejecter:...)
```

### ScoreKeeper-Bridging-Header.h
```objc
#import <React/RCTBridgeModule.h>
```

### ICloudKVS.ts (wrapper TypeScript)
Guard systématique `if (!ICloudKVS) return` — l'app fonctionne normalement si iCloud est indisponible (simulateur, compte non activé, etc.).

### Prérequis non encore complétés
- Activer la capability **iCloud → Key-value storage** dans Xcode (Signing & Capabilities → + Capability)
- Cette option n'apparaît dans Xcode que lorsque le compte Apple Developer payant est pleinement activé
- Refaire un build après activation

---

## 6. Configuration des jeux (src/games/index.ts)

```typescript
interface GameConfig {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  scoreDirection: 'low' | 'high';
  endCondition: 'threshold' | 'fixed' | 'rounds';
  endValue: number | null;
  orderMatters: boolean;
  inputType: 'simple' | 'bid' | 'bonus';
  specialRules: Record<string, unknown>;
}
```

| Jeu | Direction | endCondition | endValue | inputType | Implémenté |
|---|---|---|---|---|---|
| Skyjo | low | threshold | 100 | simple | ✅ |
| Skull King | high | fixed | 10 | bid | ❌ |
| Flip 7 | high | threshold | 200 | simple | ✅ |
| UNO | high | threshold | 500 | simple | ✅ |
| Papayoo | low | rounds | null | simple | ✅ |
| Odin | low | threshold | null* | simple | ✅ |
| Trio | high | fixed | null | simple | ❌ |

*Odin : `endValue` est `null` dans la config, la valeur réelle est dans `game.metadata.targetScore`.

---

## 7. Règles spéciales implémentées dans GameScreen

### Skyjo
- Sélecteur chips obligatoire "A terminé en 1er" (validation bloquée si non renseigné)
- Si le 1er n'a pas le score minimum → score × 2
- Scores doublés affichés en rouge dans le tableau + note explicative sous le tableau
- Scores partent de champ vide (pas de 0 par défaut)

### Papayoo
- Scores initialisés à `'0'` (pas de champ vide)
- Auto-complétion du dernier joueur : quand N-1 joueurs sont saisis, le dernier est rempli automatiquement avec `250 - somme_des_autres`
- Compteur live "Total saisi : X / 250" (rouge si ≠ 250, vert si = 250)
- Validation bloquée si total ≠ 250
- Fin de partie = `rounds.length >= playerIds.length`

### Flip 7
- Scores initialisés à `'0'`
- Sélecteur chips "Flip 7 réalisé par" avec option "Personne" (défaut)
- Le Flip 7 ne modifie pas le score calculé
- Les manches avec Flip 7 affichent ★ en doré dans le tableau
- `flip7Achieved` remis à `null` après chaque validation de manche

### Odin
- Scores initialisés à `'0'`
- Champ "Points cible" à l'étape 2 de NewGameScreen (pré-rempli à 15, modifiable)
- Stocké dans `game.metadata.targetScore`
- `checkEndCondition` lit `metadata.targetScore ?? config.endValue`
- Affiché dans l'en-tête : `Fin à ${metadata.targetScore ?? config.endValue}`

---

## 8. Logique de fin de partie (GameScreen)

```typescript
function checkEndCondition(rounds: Round[]): boolean {
  if (config.endCondition === 'threshold') {
    const threshold = (game.metadata as any)?.targetScore ?? config.endValue;
    return game.playerIds.some(id => {
      const total = rounds.reduce((s, r) => s + (r.scores[id]?.computed ?? 0), 0);
      return total >= threshold;
    });
  }
  if (config.endCondition === 'fixed' && config.endValue !== null) {
    return rounds.length >= config.endValue;
  }
  if (config.endCondition === 'rounds') {
    return rounds.length >= game.playerIds.length; // Papayoo
  }
  return false;
}
```

Après validation d'une manche, si `isFinished === true` :
- `game.status` passe à `'finished'`
- `game.winnerId` est calculé par `determineWinner` (tri par total selon `scoreDirection`)
- `game.finishedAt` = `Date.now()`
- Navigation automatique vers `EndGameScreen`

---

## 9. Patterns de code récurrents

**Rechargement au focus (tous les écrans de liste) :**
```typescript
useEffect(() => {
  const load = async () => { /* ... */ };
  load();
  const unsubscribe = navigation.addListener('focus', load);
  return unsubscribe;
}, [navigation]);
```

**Génération d'IDs :**
```typescript
function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
```

**Couleur principale :**
```typescript
const PURPLE = '#6c63ff'; // défini localement dans chaque fichier écran
```

**Scores par défaut à 0 :**
```typescript
// Dans useEffect (init)
g.playerIds.forEach(id => {
  init[id] = (g.gameConfigId === 'papayoo' || g.gameConfigId === 'flip7' || g.gameConfigId === 'odin') ? '0' : '';
});

// Dans handleValidate (reset après manche)
game.playerIds.forEach(id => {
  init[id] = (config.id === 'papayoo' || config.id === 'flip7' || config.id === 'odin') ? '0' : '';
});
```

**Guard iCloud (toutes les méthodes ICloudKVS.ts) :**
```typescript
if (!ICloudKVS) return; // fonctionne sans iCloud si non disponible
```

---

## 10. Compte Apple Developer & distribution

- **Compte Apple Developer payant** : enrollment effectué mars 2026
- **Bundle Identifier** : `com.roman.scorekeeper`
- **Team ID actuel** : Y7SPQ4G5NY (Personal Team — à remplacer par le compte payant)
- **App installée** sur iPhone 17 Pro Max — certifiée "Vérifié", pas d'expiration

### Pour TestFlight (en attente activation compte)
1. Xcode → **Product → Archive**
2. **Distribute App → TestFlight Internal Only**
3. Sélectionner le Team Account payant
4. Upload → App Store Connect → ajouter testeurs par email

---

## 11. Roadmap complète

### ✅ Phase 1 — MVP (terminé)
- Structure du projet, navigation, modèle de données, StorageService
- 7 écrans complets
- Jeux opérationnels : Skyjo, Papayoo, Flip 7, UNO, Odin
- App installée sur iPhone (build permanent)

### ✅ Phase 2 — Polish UX (terminé)
- Noms des joueurs dans les cartes "Parties en cours" de l'accueil
- Tri alphabétique dans PlayersScreen et NewGameScreen
- Bouton "Abandonner" dans GameScreen
- Durée de la partie en temps réel dans l'en-tête GameScreen
- Correction grammaticale "manche/manches" dans EndGameScreen
- Gestion des égalités dans le podium
- Bouton "Voir l'historique" dans EndGameScreen

### 🔄 Phase 3 — Infrastructure (en cours)
- ✅ Module natif iCloud KVS codé et compilé
- ✅ StorageService avec double écriture local + cloud
- ✅ Sync au démarrage dans App.tsx
- ⏳ Activer capability iCloud dans Xcode (attente activation compte Developer)
- ⏳ Build et Archive avec compte Developer payant
- ⏳ TestFlight pour distribution aux proches
- ⏳ Test sync entre deux appareils

### 📋 Phase 4 — Jeux à compléter

**Skull King** (`inputType: 'bid'`)
- Saisie : mise (plis annoncés) + plis réalisés + bonus (14, sirène, pirate, Skull King)
- Calcul : +20/pli si réussi, -10/pli d'écart si raté
- Donneur tournant, 10 manches fixes
- Nécessite une interface de saisie dédiée dans GameScreen

**Trio** (tracker de victoires)
- Pas de score numérique
- Tracker de victoires par manche
- Condition de fin : premier à X victoires

**Jeux personnalisés**
- Interface d'ajout d'un jeu custom dans l'app
- Formulaire : nom, joueurs min/max, direction, condition de fin, seuil
- Limité à `inputType: 'simple'`

### 📋 Phase 5 — Stats avancées
- Stats par jeu dans la fiche joueur
- Moyenne de score, meilleure partie, série de victoires dans l'historique
- Cache de stats avec invalidation incrémentale si > 200 parties

---

## 12. Points d'attention pour Claude Code

- Ne pas modifier les fichiers dans `ios/Pods/` (générés automatiquement)
- Les fichiers Swift custom (`ICloudKVS.swift`, `ICloudKVS.m`, `ScoreKeeper-Bridging-Header.h`) sont dans `ios/ScoreKeeper/` et sont préservés lors des rebuilds Expo
- `package.json` : `"main": "index.js"` — ne pas modifier
- SDK cible : **54** (compatible Expo Go 54.0.2)
- Xcode est sur un SSD externe : `/Volumes/Hagibis/Applications/Xcode.app`
- Tout ajout d'un nouveau jeu avec `inputType: 'simple'` ne nécessite que l'ajout de la config dans `src/games/index.ts` + éventuellement une règle spéciale dans GameScreen
- Pour ajouter le score par défaut à 0 à un nouveau jeu, chercher les 2 occurrences de la condition `papayoo || flip7 || odin` dans GameScreen
