import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Mic, Volume2, Copy, Heart } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TranslationInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  language: string;
  isOutput?: boolean;
  onSpeech?: () => void;
  onFavorite?: () => void;
}

export function TranslationInput({ 
  value, 
  onChangeText, 
  placeholder, 
  language, 
  isOutput = false,
  onSpeech,
  onFavorite 
}: TranslationInputProps) {
  const [isRecording, setIsRecording] = useState(false);

  const handleSpeech = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (value) {
      Speech.speak(value, {
        language: getLanguageCode(language),
        pitch: 1.0,
        rate: 0.8,
      });
    }
    onSpeech?.();
  };

  const handleCopy = async () => {
    // Copy to clipboard functionality would go here
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Copied', 'Text copied to clipboard');
  };

  const handleFavorite = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onFavorite?.();
  };

  const getLanguageCode = (lang: string) => {
    switch (lang) {
      case 'Arabic': return 'ar';
      case 'French': return 'fr';
      case 'English': return 'en';
      default: return 'en';
    }
  };

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.languageLabel}>{language}</Text>
        <View style={styles.actions}>
          {!isOutput && (
            <TouchableOpacity 
              style={[styles.actionButton, isRecording && styles.recording]}
              onPress={() => setIsRecording(!isRecording)}
            >
              <Mic size={20} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          )}
          {value ? (
            <>
              <TouchableOpacity style={styles.actionButton} onPress={handleSpeech}>
                <Volume2 size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                <Copy size={20} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
              {isOutput && (
                <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
                  <Heart size={20} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
              )}
            </>
          ) : null}
        </View>
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        multiline
        editable={!isOutput}
        textAlignVertical="top"
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: '#EF4444',
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 80,
    textAlignVertical: 'top',
  },
});