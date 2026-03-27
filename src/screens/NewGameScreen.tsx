import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GAME_CONFIGS } from '../games';
import {
  getPlayers, addPlayer, upsertGame,
  getCustomGameConfigs, deleteCustomGameConfig, updatePlayer,
} from '../storage/StorageService';
import { GameConfig, Player } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'NewGame'>;
type RouteType = RouteProp<RootStackParamList, 'NewGame'>;

const COLORS = ['#E74C3C','#3498DB','#2ECC71','#F39C12','#9B59B6','#1ABC9C','#E67E22','#E91E63',
                '#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F'];

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function NewGameScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const preselectedGameId = route.params?.preselectedGameId;

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [targetScore, setTargetScore] = useState<string>('15');
  const [customConfigs, setCustomConfigs] = useState<GameConfig[]>([]);
  const [colorPickerPlayerId, setColorPickerPlayerId] = useState<string | null>(null);

  // Recharge joueurs + jeux custom à chaque fois que l'écran est visible
  useFocusEffect(
    useCallback(() => {
      setColorPickerPlayerId(null);
      async function loadData() {
        const p = await getPlayers();
        setPlayers([...p].sort((a, b) => a.name.localeCompare(b.name)));
        const customs = await getCustomGameConfigs();
        setCustomConfigs(customs);
        if (preselectedGameId) {
          const allGames = [...GAME_CONFIGS, ...customs];
          const found = allGames.find(g => g.id === preselectedGameId);
          if (found) {
            setSelectedGame(found);
            if (found.id === 'trio') setTargetScore('3');
            else setTargetScore('15');
            setStep(2);
          }
        }
      }
      loadData();
    }, [preselectedGameId])
  );

  const allGames = [...GAME_CONFIGS, ...customConfigs];

  // ── Étape 1 : sélection du jeu ──────────────────────────────────────────────

  function handleSelectGame(game: GameConfig) {
    setSelectedGame(game);
    if (game.id === 'trio') setTargetScore('3');
    else setTargetScore('15');
    setStep(2);
  }

  function handleDeleteCustom(game: GameConfig) {
    Alert.alert(
      `Supprimer "${game.name}" ?`,
      'Ce jeu sera définitivement supprimé.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive',
          onPress: async () => {
            await deleteCustomGameConfig(game.id);
            setCustomConfigs(prev => prev.filter(c => c.id !== game.id));
          },
        },
      ]
    );
  }

  // ── Étape 2 : joueurs ────────────────────────────────────────────────────────

  function togglePlayer(id: string) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  }

  async function handleAddPlayer() {
    const name = newName.trim();
    if (!name) return;
    const color = COLORS[players.length % COLORS.length];
    const player: Player = { id: generateId(), name, color, createdAt: Date.now() };
    await addPlayer(player);
    const updated = await getPlayers().then(p => p);
    setPlayers(updated);
    setSelectedIds(prev => [...prev, player.id]);
    setNewName('');
  }

  async function handleColorChange(playerId: string, color: string) {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    const updated = { ...player, color };
    await updatePlayer(updated);
    setPlayers(prev => prev.map(p => p.id === playerId ? updated : p));
    setColorPickerPlayerId(null);
  }

  async function handleStart() {
    if (!selectedGame) return;
    const { minPlayers, maxPlayers } = selectedGame;
    if (selectedIds.length < minPlayers || selectedIds.length > maxPlayers) {
      Alert.alert(
        'Nombre de joueurs invalide',
        `${selectedGame.name} nécessite entre ${minPlayers} et ${maxPlayers} joueurs.`
      );
      return;
    }

    const needsTargetScore = selectedGame.id === 'odin' || selectedGame.id === 'trio';
    const defaultTarget = selectedGame.id === 'trio' ? 3 : 15;

    const game = {
      id: generateId(),
      gameConfigId: selectedGame.id,
      playerIds: selectedIds,
      rounds: [],
      status: 'playing' as const,
      winnerId: null,
      startedAt: Date.now(),
      finishedAt: null,
      metadata: {
        targetScore: needsTargetScore ? (parseInt(targetScore, 10) || defaultTarget) : null,
      },
    };
    await upsertGame(game);
    navigation.replace('Game', { gameId: game.id });
  }

  // ── Rendu étape 1 ────────────────────────────────────────────────────────────

  if (step === 1) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choisir un jeu</Text>
          <View style={{ width: 60 }} />
        </View>
        <ScrollView contentContainerStyle={styles.grid}>
          {allGames.map(game => {
            const isCustom = !!(game.specialRules as any)?.isCustom;
            return (
              <TouchableOpacity
                key={game.id}
                style={styles.gameCard}
                onPress={() => handleSelectGame(game)}
                onLongPress={isCustom ? () => handleDeleteCustom(game) : undefined}
              >
                {isCustom && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteCustom(game)}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <Text style={styles.deleteBtnText}>×</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.gameName}>{game.emoji ?? '🎮'} {game.name}</Text>
                <Text style={styles.gameMeta}>
                  {game.minPlayers}–{game.maxPlayers} joueurs
                </Text>
                <Text style={styles.gameMeta}>
                  {game.inputType === 'wins'
                    ? 'Tracker de victoires'
                    : game.scoreDirection === 'low' ? '↓ Le moins possible' : '↑ Le plus possible'}
                </Text>
                {isCustom && (
                  <View style={styles.customBadge}>
                    <Text style={styles.customBadgeText}>Perso</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Carte "Créer un jeu" */}
          <TouchableOpacity
            style={[styles.gameCard, styles.addGameCard]}
            onPress={() => navigation.navigate('AddGame')}
          >
            <Text style={styles.addGameIcon}>+</Text>
            <Text style={styles.addGameText}>Créer un jeu</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Rendu étape 2 ────────────────────────────────────────────────────────────

  const canStart = selectedGame
    && selectedIds.length >= selectedGame.minPlayers
    && selectedIds.length <= selectedGame.maxPlayers;

  const needsTargetScore = selectedGame?.id === 'odin' || selectedGame?.id === 'trio';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep(1)}>
          <Text style={styles.back}>← {selectedGame?.name}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Joueurs</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Points / Victoires cible (Odin & Trio) */}
        {needsTargetScore && (
          <View style={styles.targetScoreRow}>
            <Text style={styles.targetScoreLabel}>
              {selectedGame?.id === 'trio' ? 'Victoires pour gagner :' : 'Points cible :'}
            </Text>
            <TextInput
              style={styles.targetScoreInput}
              keyboardType="number-pad"
              value={targetScore}
              onChangeText={setTargetScore}
            />
          </View>
        )}

        {/* Ajout rapide */}
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="Prénom du joueur"
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={handleAddPlayer}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddPlayer}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Liste des joueurs */}
        {players.map(player => {
          const selected = selectedIds.includes(player.id);
          return (
            <TouchableOpacity
              key={player.id}
              style={[styles.playerRow, selected && styles.playerRowSelected]}
              onPress={() => togglePlayer(player.id)}
            >
              <TouchableOpacity
                onPress={() => setColorPickerPlayerId(colorPickerPlayerId === player.id ? null : player.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View style={[styles.avatar, { backgroundColor: player.color }]}>
                  <Text style={styles.avatarText}>{player.name[0].toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                {colorPickerPlayerId === player.id && (
                  <View style={styles.colorPicker}>
                    {COLORS.map(c => (
                      <TouchableOpacity
                        key={c}
                        style={[styles.colorDot, { backgroundColor: c }, player.color === c && styles.colorDotSelected]}
                        onPress={() => handleColorChange(player.id, c)}
                      />
                    ))}
                  </View>
                )}
              </View>
              {selected && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}

        {players.length === 0 && (
          <Text style={styles.empty}>Aucun joueur — ajoute-en un ci-dessus !</Text>
        )}
      </ScrollView>

      {/* Barre de validation */}
      <View style={styles.footer}>
        <Text style={styles.footerMeta}>
          {selectedIds.length} joueur{selectedIds.length > 1 ? 's' : ''} sélectionné{selectedIds.length > 1 ? 's' : ''}
          {selectedGame ? ` · ${selectedGame.minPlayers}–${selectedGame.maxPlayers} requis` : ''}
        </Text>
        <TouchableOpacity
          style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
          onPress={handleStart}
          disabled={!canStart}
        >
          <Text style={styles.startBtnText}>Lancer la partie →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
  },
  back: { fontSize: 15, color: PURPLE, width: 60 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  grid: { padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gameCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 14,
    padding: 16, gap: 6,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  gameName: { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  gameMeta: { fontSize: 12, color: '#888' },
  deleteBtn: {
    position: 'absolute', top: 8, right: 10,
    width: 22, height: 22, alignItems: 'center', justifyContent: 'center',
  },
  deleteBtnText: { fontSize: 20, color: '#bbb', lineHeight: 22 },
  customBadge: {
    alignSelf: 'flex-start',
    backgroundColor: PURPLE + '18', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 2,
  },
  customBadgeText: { fontSize: 10, color: PURPLE, fontWeight: '600' },
  addGameCard: {
    borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#ccc',
    backgroundColor: '#fafafa', alignItems: 'center', justifyContent: 'center',
    minHeight: 90,
  },
  addGameIcon: { fontSize: 28, color: '#bbb', lineHeight: 34 },
  addGameText: { fontSize: 13, color: '#bbb', fontWeight: '500' },
  scroll: { padding: 16, gap: 10 },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  input: {
    flex: 1, backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, borderWidth: 1, borderColor: '#e0e0e0',
  },
  addBtn: {
    backgroundColor: PURPLE, borderRadius: 10,
    width: 46, alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 24, fontWeight: '300' },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    borderWidth: 2, borderColor: 'transparent',
  },
  playerRowSelected: { borderColor: PURPLE, backgroundColor: PURPLE + '0D' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 16, color: '#1a1a1a' },
  colorPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  colorDot: { width: 22, height: 22, borderRadius: 11 },
  colorDotSelected: { borderWidth: 2.5, borderColor: '#1a1a1a', transform: [{ scale: 1.2 }] },
  check: { fontSize: 18, color: PURPLE, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 32, fontSize: 15 },
  footer: {
    padding: 16, backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#eee', gap: 10,
  },
  footerMeta: { fontSize: 13, color: '#888', textAlign: 'center' },
  startBtn: { backgroundColor: PURPLE, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  startBtnDisabled: { backgroundColor: '#ccc' },
  startBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  targetScoreRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
  },
  targetScoreLabel: { fontSize: 15, color: '#1a1a1a', fontWeight: '500' },
  targetScoreInput: {
    width: 70, height: 40, borderRadius: 8,
    borderWidth: 1, borderColor: PURPLE,
    textAlign: 'center', fontSize: 16, fontWeight: '600', color: PURPLE,
  },
});
