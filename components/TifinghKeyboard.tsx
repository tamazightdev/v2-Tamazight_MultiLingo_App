import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { GlassCard } from './GlassCard';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TifinghKeyboardProps {
  onCharacterPress: (character: string) => void;
  visible: boolean;
}

const TIFINAGH_CHARACTERS = [
  ['ⴰ', 'ⴱ', 'ⴳ', 'ⴷ', 'ⴹ', 'ⴻ', 'ⴼ', 'ⴽ'],
  ['ⵀ', 'ⵃ', 'ⵄ', 'ⵅ', 'ⵇ', 'ⵉ', 'ⵊ', 'ⵍ'],
  ['ⵎ', 'ⵏ', 'ⵓ', 'ⵔ', 'ⵕ', 'ⵖ', 'ⵙ', 'ⵛ'],
  ['ⵜ', 'ⵟ', 'ⵡ', 'ⵢ', 'ⵣ', 'ⵥ', 'ⵯ', '⵿'],
];

export function TifinghKeyboard({ onCharacterPress, visible }: TifinghKeyboardProps) {
  if (!visible) return null;

  const handlePress = (character: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onCharacterPress(character);
  };

  return (
    <GlassCard style={styles.container} variant="strong">
      <View style={styles.header}>
        <Text style={styles.title}>Tifinagh Keyboard</Text>
        <Text style={styles.subtitle}>ⵜⴰⵎⴰⵣⵉⵖⵜ</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.keyboard}>
          {TIFINAGH_CHARACTERS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((char, charIndex) => (
                <TouchableOpacity
                  key={charIndex}
                  style={styles.key}
                  onPress={() => handlePress(char)}
                >
                  <Text style={styles.keyText}>{char}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  keyboard: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  key: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(156, 28, 39, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  keyText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});