import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getGames, getPlayers, getAllGameConfigs } from '../storage/StorageService';
import { Game, GameConfig, Player } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'History'>;

function formatDateRelative(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  if (days < 7) return ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][new Date(ts).getDay()];
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

const GAME_COLORS: Record<string, { bg: string; text: string }> = {
  skyjo:     { bg: '#E1F5EE', text: '#085041' },
  skullking: { bg: '#EEEDFE', text: '#3C3489' },
  flip7:     { bg: '#FAEEDA', text: '#633806' },
  uno:       { bg: '#FDE8E8', text: '#8B0000' },
  papayoo:   { bg: '#F0F0F0', text: '#444' },
  odin:      { bg: '#E8F0FE', text: '#1A4C8B' },
  trio:      { bg: '#FEF3E2', text: '#8B5E00' },
};

export default function HistoryScreen() {
  const navigation = useNavigation<NavProp>();
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [allConfigs, setAllConfigs] = useState<GameConfig[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

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

  const filteredGames = filter ? games.filter(g => g.gameConfigId === filter) : games;

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
        </View>

        {/* Filtres */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <View style={styles.filters}>
            <TouchableOpacity
              style={[styles.filterChip, filter === null && styles.filterChipActive]}
              onPress={() => setFilter(null)}
            >
              <Text style={[styles.filterText, filter === null && styles.filterTextActive]}>Toutes</Text>
            </TouchableOpacity>
            {allConfigs.map(g => (
              <TouchableOpacity
                key={g.id}
                style={[styles.filterChip, filter === g.id && styles.filterChipActive]}
                onPress={() => setFilter(g.id)}
              >
                <Text style={[styles.filterText, filter === g.id && styles.filterTextActive]}>{g.name}</Text>
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
              {filteredGames.map(game => {
                const config = allConfigs.find(c => c.id === game.gameConfigId);
                const winner = players.find(p => p.id === game.winnerId);
                const colors = GAME_COLORS[game.gameConfigId] ?? { bg: '#f0f0f0', text: '#444' };
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
                        <Text style={styles.gameCardName}>{config?.name ?? '?'}</Text>
                        <View style={[styles.gameCardBadge, { backgroundColor: colors.bg }]}>
                          <Text style={[styles.gameCardBadgeText, { color: colors.text }]}>
                            {game.rounds.length} manches
                          </Text>
                        </View>
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
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40, fontSize: 15 },
});