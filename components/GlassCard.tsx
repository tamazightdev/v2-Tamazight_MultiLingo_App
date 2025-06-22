import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 15 }: GlassCardProps) {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} style={StyleSheet.absoluteFillObject} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    // Moroccan-inspired glass-morphic gradient
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    // Apply the gradient as a background
    background: `linear-gradient(
      180deg,
      rgba(250, 250, 250, 0.4) 0%,
      rgba(240, 240, 240, 0.4) 25%,
      rgba(184, 184, 184, 0.4) 50%,
      rgba(156, 28, 39, 0.4) 75%,
      rgba(193, 39, 45, 0.4) 100%
    )`,
  },
  content: {
    padding: 20,
    backgroundColor: 'rgba(250, 250, 250, 0.1)', // Subtle overlay for React Native
  },
});