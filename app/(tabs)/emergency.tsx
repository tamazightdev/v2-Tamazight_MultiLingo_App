import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Heart, Phone, TriangleAlert as AlertTriangle, MapPin, Volume2, Music } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from '@/components/AudioPlayer';
import { getTamazightAudioUrl, hasTamazightAudio } from '@/constants/AudioFiles';

interface EmergencyPhrase {
  id: string;
  category: string;
  english: string;
  tamazight: string;
  arabic: string;
  french: string;
  priority: 'high' | 'medium' | 'low';
}

const EMERGENCY_PHRASES: EmergencyPhrase[] = [
  {
    id: '1',
    category: 'Medical',
    english: 'I need medical help immediately',
    tamazight: 'ⵔⵉⵖ ⴰⵢⵓⵎⵏ ⵏ ⵓⵙⵙⵏⴰⵏ ⴷⵖⴰ',
    arabic: 'أحتاج مساعدة طبية فورية',
    french: "J'ai besoin d'aide médicale immédiatement",
    priority: 'high',
  },
  {
    id: '2',
    category: 'Emergency',
    english: 'Call the police',
    tamazight: 'ⵙⵙⵉⵡⵍ ⵉⵎⵓⵀⵏⴷⵉⵙⵏ',
    arabic: 'اتصل بالشرطة',
    french: 'Appelez la police',
    priority: 'high',
  },
  {
    id: '3',
    category: 'Emergency',
    english: 'I am lost',
    tamazight: 'ⵓⵔⵢⵖ ⴰⴱⵔⵉⴷ',
    arabic: 'أنا تائه',
    french: 'Je suis perdu',
    priority: 'medium',
  },
  {
    id: '4',
    category: 'Medical',
    english: 'I am having chest pain',
    tamazight: 'ⴷⴰⵔⵉ ⵜⵙⵓⵍ ⵉⴷⵎⴰⵔⵏ',
    arabic: 'أشعر بألم في الصدر',
    french: "J'ai mal à la poitrine",
    priority: 'high',
  },
  {
    id: '5',
    category: 'Basic Needs',
    english: 'Where is the hospital?',
    tamazight: 'ⵎⴰⵏⵉ ⵉⵍⵍⴰ ⵓⵙⵙⵏⴰⵏ?',
    arabic: 'أين المستشفى؟',
    french: "Où est l'hôpital?",
    priority: 'medium',
  },
  {
    id: '6',
    category: 'Basic Needs',
    english: 'I need water',
    tamazight: 'ⵔⵉⵖ ⴰⵎⴰⵏ',
    arabic: 'أحتاج الماء',
    french: "J'ai besoin d'eau",
    priority: 'medium',
  },
];

const CATEGORIES = ['All', 'Medical', 'Emergency', 'Basic Needs'];

