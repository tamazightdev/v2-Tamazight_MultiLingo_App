import React, { useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface AudioPlayerProps {
  audioUrl: string;
  onPlaybackStatusUpdate?: (status: any) => void;
  onError?: (error: string) => void;
}

export class AudioPlayer {
  private sound: Audio.Sound | null = null;
  private isLoaded = false;

  constructor(private audioUrl: string) {}

  async loadAudio(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // For web, use HTML5 Audio
        return true;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: this.audioUrl },
        { shouldPlay: false }
      );
      this.sound = sound;
      this.isLoaded = true;
      return true;
    } catch (error) {
      console.error('Error loading audio:', error);
      return false;
    }
  }

  async play(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // For web, use HTML5 Audio
        const audio = new window.Audio(this.audioUrl);
        audio.play();
        return true;
      }

      if (!this.isLoaded) {
        const loaded = await this.loadAudio();
        if (!loaded) return false;
      }

      if (this.sound) {
        await this.sound.replayAsync();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error playing audio:', error);
      return false;
    }
  }

  async stop(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  async unload(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
        this.isLoaded = false;
      }
    } catch (error) {
      console.error('Error unloading audio:', error);
    }
  }
}

export function useAudioPlayer(audioUrl: string) {
  const [player, setPlayer] = useState<AudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audioPlayer = new AudioPlayer(audioUrl);
    setPlayer(audioPlayer);

    return () => {
      audioPlayer.unload();
    };
  }, [audioUrl]);

  const play = async () => {
    if (!player) return false;
    
    setIsLoading(true);
    setIsPlaying(true);
    
    const success = await player.play();
    
    setIsLoading(false);
    
    if (!success) {
      setIsPlaying(false);
    } else {
      // Auto-reset playing state after a reasonable duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    }
    
    return success;
  };

  const stop = async () => {
    if (player) {
      await player.stop();
      setIsPlaying(false);
    }
  };

  return {
    play,
    stop,
    isPlaying,
    isLoading
  };
}