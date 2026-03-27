import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getGames, saveGames, getPlayers, savePlayers, getAllGameConfigs } from '../storage/StorageService';
import { Game, GameConfig, Player } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

function formatDuration(startedAt: number, finishedAt: number): string {
  const diff = finishedAt - startedAt;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h${m > 0 ? `${m}min` : ''}`;
  if (m > 0) return `${m}min`;
  return '<1min';
}

function formatDateRelative(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  if (days < 7) return ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][new Date(ts).getDay()];
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}


export default function HistoryScreen() {
  const navigation = useNavigation<NavProp>();
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [allConfigs, setAllConfigs] = useState<GameConfig[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'game' | 'duration'>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);

  const PAGE_SIZE = 20;

  useEffect(() => {
    const load = async () => {
      const [allGames, allPlayers, configs] = await Promise.all([
        getGames(),
        getPlayers(),
        getAllGameConfigs(),
      ]);
      setGames(allGames.filter(g => g.status === 'finished').sort((a, b) =>
        (b.finishedAt ?? 0) - (a.finishedAt ?? 0)
      ));
      setPlayers(allPlayers);
      setAllConfigs(configs);
    };
    load();
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  const filteredGames = (() => {
    let result = filter ? games.filter(g => g.gameConfigId === filter) : games;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => {
        const gameName = allConfigs.find(c => c.id === g.gameConfigId)?.name?.toLowerCase() ?? '';
        const playerNames = g.playerIds.map(id => players.find(p => p.id === id)?.name?.toLowerCase() ?? '');
        return gameName.includes(q) || playerNames.some(n => n.includes(q));
      });
    }
    if (sortBy === 'game') {
      result = [...result].sort((a, b) => {
        const na = allConfigs.find(c => c.id === a.gameConfigId)?.name ?? '';
        const nb = allConfigs.find(c => c.id === b.gameConfigId)?.name ?? '';
        return na.localeCompare(nb);
      });
    } else if (sortBy === 'duration') {
      result = [...result].sort((a, b) => {
        const da = (a.finishedAt ?? a.startedAt) - a.startedAt;
        const db = (b.finishedAt ?? b.startedAt) - b.startedAt;
        return db - da;
      });
    }
    return result;
  })();

  const pagedGames = filteredGames.slice(0, visibleCount);
  const hasMore = filteredGames.length > visibleCount;

  // ── Import CSV ─────────────────────────────────────────────────────────────

  function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  async function handleImportCSV() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'public.comma-separated-values-text'],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;

      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length < 2) {
        Alert.alert('Fichier invalide', 'Le CSV ne contient aucune donnée.');
        return;
      }

      const [existingPlayers, existingGames, configs] = await Promise.all([
        getPlayers(),
        getGames(),
        getAllGameConfigs(),
      ]);

      let imported = 0;
      const newPlayers = [...existingPlayers];
      const newGames = [...existingGames];

      for (const line of lines.slice(1)) {
        const fields = parseCSVLine(line);
        if (fields.length < 4) continue;
        const [gameName, dateStr, playersStr, winnerName] = fields;

        const config = configs.find(c => c.name === gameName);
        if (!config) continue;

        const playerNames = playersStr.split(' / ').map(n => n.trim()).filter(Boolean);
        const playerIds: string[] = [];
        for (const name of playerNames) {
          let player = newPlayers.find(p => p.name === name);
          if (!player) {
            player = {
              id: Math.random().toString(36).slice(2) + Date.now().toString(36),
              name,
              color: '#6c63ff',
              createdAt: Date.now(),
            };
            newPlayers.push(player);
          }
          playerIds.push(player.id);
        }

        const winner = newPlayers.find(p => p.name === winnerName);
        const parts = dateStr.split('/');
        const startedAt = parts.length === 3
          ? new Date(+parts[2], +parts[1] - 1, +parts[0]).getTime()
          : Date.now();

        newGames.push({
          id: Math.random().toString(36).slice(2) + Date.now().toString(36),
          gameConfigId: config.id,
          playerIds,
          rounds: [],
          status: 'finished',
          winnerId: winner?.id ?? null,
          startedAt,
          finishedAt: startedAt,
          metadata: {},
        });
        imported++;
      }

      await savePlayers(newPlayers);
      await saveGames(newGames);
      setGames(newGames.filter(g => g.status === 'finished').sort((a, b) => (b.finishedAt ?? 0) - (a.finishedAt ?? 0)));
      setPlayers(newPlayers);
      Alert.alert('Import réussi', `${imported} partie${imported > 1 ? 's' : ''} importée${imported > 1 ? 's' : ''}.`);
    } catch {
      Alert.alert('Erreur', 'Impossible de lire le fichier CSV.');
    }
  }

  // ── Export CSV ─────────────────────────────────────────────────────────────

  async function handleExportCSV() {
    if (games.length === 0) {
      Alert.alert('Aucune partie', 'Il n\'y a rien à exporter.');
      return;
    }
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      Alert.alert('Non disponible', 'Le partage n\'est pas disponible sur cet appareil.');
      return;
    }
    const header = 'Jeu,Date,Joueurs,Gagnant,Manches,Durée\n';
    const rows = games.map(g => {
      const name = allConfigs.find(c => c.id === g.gameConfigId)?.name ?? '';
      const date = new Date(g.finishedAt ?? 0).toLocaleDateString('fr-FR');
      const playerNames = g.playerIds.map(id => players.find(p => p.id === id)?.name ?? '?').join(' / ');
      const winner = players.find(p => p.id === g.winnerId)?.name ?? '?';
      const rounds = g.rounds.length;
      const duration = g.finishedAt ? formatDuration(g.startedAt, g.finishedAt) : '';
      return `"${name}","${date}","${playerNames}","${winner}",${rounds},"${duration}"`;
    }).join('\n');
    const csv = header + rows;
    const path = `${FileSystem.cacheDirectory}scorekeeper_export.csv`;
    await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Exporter l\'historique' });
  }

  // ── Classement global ──────────────────────────────────────────────────────

  const playerStats = players.map(p => {
    const myGames = filteredGames.filter(g => g.playerIds.includes(p.id));
    const wins = myGames.filter(g => g.winnerId === p.id).length;
    return { player: p, wins, total: myGames.length };
  })
  .filter(s => s.total > 0)
  .sort((a, b) => b.wins - a.wins || b.total - a.total);

  // ── Rendu ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* En-tête */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Historique</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleImportCSV}>
              <Text style={styles.exportBtn}>↓ CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExportCSV}>
              <Text style={styles.exportBtn}>↑ CSV</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recherche */}
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un jeu ou un joueur..."
            placeholderTextColor="#bbb"
            value={searchQuery}
            onChangeText={v => { setSearchQuery(v); setVisibleCount(PAGE_SIZE); }}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Tri */}
        <View style={styles.sortRow}>
          {(['date', 'game', 'duration'] as const).map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.sortChip, sortBy === s && styles.sortChipActive]}
              onPress={() => { setSortBy(s); setVisibleCount(PAGE_SIZE); }}
            >
              <Text style={[styles.sortText, sortBy === s && styles.sortTextActive]}>
                {s === 'date' ? 'Date' : s === 'game' ? 'Jeu' : 'Durée'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Filtres */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filters}>
            <TouchableOpacity
              style={[styles.filterChip, filter === null && styles.filterChipActive]}
              onPress={() => { setFilter(null); setVisibleCount(PAGE_SIZE); }}
            >
              <Text style={[styles.filterText, filter === null && styles.filterTextActive]}>Toutes</Text>
            </TouchableOpacity>
            {allConfigs.map(g => (
              <TouchableOpacity
                key={g.id}
                style={[styles.filterChip, filter === g.id && styles.filterChipActive]}
                onPress={() => { setFilter(g.id); setVisibleCount(PAGE_SIZE); }}
              >
                <Text style={[styles.filterText, filter === g.id && styles.filterTextActive]}>{g.emoji ?? '🎮'} {g.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Classement global */}
        {playerStats.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>CLASSEMENT GLOBAL</Text>
            <View style={styles.rankingList}>
              {playerStats.map((s, i) => {
                const isFirst = i === 0;
                const rate = s.total > 0 ? Math.round((s.wins / s.total) * 100) : 0;
                return (
                  <View key={s.player.id} style={[styles.rankRow, isFirst && styles.rankRowFirst]}>
                    <Text style={[styles.rankNum, isFirst && styles.rankNumFirst]}>{i + 1}</Text>
                    <View style={[styles.rankAvatar, { backgroundColor: s.player.color + '33' }]}>
                      <Text style={[styles.rankAvatarText, { color: s.player.color }]}>
                        {s.player.name[0].toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.rankName, isFirst && styles.rankNameFirst]}>{s.player.name}</Text>
                    <View style={styles.rankRight}>
                      <Text style={[styles.rankWins, isFirst && styles.rankWinsFirst]}>
                        {s.wins} victoire{s.wins > 1 ? 's' : ''}
                      </Text>
                      <Text style={[styles.rankMeta, isFirst && styles.rankMetaFirst]}>
                        {s.total} partie{s.total > 1 ? 's' : ''} · {rate}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Parties récentes */}
        {filteredGames.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>PARTIES RÉCENTES</Text>
            <View style={styles.gamesList}>
              {pagedGames.map(game => {
                const config = allConfigs.find(c => c.id === game.gameConfigId);
                const winner = players.find(p => p.id === game.winnerId);
                const tc = config?.themeColor ?? '#666666';
                const colors = { bg: tc + '22', text: tc };
                const others = game.playerIds
                  .filter(id => id !== game.winnerId)
                  .map(id => {
                    const p = players.find(pl => pl.id === id);
                    const total = game.rounds.reduce((s, r) => s + (r.scores[id]?.computed ?? 0), 0);
                    return `${p?.name ?? '?'} ${total}`;
                  });
                const winnerTotal = game.rounds.reduce((s, r) =>
                  s + (r.scores[game.winnerId ?? '']?.computed ?? 0), 0);

                return (
                  <TouchableOpacity
                    key={game.id}
                    style={styles.gameCard}
                    onPress={() => navigation.navigate('EndGame', { gameId: game.id })}
                  >
                    <View style={styles.gameCardTop}>
                      <View style={styles.gameCardLeft}>
                        <Text style={styles.gameCardName}>{config?.emoji ?? '🎮'} {config?.name ?? '?'}</Text>
                        <View style={[styles.gameCardBadge, { backgroundColor: colors.bg }]}>
                          <Text style={[styles.gameCardBadgeText, { color: colors.text }]}>
                            {game.rounds.length} manches
                          </Text>
                        </View>
                        {game.finishedAt && (
                          <View style={styles.gameCardDurationBadge}>
                            <Text style={styles.gameCardDurationText}>
                              {formatDuration(game.startedAt, game.finishedAt)}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.gameCardDate}>
                        {formatDateRelative(game.finishedAt ?? game.startedAt)}
                      </Text>
                    </View>
                    <View style={styles.gameCardScores}>
                      <Text style={styles.starIcon}>★</Text>
                      <Text style={styles.winnerScore}>
                        {winner?.name ?? '?'} {winnerTotal}
                      </Text>
                      <Text style={styles.dot}> · </Text>
                      <Text style={styles.othersScore} numberOfLines={1}>
                        {others.join(' · ')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {hasMore && (
          <TouchableOpacity
            style={styles.loadMoreBtn}
            onPress={() => setVisibleCount(c => c + PAGE_SIZE)}
          >
            <Text style={styles.loadMoreText}>
              Voir plus ({filteredGames.length - visibleCount} restantes)
            </Text>
          </TouchableOpacity>
        )}

        {filteredGames.length === 0 && (
          <Text style={styles.empty}>Aucune partie enregistrée.</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';
const GREEN = '#0F6E56';
const GREEN_BG = '#E1F5EE';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f7f7' },
  scroll: { padding: 20, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 4 },
  back: { fontSize: 28, color: PURPLE, lineHeight: 32 },
  title: { fontSize: 18, fontWeight: '500', color: '#1a1a1a' },
  filtersScroll: { marginHorizontal: -20 },
  filters: { flexDirection: 'row', gap: 6, paddingHorizontal: 20 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, backgroundColor: '#f0f0f0',
    borderWidth: 1, borderColor: '#e0e0e0',
  },
  filterChipActive: { backgroundColor: '#EEEDFE', borderColor: '#CECBF6' },
  filterText: { fontSize: 13, color: '#888' },
  filterTextActive: { color: PURPLE, fontWeight: '500' },
  sectionLabel: {
    fontSize: 13, fontWeight: '500', color: '#aaa',
    letterSpacing: 0.5, marginBottom: -8,
  },
  rankingList: { gap: 6 },
  rankRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#f0f0f0', borderRadius: 10, padding: 10,
  },
  rankRowFirst: { backgroundColor: GREEN_BG, borderWidth: 1, borderColor: '#9FE1CB' },
  rankNum: { fontSize: 14, fontWeight: '500', color: '#888', width: 20, textAlign: 'center' },
  rankNumFirst: { color: GREEN },
  rankAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rankAvatarText: { fontSize: 13, fontWeight: '500' },
  rankName: { flex: 1, fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
  rankNameFirst: { color: '#04342C' },
  rankRight: { alignItems: 'flex-end' },
  rankWins: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  rankWinsFirst: { color: '#085041' },
  rankMeta: { fontSize: 11, color: '#888', marginTop: 1 },
  rankMetaFirst: { color: GREEN },
  gamesList: { gap: 6 },
  gameCard: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 12 },
  gameCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  gameCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gameCardName: { fontSize: 13, fontWeight: '500', color: '#1a1a1a' },
  gameCardBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  gameCardBadgeText: { fontSize: 11 },
  gameCardDate: { fontSize: 11, color: '#aaa' },
  gameCardScores: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starIcon: { fontSize: 12, color: '#EF9F27' },
  winnerScore: { fontSize: 12, fontWeight: '500', color: '#1a1a1a' },
  dot: { fontSize: 11, color: '#ccc' },
  othersScore: { fontSize: 11, color: '#888', flex: 1 },
  exportBtn: { fontSize: 13, color: PURPLE, fontWeight: '500' },
  headerActions: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
  loadMoreBtn: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0',
    paddingVertical: 14, alignItems: 'center',
  },
  loadMoreText: { fontSize: 14, color: PURPLE, fontWeight: '600' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 12, borderWidth: 1, borderColor: '#e0e0e0',
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#1a1a1a' },
  sortRow: { flexDirection: 'row', gap: 6 },
  sortChip: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, backgroundColor: '#f0f0f0',
    borderWidth: 1, borderColor: '#e0e0e0',
  },
  sortChipActive: { backgroundColor: '#EEEDFE', borderColor: '#CECBF6' },
  sortText: { fontSize: 13, color: '#888' },
  sortTextActive: { color: PURPLE, fontWeight: '500' },
  gameCardDurationBadge: {
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 8, backgroundColor: '#f7f7f7',
    borderWidth: 1, borderColor: '#e8e8e8',
  },
  gameCardDurationText: { fontSize: 10, color: '#999' },
});