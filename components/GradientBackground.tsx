import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: any;
  variant?: 'primary' | 'secondary' | 'emergency';
}

export function GradientBackground({ children, style, variant = 'primary' }: GradientBackgroundProps) {
  const getColors = () => {
    switch (variant) {
      case 'emergency':
        return ['#C53030', '#822727'] as const; // Darker red gradient for emergency
      case 'secondary':
        return ['rgba(67, 56, 202, 0.1)', 'rgba(219, 39, 119, 0.1)'] as const; // Subtle gradient
      default:
        return ['#4338CA', '#DB2777'] as const; // Primary indigo to magenta
    }
  };

  return (
    <LinearGradient
      colors={getColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
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
