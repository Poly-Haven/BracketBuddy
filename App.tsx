import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppStateProvider } from './context/AppStateContext';
import { MainScreen } from './screens/MainScreen';
import { theme } from './utils/theme';

export default function App() {
  return (
    <AppStateProvider>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      <MainScreen />
    </AppStateProvider>
  );
}
