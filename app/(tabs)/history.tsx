import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { GradientBackground } from '@/components/GradientBackground';
import { GlassCard } from '@/components/GlassCard';
import { Search, Star, Trash2, ArrowUpDown } from 'lucide-react-native';

interface TranslationItem {
  id: string;
  sourceText: string;
  translatedText: string;
  fromLang: string;
  toLang: string;
  timestamp: Date;
  isFavorite: boolean;
}

const SAMPLE_HISTORY: TranslationItem[] = [
  {
    id: '1',
    sourceText: 'Hello, how are you?',
    translatedText: 'ⴰⵣⵓⵍ, ⵎⴰⵏⵉⵎⴽ ⵜⵍⵍⵉⴷ?',
    fromLang: 'English',
    toLang: 'Tamazight',
    timestamp: new Date('2024-01-15T10:30:00'),
    isFavorite: true,
  },
  {
    id: '2',
    sourceText: 'مرحبا، كيف حالك؟',
    translatedText: 'Hello, how are you?',
    fromLang: 'Arabic',
    toLang: 'English',
    timestamp: new Date('2024-01-15T09:15:00'),
    isFavorite: false,
  },
  {
    id: '3',
    sourceText: 'Où est la pharmacie?',
    translatedText: 'Where is the pharmacy?',
    fromLang: 'French',
    toLang: 'English',
    timestamp: new Date('2024-01-14T16:45:00'),
    isFavorite: true,
  },
];

export default function HistoryScreen() {
  const [searchText, setSearchText] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [history, setHistory] = useState(SAMPLE_HISTORY);

  const filteredHistory = history.filter(item => {
    const matchesSearch = searchText === '' || 
      item.sourceText.toLowerCase().includes(searchText.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesFavorites = !showFavoritesOnly || item.isFavorite;
    
    return matchesSearch && matchesFavorites;
  });

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const deleteItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.title}>Translation History</Text>
            <Text style={styles.subtitle}>Your saved translations</Text>
          </View>

          <GlassCard style={styles.searchCard}>
            <View style={styles.searchContainer}>
              <Search size={20} color="rgba(255, 255, 255, 0.7)" strokeWidth={2} />
              <Text style={styles.searchPlaceholder}>Search translations...</Text>
            </View>
            <TouchableOpacity 
              style={[styles.filterButton, showFavoritesOnly && styles.filterActive]}
              onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Star size={20} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </GlassCard>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {filteredHistory.length === 0 ? (
              <GlassCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>No translations found</Text>
                <Text style={styles.emptySubtext}>
                  {showFavoritesOnly ? 'No favorite translations yet' : 'Start translating to build your history'}
                </Text>
              </GlassCard>
            ) : (
              filteredHistory.map((item) => (
                <GlassCard key={item.id} style={styles.historyItem}>
                  <View style={styles.itemHeader}>
                    <View style={styles.languageInfo}>
                      <Text style={styles.languageText}>{item.fromLang}</Text>
                      <ArrowUpDown size={16} color="rgba(255, 255, 255, 0.6)" strokeWidth={2} />
                      <Text style={styles.languageText}>{item.toLang}</Text>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => toggleFavorite(item.id)}
                      >
                        <Star 
                          size={20} 
                          color={item.isFavorite ? '#F59E0B' : 'rgba(255, 255, 255, 0.6)'} 
                          fill={item.isFavorite ? '#F59E0B' : 'none'}
                          strokeWidth={2} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteItem(item.id)}
                      >
                        <Trash2 size={20} color="rgba(239, 68, 68, 0.8)" strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.textContainer}>
                    <Text style={styles.sourceText}>{item.sourceText}</Text>
                    <View style={styles.arrow}>
                      <Text style={styles.arrowText}>↓</Text>
                    </View>
                    <Text style={styles.translatedText}>{item.translatedText}</Text>
                  </View>
                  
                  <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
                </GlassCard>
              ))
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  searchCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  searchPlaceholder: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 20,
  },
  filterActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.8)',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyItem: {
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 12,
  },
  sourceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  arrow: {
    alignItems: 'center',
    marginVertical: 8,
  },
  arrowText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  },
  translatedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    lineHeight: 24,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});