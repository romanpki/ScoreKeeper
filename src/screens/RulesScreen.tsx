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

type NavProp = NativeStackNavigationProp<RootStackParamList, "Rules">;
type RouteType = RouteProp<RootStackParamList, "Rules">;

// ─── Types ───────────────────────────────────

type RulesValue =
  | string
  | string[]
  | Record<string, string | string[]>
  | { min: number; max: number }
  | undefined;

// ─── Helpers de rendu ────────────────────────

function renderValue(
  value: RulesValue,
  depth = 0,
  colors: ReturnType<typeof import("../context/ThemeContext").useTheme>["colors"]
): React.ReactNode {
  if (value === undefined || value === null) return null;

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
        {value.min} à {value.max} joueurs
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
          {formatKey(subKey)}
        </Text>
        {renderValue(subVal as RulesValue, depth + 1, colors)}
      </View>
    ));
  }

  return null;
}

function formatKey(key: string): string {
  const labels: Record<string, string> = {
    objective: "Objectif",
    setup: "Mise en place",
    gameplay: "Déroulement",
    cards: "Les cartes",
    scoring: "Score",
    endGame: "Fin de partie",
    players: "Joueurs",
    duration: "Durée",
    advancedRules: "Règles avancées",
    teamRules: "Mode équipes",
    modes: "Modes de jeu",
    endRound: "Fin de manche",
    endTurn: "Fin de tour",
    challenge: "Contestation",
    uno: "Règle UNO",
    actionCards: "Cartes Action",
    cardValues: "Valeur des cartes",
    tips: "Conseils",
    flip7: "Flip 7",
    cardDistribution: "Distribution",
    steps: "Étapes",
    colored: "Cartes de couleur",
    special: "Cartes spéciales",
    bonus: "Cartes Bonus",
    number: "Cartes Numéro",
    systemSkullKing: "Système Skull King",
    systemRascal: "Système Rascal",
    bonusPoints: "Points bonus",
    winner: "Vainqueur",
    classic: "Cartes classiques",
    payoo: "Cartes Payoo",
    papayoo: "Le Papayoo",
    total: "Total de la manche",
    simple: "Mode Simple",
    picante: "Mode Picante",
    alternative: "Variante",
    players_team: "Joueurs",
  };
  return labels[key] ?? key.replace(/([A-Z])/g, " $1").trim();
}

const SKIP_KEYS = new Set(["gameId", "gameName", "tagline"]);

// ─── Composant principal ─────────────────────

const PURPLE = "#6c63ff";

export default function RulesScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { colors, isDark } = useTheme();
  const { gameId } = route.params;
  const rules = ALL_GAME_RULES[gameId as GameId];
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (!rules) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <Text style={{ padding: 20, color: "#FF3B30", fontSize: 16 }}>
          Règles introuvables pour ce jeu.
        </Text>
      </SafeAreaView>
    );
  }

  const sections = Object.entries(rules).filter(([key]) => !SKIP_KEYS.has(key));
  const gameName = (rules as any).gameName as string;
  const tagline = (rules as any).tagline as string;

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 8 }}>
          <Text style={{ color: PURPLE, fontSize: 16 }}>‹ Retour</Text>
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
          const label = formatKey(key);
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
                  {renderValue(value as RulesValue, 0, colors)}
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
