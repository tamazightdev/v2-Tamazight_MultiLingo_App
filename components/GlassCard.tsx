import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassCard({ children, style, intensity = 15 }: GlassCardProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Moroccan-inspired gradient background */}
      <LinearGradient
        colors={[
          'rgba(250, 250, 250, 0.4)', // Pure light
          'rgba(240, 240, 240, 0.4)', // Soft gray
          'rgba(184, 184, 184, 0.4)', // Medium gray
          'rgba(156, 28, 39, 0.4)',   // Deep crimson
          'rgba(193, 39, 45, 0.4)'    // Bright red
        ]}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    padding: 20,
  },
});