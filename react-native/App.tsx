import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import NavigationConfig from './src/navigation/navigationConfig';
import React from 'react';


export default function App() {
  return (
    <NavigationConfig></NavigationConfig>
  );
}
