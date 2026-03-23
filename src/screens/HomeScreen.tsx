import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GAME_CONFIGS } from '../games';
import { getCurrentGames, getGames, saveGames, getPlayers } from '../storage/StorageService';
import { Game, Player } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const [currentGames, setCurrentGames] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const load = async () => {
      const current = await getCurrentGames();
      setCurrentGames(current);
      const all = await getGames();
      const finished = all
        .filter(g => g.status === 'finished')
        .sort((a, b) => (b.finishedAt ?? 0) - (a.finishedAt ?? 0))
        .slice(0, 3);
      setRecentGames(finished);
      const allPlayers = await getPlayers();
setPlayers(allPlayers);
    };
    load();
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  async function handleAbandon(gameId: string) {
    Alert.alert(
      'Abandonner la partie ?',
      'La partie sera supprimée définitivement.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Abandonner', style: 'destructive',
          onPress: async () => {
            const all = await getGames();
            await saveGames(all.filter(g => g.id !== gameId));
            const current = await getCurrentGames();
            setCurrentGames(current);
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>ScoreKeeper</Text>
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Players')}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Bouton principal */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('NewGame')}
        >
          <Text style={styles.primaryBtnText}>+ Nouvelle partie</Text>
        </TouchableOpacity>

        {/* Parties en cours */}
        {currentGames.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {currentGames.length > 1 ? 'Parties en cours' : 'Partie en cours'}
            </Text>
            {currentGames.map(game => (
              <View key={game.id} style={styles.currentGameCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Game', { gameId: game.id })}
                >
                  <Text style={styles.currentGameName}>
                    {GAME_CONFIGS.find(g => g.id === game.gameConfigId)?.name ?? 'Jeu'}
                  </Text>
                 <Text style={styles.currentGameSub}>
  {game.playerIds
    .map(id => players.find(p => p.id === id)?.name ?? '?')
    .join(', ')} · Manche {game.rounds.length}
</Text>
                  <Text style={styles.currentGameResume}>Reprendre →</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.abandonBtn}
                  onPress={() => handleAbandon(game.id)}
                >
                  <Text style={styles.abandonBtnText}>Abandonner</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Dernières parties */}
        {recentGames.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Dernières parties</Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={styles.seeAll}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            {recentGames.map(game => {
  const winner = players.find(p => p.id === game.winnerId);
  const others = game.playerIds
    .filter(id => id !== game.winnerId)
    .map(id => players.find(p => p.id === id)?.name ?? '?')
    .join(', ');
  return (
    <TouchableOpacity
      key={game.id}
      style={styles.recentCard}
      onPress={() => navigation.navigate('EndGame', { gameId: game.id })}
    >
      <Text style={styles.recentName}>
        {GAME_CONFIGS.find(g => g.id === game.gameConfigId)?.name ?? 'Jeu'}
        <Text style={styles.recentManches}> · {game.rounds.length} manches</Text>
      </Text>
      <Text style={styles.recentSub}>
        🏆 {winner?.name ?? '?'} · {others}
      </Text>
    </TouchableOpacity>
  );
})}
          </View>
        )}

        {/* Jeux disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jeux disponibles</Text>
          <View style={styles.chips}>
            {GAME_CONFIGS.map(game => (
              <View key={game.id} style={styles.chip}>
                <Text style={styles.chipText}>{game.name}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.chipAdd}>
              <Text style={styles.chipAddText}>+ Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  profileBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: PURPLE + '18',
    borderWidth: 1, borderColor: PURPLE + '44',
    alignItems: 'center', justifyContent: 'center',
  },
  profileIcon: { fontSize: 18 },
  scroll: { padding: 20, gap: 24 },
  primaryBtn: {
    backgroundColor: PURPLE,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  section: { gap: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  seeAll: { fontSize: 14, color: PURPLE },
  currentGameCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: PURPLE,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  currentGameName: { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  currentGameSub: { fontSize: 13, color: '#888', marginTop: 4 },
  currentGameResume: { fontSize: 14, color: PURPLE, marginTop: 8, fontWeight: '600' },
  abandonBtn: { marginTop: 10, alignSelf: 'flex-start' },
  abandonBtnText: { fontSize: 12, color: '#bbb' },
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  recentName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  recentSub: { fontSize: 13, color: '#888', marginTop: 2 },
  recentManches: { fontSize: 13, color: '#aaa', fontWeight: '400' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipText: { fontSize: 14, color: '#333' },
  chipAdd: {
    backgroundColor: PURPLE + '18',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipAddText: { fontSize: 14, color: PURPLE, fontWeight: '600' },
});