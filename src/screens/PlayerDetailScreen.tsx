import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getPlayers, updatePlayer, deletePlayer, getGames, saveGames, getAllGameConfigs } from '../storage/StorageService';
import { Player, Game, GameConfig } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

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
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { playerId } = route.params;

  const [player, setPlayer] = useState<Player | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [allConfigs, setAllConfigs] = useState<GameConfig[]>([]);
  const [editName, setEditName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [allPlayers, allGames, configs] = await Promise.all([getPlayers(), getGames(), getAllGameConfigs()]);
    const p = allPlayers.find(pl => pl.id === playerId) ?? null;
    setPlayer(p);
    setEditName(p?.name ?? '');
    setGames(allGames);
    setAllConfigs(configs);
  }

  if (!player) return null;

  const styles = makeStyles(colors);
  const myGames = games.filter(g => g.playerIds.includes(playerId));
  const finishedGames = myGames.filter(g => g.status === 'finished');
  const wins = finishedGames.filter(g => g.winnerId === playerId).length;
  const winRate = finishedGames.length > 0
    ? Math.round((wins / finishedGames.length) * 100)
    : 0;
  const hasActiveGame = myGames.some(g => g.status === 'playing');

  // ── Stats cross-jeux ─────────────────────────────────────────────────────────

  const gameFrequency: Record<string, number> = {};
  finishedGames.forEach(g => {
    gameFrequency[g.gameConfigId] = (gameFrequency[g.gameConfigId] ?? 0) + 1;
  });
  const favoriteConfigId = Object.entries(gameFrequency).sort((a, b) => b[1] - a[1])[0]?.[0];
  const favoriteGame = allConfigs.find(c => c.id === favoriteConfigId)?.name ?? null;

  let bestStreak = 0;
  let currentStreak = 0;
  [...finishedGames].sort((a, b) => (a.finishedAt ?? 0) - (b.finishedAt ?? 0)).forEach(g => {
    if (g.winnerId === playerId) { currentStreak++; bestStreak = Math.max(bestStreak, currentStreak); }
    else currentStreak = 0;
  });

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
      Alert.alert(
        t('deletePlayerTitle', { name: player.name }),
        t('deletePlayerInGameDetail'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('deletePlayerForce'), style: 'destructive',
            onPress: async () => {
              const allGames = await getGames();
              await saveGames(allGames.filter(g => !g.playerIds.includes(playerId)));
              await deletePlayer(playerId);
              navigation.goBack();
            },
          },
        ]
      );
      return;
    }
    Alert.alert(
      t('deletePlayerTitle', { name: player.name }),
      t('irreversible'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'), style: 'destructive',
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
        <Text style={styles.headerTitle}>{t('playerCard')}</Text>
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
            <Text style={styles.statLabel}>{t('gamesCount')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{wins}</Text>
            <Text style={styles.statLabel}>{t('winsCount')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{winRate}%</Text>
            <Text style={styles.statLabel}>{t('winRate')}</Text>
          </View>
        </View>

        {/* Stats avancées */}
        {finishedGames.length > 0 && (
          <View style={styles.statsGrid}>
            {favoriteGame && (
              <View style={[styles.statCard, { flex: 2 }]}>
                <Text style={styles.statValue} numberOfLines={1}>{favoriteGame}</Text>
                <Text style={styles.statLabel}>{t('favoriteGame')}</Text>
              </View>
            )}
            {bestStreak > 1 && (
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{bestStreak}</Text>
                <Text style={styles.statLabel}>{t('bestStreak')}</Text>
              </View>
            )}
          </View>
        )}

        {/* Couleur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('colorLabel')}</Text>
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
          style={styles.deleteBtn}
          onPress={handleDelete}
        >
          <Text style={styles.deleteBtnText}>
            {t('deletePlayerBtn', { name: player.name })}
          </Text>
        </TouchableOpacity>
        {hasActiveGame && (
          <Text style={styles.deleteNote}>
            {t('playerInActiveGame')}
          </Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';

function makeStyles(colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14,
      backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border2,
    },
    back: { fontSize: 28, color: PURPLE, lineHeight: 32 },
    headerTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
    scroll: { padding: 20, gap: 20 },
    profileBlock: { alignItems: 'center', gap: 12, paddingVertical: 8 },
    avatarLarge: {
      width: 80, height: 80, borderRadius: 40,
      alignItems: 'center', justifyContent: 'center',
    },
    avatarLargeText: { fontSize: 32, fontWeight: '500' },
    playerName: { fontSize: 22, fontWeight: '600', color: colors.text, textAlign: 'center' },
    editHint: { fontSize: 16, color: colors.textMuted },
    editRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    editInput: {
      borderWidth: 1, borderColor: PURPLE, borderRadius: 8,
      paddingHorizontal: 12, paddingVertical: 8,
      fontSize: 18, color: colors.text, minWidth: 160,
    },
    editSaveBtn: {
      backgroundColor: PURPLE, borderRadius: 8,
      paddingHorizontal: 14, paddingVertical: 8,
    },
    editSaveBtnText: { color: '#fff', fontWeight: '600' },
    statsGrid: { flexDirection: 'row', gap: 10 },
    statCard: {
      flex: 1, backgroundColor: colors.surface, borderRadius: 12,
      padding: 14, alignItems: 'center', gap: 4,
    },
    statValue: { fontSize: 22, fontWeight: '700', color: colors.text },
    statLabel: { fontSize: 12, color: colors.textSub },
    section: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, gap: 12 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
    colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    colorSwatch: { width: 36, height: 36, borderRadius: 18 },
    colorSwatchSelected: {
      borderWidth: 3, borderColor: colors.text,
      transform: [{ scale: 1.15 }],
    },
    deleteBtn: {
      borderWidth: 1, borderColor: '#E74C3C',
      borderRadius: 12, paddingVertical: 14, alignItems: 'center',
    },
    deleteBtnDisabled: { borderColor: colors.border },
    deleteBtnText: { color: '#E74C3C', fontSize: 15, fontWeight: '500' },
    deleteBtnTextDisabled: { color: colors.textMuted },
    deleteNote: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginTop: -12 },
  });
}