export default function EmergencyScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);

  const filteredPhrases = EMERGENCY_PHRASES.filter(phrase => 
    selectedCategory === 'All' || phrase.category === selectedCategory
  );

  const handleSpeak = async (phrase: EmergencyPhrase) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setPlayingPhraseId(phrase.id);

    // If Tamazight is selected and we have native audio, use it
    if (selectedLanguage === 'tamazight' && hasTamazightAudio(phrase.english)) {
      const audioUrl = getTamazightAudioUrl(phrase.english);
      if (audioUrl) {
        try {
          if (Platform.OS === 'web') {
            const audio = new Audio(audioUrl);
            audio.play();
            // Reset playing state after audio duration (estimated 3 seconds)
            setTimeout(() => setPlayingPhraseId(null), 3000);
          } else {
            // For mobile, we would use the AudioPlayer component
            // This is a simplified version for demonstration
            console.log('Playing native Tamazight audio:', audioUrl);
            setTimeout(() => setPlayingPhraseId(null), 3000);
          }
          return;
        } catch (error) {
          console.error('Error playing native audio, falling back to TTS:', error);
        }
      }
    }

    // Fallback to text-to-speech
    let textToSpeak = '';
    let languageCode = 'en';

    switch (selectedLanguage) {
      case 'tamazight':
        textToSpeak = phrase.tamazight;
        languageCode = 'ar'; // Fallback to Arabic for Tifinagh
        break;
      case 'arabic':
        textToSpeak = phrase.arabic;
        languageCode = 'ar';
        break;
      case 'french':
        textToSpeak = phrase.french;
        languageCode = 'fr';
        break;
      default:
        textToSpeak = phrase.english;
        languageCode = 'en';
    }

    Speech.speak(textToSpeak, {
      language: languageCode,
      pitch: 1.0,
      rate: 0.7,
      onDone: () => setPlayingPhraseId(null),
      onError: () => setPlayingPhraseId(null),
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getSelectedText = (phrase: EmergencyPhrase) => {
    switch (selectedLanguage) {
      case 'tamazight': return phrase.tamazight;
      case 'arabic': return phrase.arabic;
      case 'french': return phrase.french;
      default: return phrase.english;
    }
  };

  const hasNativeAudio = (phrase: EmergencyPhrase) => {
    return selectedLanguage === 'tamazight' && hasTamazightAudio(phrase.english);
  };

  return (
    <View style={styles.container}>
      <GradientBackground variant="emergency">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <AlertTriangle size={32} color="#FFFFFF" strokeWidth={2} />
              <Text style={styles.title}>Emergency</Text>
            </View>
            <Text style={styles.subtitle}>Critical phrases for emergency situations</Text>
          </View>

          <GlassCard style={styles.emergencyInfo}>
            <View style={styles.infoRow}>
              <Phone size={20} color="#10B981" strokeWidth={2} />
              <Text style={styles.infoText}>Morocco Emergency: 15 (Medical) • 19 (Fire) • 177 (Police)</Text>
            </View>
          </GlassCard>

          <View style={styles.controls}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.languageScroll}>
              {['english', 'tamazight', 'arabic', 'french'].map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageButton,
                    selectedLanguage === lang && styles.languageActive
                  ]}
                  onPress={() => setSelectedLanguage(lang)}
                >
                  <Text style={[
                    styles.languageText,
                    selectedLanguage === lang && styles.languageTextActive
                  ]}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {filteredPhrases.map((phrase) => (
              <TouchableOpacity 
                key={phrase.id}
                style={styles.phraseButton}
                onPress={() => handleSpeak(phrase)}
              >
                <GlassCard style={styles.phraseCard}>
                  <View style={styles.phraseHeader}>
                    <View style={styles.priorityBadge}>
                      <View 
                        style={[
                          styles.priorityDot, 
                          { backgroundColor: getPriorityColor(phrase.priority) }
                        ]} 
                      />
                      <Text style={styles.categoryLabel}>{phrase.category}</Text>
                      {hasNativeAudio(phrase) && (
                        <View style={styles.audioIndicator}>
                          <Music size={14} color="#10B981" strokeWidth={2} />
                        </View>
                      )}
                    </View>
                    <TouchableOpacity 
                      style={[
                        styles.speakButton,
                        playingPhraseId === phrase.id && styles.speakButtonActive
                      ]}
                      onPress={() => handleSpeak(phrase)}
                    >
                      <Volume2 size={20} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.phraseText}>
                    {getSelectedText(phrase)}
                  </Text>
                  {selectedLanguage !== 'english' && (
                    <Text style={styles.englishText}>
                      {phrase.english}
                    </Text>
                  )}
                  {hasNativeAudio(phrase) && (
                    <Text style={styles.audioNote}>
                      🎵 Native Tamazight audio available
                    </Text>
                  )}
                </GlassCard>
              </TouchableOpacity>
            ))}
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  emergencyInfo: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  controls: {
    marginBottom: 16,
    gap: 12,
  },
  categoryScroll: {
    paddingHorizontal: 20,
  },
  languageScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  categoryText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  languageActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
  },
  languageText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  languageTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  phraseButton: {
    marginBottom: 12,
  },
  phraseCard: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  phraseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  audioIndicator: {
    marginLeft: 4,
  },
  speakButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speakButtonActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.8)',
  },
  phraseText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 28,
    marginBottom: 8,
  },
  englishText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 4,
  },
  audioNote: {
    color: 'rgba(16, 185, 129, 0.9)',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    fontStyle: 'italic',
  },
});