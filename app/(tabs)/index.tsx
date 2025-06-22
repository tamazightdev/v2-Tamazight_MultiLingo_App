import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { GradientBackground } from '@/components/GradientBackground';
import { TranslationInput } from '@/components/TranslationInput';
import { LanguageSelector } from '@/components/LanguageSelector';
import { TifinghKeyboard } from '@/components/TifinghKeyboard';
import { GlassCard } from '@/components/GlassCard';
import { Keyboard, Zap, Camera } from 'lucide-react-native';

export default function TranslateScreen() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('Arabic (العربية)');
  const [toLanguage, setToLanguage] = useState('Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)');
  const [showTifinghKeyboard, setShowTifinghKeyboard] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleSwapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate AI translation delay
    setTimeout(() => {
      // Mock translation - in real app, this would call the Gemma-3 model
      if (fromLanguage === 'English' && toLanguage.includes('Tamazight')) {
        setOutputText('ⴰⵣⵓⵍ ⴰⴼⵍⵍⴰⵙ'); // Hello/Peace in Tamazight
      } else if (fromLanguage.includes('Tamazight') && toLanguage === 'English') {
        setOutputText('Hello, peace be with you');
      } else {
        setOutputText(`[Translated from ${fromLanguage} to ${toLanguage}]: ${inputText}`);
      }
      setIsTranslating(false);
    }, 1500);
  };

  const handleTifinghCharacter = (character: string) => {
    setInputText(prev => prev + character);
  };

  return (
    <View style={styles.container}>
      <GradientBackground variant="moroccan">
        <SafeAreaView style={styles.safeArea}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/image-app-header-tamazight-500x500.png')}
                style={styles.headerImage}
                resizeMode="contain"
              />
            </View>

            <LanguageSelector
              fromLanguage={fromLanguage}
              toLanguage={toLanguage}
              onFromLanguageChange={setFromLanguage}
              onToLanguageChange={setToLanguage}
              onSwap={handleSwapLanguages}
            />

            <TranslationInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Enter text in ${fromLanguage}...`}
              language={fromLanguage}
            />

            <View style={styles.controls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setShowTifinghKeyboard(!showTifinghKeyboard)}
              >
                <Keyboard size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.controlText}>Tifinagh</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.translateButton, isTranslating && styles.translating]}
                onPress={handleTranslate}
                disabled={isTranslating || !inputText.trim()}
              >
                <Zap size={24} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.translateText}>
                  {isTranslating ? 'Translating...' : 'Translate'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton}>
                <Camera size={20} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.controlText}>Camera</Text>
              </TouchableOpacity>
            </View>

            <TifinghKeyboard
              visible={showTifinghKeyboard}
              onCharacterPress={handleTifinghCharacter}
            />

            {(outputText || isTranslating) && (
              <TranslationInput
                value={isTranslating ? 'Translating with Gemma-3 AI...' : outputText}
                onChangeText={() => {}}
                placeholder=""
                language={toLanguage}
                isOutput
                onFavorite={() => {}}
              />
            )}

            {outputText && (
              <GlassCard style={styles.aiInfo} variant="subtle">
                <View style={styles.aiRow}>
                  <Zap size={16} color="rgba(193, 39, 45, 0.9)" strokeWidth={2} />
                  <Text style={styles.aiText}>
                    Translated offline using Gemma-3 AI • Processing time: 1.2s
                  </Text>
                </View>
              </GlassCard>
            )}
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  headerImage: {
    width: '80%',
    height: 200,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    gap: 12,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 12,
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(156, 28, 39, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  controlText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  translateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(193, 39, 45, 0.9)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flex: 1,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(156, 28, 39, 0.5)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  translating: {
    backgroundColor: 'rgba(148, 199, 217, 0.9)',
  },
  translateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  aiInfo: {
    marginTop: 16,
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiText: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});