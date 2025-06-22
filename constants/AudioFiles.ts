// Tamazight audio files from GitHub repository
export const TAMAZIGHT_AUDIO_FILES = {
  // Emergency phrases with their corresponding audio URLs
  'I am lost': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20i%20am%20lost.MP3',
  'Call the police': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20call%20the%20police.MP3',
  'I need medical help immediately': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20i%20need%20medical%20help.MP3',
  'Where is the hospital?': 'https://raw.githubusercontent.com/tamazightdev/Tamazight_MultiLingo_App/main/assets/audio/tamazight%20where%20is%20the%20hospital.MP3',
} as const;

// Helper function to get audio URL for a phrase
export function getTamazightAudioUrl(englishPhrase: string): string | null {
  return TAMAZIGHT_AUDIO_FILES[englishPhrase as keyof typeof TAMAZIGHT_AUDIO_FILES] || null;
}

// Helper function to check if audio is available for a phrase
export function hasTamazightAudio(englishPhrase: string): boolean {
  return englishPhrase in TAMAZIGHT_AUDIO_FILES;
}