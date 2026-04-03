import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, useWindowDimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const PURPLE = '#6c63ff';

const SLIDES = [
  { icon: '🏠', titleKey: 'tuto_s1_title', bullets: ['tuto_s1_b1', 'tuto_s1_b2', 'tuto_s1_b3'] },
  { icon: '🃏', titleKey: 'tuto_s2_title', bullets: ['tuto_s2_b1', 'tuto_s2_b2', 'tuto_s2_b3'] },
  { icon: '✏️', titleKey: 'tuto_s3_title', bullets: ['tuto_s3_b1', 'tuto_s3_b2', 'tuto_s3_b3'] },
  { icon: '🏆', titleKey: 'tuto_s4_title', bullets: ['tuto_s4_b1', 'tuto_s4_b2', 'tuto_s4_b3'] },
  { icon: '📋', titleKey: 'tuto_s5_title', bullets: ['tuto_s5_b1', 'tuto_s5_b2', 'tuto_s5_b3'] },
  { icon: '👤', titleKey: 'tuto_s6_title', bullets: ['tuto_s6_b1', 'tuto_s6_b2', 'tuto_s6_b3'] },
  { icon: '⚙️', titleKey: 'tuto_s7_title', bullets: ['tuto_s7_b1', 'tuto_s7_b2', 'tuto_s7_b3'] },
] as const;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function TutorialModal({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  function handleNext() {
    if (isLast) {
      setIndex(0);
      onClose();
    } else {
      setIndex(i => i + 1);
    }
  }

  function handleSkip() {
    setIndex(0);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surface, maxWidth: Math.min(width - 40, 400) }]}>

          {/* Icon */}
          <Text style={styles.icon}>{slide.icon}</Text>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            {t(slide.titleKey as any)}
          </Text>

          {/* Bullets */}
          <View style={styles.bullets}>
            {slide.bullets.map(key => (
              <View key={key} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: PURPLE }]}>•</Text>
                <Text style={[styles.bulletText, { color: colors.textSub }]}>
                  {t(key as any)}
                </Text>
              </View>
            ))}
          </View>

          {/* Progress dots */}
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === index ? PURPLE : colors.border },
                  i === index && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.btnRow}>
            {!isLast && (
              <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={[styles.skipBtn, { color: colors.textMuted }]}>{t('tuto_skip')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.nextBtn, !isLast && styles.nextBtnRight]}
              onPress={handleNext}
            >
              <Text style={styles.nextBtnText}>
                {isLast ? t('tuto_done') : t('tuto_next')}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },
  icon: { fontSize: 52, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  bullets: { width: '100%', gap: 10, marginBottom: 28 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bulletDot: { fontSize: 16, lineHeight: 22, fontWeight: '700' },
  bulletText: { fontSize: 15, lineHeight: 22, flex: 1 },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 28 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dotActive: { width: 20 },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  skipBtn: { fontSize: 15, fontWeight: '500' },
  nextBtn: {
    backgroundColor: PURPLE,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  nextBtnRight: { marginLeft: 'auto' },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
