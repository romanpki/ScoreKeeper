import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getPlayers, updatePlayer, deletePlayer, getGames } from '../storage/StorageService';
import { Player, Game } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'PlayerDetail'>;
type RouteType = RouteProp<RootStackParamList, 'PlayerDetail'>;

const COLORS = [
  '#E74C3C','#E91E63','#9B59B6','#3498DB',
  '#1ABC9C','#2ECC71','#F39C12','#E67E22',
  '#795548','#607D8B',
];

export default function PlayerDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { playerId } = route.params;

  const [player, setPlayer] = useState<Player | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [editName, setEditName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [allPlayers, allGames] = await Promise.all([getPlayers(), getGames()]);
    const p = allPlayers.find(pl => pl.id === playerId) ?? null;
    setPlayer(p);
    setEditName(p?.name ?? '');
    setGames(allGames);
  }

  if (!player) return null;

  const myGames = games.filter(g => g.playerIds.includes(playerId));
  const finishedGames = myGames.filter(g => g.status === 'finished');
  const wins = finishedGames.filter(g => g.winnerId === playerId).length;
  const winRate = finishedGames.length > 0
    ? Math.round((wins / finishedGames.length) * 100)
    : 0;
  const hasActiveGame = myGames.some(g => g.status === 'playing');

  // ── Renommer ──────────────────────────────────────────────────────────────────

  async function handleRename() {
    const name = editName.trim();
    if (!name || name === player.name) { setIsEditing(false); return; }
    const updated = { ...player, name };
    await updatePlayer(updated);
    setPlayer(updated);
    setIsEditing(false);
  }

  // ── Changer couleur ───────────────────────────────────────────────────────────

  async function handleColor(color: string) {
    const updated = { ...player, color };
    await updatePlayer(updated);
    setPlayer(updated);
  }

  // ── Supprimer ────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (hasActiveGame) {
      Alert.alert('Impossible', 'Ce joueur a une partie en cours.');
      return;
    }
    Alert.alert(
      `Supprimer ${player.name} ?`,
      'Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive',
          onPress: async () => {
            await deletePlayer(playerId);
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>

      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fiche joueur</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Avatar + nom */}
        <View style={styles.profileBlock}>
          <View style={[styles.avatarLarge, { backgroundColor: player.color + '22' }]}>
            <Text style={[styles.avatarLargeText, { color: player.color }]}>
              {player.name[0].toUpperCase()}
            </Text>
          </View>
          {isEditing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                autoFocus
                onSubmitEditing={handleRename}
                returnKeyType="done"
              />
              <TouchableOpacity style={styles.editSaveBtn} onPress={handleRename}>
                <Text style={styles.editSaveBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.playerName}>{player.name} <Text style={styles.editHint}>✎</Text></Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{finishedGames.length}</Text>
            <Text style={styles.statLabel}>Parties</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{wins}</Text>
            <Text style={styles.statLabel}>Victoires</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{winRate}%</Text>
            <Text style={styles.statLabel}>Taux de victoire</Text>
          </View>
        </View>

        {/* Couleur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Couleur</Text>
          <View style={styles.colorGrid}>
            {COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[styles.colorSwatch, { backgroundColor: color },
                  player.color === color && styles.colorSwatchSelected]}
                onPress={() => handleColor(color)}
              />
            ))}
          </View>
        </View>

        {/* Supprimer */}
        <TouchableOpacity
          style={[styles.deleteBtn, hasActiveGame && styles.deleteBtnDisabled]}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteBtnText, hasActiveGame && styles.deleteBtnTextDisabled]}>
            Supprimer {player.name}
          </Text>
        </TouchableOpacity>
        {hasActiveGame && (
          <Text style={styles.deleteNote}>
            Impossible — ce joueur a une partie en cours.
          </Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  back: { fontSize: 28, color: PURPLE, lineHeight: 32 },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#1a1a1a' },
  scroll: { padding: 20, gap: 20 },
  profileBlock: { alignItems: 'center', gap: 12, paddingVertical: 8 },
  avatarLarge: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLargeText: { fontSize: 32, fontWeight: '500' },
  playerName: { fontSize: 22, fontWeight: '600', color: '#1a1a1a', textAlign: 'center' },
  editHint: { fontSize: 16, color: '#aaa' },
  editRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  editInput: {
    borderWidth: 1, borderColor: PURPLE, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8,
    fontSize: 18, color: '#1a1a1a', minWidth: 160,
  },
  editSaveBtn: {
    backgroundColor: PURPLE, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  editSaveBtnText: { color: '#fff', fontWeight: '600' },
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12,
    padding: 14, alignItems: 'center', gap: 4,
  },
  statValue: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  statLabel: { fontSize: 12, color: '#888' },
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorSwatch: { width: 36, height: 36, borderRadius: 18 },
  colorSwatchSelected: {
    borderWidth: 3, borderColor: '#1a1a1a',
    transform: [{ scale: 1.15 }],
  },
  deleteBtn: {
    borderWidth: 1, borderColor: '#E74C3C',
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  deleteBtnDisabled: { borderColor: '#ddd' },
  deleteBtnText: { color: '#E74C3C', fontSize: 15, fontWeight: '500' },
  deleteBtnTextDisabled: { color: '#ccc' },
  deleteNote: { textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: -12 },
});