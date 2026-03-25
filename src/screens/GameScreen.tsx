import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  getGameById, getPlayers, upsertGame, getGames, saveGames,
  getAllGameConfigs,
} from '../storage/StorageService';
import { Game, GameConfig, Player, Round } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type RoutePropType = RouteProp<RootStackParamList, 'Game'>;

export default function GameScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RoutePropType>();
  const { gameId } = route.params;

  const [game, setGame] = useState<Game | null>(null);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [firstPlayerId, setFirstPlayerId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState<string>('');
  const [flip7Achieved, setFlip7Achieved] = useState<string | null>(null);
  const [winRoundWinner, setWinRoundWinner] = useState<string | null>(null);

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

      const initToZero = cfg?.id === 'papayoo' || cfg?.id === 'flip7' || cfg?.id === 'odin';
      const init: Record<string, string> = {};
      g.playerIds.forEach(id => { init[id] = initToZero ? '0' : ''; });
      setInputs(init);
    };
    load();
  }, [gameId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!game) return;
      const diff = Date.now() - game.startedAt;
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setElapsed(mins > 0 ? `${mins}min${secs > 0 ? ` ${secs}s` : ''}` : `${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [game?.startedAt]);

  if (!game || !config) return null;

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
        if (score?.rawInput && (score.rawInput as any).doubled) {
          const player = players.find(p => p.id === id);
          const orig = (score.rawInput as any).original;
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
      const threshold = (game!.metadata as any)?.targetScore ?? config.endValue;
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
    const currentLeader = determineWinner(game.rounds);
    Alert.alert(
      'Terminer la partie',
      'Sélectionne le vainqueur :',
      [
        { text: 'Annuler', style: 'cancel' },
        ...players.map(p => ({
          text: p.name + (p.id === currentLeader ? ' 👑' : ''),
          onPress: () => forceEndGame(p.id),
        })),
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
    navigation.replace('EndGame', { gameId: game.id });
  }

  // ── Validation — Trio (tracker de victoires) ──────────────────────────────────

  async function handleValidateTrio() {
    if (!game || !config) return;
    if (!winRoundWinner) {
      Alert.alert('Vainqueur manquant', 'Sélectionne qui a gagné cette manche.');
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

    await upsertGame(updatedGame);
    setGame(updatedGame);
    setWinRoundWinner(null);

    if (isFinished) {
      navigation.replace('EndGame', { gameId: game.id });
    }
  }

  // ── Validation — jeux numériques ──────────────────────────────────────────────

  async function handleValidate() {
    if (!game || !config) return;

    if (config.inputType === 'wins') {
      return handleValidateTrio();
    }

    const missing = game.playerIds.some(id => inputs[id].trim() === '');
    if (missing) {
      Alert.alert('Saisie incomplète', 'Entre un score pour chaque joueur.');
      return;
    }

    if (config.id === 'papayoo') {
      const total = game.playerIds.reduce((sum, id) =>
        sum + (parseInt(inputs[id], 10) || 0), 0
      );
      if (total !== 250) {
        Alert.alert(
          'Total incorrect',
          `La somme des points doit être égale à 250.\nTotal actuel : ${total} pts.`
        );
        return;
      }
    }

    if (config.id === 'skyjo' && !firstPlayerId) {
      Alert.alert('Joueur manquant', 'Indique qui a retourné sa dernière carte en premier.');
      return;
    }

    const roundNumber = game.rounds.length + 1;
    const rawValues: Record<string, number> = {};
    game.playerIds.forEach(id => {
      rawValues[id] = parseInt(inputs[id], 10) || 0;
    });

    const doubled: Record<string, boolean> = {};
    if (config.id === 'skyjo' && firstPlayerId) {
      const minScore = Math.min(...Object.values(rawValues));
      if (rawValues[firstPlayerId] !== minScore) {
        doubled[firstPlayerId] = true;
        rawValues[firstPlayerId] *= 2;
      }
    }

    const scores: Round['scores'] = {};
    game.playerIds.forEach(id => {
      const original = parseInt(inputs[id], 10) || 0;
      const val = rawValues[id];
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

    await upsertGame(updatedGame);
    setGame(updatedGame);
    setFirstPlayerId(null);
    setFlip7Achieved(null);

    const initToZero = config.id === 'papayoo' || config.id === 'flip7' || config.id === 'odin';
    const init: Record<string, string> = {};
    game.playerIds.forEach(id => { init[id] = initToZero ? '0' : ''; });
    setInputs(init);

    if (isFinished) {
      navigation.replace('EndGame', { gameId: game.id });
    }
  }

  async function handleAbandon() {
    Alert.alert(
      'Abandonner la partie ?',
      'La partie sera supprimée définitivement.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Abandonner', style: 'destructive',
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
  const targetScore = (game.metadata as any)?.targetScore ?? config.endValue;

  const endLabel = config.id === 'papayoo'
    ? `${game.playerIds.length} manches`
    : config.inputType === 'wins'
    ? `Fin à ${targetScore} victoire${targetScore > 1 ? 's' : ''}`
    : config.endCondition === 'threshold'
    ? `Fin à ${targetScore}`
    : config.endCondition === 'fixed'
    ? `${config.endValue} manches`
    : 'Manches choisies';

  const dirLabel = config.inputType === 'wins'
    ? ''
    : config.scoreDirection === 'low' ? 'Le + bas gagne' : 'Le + haut gagne';

  const skyjoNotes = getSkyjoDoubledNotes();

  return (
    <SafeAreaView style={styles.safe}>

      {/* En-tête */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.back}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.gameName}>{config.name}</Text>
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
          <Text style={styles.roundSub}>Manche {roundNumber}{elapsed ? ` · ${elapsed}` : ''}</Text>
        </View>
      </View>

      {/* Tableau des scores */}
      {game.rounds.length > 0 && (
        <View style={styles.tableContainer}>
          <ScrollView horizontal>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.nameCellWrap}>
                  <Text style={[styles.tableCell, styles.tableCellHeader]}>Joueur</Text>
                </View>
                {game.rounds.map(r => (
                  <Text key={r.roundNumber} style={[styles.tableCell, styles.tableCellHeader]}>
                    M{r.roundNumber}
                  </Text>
                ))}
                <Text style={[styles.tableCell, styles.tableCellHeader, styles.totalCell]}>
                  {config.inputType === 'wins' ? 'Vict.' : 'Total'}
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
                    const isDoubled = (score?.rawInput as any)?.doubled;
                    const isFlip7 = (score?.rawInput as any)?.flip7;
                    const isWin = (score?.rawInput as any)?.winner;

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

      {/* ── Zone de saisie Trio ── */}
      {config.inputType === 'wins' ? (
        <ScrollView contentContainerStyle={styles.inputs}>
          <View style={styles.firstPlayerSection}>
            <Text style={styles.firstPlayerLabel}>Qui a gagné la manche {roundNumber} ?</Text>
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
      ) : (
        /* ── Zone de saisie numérique ── */
        <ScrollView contentContainerStyle={styles.inputs}>
          <View style={styles.inputsHeader}>
            <Text style={styles.inputsTitle}>Saisie — Manche {roundNumber}</Text>
            <Text style={styles.inputsHint}>Total de chaque joueur</Text>
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
              <Text style={styles.firstPlayerLabel}>Flip 7 réalisé par :</Text>
              <View style={styles.firstPlayerChips}>
                <TouchableOpacity
                  style={[styles.chip, flip7Achieved === null && styles.chipSelected]}
                  onPress={() => setFlip7Achieved(null as any)}
                >
                  <Text style={[styles.chipText, flip7Achieved === null && styles.chipTextSelected]}>
                    Personne
                  </Text>
                </TouchableOpacity>
                {players.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.chip, flip7Achieved === p.id && styles.chipSelected]}
                    onPress={() => setFlip7Achieved(p.id as any)}
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
              <Text style={styles.firstPlayerLabel}>A terminé en 1er :</Text>
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
      )}

      {/* Total en cours pour Papayoo */}
      {config.id === 'papayoo' && (
        <View style={styles.papayooTotal}>
          <Text style={styles.papayooTotalLabel}>Total saisi :</Text>
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
      <View style={styles.footer}>
        <TouchableOpacity style={styles.validateBtn} onPress={handleValidate}>
          <Text style={styles.validateBtnText}>Valider la manche {roundNumber}</Text>
        </TouchableOpacity>
        {game.rounds.length > 0 && (
          <TouchableOpacity style={styles.forceEndBtn} onPress={handleForceEnd}>
            <Text style={styles.forceEndBtnText}>Terminer la partie</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.abandonBtn} onPress={handleAbandon}>
          <Text style={styles.abandonBtnText}>Abandonner la partie</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';
const RED = '#e74c3c';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  back: { fontSize: 28, color: PURPLE, marginRight: 4, lineHeight: 32 },
  gameName: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  headerMeta: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  metaText: { fontSize: 13, color: '#888' },
  metaDot: { fontSize: 13, color: '#bbb' },
  metaDir: { fontSize: 13, color: '#2ecc71', fontWeight: '600' },
  roundSub: { fontSize: 13, color: '#aaa', marginTop: 2, marginLeft: 36 },
  tableContainer: {
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  table: { padding: 12 },
  tableRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  nameCellWrap: { flexDirection: 'row', alignItems: 'center', width: 100, gap: 6 },
  avatarSmall: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  avatarSmallText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  tableNameText: { fontSize: 13, color: '#1a1a1a', flex: 1 },
  tableCell: { width: 48, textAlign: 'center', fontSize: 13, color: '#444' },
  tableCellHeader: { fontWeight: '700', color: '#1a1a1a' },
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
  inputsTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  inputsHint: { fontSize: 12, color: '#aaa' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  playerName: { flex: 1, fontSize: 15, color: '#1a1a1a' },
  inputControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center',
  },
  stepBtnText: { fontSize: 20, color: '#333', lineHeight: 24 },
  scoreInput: {
    width: 52, height: 38, borderRadius: 8,
    backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: '#e0e0e0',
    fontSize: 16, fontWeight: '600',
  },
  previewTotal: { fontSize: 13, color: '#888', width: 44, textAlign: 'right' },
  firstPlayerSection: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14, gap: 10, marginTop: 4,
  },
  firstPlayerLabel: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  firstPlayerChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#e0e0e0',
  },
  chipSelected: { backgroundColor: PURPLE + '18', borderColor: PURPLE },
  chipText: { fontSize: 14, color: '#555' },
  chipTextSelected: { color: PURPLE, fontWeight: '600' },
  // Trio win chips
  winChip: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  winChipSelected: { borderColor: '#2ecc71', backgroundColor: '#e1f5ee' },
  winChipAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  winChipAvatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  winChipText: { flex: 1, fontSize: 16, color: '#1a1a1a' },
  winChipTextSelected: { color: '#085041', fontWeight: '600' },
  winCheck: { fontSize: 18, color: '#2ecc71', fontWeight: '700' },
  footer: {
    padding: 16, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  validateBtn: {
    backgroundColor: PURPLE, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginBottom: 8,
  },
  validateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  forceEndBtn: { alignItems: 'center', paddingVertical: 8 },
  forceEndBtnText: { fontSize: 14, color: '#888', fontWeight: '500' },
  papayooTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 12, padding: 14, marginHorizontal: 16,
  },
  papayooTotalLabel: { fontSize: 14, color: '#888' },
  papayooTotalValue: { fontSize: 16, fontWeight: '700' },
  papayooTotalOk: { color: '#2ECC71' },
  papayooTotalBad: { color: '#E74C3C' },
  abandonBtn: { alignItems: 'center', paddingVertical: 6 },
  abandonBtnText: { fontSize: 13, color: '#bbb' },
});
