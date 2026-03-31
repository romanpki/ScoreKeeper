import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Swipeable } from 'react-native-gesture-handler';
import { getPlayers, addPlayer, deletePlayer, getCurrentGames, getGames, saveGames } from '../storage/StorageService';
import { Player, Game } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Players'>;

const COLORS = ['#E74C3C','#3498DB','#2ECC71','#F39C12','#9B59B6','#1ABC9C','#E67E22','#E91E63'];

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function PlayersScreen() {
  const navigation = useNavigation<NavProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
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

  async function handleDelete(playerId: string, playerName: string) {
    const currentGames = await getCurrentGames();
    const hasActiveGame = currentGames.some(g => g.playerIds.includes(playerId));
    const message = hasActiveGame
      ? t('deletePlayerInGame')
      : t('irreversible');
    Alert.alert(t('deletePlayerTitle', { name: playerName }), message, [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'), style: 'destructive',
        onPress: async () => {
          if (hasActiveGame) {
            const allGames = await getGames();
            await saveGames(allGames.filter(g => !g.playerIds.includes(playerId)));
          }
          await deletePlayer(playerId);
          load();
        },
      },
    ]);
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

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.safe}>

      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('playersTitle')}</Text>
        <Text style={styles.count}>{players.length} {t('players')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Barre de recherche */}
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlayerPlaceholder')}
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
              <Swipeable
                key={player.id}
                renderRightActions={() => (
                  <TouchableOpacity
                    style={styles.deleteAction}
                    onPress={() => handleDelete(player.id, player.name)}
                  >
                    <Text style={styles.deleteActionText}>{t('delete')}</Text>
                  </TouchableOpacity>
                )}
              >
                <TouchableOpacity
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
                      {stats.total} {stats.total > 1 ? t('games') : t('game')}
                      {stats.total > 0 ? ` · ${stats.wins} ${stats.wins > 1 ? t('wins') : t('win')}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              </Swipeable>
            );
          })}
          {filtered.length === 0 && search.length > 0 && (
            <Text style={styles.empty}>{t('noPlayerFound')}</Text>
          )}
        </View>

        {/* Ajouter un joueur */}
        <View style={styles.addSection}>
          <Text style={styles.addTitle}>{t('addPlayerTitle')}</Text>
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              placeholder={t('firstNamePlaceholder')}
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>{t('addBtn')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{t('playersInfoText')}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';

function makeStyles(colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      paddingHorizontal: 16, paddingVertical: 14,
      backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border2,
    },
    back: { fontSize: 28, color: PURPLE, lineHeight: 32 },
    title: { flex: 1, fontSize: 18, fontWeight: '500', color: colors.text },
    count: { fontSize: 13, color: colors.textSub },
    scroll: { padding: 16, gap: 16 },
    searchRow: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: colors.searchBg, borderRadius: 10,
      paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border,
    },
    searchIcon: { fontSize: 14 },
    searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: colors.text },
    list: { gap: 2 },
    playerRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      padding: 10, borderRadius: 10, backgroundColor: colors.surface,
    },
    avatar: {
      width: 40, height: 40, borderRadius: 20,
      alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontSize: 15, fontWeight: '500' },
    playerInfo: { flex: 1 },
    playerName: { fontSize: 14, fontWeight: '500', color: colors.text },
    playerStats: { fontSize: 12, color: colors.textSub, marginTop: 2 },
    chevron: { fontSize: 20, color: colors.border },
    empty: { textAlign: 'center', color: colors.textMuted, paddingVertical: 20 },
    addSection: {
      backgroundColor: colors.surface, borderRadius: 12, padding: 14, gap: 10,
      borderTopWidth: 1, borderTopColor: colors.border2,
    },
    addTitle: { fontSize: 13, fontWeight: '500', color: colors.textSub },
    addRow: { flexDirection: 'row', gap: 8 },
    addInput: {
      flex: 1, borderWidth: 1, borderColor: colors.border,
      borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
      fontSize: 14, backgroundColor: colors.surface, color: colors.text,
    },
    addBtn: {
      backgroundColor: PURPLE, borderRadius: 8,
      paddingHorizontal: 16, justifyContent: 'center',
    },
    addBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
    infoBox: {
      backgroundColor: colors.surface2, borderRadius: 10, padding: 12,
    },
    infoText: { fontSize: 12, color: colors.textSub, lineHeight: 18 },
    deleteAction: {
      backgroundColor: '#E74C3C', borderRadius: 10,
      justifyContent: 'center', alignItems: 'center',
      paddingHorizontal: 20, marginLeft: 4,
    },
    deleteActionText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  });
}