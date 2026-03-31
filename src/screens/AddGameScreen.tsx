import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, Alert, ScrollView, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { addCustomGameConfig } from '../storage/StorageService';
import { GameConfig } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'AddGame'>;

function generateId(): string {
  return 'custom_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function AddGameScreen() {
  const navigation = useNavigation<NavProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(6);
  const [direction, setDirection] = useState<'high' | 'low'>('high');
  const [endType, setEndType] = useState<'threshold' | 'fixed'>('threshold');
  const [endValue, setEndValue] = useState('100');
  const [allowNegative, setAllowNegative] = useState(true);

  async function handleCreate() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert(t('missingName'), t('missingNameMsg'));
      return;
    }
    if (maxPlayers < minPlayers) {
      Alert.alert(t('invalidPlayersMinMax'), t('invalidPlayersMinMaxMsg'));
      return;
    }
    const ev = parseInt(endValue, 10);
    if (isNaN(ev) || ev <= 0) {
      Alert.alert(t('invalidEndValue'), t('invalidEndValueMsg'));
      return;
    }

    const config: GameConfig = {
      id: generateId(),
      name: trimmedName,
      minPlayers,
      maxPlayers,
      scoreDirection: direction,
      endCondition: endType,
      endValue: ev,
      orderMatters: false,
      inputType: 'simple',
      specialRules: { isCustom: true, allowNegative },
    };

    await addCustomGameConfig(config);
    navigation.goBack();
  }

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{t('backTo')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addGameTitle')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Nom */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('gameNameLabel')}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t('gameNamePlaceholder')}
            placeholderTextColor="#bbb"
            value={name}
            onChangeText={setName}
            returnKeyType="done"
          />
        </View>

        {/* Min / Max joueurs */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('playerCountLabel')}</Text>
          <View style={styles.steppersRow}>
            <View style={styles.stepperGroup}>
              <Text style={styles.stepperLabel}>{t('minimum')}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setMinPlayers(v => Math.max(2, v - 1))}
                >
                  <Text style={styles.stepBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepValue}>{minPlayers}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setMinPlayers(v => Math.min(maxPlayers, v + 1))}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.stepperGroup}>
              <Text style={styles.stepperLabel}>{t('maximum')}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setMaxPlayers(v => Math.max(minPlayers, v - 1))}
                >
                  <Text style={styles.stepBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.stepValue}>{maxPlayers}</Text>
                <TouchableOpacity
                  style={styles.stepBtn}
                  onPress={() => setMaxPlayers(v => Math.min(20, v + 1))}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Direction du score */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('scoreObjectiveLabel')}</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, direction === 'high' && styles.toggleBtnActive]}
              onPress={() => setDirection('high')}
            >
              <Text style={[styles.toggleText, direction === 'high' && styles.toggleTextActive]}>
                {t('highDirShort')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, direction === 'low' && styles.toggleBtnActive]}
              onPress={() => setDirection('low')}
            >
              <Text style={[styles.toggleText, direction === 'low' && styles.toggleTextActive]}>
                {t('lowDirShort')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fin de partie */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('endConditionLabel')}</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, endType === 'threshold' && styles.toggleBtnActive]}
              onPress={() => setEndType('threshold')}
            >
              <Text style={[styles.toggleText, endType === 'threshold' && styles.toggleTextActive]}>
                {t('endAtXPts')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, endType === 'fixed' && styles.toggleBtnActive]}
              onPress={() => setEndType('fixed')}
            >
              <Text style={[styles.toggleText, endType === 'fixed' && styles.toggleTextActive]}>
                {t('afterXRounds')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.endValueRow}>
            <Text style={styles.endValueLabel}>
              {endType === 'threshold' ? t('pointsToWinLabel') : t('roundsCountLabel')}
            </Text>
            <TextInput
              style={styles.endValueInput}
              keyboardType="number-pad"
              value={endValue}
              onChangeText={setEndValue}
            />
          </View>
        </View>

        {/* Scores négatifs */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('negativeScoresLabel')}</Text>
            <Switch
              value={allowNegative}
              onValueChange={setAllowNegative}
              trackColor={{ false: '#e0e0e0', true: PURPLE }}
              thumbColor="#fff"
            />
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <Text style={styles.createBtnText}>{t('createGameBtn')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PURPLE = '#6c63ff';

function makeStyles(colors: ReturnType<typeof import('../context/ThemeContext').useTheme>['colors']) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 14,
      backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border2,
    },
    back: { fontSize: 15, color: PURPLE, width: 60 },
    headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
    scroll: { padding: 16, gap: 12 },
    section: {
      backgroundColor: colors.surface, borderRadius: 14, padding: 16, gap: 12,
      shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    },
    sectionLabel: { fontSize: 13, fontWeight: '600', color: colors.textSub, letterSpacing: 0.3 },
    textInput: {
      borderWidth: 1, borderColor: colors.border, borderRadius: 10,
      paddingHorizontal: 14, paddingVertical: 12,
      fontSize: 16, color: colors.text, backgroundColor: colors.bg,
    },
    steppersRow: { flexDirection: 'row', gap: 16 },
    stepperGroup: { flex: 1, gap: 8 },
    stepperLabel: { fontSize: 13, color: colors.textSub },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    stepBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center',
    },
    stepBtnText: { fontSize: 20, color: colors.text, lineHeight: 24 },
    stepValue: { fontSize: 20, fontWeight: '700', color: colors.text, minWidth: 28, textAlign: 'center' },
    toggleRow: { flexDirection: 'row', gap: 8 },
    toggleBtn: {
      flex: 1, paddingVertical: 10, borderRadius: 10,
      backgroundColor: colors.surface2, alignItems: 'center',
      borderWidth: 1, borderColor: colors.border,
    },
    toggleBtnActive: { backgroundColor: PURPLE + '18', borderColor: PURPLE },
    toggleText: { fontSize: 14, color: colors.textSub },
    toggleTextActive: { color: PURPLE, fontWeight: '600' },
    endValueRow: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between', paddingTop: 4,
    },
    endValueLabel: { fontSize: 15, color: colors.text },
    endValueInput: {
      width: 80, height: 42, borderRadius: 10,
      borderWidth: 1, borderColor: PURPLE,
      textAlign: 'center', fontSize: 18, fontWeight: '700', color: PURPLE,
    },
    footer: {
      padding: 16, backgroundColor: colors.surface,
      borderTopWidth: 1, borderTopColor: colors.border2,
    },
    createBtn: { backgroundColor: PURPLE, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
    createBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    switchRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    switchLabel: { fontSize: 15, color: colors.text },
  });
}
