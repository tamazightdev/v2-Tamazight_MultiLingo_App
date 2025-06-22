import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { ChevronDown, ArrowUpDown } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface LanguageSelectorProps {
  fromLanguage: string;
  toLanguage: string;
  onFromLanguageChange: (language: string) => void;
  onToLanguageChange: (language: string) => void;
  onSwap: () => void;
}

const LANGUAGES = [
  'Arabic (العربية)',
  'English',
  'French (Français)',
  'Tamazight (ⵜⴰⵎⴰⵣⵉⵖⵜ)'
];

export function LanguageSelector({ 
  fromLanguage, 
  toLanguage, 
  onFromLanguageChange, 
  onToLanguageChange, 
  onSwap 
}: LanguageSelectorProps) {
  const [isFromModalVisible, setFromModalVisible] = useState(false);
  const [isToModalVisible, setToModalVisible] = useState(false);

  const handleSwap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSwap();
  };

  return (
    <GlassCard style={styles.container}>
      <View style={styles.selectorRow}>
        <TouchableOpacity style={styles.languageButton} onPress={() => setFromModalVisible(true)}>
          <Text style={styles.languageText}>{fromLanguage}</Text>
          <ChevronDown size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.swapButton} onPress={handleSwap}>
          <ArrowUpDown size={24} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.languageButton} onPress={() => setToModalVisible(true)}>
          <Text style={styles.languageText}>{toLanguage}</Text>
          <ChevronDown size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <LanguageModal
        visible={isFromModalVisible}
        languages={LANGUAGES.filter(lang => lang !== toLanguage)}
        onSelect={(language) => {
          onFromLanguageChange(language);
          setFromModalVisible(false);
        }}
        onClose={() => setFromModalVisible(false)}
      />

      <LanguageModal
        visible={isToModalVisible}
        languages={LANGUAGES.filter(lang => lang !== fromLanguage)}
        onSelect={(language) => {
          onToLanguageChange(language);
          setToModalVisible(false);
        }}
        onClose={() => setToModalVisible(false)}
      />
    </GlassCard>
  );
}

interface LanguageModalProps {
  visible: boolean;
  languages: string[];
  onSelect: (language: string) => void;
  onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ visible, languages, onSelect, onClose }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <FlatList
          data={languages}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item)}>
              <Text style={styles.modalItemText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(184, 184, 184, 0.3)', // Medium gray from gradient
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  languageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  swapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(156, 28, 39, 0.6)', // Moroccan red
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(156, 28, 39, 0.9)', // Moroccan red modal
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalItemText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});