import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Share, Animated, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getGameById, getPlayers, upsertGame, getAllGameConfigs, getGames, saveGames } from '../storage/StorageService';
import { Game, GameConfig, Player } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'EndGame'>;
type RouteType = RouteProp<RootStackParamList, 'EndGame'>;

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function formatDuration(startedAt: number, finishedAt: number): string {
  const mins = Math.round((finishedAt - startedAt) / 60000);
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h${mins % 60 > 0 ? String(mins % 60).padStart(2, '0') : ''}`;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function EndGameScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { gameId } = route.params;
  const { colors } = useTheme();
  const { t } = useLanguage();

  const [game, setGame] = useState<Game | null>(null);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const barAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const CONFETTI_COUNT = 18;
  const CONFETTI_COLORS = ['#6c63ff', '#EF9F27', '#0F6E56', '#E33B3B', '#4fc3f7', '#ab47bc', '#26a69a', '#ff7043', '#ffca28'];
  const confettiAnims = useRef(
    Array.from({ length: CONFETTI_COUNT }, () => ({
      y: new Animated.Value(-20),
      x: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    const load = async () => {
      const g = await getGameById(gameId);
      if (!g) return;
      setGame(g);
      const allConfigs = await getAllGameConfigs();
      setConfig(allConfigs.find(c => c.id === g.gameConfigId) ?? null);
      const all = await getPlayers();
      setPlayers(all.filter(p => g.playerIds.includes(p.id)));
    };
    load();
  }, [gameId]);

  useEffect(() => {
    if (!game) return;
    Animated.stagger(120, barAnims.map(anim =>
      Animated.timing(anim, { toValue: 1, duration: 450, useNativeDriver: false })
    )).start();
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();

    confettiAnims.forEach((anim, i) => {
      anim.y.setValue(-20);
      anim.opacity.setValue(1);
      anim.rotate.setValue(0);
      anim.x.setValue(0);
      const delay = i * 70;
      const duration = 2000 + (i % 5) * 250;
      Animated.parallel([
        Animated.timing(anim.y, { toValue: 750, duration, delay, useNativeDriver: true }),
        Animated.timing(anim.x, {
          toValue: (i % 2 === 0 ? 1 : -1) * (20 + (i % 6) * 22),
          duration, delay, useNativeDriver: true,
        }),
        Animated.timing(anim.rotate, {
          toValue: (i % 2 === 0 ? 1 : -1) * (2 + (i % 4) * 2),
          duration, delay, useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 0, duration: 500, delay: delay + 1600, useNativeDriver: true,
        }),
      ]).start();
    });
  }, [game]);

  if (!game || !config) return null;

  const styles = makeStyles(colors);
  const themeColor = config.themeColor ?? '#0F6E56';
  const themeBg = themeColor + '22';

  // ── Calcul des totaux et classement ──────────────────────────────────────────

  const totals = game.playerIds.map(id => ({
    id,
    player: players.find(p => p.id === id),
    total: game.rounds.reduce((s, r) => s + (r.scores[id]?.computed ?? 0), 0),
  }));

  const ranked = [...totals].sort((a, b) =>
    config.scoreDirection === 'high' ? b.total - a.total : a.total - b.total
  );

  // Calcul des rangs avec gestion des égalités
  const ranks: Record<string, number> = {};
  ranked.forEach((entry, i) => {
    if (i === 0) {
      ranks[entry.id] = 1;
    } else {
      ranks[entry.id] = ranked[i - 1].total === entry.total
        ? ranks[ranked[i - 1].id]
        : i + 1;
    }
  });

  // ── Podium (1er au centre, 2e à gauche, 3e à droite) ────────────────────────

  const podium = [ranked[1], ranked[0], ranked[2]].filter(Boolean);
  const podiumHeights = [56, 80, 40];

  // ── Stats ────────────────────────────────────────────────────────────────────

  const allScores = game.rounds.flatMap(r =>
    game.playerIds.map(id => ({
      playerId: id,
      round: r.roundNumber,
      score: r.scores[id]?.computed ?? 0,
    }))
  );
  const bestScore = allScores.reduce((a, b) =>
    config.scoreDirection === 'low'
      ? (a.score < b.score ? a : b)
      : (a.score > b.score ? a : b)
  );
  const worstScore = allScores.reduce((a, b) =>
    config.scoreDirection === 'low'
      ? (a.score > b.score ? a : b)
      : (a.score < b.score ? a : b)
  );
  const avg = allScores.reduce((s, x) => s + x.score, 0) / allScores.length;
  const doubledCount = game.rounds.reduce((count, r) =>
    count + game.playerIds.filter(id => (r.scores[id]?.rawInput as any)?.doubled).length, 0
  );
  const firstDoubled = game.rounds.flatMap(r =>
    game.playerIds
      .filter(id => (r.scores[id]?.rawInput as any)?.doubled)
      .map(id => `${players.find(p => p.id === id)?.name} M${r.roundNumber}`)
  )[0];

  // ── Revanche ──────────────────────────────────────────────────────────────────

  async function handleRevanche() {
    const newGame: Game = {
      id: generateId(),
      gameConfigId: game!.gameConfigId,
      playerIds: game!.playerIds,
      rounds: [],
      status: 'playing',
      winnerId: null,
      startedAt: Date.now(),
      finishedAt: null,
      metadata: game!.metadata, // Préserve targetScore (Trio, Odin, etc.)
    };
    await upsertGame(newGame);
    navigation.replace('Game', { gameId: newGame.id });
  }

  async function handleShare() {
    const lines = ranked.map((r) => {
      const score = r.total;
      const label = config.inputType === 'wins'
        ? `${score} ${score > 1 ? t('wins') : t('win')}`
        : `${score} ${t('pts')}`;
      return `${ranks[r.id]}. ${r.player?.name ?? '?'} — ${label}`;
    });
    await Share.share({
      message: `${config.name} — ${game.rounds.length} ${game.rounds.length > 1 ? t('rounds') : t('round')}\n${lines.join('\n')}`,
    });
  }

  // ── Suppression ───────────────────────────────────────────────────────────────

  async function handleDeleteGame() {
    Alert.alert(t('deleteGameTitle'), t('irreversible'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'), style: 'destructive',
        onPress: async () => {
          const all = await getGames();
          await saveGames(all.filter(g => g.id !== gameId));
          navigation.navigate('Home');
        },
      },
    ]);
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
      </View>

      {/* Confetti */}
      <View style={styles.confettiOverlay} pointerEvents="none">
        {confettiAnims.map((anim, i) => {
          const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
          const startX = (i / CONFETTI_COUNT) * 340 - 10;
          const rotateDeg = anim.rotate.interpolate({ inputRange: [-8, 8], outputRange: ['-360deg', '360deg'] });
          return (
            <Animated.View
              key={i}
              style={[
                styles.confettiParticle,
                {
                  backgroundColor: color,
                  left: startX,
                  opacity: anim.opacity,
                  transform: [
                    { translateY: anim.y },
                    { translateX: anim.x },
                    { rotate: rotateDeg },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Titre */}
        <View style={styles.titleBlock}>
          <Text style={styles.subtitle}>{t('gameOver')}</Text>
          <Text style={styles.gameTitle}>
            {config.emoji ?? '🎮'} {config.name} — {game.rounds.length} {game.rounds.length > 1 ? t('rounds') : t('round')}
          </Text>
          <Text style={styles.dateText}>
            {formatDate(game.startedAt)}
            {game.finishedAt ? ` · ${formatDuration(game.startedAt, game.finishedAt)}` : ''}
          </Text>
        </View>

        {/* Podium */}
        <View style={styles.podium}>
          {podium.map((entry, i) => {
            const rankNum = entry ? ranks[entry.id] : i + 1;
            const isWinner = rankNum === 1;
            const height = podiumHeights[i];
            const animatedHeight = barAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: [0, height],
            });
            return (
              <View key={entry.id} style={styles.podiumCol}>
                {isWinner && <Text style={styles.star}>★</Text>}
                <Animated.View style={[
                  styles.podiumAvatar,
                  isWinner && [styles.podiumAvatarWinner, { borderColor: themeColor }],
                  { backgroundColor: (entry.player?.color ?? '#999') + '33' },
                  isWinner && { transform: [{ scale: scaleAnim }] },
                ]}>
                  <Text style={[
                    styles.podiumAvatarText,
                    { color: entry.player?.color ?? '#333' },
                    isWinner && { fontSize: 20 },
                  ]}>
                    {entry.player?.name[0].toUpperCase() ?? '?'}
                  </Text>
                </Animated.View>
                <Text style={[styles.podiumName, isWinner && styles.podiumNameWinner]}>
                  {entry.player?.name ?? '?'}
                </Text>
                <Text style={[styles.podiumScore, isWinner && [styles.podiumScoreWinner, { color: themeColor }]]}>
                  {config.inputType === 'wins'
                    ? `${entry.total} ${entry.total > 1 ? t('wins') : t('win')}`
                    : `${entry.total} ${t('pts')}`}
                </Text>
                <Animated.View style={[
                  styles.podiumBar,
                  { height: animatedHeight },
                  isWinner && [styles.podiumBarWinner, { backgroundColor: themeBg }],
                ]}>
                  <Text style={[styles.podiumRank, isWinner && [styles.podiumRankWinner, { color: themeColor }]]}>
                    {rankNum}
                  </Text>
                </Animated.View>
              </View>
            );
          })}
        </View>

        {/* 4e et + */}
        {ranked.slice(3).map((entry, i) => (
          <View key={entry.id} style={styles.extraRow}>
            <View style={[styles.extraAvatar,
              { backgroundColor: (entry.player?.color ?? '#999') + '22' }]}>
              <Text style={[styles.extraAvatarText, { color: entry.player?.color ?? '#333' }]}>
                {entry.player?.name[0].toUpperCase() ?? '?'}
              </Text>
            </View>
            <Text style={styles.extraName}>{entry.player?.name ?? '?'}</Text>
            <Text style={styles.extraRank}>{ranks[entry.id]}e</Text>
            <Text style={styles.extraScore}>{entry.total} pts</Text>
          </View>
        ))}

        {/* Détail par manche */}
        <Text style={styles.sectionTitle}>{t('roundDetail')}</Text>
        <ScrollView horizontal style={styles.tableScroll}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.nameCol, styles.cellHeader]} />
              {game.rounds.map(r => (
                <Text key={r.roundNumber} style={[styles.cell, styles.cellHeader]}>M{r.roundNumber}</Text>
              ))}
              <Text style={[styles.cell, styles.totCol, styles.cellHeader]}>{t('tot')}</Text>
            </View>
            {ranked.map((entry) => (
              <View key={entry.id} style={[styles.tableRow, ranks[entry.id] === 1 && [styles.tableRowWinner, { backgroundColor: themeBg }]]}>
                <Text style={[styles.cell, styles.nameCol, ranks[entry.id] === 1 && [styles.cellWinner, { color: themeColor }]]} numberOfLines={1}>
                  {entry.player?.name ?? '?'}
                </Text>
                {game.rounds.map(r => {
                  const score = r.scores[entry.id];
                  const doubled = (score?.rawInput as any)?.doubled;
                  const isWinRound = (score?.rawInput as any)?.winner;
                  if (config.inputType === 'wins') {
                    return (
                      <Text key={r.roundNumber} style={[styles.cell, isWinRound && styles.cellWinRound, ranks[entry.id] === 1 && [styles.cellWinner, { color: themeColor }]]}>
                        {isWinRound ? '✓' : ''}
                      </Text>
                    );
                  }
                  if (config.inputType === 'bid') {
                    const bid = (score?.rawInput as any)?.bid ?? '?';
                    const tricks = (score?.rawInput as any)?.tricks ?? '?';
                    const isOk = bid === tricks;
                    return (
                      <Text key={r.roundNumber} style={[styles.cell, isOk ? styles.cellSKOk : styles.cellSKFail, ranks[entry.id] === 1 && [styles.cellWinner, { color: themeColor }]]}>
                        {bid}/{tricks}
                      </Text>
                    );
                  }
                  return (
                    <Text key={r.roundNumber} style={[styles.cell, doubled && styles.cellDoubled, ranks[entry.id] === 1 && [styles.cellWinner, { color: themeColor }]]}>
                      {score?.computed ?? '-'}
                    </Text>
                  );
                })}
                <Text style={[styles.cell, styles.totCol, styles.cellBold, ranks[entry.id] === 1 ? [styles.cellWinner, { color: themeColor }] : styles.cellWorse]}>
                  {entry.total}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Stats — masquées pour Trio (scores binaires 0/1 non significatifs) */}
        {config.inputType !== 'wins' && (
          <>
            <Text style={styles.sectionTitle}>{t('statsTitle')}</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>{t('bestRound')}</Text>
                <Text style={styles.statValue}>
                  {players.find(p => p.id === bestScore.playerId)?.name} M{bestScore.round} ({bestScore.score})
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>{t('worstRound')}</Text>
                <Text style={[styles.statValue, styles.statBad]}>
                  {players.find(p => p.id === worstScore.playerId)?.name} M{worstScore.round} ({worstScore.score})
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>{t('avgPerRound')}</Text>
                <Text style={styles.statValue}>{avg.toFixed(1)} {t('pts')}</Text>
              </View>
              {config.id === 'skyjo' && (
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>{t('doublesDealt')}</Text>
                  <Text style={styles.statValue}>
                    {doubledCount > 0 ? `${doubledCount} (${firstDoubled})` : t('none')}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Boutons */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnSecondary} onPress={handleShare}>
            <Text style={styles.btnSecondaryText}>{t('shareBtn')}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.btnSecondaryFull}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.btnSecondaryFullText}>{t('seeHistory')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnDelete} onPress={handleDeleteGame}>
          <Text style={styles.btnDeleteText}>{t('deleteGameBtn')}</Text>
        </TouchableOpacity>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnOutlineHalf} onPress={handleRevanche}>
            <Text style={styles.btnOutlineText}>{t('rematch')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutlineHalf}
            onPress={() => navigation.navigate('NewGame', { preselectedGameId: game!.gameConfigId })}
          >
            <Text style={styles.btnOutlineText}>{t('replay')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';
const GREEN = '#0F6E56';
const RED = '#A32D2D';

function makeStyles(colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 20, paddingVertical: 8,
      backgroundColor: colors.bg,
    },
    back: { fontSize: 28, color: PURPLE, lineHeight: 32 },
    scroll: { padding: 20, gap: 16 },
    titleBlock: { alignItems: 'center', paddingTop: 8 },
    subtitle: { fontSize: 13, color: colors.textSub, marginBottom: 4 },
    gameTitle: { fontSize: 20, fontWeight: '500', color: colors.text },
    dateText: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
    star: { fontSize: 22, color: '#EF9F27', marginBottom: 4 },
    podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 12 },
    podiumCol: { alignItems: 'center', width: 80 },
    podiumAvatar: {
      width: 44, height: 44, borderRadius: 22,
      alignItems: 'center', justifyContent: 'center', marginBottom: 6,
    },
    podiumAvatarWinner: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: GREEN },
    podiumAvatarText: { fontSize: 17, fontWeight: '500' },
    podiumName: { fontSize: 13, fontWeight: '500', color: colors.text },
    podiumNameWinner: { fontSize: 14, color: colors.text },
    podiumScore: { fontSize: 12, color: colors.textSub, marginBottom: 6 },
    podiumScoreWinner: { fontSize: 13, fontWeight: '500', color: GREEN },
    podiumBar: {
      width: '100%', backgroundColor: colors.surface2,
      borderRadius: 8, borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
      alignItems: 'center', justifyContent: 'center',
    },
    podiumBarWinner: { backgroundColor: colors.greenBg },
    podiumRank: { fontSize: 18, fontWeight: '500', color: colors.textSub },
    podiumRankWinner: { fontSize: 22, color: GREEN },
    extraRow: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: colors.surface2, borderRadius: 10, padding: 10,
    },
    extraAvatar: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
    extraAvatarText: { fontSize: 9, fontWeight: '500' },
    extraName: { flex: 1, fontSize: 13, color: colors.text },
    extraRank: { fontSize: 11, color: colors.textMuted },
    extraScore: { fontSize: 13, fontWeight: '500', color: RED },
    sectionTitle: { fontSize: 14, fontWeight: '500', color: colors.text },
    tableScroll: { borderRadius: 12, overflow: 'hidden' },
    table: { backgroundColor: colors.surface, borderRadius: 12, padding: 8 },
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
    tableRowWinner: { backgroundColor: colors.greenBg, borderRadius: 6 },
    cell: { width: 40, textAlign: 'center', fontSize: 11, color: colors.textSub },
    cellHeader: { fontWeight: '500', color: colors.textMuted, fontSize: 10 },
    cellBold: { fontWeight: '500' },
    cellWinner: { color: GREEN, fontWeight: '500' },
    cellWorse: { color: colors.text },
    cellDoubled: { color: RED, fontWeight: '500' },
    cellWinRound: { color: GREEN, fontWeight: '700' },
    cellSKOk: { color: GREEN, fontWeight: '700' },
    cellSKFail: { color: RED, fontWeight: '700' },
    nameCol: { width: 60, textAlign: 'left', paddingLeft: 6 },
    totCol: { width: 36 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    statCard: {
      width: '47%', backgroundColor: colors.surface,
      borderRadius: 10, padding: 10,
    },
    statLabel: { fontSize: 11, color: colors.textSub, marginBottom: 2 },
    statValue: { fontSize: 14, fontWeight: '500', color: colors.text },
    statBad: { color: RED },
    btnRow: { flexDirection: 'row', gap: 8 },
    btnSecondary: {
      flex: 1, padding: 12, borderRadius: 12,
      backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
      alignItems: 'center',
    },
    btnSecondaryText: { fontSize: 14, fontWeight: '500', color: colors.text },
    btnSecondaryFull: {
      padding: 12, borderRadius: 12,
      backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
      alignItems: 'center',
    },
    btnSecondaryFullText: { fontSize: 14, fontWeight: '500', color: colors.text },
    btnDelete: { alignItems: 'center', paddingVertical: 10 },
    btnDeleteText: { fontSize: 13, color: RED },
    btnOutlineHalf: {
      flex: 1, borderRadius: 12, paddingVertical: 12,
      backgroundColor: colors.surface, borderWidth: 1, borderColor: PURPLE + '66',
      alignItems: 'center',
    },
    btnOutlineText: { color: PURPLE, fontSize: 13, fontWeight: '500' },
    confettiOverlay: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 10,
    },
    confettiParticle: {
      position: 'absolute', top: 0,
      width: 8, height: 14, borderRadius: 2,
    },
  });
}