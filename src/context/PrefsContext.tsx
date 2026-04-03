import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_KEEP_AWAKE = '@prefs_keep_awake';
const KEY_HAPTICS = '@prefs_haptics';

interface PrefsContextValue {
  keepAwake: boolean;
  hapticsEnabled: boolean;
  setKeepAwake: (val: boolean) => void;
  setHapticsEnabled: (val: boolean) => void;
}

const PrefsContext = createContext<PrefsContextValue>({
  keepAwake: true,
  hapticsEnabled: true,
  setKeepAwake: () => {},
  setHapticsEnabled: () => {},
});

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [keepAwake, setKeepAwakeState] = useState(true);
  const [hapticsEnabled, setHapticsState] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(KEY_KEEP_AWAKE),
      AsyncStorage.getItem(KEY_HAPTICS),
    ]).then(([ka, hap]) => {
      if (ka !== null) setKeepAwakeState(ka === 'true');
      if (hap !== null) setHapticsState(hap === 'true');
    });
  }, []);

  const setKeepAwake = useCallback((val: boolean) => {
    setKeepAwakeState(val);
    AsyncStorage.setItem(KEY_KEEP_AWAKE, val ? 'true' : 'false');
  }, []);

  const setHapticsEnabled = useCallback((val: boolean) => {
    setHapticsState(val);
    AsyncStorage.setItem(KEY_HAPTICS, val ? 'true' : 'false');
  }, []);

  return (
    <PrefsContext.Provider value={{ keepAwake, hapticsEnabled, setKeepAwake, setHapticsEnabled }}>
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  return useContext(PrefsContext);
}
