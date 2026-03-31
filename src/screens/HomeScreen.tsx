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
import { getCurrentGames, getGames, saveGames, getPlayers, getAllGameConfigs } from '../storage/StorageService';
import { Game, GameConfig, Player } from '../types';
import { GAME_RULES } from '../data/gameRules';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const PURPLE = '#6c63ff';

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [currentGames, setCurrentGames] = useState<Game[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [allConfigs, setAllConfigs] = useState<GameConfig[]>([]);

  useEffect(() => {
    const load = async () => {
      const [current, all, allPlayers, configs] = await Promise.all([
        getCurrentGames(),
        getGames(),
        getPlayers(),
        getAllGameConfigs(),
      ]);
      setCurrentGames(current);
      setRecentGames(
        all.filter(g => g.status === 'finished')
          .sort((a, b) => (b.finishedAt ?? 0) - (a.finishedAt ?? 0))
          .slice(0, 3)
      );
      setPlayers(allPlayers);
      setAllConfigs(configs);
    };
    load();
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  async function handleAbandon(gameId: string) {
    Alert.alert(
      t('abandonTitle'),
      t('abandonMsg'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('abandon'), style: 'destructive',
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

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>ScoreKeeper</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Players')}>
            <Text style={styles.iconBtnText}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.iconBtnText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('NewGame')}
        >
          <Text style={styles.primaryBtnText}>{t('newGame')}</Text>
        </TouchableOpacity>

        {/* Parties en cours */}
        {currentGames.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {currentGames.length > 1 ? t('currentGames') : t('currentGame')}
            </Text>
            {currentGames.map(game => (
              <View key={game.id} style={styles.currentGameCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Game', { gameId: game.id })}
                >
                  <Text style={styles.currentGameName}>
                    {allConfigs.find(g => g.id === game.gameConfigId)?.emoji ?? '🎮'} {allConfigs.find(g => g.id === game.gameConfigId)?.name ?? 'Jeu'}
                  </Text>
                  <Text style={styles.currentGameSub}>
                    {game.playerIds
                      .map(id => players.find(p => p.id === id)?.name ?? '?')
                      .join(', ')} · {t('round')} {game.rounds.length}
                  </Text>
                  <Text style={styles.currentGameResume}>{t('resume')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.abandonBtn}
                  onPress={() => handleAbandon(game.id)}
                >
                  <Text style={styles.abandonBtnText}>{t('abandon')}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Dernières parties */}
        {recentGames.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('recentGames')}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={styles.seeAll}>{t('seeAll')}</Text>
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
                    {allConfigs.find(g => g.id === game.gameConfigId)?.emoji ?? '🎮'} {allConfigs.find(g => g.id === game.gameConfigId)?.name ?? 'Jeu'}
                    <Text style={styles.recentManches}> · {game.rounds.length} {game.rounds.length > 1 ? t('rounds') : t('round')}</Text>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('availableGames')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('NewGame')}>
              <Text style={styles.seeAll}>{t('addGame')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gameList}>
            {allConfigs.map((game, index) => {
              const isCustom = !!(game.specialRules as any)?.isCustom;
              const isLast = index === allConfigs.length - 1;
              const rules = GAME_RULES[game.id];
              return (
                <View
                  key={game.id}
                  style={[styles.gameListRow, !isLast && styles.gameListRowBorder]}
                >
                  <View style={styles.gameListLeft}>
                    <Text style={styles.gameListName}>
                      {game.emoji ?? '🎮'} {game.name}
                    </Text>
                    {isCustom && (
                      <View style={styles.customBadge}>
                        <Text style={styles.customBadgeText}>{t('custom')}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.gameListMeta}>
                    {game.minPlayers}–{game.maxPlayers} {t('players')}
                  </Text>
                  {rules ? (
                    <TouchableOpacity
                      style={styles.rulesBtn}
                      onPress={() => Alert.alert(t('rulesAlertTitle', { name: game.name }), rules)}
                    >
                      <Text style={styles.rulesBtnText}>?</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border2,
    },
    title: { fontSize: 22, fontWeight: 'bold', color: colors.text },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.surface2,
      alignItems: 'center', justifyContent: 'center',
    },
    iconBtnText: { fontSize: 18 },
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
    sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
    seeAll: { fontSize: 14, color: PURPLE },
    currentGameCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderLeftWidth: 4,
      borderLeftColor: PURPLE,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    currentGameName: { fontSize: 17, fontWeight: '700', color: colors.text },
    currentGameSub: { fontSize: 13, color: colors.textSub, marginTop: 4 },
    currentGameResume: { fontSize: 14, color: PURPLE, marginTop: 8, fontWeight: '600' },
    abandonBtn: { marginTop: 10, alignSelf: 'flex-start' },
    abandonBtnText: { fontSize: 12, color: colors.textMuted },
    recentCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      shadowColor: '#000',
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    recentName: { fontSize: 15, fontWeight: '600', color: colors.text },
    recentSub: { fontSize: 13, color: colors.textSub, marginTop: 2 },
    recentManches: { fontSize: 13, color: colors.textMuted, fontWeight: '400' },
    gameList: {
      backgroundColor: colors.surface, borderRadius: 12,
      shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
      overflow: 'hidden',
    },
    gameListRow: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 13,
    },
    gameListRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border2 },
    gameListLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
    gameListName: { fontSize: 15, fontWeight: '500', color: colors.text },
    gameListMeta: { fontSize: 12, color: colors.textMuted },
    customBadge: {
      backgroundColor: PURPLE + '18', borderRadius: 6,
      paddingHorizontal: 6, paddingVertical: 2,
    },
    customBadgeText: { fontSize: 10, color: PURPLE, fontWeight: '600' },
    rulesBtn: {
      width: 22, height: 22, borderRadius: 11,
      backgroundColor: PURPLE + '18',
      borderWidth: 1, borderColor: PURPLE + '44',
      alignItems: 'center', justifyContent: 'center',
      marginLeft: 8,
    },
    rulesBtnText: { fontSize: 12, color: PURPLE, fontWeight: '700', lineHeight: 16 },
  });
}
