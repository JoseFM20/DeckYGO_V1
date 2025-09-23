import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigation from './src/navigation/index';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigation />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}