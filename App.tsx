import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import { syncFromCloud } from './src/storage/StorageService';
import CloudSyncToast from './src/components/CloudSyncToast';
import TutorialModal from './src/components/TutorialModal';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { PrefsProvider } from './src/context/PrefsContext';

const TUTORIAL_KEY = '@tutorial_seen';

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await syncFromCloud();
      } catch (e) {
        // iCloud non disponible, on continue
      }
      const seen = await AsyncStorage.getItem(TUTORIAL_KEY);
      if (!seen) setShowTutorial(true);
      setReady(true);
    };
    init();
  }, []);

  function handleTutorialClose() {
    setShowTutorial(false);
    AsyncStorage.setItem(TUTORIAL_KEY, '1');
  }

  if (!ready) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#6c63ff" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <PrefsProvider>
          <ThemeProvider>
            <ThemedStatusBar />
            <AppNavigator />
            <CloudSyncToast />
            <TutorialModal visible={showTutorial} onClose={handleTutorialClose} />
          </ThemeProvider>
        </PrefsProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
