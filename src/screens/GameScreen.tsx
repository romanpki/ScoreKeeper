import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert, Animated, useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Notifications from 'expo-notifications';
import { GAME_RULES } from '../data/gameRules';
import { computeSkullKingScore } from '../games/skullking';
import { computeSkyjoDoubling } from '../games/skyjo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  getGameById, getPlayers, upsertGame, getGames, saveGames,
  getAllGameConfigs,
} from '../storage/StorageService';
import { Game, GameConfig, Player, Round, isSimpleRawInput, isBidRawInput, isWinsRawInput } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { usePrefs } from '../context/PrefsContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type RoutePropType = RouteProp<RootStackParamList, 'Game'>;

export default function GameScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { gameId } = route.params;
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { keepAwake, hapticsEnabled } = usePrefs();

  const [game, setGame] = useState<Game | null>(null);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [firstPlayerId, setFirstPlayerId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<string>('');
  const [flip7Achieved, setFlip7Achieved] = useState<string | null>(null);
  const [winRoundWinner, setWinRoundWinner] = useState<string | null>(null);
  const [skBids, setSkBids] = useState<Record<string, number>>({});
  const [skTricks, setSkTricks] = useState<Record<string, number>>({});
  const [skBonus14, setSkBonus14] = useState<Record<string, number>>({});
  const [skBonusPirate, setSkBonusPirate] = useState<Record<string, number>>({});
  const [skBonusSK, setSkBonusSK] = useState<Record<string, boolean>>({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();
  const isSpectatorMode = width > height && width > 700;
  const [forceInputMode, setForceInputMode] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    if (!keepAwake) return;
    activateKeepAwakeAsync();
    return () => { deactivateKeepAwake(); };
  }, [keepAwake]);

  function triggerHaptic(type: Haptics.NotificationFeedbackType) {
    if (hapticsEnabled) Haptics.notificationAsync(type);
  }

  useEffect(() => {
    const load = async () => {
      const g = await getGameById(gameId);
      if (!g) return;
      setGame(g);

      const allConfigs = await getAllGameConfigs();
      const cfg = allConfigs.find(c => c.id === g.gameConfigId) ?? null;
      setConfig(cfg);

      const allPlayers = await getPlayers();
      setPlayers(allPlayers.filter(p => g.playerIds.includes(p.id)));

      const init: Record<string, string> = {};
      g.playerIds.forEach(id => { init[id] = '0'; });
      setInputs(init);
      if (cfg?.inputType === 'bid') {
        const bids: Record<string, number> = {};
        const tricks: Record<string, number> = {};
        const b14: Record<string, number> = {};
        const bPirate: Record<string, number> = {};
        const bSK: Record<string, boolean> = {};
        g.playerIds.forEach(id => { bids[id] = 0; tricks[id] = 0; b14[id] = 0; bPirate[id] = 0; bSK[id] = false; });
        setSkBids(bids); setSkTricks(tricks); setSkBonus14(b14); setSkBonusPirate(bPirate); setSkBonusSK(bSK);
      }

      // Programmer une notification de rappel si la partie est en cours
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted' && g.status === 'playing') {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: t('notifTitle'),
            body: t('notifBody', { name: cfg?.name ?? 'jeu' }),
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 86400, repeats: false },
        });
      }
    };
    load();
    return () => { Notifications.cancelAllScheduledNotificationsAsync(); };
  }, [gameId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!game) return;
      const diff = Date.now() - game.startedAt;
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      if (hours > 0) {
        setElapsed(`${hours}h${mins > 0 ? `${mins}min` : ''}`);
      } else if (mins > 0) {
        setElapsed(`${mins}min${secs > 0 ? ` ${secs}s` : ''}`);
      } else {
        setElapsed(`${secs}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [game?.startedAt]);

  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (!game || !config) return null;

  const themeColor = config.themeColor ?? '#6c63ff';

  // ── Cumulatif ────────────────────────────────────────────────────────────────

  function getCumulative(playerId: string): number {
    if (!game) return 0;
    return game.rounds.reduce((sum, r) => sum + (r.scores[playerId]?.computed ?? 0), 0);
  }

  function getPreview(playerId: string): number {
    return getCumulative(playerId) + (parseInt(inputs[playerId], 10) || 0);
  }

  // ── Auto-complétion Papayoo ───────────────────────────────────────────────────

  function updateInput(playerId: string, value: string) {
    const newInputs = { ...inputs, [playerId]: value };

    if (config?.id === 'papayoo') {
      const unfilledIds = game!.playerIds.filter(
        id => newInputs[id].trim() === '' && id !== playerId
      );
      if (unfilledIds.length === 1) {
        const filledTotal = game!.playerIds
          .filter(id => id !== unfilledIds[0])
          .reduce((s, id) => s + (parseInt(newInputs[id], 10) || 0), 0);
        newInputs[unfilledIds[0]] = String(250 - filledTotal);
      }
    }

    setInputs(newInputs);
  }

  // ── Notes de doublement Skyjo ─────────────────────────────────────────────────

  function getSkyjoDoubledNotes(): string[] {
    if (!game || config.id !== 'skyjo') return [];
    const notes: string[] = [];
    game.rounds.forEach(r => {
      game!.playerIds.forEach(id => {
        const score = r.scores[id];
        if (score?.rawInput && isSimpleRawInput(score.rawInput) && score.rawInput.doubled) {
          const player = players.find(p => p.id === id);
          const orig = score.rawInput.original;
          notes.push(`M${r.roundNumber} ${player?.name} : ${orig} doublé à ${score.computed} (a terminé sans avoir le + bas)`);
        }
      });
    });
    return notes;
  }

  // ── Fin de partie ─────────────────────────────────────────────────────────────

  function checkEndCondition(rounds: Round[]): boolean {
    if (!config) return false;
    if (config.endCondition === 'threshold') {
      const threshold = game!.metadata?.targetScore ?? config.endValue;
      return game!.playerIds.some(id => {
        const total = rounds.reduce((s, r) => s + (r.scores[id]?.computed ?? 0), 0);
        return total >= threshold;
      });
    }
    if (config.endCondition === 'fixed' && config.endValue !== null) {
      return rounds.length >= config.endValue;
    }
    if (config.endCondition === 'rounds') {
      return rounds.length >= game!.playerIds.length;
    }
    return false;
  }

  function determineWinner(rounds: Round[]): string {
    const totals = game!.playerIds.map(id => ({
      id,
      total: rounds.reduce((s, r) => s + (r.scores[id]?.computed ?? 0), 0),
    }));
    totals.sort((a, b) =>
      config!.scoreDirection === 'high' ? b.total - a.total : a.total - b.total
    );
    return totals[0].id;
  }

  // ── Terminer la partie manuellement ──────────────────────────────────────────

  function handleForceEnd() {
    if (!game || game.rounds.length === 0) return;
    const autoWinner = determineWinner(game.rounds);
    const winnerPlayer = players.find(p => p.id === autoWinner);
    const dirLabel = config?.scoreDirection === 'high' ? t('highScore') : t('lowScore');
    Alert.alert(
      t('endGameTitle'),
      t('endGameMsg', { winner: winnerPlayer?.name ?? '?', dir: dirLabel }),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('confirm'), onPress: () => forceEndGame(autoWinner) },
      ]
    );
  }

  async function forceEndGame(winnerId: string) {
    if (!game) return;
    const updatedGame: Game = {
      ...game,
      status: 'finished',
      winnerId,
      finishedAt: Date.now(),
    };
    await upsertGame(updatedGame);
    await Notifications.cancelAllScheduledNotificationsAsync();
    navigation.replace('EndGame', { gameId: game.id });
  }

  // ── Validation — Trio (tracker de victoires) ──────────────────────────────────

  async function handleValidateTrio() {
    if (!game || !config) return;
    if (!winRoundWinner) {
      Alert.alert(t('missingWinner'), t('selectRoundWinner'));
      return;
    }

    const roundNumber = game.rounds.length + 1;
    const scores: Round['scores'] = {};
    game.playerIds.forEach(id => {
      const wins = id === winRoundWinner ? 1 : 0;
      scores[id] = {
        rawInput: { winner: id === winRoundWinner },
        computed: wins,
        cumulative: getCumulative(id) + wins,
      };
    });

    const newRound: Round = { roundNumber, scores, timestamp: Date.now() };
    const updatedRounds = [...game.rounds, newRound];
    const isFinished = checkEndCondition(updatedRounds);

    const updatedGame: Game = {
      ...game,
      rounds: updatedRounds,
      status: isFinished ? 'finished' : 'playing',
      winnerId: isFinished ? determineWinner(updatedRounds) : null,
      finishedAt: isFinished ? Date.now() : null,
    };

    const previousGame = game;
    setGame(updatedGame);
    try {
      await upsertGame(updatedGame);
    } catch {
      setGame(previousGame);
      Alert.alert(t('error'), t('saveError'));
      return;
    }
    triggerHaptic(Haptics.NotificationFeedbackType.Success);
    setWinRoundWinner(null);

    if (isFinished) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      navigation.replace('EndGame', { gameId: game.id });
    }
  }

  // ── Validation — Skull King ───────────────────────────────────────────────────

  async function handleValidateSkullKing() {
    if (!game || !config) return;
    const roundNum = game.rounds.length + 1;
    const scores: Round['scores'] = {};
    game.playerIds.forEach(id => {
      const bid = skBids[id] ?? 0;
      const tricks = skTricks[id] ?? 0;
      const b14 = skBonus14[id] ?? 0;
      const bPirate = skBonusPirate[id] ?? 0;
      const bSK = skBonusSK[id] ?? false;
      const computed = computeSkullKingScore(bid, tricks, b14, bPirate, bSK, roundNum);
      scores[id] = {
        rawInput: { bid, tricks, bonus14: b14, bonusPirate: bPirate, bonusSK: bSK },
        computed,
        cumulative: getCumulative(id) + computed,
      };
    });

    const newRound: Round = { roundNumber: roundNum, scores, timestamp: Date.now() };
    const updatedRounds = [...game.rounds, newRound];
    const isFinished = checkEndCondition(updatedRounds);

    const updatedGame: Game = {
      ...game,
      rounds: updatedRounds,
      status: isFinished ? 'finished' : 'playing',
      winnerId: isFinished ? determineWinner(updatedRounds) : null,
      finishedAt: isFinished ? Date.now() : null,
    };

    const previousGameSK = game;
    setGame(updatedGame);
    try {
      await upsertGame(updatedGame);
    } catch {
      setGame(previousGameSK);
      Alert.alert(t('error'), t('saveError'));
      return;
    }
    triggerHaptic(Haptics.NotificationFeedbackType.Success);

    const bids: Record<string, number> = {};
    const tricks: Record<string, number> = {};
    const b14: Record<string, number> = {};
    const bPirate: Record<string, number> = {};
    const bSK: Record<string, boolean> = {};
    game.playerIds.forEach(id => { bids[id] = 0; tricks[id] = 0; b14[id] = 0; bPirate[id] = 0; bSK[id] = false; });
    setSkBids(bids); setSkTricks(tricks); setSkBonus14(b14); setSkBonusPirate(bPirate); setSkBonusSK(bSK);

    if (isFinished) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      navigation.replace('EndGame', { gameId: game.id });
    }
  }

  // ── Validation — jeux numériques ──────────────────────────────────────────────

  async function handleValidate() {
    if (!game || !config) return;

    if (config.inputType === 'wins') {
      return handleValidateTrio();
    }

    if (config.inputType === 'bid') {
      return handleValidateSkullKing();
    }

    const missing = game.playerIds.some(id => inputs[id].trim() === '');
    if (missing) {
      Alert.alert(t('incompleteInput'), t('enterScoreAll'));
      return;
    }

    if (config.specialRules?.allowNegative === false) {
      const hasNegative = game.playerIds.some(id => parseInt(inputs[id], 10) < 0);
      if (hasNegative) {
        Alert.alert(t('invalidScore'), t('noNegativeScore'));
        return;
      }
    }

    if (config.id === 'papayoo') {
      const total = game.playerIds.reduce((sum, id) =>
        sum + (parseInt(inputs[id], 10) || 0), 0
      );
      if (total !== 250) {
        Alert.alert(t('totalIncorrect'), t('totalMustBe250', { total }));
        return;
      }
    }

    if (config.id === 'skyjo' && !firstPlayerId) {
      Alert.alert(t('missingPlayer'), t('selectFirstCard'));
      return;
    }

    const roundNumber = game.rounds.length + 1;
    const rawValues: Record<string, number> = {};
    game.playerIds.forEach(id => {
      rawValues[id] = parseInt(inputs[id], 10) || 0;
    });

    const { values: finalValues, doubled } = config.id === 'skyjo'
      ? computeSkyjoDoubling(rawValues, firstPlayerId)
      : { values: rawValues, doubled: {} as Record<string, boolean> };

    const scores: Round['scores'] = {};
    game.playerIds.forEach(id => {
      const original = parseInt(inputs[id], 10) || 0;
      const val = finalValues[id];
      scores[id] = {
        rawInput: {
          value: original,
          first: id === firstPlayerId,
          doubled: doubled[id] ?? false,
          original,
          flip7: id === flip7Achieved,
        },
        computed: val,
        cumulative: getCumulative(id) + val,
      };
    });

    const newRound: Round = { roundNumber, scores, timestamp: Date.now() };
    const updatedRounds = [...game.rounds, newRound];
    const isFinished = checkEndCondition(updatedRounds);

    const updatedGame: Game = {
      ...game,
      rounds: updatedRounds,
      status: isFinished ? 'finished' : 'playing',
      winnerId: isFinished ? determineWinner(updatedRounds) : null,
      finishedAt: isFinished ? Date.now() : null,
    };

    const previousGameNum = game;
    setGame(updatedGame);
    try {
      await upsertGame(updatedGame);
    } catch {
      setGame(previousGameNum);
      Alert.alert(t('error'), t('saveError'));
      return;
    }
    triggerHaptic(Haptics.NotificationFeedbackType.Success);
    setFirstPlayerId(null);
    setFlip7Achieved(null);

    const init: Record<string, string> = {};
    game.playerIds.forEach(id => { init[id] = '0'; });
    setInputs(init);

    if (isFinished) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      navigation.replace('EndGame', { gameId: game.id });
    }
  }

  async function handleUndoLastRound() {
    if (!game || game.rounds.length === 0) return;
    Alert.alert(
      t('undoRoundTitle'),
      t('undoRoundMsg'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('confirm'), style: 'destructive',
          onPress: async () => {
            const updatedGame = { ...game, rounds: game.rounds.slice(0, -1) };
            await upsertGame(updatedGame);
            setGame(updatedGame);
            triggerHaptic(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  }

  async function handleAbandon() {
    Alert.alert(
      t('abandonTitle'),
      t('abandonMsg'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('abandon'), style: 'destructive',
          onPress: async () => {
            const all = await getGames();
            await saveGames(all.filter(g => g.id !== game!.id));
            navigation.navigate('Home');
          },
        },
      ]
    );
  }

  // ── Rendu ──────────────────────────────────────────────────────────────────────

  const roundNumber = game.rounds.length + 1;
  const targetScore = game.metadata?.targetScore ?? config.endValue;

  const endLabel = config.id === 'papayoo'
    ? t('fixedRounds', { n: game.playerIds.length })
    : config.inputType === 'wins'
    ? t('endAtWins', { n: targetScore, s: targetScore > 1 ? 's' : '' })
    : config.endCondition === 'threshold'
    ? t('endAtScore', { n: targetScore })
    : config.endCondition === 'fixed'
    ? t('fixedRounds', { n: config.endValue ?? '' })
    : t('freeRounds');

  const dirLabel = config.inputType === 'wins'
    ? ''
    : config.scoreDirection === 'low' ? t('lowWins') : t('highWins');

  const skyjoNotes = getSkyjoDoubledNotes();

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
    <SafeAreaView style={styles.safe}>

      {/* En-tête */}
      <View style={[styles.header, { borderLeftColor: themeColor }]}>
        <View style={styles.headerInner}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 16 }}>
              <Text style={styles.back}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.gameName}>{config.emoji ?? '🎮'} {config.name}</Text>
            <View style={styles.headerMeta}>
              <Text style={styles.metaText}>{endLabel}</Text>
              {dirLabel ? (
                <>
                  <Text style={styles.metaDot}> · </Text>
                  <Text style={styles.metaDir}>{dirLabel}</Text>
                </>
              ) : null}
            </View>
          </View>
          <Text style={styles.roundSub}>{t('roundLabel', { n: roundNumber })}{elapsed ? ` · ${elapsed}` : ''}</Text>
        </View>
        <View style={styles.headerBtns}>
          {GAME_RULES[config.id] && (
            <TouchableOpacity
              style={styles.rulesBtn}
              onPress={() => Alert.alert(t('rulesAlertTitle', { name: config.name }), GAME_RULES[config.id])}
            >
              <Text style={styles.rulesBtnText}>?</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.fullRulesBtn}
            onPress={() => navigation.navigate('Rules', { gameId: config.id })}
          >
            <Text style={styles.fullRulesBtnText}>{t('fullRules')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tableau des scores */}
      {game.rounds.length > 0 && (
        <View style={styles.tableContainer}>
          <ScrollView horizontal>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.nameCellWrap}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>{t('playerHeader')}</Text>
                </View>
                {game.rounds.map(r => (
                  <Text key={r.roundNumber} style={[styles.tableCell, styles.tableCellHeader]}>
                    {t('roundShort')}{r.roundNumber}
                  </Text>
                ))}
                <Text style={[styles.tableCell, styles.tableCellHeader, styles.totalCell]}>
                  {config.inputType === 'wins' ? t('winsShort') : t('total')}
                </Text>
              </View>
              {players.map(player => (
                <View key={player.id} style={styles.tableRow}>
                  <View style={styles.nameCellWrap}>
                    <View style={[styles.avatarSmall, { backgroundColor: player.color }]}>
                      <Text style={styles.avatarSmallText}>{player.name[0].toUpperCase()}</Text>
                    </View>
                    <Text style={styles.tableNameText} numberOfLines={1}>{player.name}</Text>
                  </View>
                  {game.rounds.map(r => {
                    const score = r.scores[player.id];
                    const raw = score?.rawInput;
                    const isDoubled = raw && isSimpleRawInput(raw) && raw.doubled;
                    const isFlip7 = raw && isSimpleRawInput(raw) && raw.flip7;
                    const isWin = raw && isWinsRawInput(raw) && raw.winner;

                    if (config.inputType === 'wins') {
                      return (
                        <Text
                          key={r.roundNumber}
                          style={[styles.tableCell, isWin && styles.tableCellWin]}
                        >
                          {isWin ? '✓' : ''}
                        </Text>
                      );
                    }
                    if (config.inputType === 'bid') {
                      const bid = raw && isBidRawInput(raw) ? raw.bid : '?';
                      const tricks = raw && isBidRawInput(raw) ? raw.tricks : '?';
                      const isOk = bid === tricks;
                      return (
                        <Text
                          key={r.roundNumber}
                          style={[styles.tableCell, isOk ? styles.tableCellSKOk : styles.tableCellSKFail]}
                        >
                          {bid}/{tricks}
                        </Text>
                      );
                    }
                    return (
                      <Text
                        key={r.roundNumber}
                        style={[styles.tableCell, isDoubled && styles.tableCellDoubled, isFlip7 && styles.tableCellFlip7]}
                      >
                        {score?.computed ?? '-'}{isFlip7 ? '★' : ''}
                      </Text>
                    );
                  })}
                  <Text style={[styles.tableCell, styles.totalCell, styles.totalValue]}>
                    {getCumulative(player.id)}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
          {skyjoNotes.map((note, i) => (
            <View key={i} style={styles.noteRow}>
              <Text style={styles.noteDot}>●</Text>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── Mode spectateur (iPad paysage) ── */}
      {isSpectatorMode && !forceInputMode ? (
        <TouchableOpacity
          style={styles.spectatorFAB}
          onPress={() => setForceInputMode(true)}
        >
          <Text style={styles.spectatorFABText}>{t('enterRound')}</Text>
        </TouchableOpacity>
      ) : null}

      {/* ── Zone de saisie Skull King ── */}
      {(!isSpectatorMode || forceInputMode) && config.inputType === 'bid' ? (
        <ScrollView contentContainerStyle={styles.inputs}>
          <View style={styles.skDealerBanner}>
            <Text style={styles.skDealerText}>
              {t('dealer', { name: players[(roundNumber - 1) % players.length]?.name ?? '?' })}
            </Text>
          </View>
          {players.map(player => {
            const bid = skBids[player.id] ?? 0;
            const tricks = skTricks[player.id] ?? 0;
            const b14 = skBonus14[player.id] ?? 0;
            const bPirate = skBonusPirate[player.id] ?? 0;
            const bSK = skBonusSK[player.id] ?? false;
            const preview = computeSkullKingScore(bid, tricks, b14, bPirate, bSK, roundNumber);
            return (
              <View key={player.id} style={styles.skCard}>
                <View style={styles.skCardHeader}>
                  <View style={[styles.avatar, { backgroundColor: player.color }]}>
                    <Text style={styles.avatarText}>{player.name[0].toUpperCase()}</Text>
                  </View>
                  <Text style={styles.skPlayerName}>{player.name}</Text>
                  <Text style={[styles.skPreview, preview >= 0 ? styles.skPreviewPos : styles.skPreviewNeg]}>
                    {preview >= 0 ? '+' : ''}{preview} pts
                  </Text>
                </View>
                <View style={styles.skRow}>
                  <View style={styles.skField}>
                    <Text style={styles.skFieldLabel}>{t('skBidLabel')}</Text>
                    <View style={styles.skStepper}>
                      <TouchableOpacity style={styles.stepBtn} onPress={() => setSkBids(p => ({ ...p, [player.id]: Math.max(0, bid - 1) }))}>
                        <Text style={styles.stepBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.skStepValue}>{bid}</Text>
                      <TouchableOpacity style={styles.stepBtn} onPress={() => setSkBids(p => ({ ...p, [player.id]: Math.min(roundNumber, bid + 1) }))}>
                        <Text style={styles.stepBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.skField}>
                    <Text style={styles.skFieldLabel}>{t('skTricksLabel')}</Text>
                    <View style={styles.skStepper}>
                      <TouchableOpacity style={styles.stepBtn} onPress={() => setSkTricks(p => ({ ...p, [player.id]: Math.max(0, tricks - 1) }))}>
                        <Text style={styles.stepBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.skStepValue}>{tricks}</Text>
                      <TouchableOpacity style={styles.stepBtn} onPress={() => setSkTricks(p => ({ ...p, [player.id]: Math.min(roundNumber, tricks + 1) }))}>
                        <Text style={styles.stepBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.skBonusRow}>
                  <View style={styles.skBonusField}>
                    <Text style={styles.skBonusLabel}>{t('skBonus14Label')}</Text>
                    <View style={styles.skBonusStepper}>
                      <TouchableOpacity style={styles.skBonusBtn} onPress={() => setSkBonus14(p => ({ ...p, [player.id]: Math.max(0, b14 - 1) }))}>
                        <Text style={styles.stepBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.skBonusValue}>{b14}</Text>
                      <TouchableOpacity style={styles.skBonusBtn} onPress={() => setSkBonus14(p => ({ ...p, [player.id]: b14 + 1 }))}>
                        <Text style={styles.stepBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.skBonusField}>
                    <Text style={styles.skBonusLabel}>{t('skBonusPirateLabel')}</Text>
                    <View style={styles.skBonusStepper}>
                      <TouchableOpacity style={styles.skBonusBtn} onPress={() => setSkBonusPirate(p => ({ ...p, [player.id]: Math.max(0, bPirate - 1) }))}>
                        <Text style={styles.stepBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.skBonusValue}>{bPirate}</Text>
                      <TouchableOpacity style={styles.skBonusBtn} onPress={() => setSkBonusPirate(p => ({ ...p, [player.id]: bPirate + 1 }))}>
                        <Text style={styles.stepBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.skBonusSKToggle, bSK && styles.skBonusSKToggleOn]}
                    onPress={() => setSkBonusSK(p => ({ ...p, [player.id]: !bSK }))}
                  >
                    <Text style={[styles.skBonusSKText, bSK && styles.skBonusSKTextOn]}>
                      {t('skMermaid', { check: bSK ? ' ✓' : '' })}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (!isSpectatorMode || forceInputMode) && config.inputType === 'wins' ? (
        <ScrollView contentContainerStyle={styles.inputs}>
          <View style={styles.firstPlayerSection}>
            <Text style={styles.firstPlayerLabel}>{t('roundWinnerLabel', { n: roundNumber })}</Text>
            <View style={styles.firstPlayerChips}>
              {players.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.winChip, winRoundWinner === p.id && styles.winChipSelected]}
                  onPress={() => setWinRoundWinner(p.id)}
                >
                  <View style={[styles.winChipAvatar, { backgroundColor: p.color }]}>
                    <Text style={styles.winChipAvatarText}>{p.name[0].toUpperCase()}</Text>
                  </View>
                  <Text style={[styles.winChipText, winRoundWinner === p.id && styles.winChipTextSelected]}>
                    {p.name}
                  </Text>
                  {winRoundWinner === p.id && <Text style={styles.winCheck}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : (!isSpectatorMode || forceInputMode) ? (
        /* ── Zone de saisie numérique ── */
        <ScrollView contentContainerStyle={styles.inputs}>
          <View style={styles.inputsHeader}>
            <Text style={styles.inputsTitle}>{t('inputHeader', { n: roundNumber })}</Text>
            <Text style={styles.inputsHint}>{t('playerTotalHint')}</Text>
          </View>
          {players.map(player => (
            <View key={player.id} style={styles.inputRow}>
              <View style={[styles.avatar, { backgroundColor: player.color }]}>
                <Text style={styles.avatarText}>{player.name[0].toUpperCase()}</Text>
              </View>
              <Text style={styles.playerName}>{player.name}</Text>
              <View style={styles.inputControls}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateInput(
                    player.id,
                    String(parseInt(inputs[player.id] || '0', 10) - 1)
                  )}
                >
                  <Text style={styles.stepBtnText}>−</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.scoreInput}
                  keyboardType="numbers-and-punctuation"
                  value={inputs[player.id]}
                  onChangeText={val => updateInput(player.id, val)}
                  placeholder="0"
                  textAlign="center"
                />
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => updateInput(
                    player.id,
                    String(parseInt(inputs[player.id] || '0', 10) + 1)
                  )}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.previewTotal}>
                = {inputs[player.id].trim() !== '' ? getPreview(player.id) : '—'}
              </Text>
            </View>
          ))}

          {/* Flip 7 — qui a fait le Flip ? */}
          {config.id === 'flip7' && (
            <View style={styles.firstPlayerSection}>
              <Text style={styles.firstPlayerLabel}>{t('flip7By')}</Text>
              <View style={styles.firstPlayerChips}>
                <TouchableOpacity
                  style={[styles.chip, flip7Achieved === null && styles.chipSelected]}
                  onPress={() => setFlip7Achieved(null)}
                >
                  <Text style={[styles.chipText, flip7Achieved === null && styles.chipTextSelected]}>
                    {t('nobody')}
                  </Text>
                </TouchableOpacity>
                {players.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.chip, flip7Achieved === p.id && styles.chipSelected]}
                    onPress={() => setFlip7Achieved(p.id)}
                  >
                    <Text style={[styles.chipText, flip7Achieved === p.id && styles.chipTextSelected]}>
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Sélecteur "A terminé en 1er" pour Skyjo */}
          {config.id === 'skyjo' && (
            <View style={styles.firstPlayerSection}>
              <Text style={styles.firstPlayerLabel}>{t('finishedFirst')}</Text>
              <View style={styles.firstPlayerChips}>
                {players.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.chip, firstPlayerId === p.id && styles.chipSelected]}
                    onPress={() => setFirstPlayerId(p.id)}
                  >
                    <Text style={[styles.chipText, firstPlayerId === p.id && styles.chipTextSelected]}>
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      ) : null}

      {/* Total en cours pour Papayoo */}
      {(!isSpectatorMode || forceInputMode) && config.id === 'papayoo' && (
        <View style={styles.papayooTotal}>
          <Text style={styles.papayooTotalLabel}>{t('papayooRunning')}</Text>
          <Text style={[
            styles.papayooTotalValue,
            game.playerIds.reduce((s, id) => s + (parseInt(inputs[id], 10) || 0), 0) === 250
              ? styles.papayooTotalOk
              : styles.papayooTotalBad
          ]}>
            {game.playerIds.reduce((s, id) => s + (parseInt(inputs[id], 10) || 0), 0)} / 250
          </Text>
        </View>
      )}

      {/* Footer */}
      {isSpectatorMode && forceInputMode && (
        <TouchableOpacity style={styles.spectatorBack} onPress={() => setForceInputMode(false)}>
          <Text style={styles.spectatorBackText}>{t('tableMode')}</Text>
        </TouchableOpacity>
      )}
      {(!isSpectatorMode || forceInputMode) && <View style={styles.footer}>
        <TouchableOpacity style={[styles.validateBtn, { backgroundColor: themeColor }]} onPress={handleValidate}>
          <Text style={styles.validateBtnText}>{t('validateRound', { n: roundNumber })}</Text>
        </TouchableOpacity>
        <View style={styles.footerRow}>
          {game.rounds.length > 0 && (
            <TouchableOpacity style={styles.forceEndBtn} onPress={handleForceEnd}>
              <Text style={styles.forceEndBtnText}>{t('forceEnd')}</Text>
            </TouchableOpacity>
          )}
          {game.rounds.length > 0 && (
            <TouchableOpacity style={styles.undoBtn} onPress={handleUndoLastRound}>
              <Text style={styles.undoBtnText}>{t('undoRoundShort', { n: game.rounds.length })}</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.abandonBtn} onPress={handleAbandon}>
          <Text style={styles.abandonBtnText}>{t('abandonTitle')}</Text>
        </TouchableOpacity>
      </View>}

    </SafeAreaView>
    </Animated.View>
  );
}

const PURPLE = '#6c63ff';
const RED = '#e74c3c';

function makeStyles(colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      paddingHorizontal: 16, paddingVertical: 12,
      backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border2,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    headerInner: { flex: 1 },
    headerTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    rulesBtn: {
      width: 30, height: 30, borderRadius: 15,
      backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center',
      marginLeft: 8,
    },
    rulesBtnText: { fontSize: 14, fontWeight: '700', color: colors.textSub },
    headerBtns: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    fullRulesBtn: {
      paddingHorizontal: 10, paddingVertical: 6,
      borderRadius: 8, backgroundColor: PURPLE + '18',
      borderWidth: 1, borderColor: PURPLE + '44',
    },
    fullRulesBtnText: { fontSize: 12, color: PURPLE, fontWeight: '600' },
    back: { fontSize: 28, color: PURPLE, marginRight: 4, lineHeight: 32 },
    gameName: { fontSize: 20, fontWeight: '700', color: colors.text },
    headerMeta: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
    metaText: { fontSize: 13, color: colors.textSub },
    metaDot: { fontSize: 13, color: colors.border },
    metaDir: { fontSize: 13, color: '#2ecc71', fontWeight: '600' },
    roundSub: { fontSize: 13, color: colors.textMuted, marginTop: 2, marginLeft: 36 },
    tableContainer: {
      backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border2,
    },
    table: { padding: 12 },
    tableRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    nameCellWrap: { flexDirection: 'row', alignItems: 'center', width: 100, gap: 6 },
    avatarSmall: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    avatarSmallText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    tableNameText: { fontSize: 13, color: colors.text, flex: 1 },
    tableCell: { width: 48, textAlign: 'center', fontSize: 13, color: colors.textSub },
    tableCellHeader: { fontWeight: '700', color: colors.text },
    tableCellDoubled: { color: RED, fontWeight: '700' },
    tableCellFlip7: { color: '#F39C12', fontWeight: '700' },
    tableCellWin: { color: '#2ecc71', fontWeight: '700', fontSize: 16 },
    totalCell: { width: 56, fontWeight: '700' },
    totalValue: { color: PURPLE },
    noteRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingHorizontal: 12, paddingBottom: 8 },
    noteDot: { color: RED, fontSize: 10, marginTop: 3 },
    noteText: { fontSize: 12, color: RED, flex: 1 },
    inputs: { padding: 16, gap: 10 },
    inputsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    inputsTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
    inputsHint: { fontSize: 12, color: colors.textMuted },
    inputRow: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: colors.surface, borderRadius: 12, padding: 12,
    },
    avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    playerName: { flex: 1, fontSize: 15, color: colors.text },
    inputControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    stepBtn: {
      width: 32, height: 32, borderRadius: 16,
      backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center',
    },
    stepBtnText: { fontSize: 20, color: colors.text, lineHeight: 24 },
    scoreInput: {
      width: 52, height: 38, borderRadius: 8,
      backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border,
      fontSize: 16, fontWeight: '600', color: colors.text,
    },
    previewTotal: { fontSize: 13, color: colors.textSub, width: 44, textAlign: 'right' },
    firstPlayerSection: {
      backgroundColor: colors.surface, borderRadius: 12, padding: 14, gap: 10, marginTop: 4,
    },
    firstPlayerLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
    firstPlayerChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
      backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border,
    },
    chipSelected: { backgroundColor: PURPLE + '18', borderColor: PURPLE },
    chipText: { fontSize: 14, color: colors.textSub },
    chipTextSelected: { color: PURPLE, fontWeight: '600' },
    winChip: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      backgroundColor: colors.surface, borderRadius: 14, padding: 14,
      borderWidth: 2, borderColor: 'transparent',
      shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    },
    winChipSelected: { borderColor: '#2ecc71', backgroundColor: colors.greenBg },
    winChipAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    winChipAvatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    winChipText: { flex: 1, fontSize: 16, color: colors.text },
    winChipTextSelected: { color: '#0F6E56', fontWeight: '600' },
    winCheck: { fontSize: 18, color: '#2ecc71', fontWeight: '700' },
    footer: {
      padding: 16, backgroundColor: colors.surface,
      borderTopWidth: 1, borderTopColor: colors.border2,
    },
    validateBtn: {
      backgroundColor: PURPLE, borderRadius: 12,
      paddingVertical: 16, alignItems: 'center', marginBottom: 8,
    },
    validateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    forceEndBtn: { paddingVertical: 8, paddingHorizontal: 4 },
    forceEndBtnText: { fontSize: 14, color: colors.textSub, fontWeight: '500' },
    undoBtn: { paddingVertical: 8, paddingHorizontal: 4 },
    undoBtnText: { fontSize: 13, color: colors.textMuted },
    papayooTotal: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginHorizontal: 16,
    },
    papayooTotalLabel: { fontSize: 14, color: colors.textSub },
    papayooTotalValue: { fontSize: 16, fontWeight: '700' },
    papayooTotalOk: { color: '#2ECC71' },
    papayooTotalBad: { color: '#E74C3C' },
    abandonBtn: { alignItems: 'center', paddingVertical: 6 },
    abandonBtnText: { fontSize: 13, color: colors.textMuted },
    skDealerBanner: {
      backgroundColor: colors.surface2, borderRadius: 10, padding: 12,
      borderLeftWidth: 3, borderLeftColor: '#f39c12',
    },
    skDealerText: { fontSize: 14, color: colors.textSub },
    skDealerName: { fontWeight: '700', color: colors.text },
    skCard: {
      backgroundColor: colors.surface, borderRadius: 14, padding: 14, gap: 12,
    },
    skCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    skPlayerName: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
    skPreview: { fontSize: 15, fontWeight: '700' },
    skPreviewPos: { color: '#2ecc71' },
    skPreviewNeg: { color: '#e74c3c' },
    skRow: { flexDirection: 'row', gap: 16 },
    skField: { flex: 1, alignItems: 'center', gap: 6 },
    skFieldLabel: { fontSize: 12, color: colors.textSub, fontWeight: '500' },
    skStepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    skStepValue: { fontSize: 20, fontWeight: '700', color: colors.text, minWidth: 32, textAlign: 'center' },
    skBonusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
    skBonusField: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    skBonusLabel: { fontSize: 11, color: colors.textSub },
    skBonusStepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    skBonusBtn: {
      width: 24, height: 24, borderRadius: 12,
      backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center',
    },
    skBonusValue: { fontSize: 14, fontWeight: '600', color: colors.text, minWidth: 20, textAlign: 'center' },
    skBonusSKToggle: {
      borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
      backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.border,
    },
    skBonusSKToggleOn: { backgroundColor: '#3a2e0a', borderColor: '#f39c12' },
    skBonusSKText: { fontSize: 11, color: colors.textSub, fontWeight: '500' },
    skBonusSKTextOn: { color: '#f39c12', fontWeight: '700' },
    tableCellSKOk: { color: '#2ecc71', fontWeight: '700' },
    tableCellSKFail: { color: '#e74c3c', fontWeight: '700' },
    spectatorFAB: {
      position: 'absolute', bottom: 24, right: 24,
      backgroundColor: PURPLE, borderRadius: 24,
      paddingHorizontal: 20, paddingVertical: 12,
      shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
      zIndex: 10,
    },
    spectatorFABText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    spectatorBack: {
      backgroundColor: colors.surface2, paddingVertical: 10,
      alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border2,
    },
    spectatorBackText: { fontSize: 14, color: colors.textSub },
  });
}
