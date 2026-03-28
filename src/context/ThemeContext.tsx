import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@theme';

export interface ThemeColors {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  textSub: string;
  textMuted: string;
  border: string;
  border2: string;
  searchBg: string;
  chipBg: string;
  chipActiveBg: string;
  greenBg: string;
  greenBorder: string;
}

const LIGHT: ThemeColors = {
  bg: '#f7f7f7',
  surface: '#ffffff',
  surface2: '#f0f0f0',
  text: '#1a1a1a',
  textSub: '#888888',
  textMuted: '#aaaaaa',
  border: '#e0e0e0',
  border2: '#eeeeee',
  searchBg: '#ffffff',
  chipBg: '#f0f0f0',
  chipActiveBg: '#EEEDFE',
  greenBg: '#E1F5EE',
  greenBorder: '#9FE1CB',
};

const DARK: ThemeColors = {
  bg: '#121212',
  surface: '#1e1e1e',
  surface2: '#2a2a2a',
  text: '#f0f0f0',
  textSub: '#999999',
  textMuted: '#666666',
  border: '#333333',
  border2: '#252525',
  searchBg: '#1e1e1e',
  chipBg: '#2a2a2a',
  chipActiveBg: '#2d2b50',
  greenBg: '#0A2F27',
  greenBorder: '#1A5540',
};

interface ThemeContextValue {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  colors: LIGHT,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(val => {
      if (val === 'dark') setIsDark(true);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, colors: isDark ? DARK : LIGHT, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
