import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getPlayers, addPlayer, getGames } from '../storage/StorageService';
import { Player, Game } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Players'>;

const COLORS = ['#E74C3C','#3498DB','#2ECC71','#F39C12','#9B59B6','#1ABC9C','#E67E22','#E91E63'];

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function PlayersScreen() {
  const navigation = useNavigation<NavProp>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
  load();
  const unsubscribe = navigation.addListener('focus', load);
  return unsubscribe;
}, [navigation]);

  async function load() {
    const [p, g] = await Promise.all([getPlayers(), getGames()]);
    // Tri par fréquence de jeu
    const sorted = [...p].sort((a, b) => a.name.localeCompare(b.name));
    setPlayers(sorted);
    setGames(g);
  }

  function getStats(playerId: string) {
    const myGames = games.filter(g => g.playerIds.includes(playerId) && g.status === 'finished');
    const wins = myGames.filter(g => g.winnerId === playerId).length;
    return { total: myGames.length, wins };
  }

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    const color = COLORS[players.length % COLORS.length];
    const player: Player = { id: generateId(), name, color, createdAt: Date.now() };
    await addPlayer(player);
    setNewName('');
    load();
  }

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>

      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Joueurs</Text>
        <Text style={styles.count}>{players.length} joueurs</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Barre de recherche */}
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un joueur..."
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Liste des joueurs */}
        <View style={styles.list}>
          {filtered.map(player => {
            const stats = getStats(player.id);
            return (
              <TouchableOpacity
                key={player.id}
                style={styles.playerRow}
                onPress={() => navigation.navigate('PlayerDetail', { playerId: player.id })}
              >
                <View style={[styles.avatar, { backgroundColor: player.color + '22' }]}>
                  <Text style={[styles.avatarText, { color: player.color }]}>
                    {player.name[0].toUpperCase()}
                  </Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerStats}>
                    {stats.total} partie{stats.total > 1 ? 's' : ''}
                    {stats.total > 0 ? ` · ${stats.wins} victoire${stats.wins > 1 ? 's' : ''}` : ''}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            );
          })}
          {filtered.length === 0 && search.length > 0 && (
            <Text style={styles.empty}>Aucun joueur trouvé.</Text>
          )}
        </View>

        {/* Ajouter un joueur */}
        <View style={styles.addSection}>
          <Text style={styles.addTitle}>Ajouter un joueur</Text>
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              placeholder="Prénom"
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Tap sur un joueur pour voir ses stats, changer sa couleur, ou le supprimer.
            Les joueurs avec des parties en cours ne peuvent pas être supprimés.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  back: { fontSize: 28, color: PURPLE, lineHeight: 32 },
  title: { flex: 1, fontSize: 18, fontWeight: '500', color: '#1a1a1a' },
  count: { fontSize: 13, color: '#888' },
  scroll: { padding: 16, gap: 16 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 12, borderWidth: 1, borderColor: '#e0e0e0',
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#1a1a1a' },
  list: { gap: 2 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 10, borderRadius: 10, backgroundColor: '#fff',
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '500' },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
  playerStats: { fontSize: 12, color: '#888', marginTop: 2 },
  chevron: { fontSize: 20, color: '#ccc' },
  empty: { textAlign: 'center', color: '#aaa', paddingVertical: 20 },
  addSection: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 10,
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  addTitle: { fontSize: 13, fontWeight: '500', color: '#888' },
  addRow: { flexDirection: 'row', gap: 8 },
  addInput: {
    flex: 1, borderWidth: 1, borderColor: '#e0e0e0',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: PURPLE, borderRadius: 8,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  infoBox: {
    backgroundColor: '#f0f0f0', borderRadius: 10, padding: 12,
  },
  infoText: { fontSize: 12, color: '#888', lineHeight: 18 },
});