import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import type { Lang } from '../context/LanguageContext';

const PURPLE = '#6c63ff';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { colors, isDark, toggleTheme } = useTheme();
  const { t, lang, setLang } = useLanguage();
  const [notifStatus, setNotifStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');
  const styles = makeStyles(colors);

  useEffect(() => {
    Notifications.getPermissionsAsync().then(({ status }) => {
      setNotifStatus(status as 'granted' | 'denied' | 'undetermined');
    });
  }, []);

  async function handleNotifToggle() {
    if (notifStatus === 'granted') {
      // Cannot revoke programmatically — send user to system settings
      Linking.openSettings();
    } else if (notifStatus === 'denied') {
      Linking.openSettings();
    } else {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotifStatus(status as 'granted' | 'denied' | 'undetermined');
    }
  }

  const version = Constants.expoConfig?.version ?? '—';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 16 }}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Apparence */}
        <Text style={styles.sectionLabel}>{t('appearance').toUpperCase()}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t('darkMode')}</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: PURPLE + '88' }}
              thumbColor={isDark ? PURPLE : colors.surface2}
            />
          </View>
        </View>

        {/* Langue */}
        <Text style={styles.sectionLabel}>{t('languageLabel').toUpperCase()}</Text>
        <View style={styles.card}>
          <View style={styles.langRow}>
            {(['fr', 'en'] as Lang[]).map(l => (
              <TouchableOpacity
                key={l}
                style={[styles.langPill, lang === l && styles.langPillActive]}
                onPress={() => setLang(l)}
              >
                <Text style={[styles.langPillText, lang === l && styles.langPillTextActive]}>
                  {l === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionLabel}>{t('notificationsLabel').toUpperCase()}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowLabel}>{t('notificationsLabel')}</Text>
              <Text style={styles.rowSub}>
                {notifStatus === 'granted' ? t('notifEnabled') : t('notifDisabled')}
              </Text>
            </View>
            {notifStatus === 'granted' ? (
              <Switch
                value={true}
                onValueChange={handleNotifToggle}
                trackColor={{ false: colors.border, true: PURPLE + '88' }}
                thumbColor={PURPLE}
              />
            ) : (
              <TouchableOpacity onPress={handleNotifToggle}>
                <Text style={styles.openSettingsBtn}>{t('notifOpenSettings')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* À propos */}
        <Text style={styles.sectionLabel}>{t('aboutLabel').toUpperCase()}</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.rowLabel}>{t('versionLabel')}</Text>
            <Text style={styles.rowValue}>{version}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{t('madeWith')}</Text>
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
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14,
      backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border2,
    },
    back: { fontSize: 28, color: PURPLE, lineHeight: 32 },
    headerTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
    scroll: { padding: 20, gap: 8 },
    sectionLabel: {
      fontSize: 11, fontWeight: '600', color: colors.textMuted,
      letterSpacing: 0.8, marginTop: 12, marginBottom: 4, marginLeft: 4,
    },
    card: {
      backgroundColor: colors.surface, borderRadius: 14,
      borderWidth: 1, borderColor: colors.border2, overflow: 'hidden',
    },
    row: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 14,
    },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border2 },
    rowLeft: { flex: 1 },
    rowLabel: { fontSize: 15, color: colors.text },
    rowSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
    rowValue: { fontSize: 15, color: colors.textSub },
    langRow: {
      flexDirection: 'row', gap: 10,
      paddingHorizontal: 16, paddingVertical: 12,
    },
    langPill: {
      flex: 1, paddingVertical: 10, borderRadius: 10,
      backgroundColor: colors.surface2,
      alignItems: 'center',
      borderWidth: 1, borderColor: 'transparent',
    },
    langPillActive: {
      backgroundColor: PURPLE + '18',
      borderColor: PURPLE + '55',
    },
    langPillText: { fontSize: 14, fontWeight: '500', color: colors.textSub },
    langPillTextActive: { color: PURPLE, fontWeight: '600' },
    openSettingsBtn: { fontSize: 13, color: PURPLE, fontWeight: '500' },
  });
}
