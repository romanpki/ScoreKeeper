import AsyncStorage from '@react-native-async-storage/async-storage';
import { Player, Game, GameConfig } from '../types';
import { GAME_CONFIGS } from '../games';
import ICloudKVS from './ICloudKVS';

const KEYS = {
  PLAYERS: 'scorekeeper_players',
  GAMES: 'scorekeeper_games',
  CUSTOM_GAME_CONFIGS: 'scorekeeper_custom_game_configs',
};

// ── Sync iCloud ───────────────────────────────────────────────────────────────

async function writeToCloud(key: string, value: string): Promise<void> {
  try {
    await ICloudKVS.setString(key, value);
  } catch (e) {
    // iCloud non disponible — on continue sans erreur
  }
}

export async function syncFromCloud(): Promise<void> {
  try {
    await ICloudKVS.synchronize();
    const cloudPlayers = await ICloudKVS.getString(KEYS.PLAYERS);
    const cloudGames = await ICloudKVS.getString(KEYS.GAMES);

    if (cloudPlayers) {
      const local = await AsyncStorage.getItem(KEYS.PLAYERS);
      const localData = local ? JSON.parse(local) as Player[] : [];
      const cloudData = JSON.parse(cloudPlayers) as Player[];

      // Merge : last write wins par UUID
      const merged = mergeById(localData, cloudData);
      await AsyncStorage.setItem(KEYS.PLAYERS, JSON.stringify(merged));
    }

    if (cloudGames) {
      const local = await AsyncStorage.getItem(KEYS.GAMES);
      const localData = local ? JSON.parse(local) as Game[] : [];
      const cloudData = JSON.parse(cloudGames) as Game[];

      const merged = mergeById(localData, cloudData);
      await AsyncStorage.setItem(KEYS.GAMES, JSON.stringify(merged));
    }
  } catch (e) {
    // iCloud non disponible — on continue avec les données locales
  }
}

function mergeById<T extends { id: string; startedAt?: number; createdAt?: number }>(
  local: T[],
  cloud: T[]
): T[] {
  const map = new Map<string, T>();
  // Local d'abord
  local.forEach(item => map.set(item.id, item));
  // Cloud écrase si plus récent
  cloud.forEach(item => {
    const existing = map.get(item.id);
    if (!existing) {
      map.set(item.id, item);
    } else {
      const existingTs = existing.startedAt ?? existing.createdAt ?? 0;
      const itemTs = item.startedAt ?? item.createdAt ?? 0;
      if (itemTs > existingTs) {
        map.set(item.id, item);
      }
    }
  });
  return Array.from(map.values());
}

// ── Joueurs ───────────────────────────────────────────────────────────────────

export async function getPlayers(): Promise<Player[]> {
  const raw = await AsyncStorage.getItem(KEYS.PLAYERS);
  return raw ? JSON.parse(raw) : [];
}

export async function savePlayers(players: Player[]): Promise<void> {
  const json = JSON.stringify(players);
  await AsyncStorage.setItem(KEYS.PLAYERS, json);
  await writeToCloud(KEYS.PLAYERS, json);
}

export async function addPlayer(player: Player): Promise<void> {
  const players = await getPlayers();
  await savePlayers([...players, player]);
}

export async function updatePlayer(updated: Player): Promise<void> {
  const players = await getPlayers();
  await savePlayers(players.map(p => p.id === updated.id ? updated : p));
}

export async function deletePlayer(id: string): Promise<void> {
  const players = await getPlayers();
  await savePlayers(players.filter(p => p.id !== id));
}

// ── Parties ───────────────────────────────────────────────────────────────────

export async function getGames(): Promise<Game[]> {
  const raw = await AsyncStorage.getItem(KEYS.GAMES);
  return raw ? JSON.parse(raw) : [];
}

export async function saveGames(games: Game[]): Promise<void> {
  const json = JSON.stringify(games);
  await AsyncStorage.setItem(KEYS.GAMES, json);
  await writeToCloud(KEYS.GAMES, json);
}

export async function getGameById(id: string): Promise<Game | null> {
  const games = await getGames();
  return games.find(g => g.id === id) ?? null;
}

export async function upsertGame(game: Game): Promise<void> {
  const games = await getGames();
  const idx = games.findIndex(g => g.id === game.id);
  if (idx >= 0) {
    games[idx] = game;
  } else {
    games.push(game);
  }
  await saveGames(games);
}

export async function getCurrentGames(): Promise<Game[]> {
  const games = await getGames();
  return games.filter(g => g.status === 'playing')
    .sort((a, b) => b.startedAt - a.startedAt);
}

// ── Jeux custom ───────────────────────────────────────────────────────────────

export async function getCustomGameConfigs(): Promise<GameConfig[]> {
  const raw = await AsyncStorage.getItem(KEYS.CUSTOM_GAME_CONFIGS);
  return raw ? JSON.parse(raw) : [];
}

export async function saveCustomGameConfigs(configs: GameConfig[]): Promise<void> {
  const json = JSON.stringify(configs);
  await AsyncStorage.setItem(KEYS.CUSTOM_GAME_CONFIGS, json);
  await writeToCloud(KEYS.CUSTOM_GAME_CONFIGS, json);
}

export async function addCustomGameConfig(config: GameConfig): Promise<void> {
  const configs = await getCustomGameConfigs();
  await saveCustomGameConfigs([...configs, config]);
}

export async function deleteCustomGameConfig(id: string): Promise<void> {
  const configs = await getCustomGameConfigs();
  await saveCustomGameConfigs(configs.filter(c => c.id !== id));
}

export async function getAllGameConfigs(): Promise<GameConfig[]> {
  const customs = await getCustomGameConfigs();
  return [...GAME_CONFIGS, ...customs];
}