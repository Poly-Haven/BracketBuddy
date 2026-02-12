import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ExposureSettings = {
  bracketCount: number;
  evSpacing: number;
  minShutterSeconds: number;
  maxShutterSeconds: number;
  includeThirdStops: boolean;
};

type AppStateContextValue = {
  settings: ExposureSettings;
  updateSettings: (updates: Partial<ExposureSettings>) => void;
  resetSettings: () => void;
  isReady: boolean;
};

const STORAGE_KEY = 'bracketbuddy.settings.v1';

const defaultSettings: ExposureSettings = {
  bracketCount: 5,
  evSpacing: 3,
  minShutterSeconds: 1 / 8000,
  maxShutterSeconds: 30,
  includeThirdStops: true,
};

const allowedBracketCounts = new Set([3, 5, 7, 9, 11]);
const allowedEvSpacing = new Set([1, 2, 3]);

const sanitizeSettings = (value: ExposureSettings): ExposureSettings => {
  const bracketCount = allowedBracketCounts.has(value.bracketCount)
    ? value.bracketCount
    : defaultSettings.bracketCount;
  const evSpacing = allowedEvSpacing.has(value.evSpacing)
    ? value.evSpacing
    : defaultSettings.evSpacing;
  const minSeconds = Number.isFinite(value.minShutterSeconds)
    ? value.minShutterSeconds
    : defaultSettings.minShutterSeconds;
  const maxSeconds = Number.isFinite(value.maxShutterSeconds)
    ? value.maxShutterSeconds
    : defaultSettings.maxShutterSeconds;

  if (minSeconds <= 0 || maxSeconds <= 0 || minSeconds >= maxSeconds) {
    return {
      ...value,
      bracketCount,
      evSpacing,
      minShutterSeconds: defaultSettings.minShutterSeconds,
      maxShutterSeconds: defaultSettings.maxShutterSeconds,
    };
  }

  return {
    ...value,
    bracketCount,
    evSpacing,
    minShutterSeconds: minSeconds,
    maxShutterSeconds: maxSeconds,
  };
};

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<ExposureSettings>(defaultSettings);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as ExposureSettings;
          setSettings(sanitizeSettings({ ...defaultSettings, ...parsed }));
        }
      } catch {
        setSettings(defaultSettings);
      } finally {
        setIsReady(true);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const persist = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch {
        // Ignore storage errors for now.
      }
    };

    persist();
  }, [isReady, settings]);

  const updateSettings = (updates: Partial<ExposureSettings>) => {
    setSettings((current) => sanitizeSettings({ ...current, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value = useMemo(
    () => ({ settings, updateSettings, resetSettings, isReady }),
    [settings, isReady]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};
