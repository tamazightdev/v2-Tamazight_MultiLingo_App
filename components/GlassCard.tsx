import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  variant?: 'default' | 'subtle' | 'strong';
}

export function GlassCard({ children, style, intensity = 20, variant = 'default' }: GlassCardProps) {
  const getBackgroundOpacity = () => {
    switch (variant) {
      case 'subtle': return 0.25;
      case 'strong': return 0.55;
      default: return 0.4;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.gradientOverlay, { opacity: getBackgroundOpacity() }]} />
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Moroccan-inspired 5-stop vertical gradient
    backgroundColor: 'transparent',
    // We'll use a custom gradient implementation for React Native
  },
  content: {
    padding: 20,
    position: 'relative',
    zIndex: 1,
  },
});