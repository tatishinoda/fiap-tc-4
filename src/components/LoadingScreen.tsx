import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#1A73E8" />
      
      <View style={styles.content}>
        <Ionicons name="wallet-outline" size={80} color="#FFFFFF" />
        <Text style={styles.title}>ByteBank</Text>
        <Text style={styles.subtitle}>Carregando...</Text>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E3F2FD',
    marginBottom: 40,
  },
  loadingContainer: {
    marginTop: 20,
  },
});
