import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: any;
  variant?: 'primary' | 'secondary' | 'emergency' | 'moroccan';
}

export function GradientBackground({ children, style, variant = 'primary' }: GradientBackgroundProps) {
  const getColors = () => {
    switch (variant) {
      case 'moroccan':
        return [
          'rgba(247, 251, 255, 0.9)', // 0% - Pristine white
          'rgba(225, 240, 247, 0.9)', // 25% - Soft sky blue
          'rgba(148, 199, 217, 0.9)', // 50% - Ocean breeze
          'rgba(156, 28, 39, 0.9)',   // 75% - Deep crimson
          'rgba(193, 39, 45, 0.9)'    // 100% - Bright red
        ] as const;
      case 'emergency':
        return [
          'rgba(156, 28, 39, 0.95)',  // Deep crimson
          'rgba(193, 39, 45, 0.95)'   // Bright red
        ] as const;
      case 'secondary':
        return [
          'rgba(247, 251, 255, 0.1)', // Subtle pristine white
          'rgba(148, 199, 217, 0.1)'  // Subtle ocean breeze
        ] as const;
      default:
        return [
          'rgba(148, 199, 217, 0.8)',  // Ocean breeze
          'rgba(156, 28, 39, 0.8)',    // Deep crimson
          'rgba(193, 39, 45, 0.8)'     // Bright red
        ] as const;
    }
  };

  const getLocations = () => {
    switch (variant) {
      case 'moroccan':
        return [0, 0.25, 0.5, 0.75, 1];
      case 'emergency':
        return [0, 1];
      case 'secondary':
        return [0, 1];
      default:
        return [0, 0.6, 1];
    }
  };

  return (
    <LinearGradient
      colors={getColors()}
      locations={getLocations()}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[StyleSheet.absoluteFillObject, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});