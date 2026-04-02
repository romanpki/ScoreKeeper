import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { ALL_GAME_RULES, GameId } from "../games/rules";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Strings } from "../locales/fr";

type NavProp = NativeStackNavigationProp<RootStackParamList, "Rules">;
type RouteType = RouteProp<RootStackParamList, "Rules">;

// ─── Types ───────────────────────────────────

type LocalizedString = { fr: string; en: string };
type LocalizedStringArray = { fr: string[]; en: string[] };

type RulesValue =
  | string
  | string[]
  | LocalizedString
  | LocalizedStringArray
  | Record<string, RulesValue>
  | { min: number; max: number }
  | undefined;

function isLocalized(v: unknown): v is LocalizedString | LocalizedStringArray {
  return typeof v === "object" && v !== null && "fr" in v && "en" in v &&
    !("min" in v) && !("max" in v);
}

// ─── Helpers de rendu ────────────────────────

function renderValue(
  value: RulesValue,
  depth = 0,
  colors: ReturnType<typeof import("../context/ThemeContext").useTheme>["colors"],
  t: (key: keyof Strings, vars?: Record<string, string | number>) => string,
  lang: import("../context/LanguageContext").Lang
): React.ReactNode {
  if (value === undefined || value === null) return null;

  if (isLocalized(value)) {
    return renderValue((value as any)[lang], depth, colors, t, lang);
  }

  if (typeof value === "string") {
    return (
      <Text
        key={value}
        style={[
          { fontSize: 14, lineHeight: 21, color: colors.textSub, marginTop: 10 },
          depth > 0 && { paddingLeft: 12, color: colors.textSub },
        ]}
      >
        {value}
      </Text>
    );
  }

  if (Array.isArray(value)) {
    return value.map((item, i) => (
      <Text
        key={i}
        style={[
          { fontSize: 14, lineHeight: 21, color: colors.textSub, marginTop: 6, paddingLeft: 4 },
          depth > 0 && { paddingLeft: 12 },
        ]}
      >
        {"• "}
        {item}
      </Text>
    ));
  }

  if (typeof value === "object" && "min" in value && "max" in value) {
    return (
      <Text style={{ fontSize: 14, lineHeight: 21, color: colors.textSub, marginTop: 10 }}>
        {t('nToMPlayers', { min: value.min, max: value.max })}
      </Text>
    );
  }

  if (typeof value === "object") {
    return Object.entries(value).map(([subKey, subVal]) => (
      <View key={subKey} style={{ marginTop: 12 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 4,
          }}
        >
          {t(('rk_' + subKey) as keyof Strings)}
        </Text>
        {renderValue(subVal as RulesValue, depth + 1, colors, t, lang)}
      </View>
    ));
  }

  return null;
}


const SKIP_KEYS = new Set(["gameId", "gameName", "tagline"]);

// ─── Composant principal ─────────────────────

const PURPLE = "#6c63ff";

export default function RulesScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { colors, isDark } = useTheme();
  const { t, lang } = useLanguage();
  const { gameId } = route.params;
  const rules = ALL_GAME_RULES[gameId as GameId];
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!rules) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <Text style={{ padding: 20, color: "#FF3B30", fontSize: 16 }}>
          {t('rulesNotFound')}
        </Text>
      </SafeAreaView>
    );
  }

  const sections = Object.entries(rules).filter(([key]) => !SKIP_KEYS.has(key));
  const gameNameRaw = (rules as any).gameName;
  const taglineRaw = (rules as any).tagline;
  const gameName: string = isLocalized(gameNameRaw) ? (gameNameRaw as any)[lang] : gameNameRaw;
  const tagline: string = isLocalized(taglineRaw) ? (taglineRaw as any)[lang] : taglineRaw;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: isDark ? "#1C1C1E" : "#1C1C1E",
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 16,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 8 }} hitSlop={{ top: 12, bottom: 12, left: 12, right: 16 }}>
          <Text style={{ color: PURPLE, fontSize: 16 }}>{t('backTo')}</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#FFFFFF" }}>
          {gameName}
        </Text>
        <Text style={{ fontSize: 14, color: "#AEAEB2", marginTop: 4 }}>
          {tagline}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {sections.map(([key, value]) => {
          const label = t(('rk_' + key) as keyof Strings);
          const isExpanded = expandedSection === key;

          return (
            <View
              key={key}
              style={[
                {
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  marginBottom: 10,
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isDark ? 0.2 : 0.06,
                  shadowRadius: 4,
                  elevation: 2,
                },
              ]}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                }}
                onPress={() => setExpandedSection(isExpanded ? null : key)}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: colors.text }}>
                  {label}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>
                  {isExpanded ? "▲" : "▼"}
                </Text>
              </TouchableOpacity>

              {isExpanded && (
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                    borderTopWidth: 1,
                    borderTopColor: colors.border2,
                  }}
                >
                  {renderValue(value as RulesValue, 0, colors, t, lang)}
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
