## **PRD-Product Requirements Document: The "Multi-Lingo Tamazight Edition App**

The "Multi-Lingo Tamazight Edition App will initially be an Android mobile application offering on-device translation services between Tamazight (Tifinagh and Latin scripts), Arabic, French, and English with other languages to be added in future releases. It will initially support text, and voice output, with future releases having multimodal voice input/output as well as image and video input.  It is being designed for high accuracy and offline functionality, making it suitable for emergency, governmental, and everyday use.

1. Introduction

* 1.1. Purpose

This document outlines the product requirements for "the "Multi-Lingo Tamazight Edition," A fine-tuned multilingual Gemini 3 powered on-device translation application. 


   * 1.2. Product Goal
To develop a reliable, accurate, and user-friendly mobile translation application that facilitates communication between Tamazight (including its major Moroccan variants: Tachelhit, Central Atlas Tamazight, Tarifit), Arabic, French and English. The app aims to serve critical needs in emergencies, government operations (including parliamentary settings), and daily life for the Amazigh people and Moroccan society at large, leveraging on-device AI models for offline capability and privacy.  Google Gemini Gemma-3 AI models, specifically the gemma-3-4b-it and gemma-3-1b-it variants will be finetuned for offline use and enhanced privacy.


      * 1.3. Target Audience


      * Amazigh-speaking individuals require translation to/from Arabic, French and English, especially in critical situations (emergencies, public services).

      * Government officials, public service employees, and parliamentarians needing to communicate with Amazigh-speaking citizens or utilize Tamazight in official capacities.

      * Emergency responders (medical, civil protection) operating in Amazigh-speaking regions.

      * The general public, including tourists and language learners, who are interested in Morocco, Berber culture, Tamazight, inter-cultural dialogue and communication.


      * 1.4. Background
The Moroccan government has undertaken significant initiatives to integrate the Amazigh language into society, following its constitutional recognition as an official language in 2011 and the subsequent Organic Law 26-16.2 These efforts span education, public administration, media, and parliamentary proceedings.3 However, challenges persist, particularly in resource allocation, teacher training, and consistent implementation.


The 2023 Al Haouz earthquake starkly highlighted critical communication gaps, where language barriers between official responders (often using Arabic) and Amazigh-speaking survivors impeded aid and exacerbated trauma.9 This underscores the urgent need for effective multilingual communication tools, especially in emergencies.


Additionally, the Moroccan Parliament is actively working to integrate Amazigh, including provisions for simultaneous translation, indicating a need for robust translation solutions in official settings. 

While Google Translate has recently added (June 2024) Tamazight and Tifinagh, issues with dialectal representation (often defaulting to non-Moroccan variants like Kabyle) and the need for offline capabilities present an opportunity for a dedicated, fine-tuned solution.


This app, the "Multi-Lingo Tamazight Edition," aims to address these needs by providing an on-device, AI-powered translation tool fine-tuned for Moroccan Amazigh (Tamazight - Tifinagh initially) variants and contexts.

2. Product Overview

      * 2.1. Product Description

The "Multi-Lingo Tamazight Edition App will initially be an Android mobile application offering on-device translation services between Tamazight (Tifinagh and Latin scripts), Arabic, French, and English with other languages to be added in future releases. It will support text, multimodal voice input/output, as well as image and video input.  It will be designed for high accuracy and offline functionality, making it suitable for emergency, governmental, and everyday use.


            * 2.2. Key Features (High-Level)


            * Multidirectional Translation: Tamazight <=> Arabic, Tamazight <=> French, Tamazight <=> English.

            * Support for Major Moroccan Amazigh Variants:  ***Support for Major Moroccan Amazigh Variants:  v1.0 of the app will feature the Tamazight  / Central Atlas Tamazight as the first supported language for the app's initial release with Tachelhit and Tarifit being added in the v2.0 major version update after field testing v1.0.  

            * Script Support: Tifinagh and Latin for Tamazight.

            * Input/Output Modes: Text, Speech-to-Text, Text-to-Speech.

            * On-Device Processing: Utilizing fine-tuned Gemma-3 AI models, specifically gemma-3-4b-it and gemma-3-1b-it variants for offline use and enhanced privacy.

            * Emergency Mode: Specialized features for crisis communication.

            * Government Mode: Tools and glossaries for official use.

            * User-Friendly Interface: Intuitive design accessible to a wide range of users.

            * 2.3. Technology Stack
            * Mobile Platform: Initially React, Vite, threejs, lucide icons.  React App can be deployed to Netlify and Expo Android / iPhone.

            * AI Models: Google Gemma-3 (specifically gemma-3-4b-it and gemma-3-1b-it variants) fine-tuned for Tamazight (Moroccan variants), Arabic, French and English.

            * Model Fine-tuning Data: Custom Tifinagh datasets, recorded audio files (for speech models), and potentially augmented data using the Google Translate API (for initial parallel linguistic generation, to be refined with authentic data).

            * On-Device Inference: Leveraging frameworks like MediaPipe LlmInference or similar for running Gemma-3 models locally.

3. User Stories (Personas)

            * As an Amazigh-speaking citizen in an earthquake-affected area, I want to quickly translate my urgent needs (e.g., "I need medical help," "My house collapsed," "Where is the food distribution?") from my Tamazight dialect into Arabic, French or English using voice or text, so that emergency responders can understand and assist me effectively, even if I am offline.

            * As a government official in a public service office, I want to accurately translate official information and citizen inquiries between Arabic/French, Arabic/English, English/French, French/English and various Tamazight dialects (written in Tifinagh or Latin script), so I can provide equitable service and ensure clear communication.  ***Support for Major Moroccan Amazigh Variants:  v1.0 of the app will feature the Tamazight  / Central Atlas Tamazight as the first supported language for the app's initial release with Tachelhit and Tarifit being added in the v2.0 major version update after field testing v1.0.  

            * As a member of the Moroccan Parliament, I want to use the app to understand contributions made in Tamazight or to formulate my own statements in Tamazight with accurate terminology, so I can fully participate in multilingual parliamentary proceedings.

            * As an emergency medical technician responding to a crisis, I want to use pre-set emergency phrases in Tamazight and translate patient responses from Tamazight to Arabic/French, so I can provide timely and appropriate care.

            * As a student learning Tamazight, I want to use the app to translate words and phrases, hear their pronunciation, and see them in Tifinagh script, so I can improve my language skills.

4. Functional Requirements

            * 4.1. Core Translation Features

            * FR1.1 Text-to-Text Translation:
            * Tamazight (Tifinagh input/output) <=> Arabic (text)

            * Tamazight (Tifinagh input/output) <=> French (text)

            * Tamazight (Tifinagh input/output) <=> English (text)

            * Tamazight (Latin script input/output) <=> Arabic (text)

            * Tamazight (Latin script input/output) <=> French (text)

            * Tamazight (Latin script input/output) <=> English(text)

            * Arabic (text) <=> French (text) and Arabic (text) <=> English (text), French (text) <=> English text (for completeness if leveraging multilingual models)

            * FR1.2 Speech-to-Text (STT):

            * Input in Tamazight (Central Atlas Tamazight) transcribed to text (Tifinagh and/or Latin).

            * Input in Arabic transcribed to Arabic text.

            * Input in French transcribed to French text.

            * Input in English transcribed to English text

            * FR1.3 Text-to-Speech (TTS):

            * Pronunciation of Tamazight text (Central Atlas Tamazight).

            * Pronunciation of Arabic text.

            * Pronunciation of French text.

            * Pronunciation of English text

            * FR1.4 Amazigh Variant Support:

            *  ***Support for Major Moroccan Amazigh Variants:  v1.0 of the app will feature the Tamazight  / Central Atlas Tamazight as the first supported language for the app's initial release with Tachelhit and Tarifit being added in the v2.0 major version update after field testing v1.0.  User ability to select or the app to auto-detect (if feasible with model capabilities) the specific Moroccan Amazigh variant (Tachelhit, Central Atlas Tamazight, Tarifit) for more accurate translation and pronunciation. 

            * Fine-tuned models should be specialized or adaptable for these variants.

            * FR1.5 Offline Capability: All core translation functionalities (text, STT, TTS) must operate entirely on-device without requiring an internet connection.

            * FR1.6 Bidirectional Translation: All language pairs must support translation in both directions.

            * FR1.7 Copy/Paste Functionality: Allow users to easily copy translated text and paste text for translation.

            * 4.2. User Interface (UI) and User Experience (UX)

            * FR2.1 Language Selection: Clear and intuitive interface for selecting source and target languages, including Amazigh variants and script preference (Tifinagh/Latin for Tamazight).

            * FR2.2 Input/Output Display: Separate, clearly demarcated areas for input and output text.

            * FR2.3 Tifinagh Keyboard: Integration of an innovative Tifinagh virtual keyboard.

            * FR2.4 Translation History: Locally stored on device, chronological list of past translations, allowing users to revisit them Using SQLite 3.  Using SQLite 3, particularly the better-sqlite3 library, on a mobile device for AI applications offers a compelling combination of speed, simplicity, and local data management. Better-sqlite3 is a fast and simple SQLite driver, making it suitable for on-device AI tasks that benefit from low-latency data access.

            * FR2.5 Favorites: Ability for users to save frequently used or important translations as favorites for quick access.

            * FR2.6 Clear Button: Easily accessible button to clear input and output fields.

            * FR2.7 Loading/Processing Indicators: Visual feedback during STT processing or translation computation.

            * FR2.8 Onboarding/Tutorial: Simple text andor audio onboarding guide for first-time users explaining key features.

            * 4.3. Emergency Mode Features

            * FR3.1 Quick Access Toggle: Prominent button to switch to "Emergency Mode."

            * FR3.2 Pre-defined Emergency Phrasebook: A categorized list of common emergency phrases (e.g., medical, danger, needs) translated into Tamazight (all supported variants, Tifinagh/Latin), Arabic, and French. Phrases should be accessible offline.

            * Examples: "Help!", "I am injured.", "Need doctor.", "No water.", "Building collapsed."

            * FR3.3 Large Text/High Contrast Option: Accessibility feature within Emergency Mode for enhanced readability in stressful situations or for users with visual impairments.

            * FR3.4 Offline First: Emergency mode must be fully functional offline.

            * FR3.5 Simplified UI: Potentially a more streamlined interface in Emergency Mode focusing on core communication.

            * 4.4. Government/Parliamentary Mode Features

            * FR4.1 Mode Toggle: Option to switch to "Government/Parliamentary Mode."

            * FR4.2 Specialized Glossaries: Access to pre-loaded, updatable glossaries of official, administrative, legal, and parliamentary terminology in Tamazight (Tifinagh/Latin), Arabic, French and English. This will aid in translation consistency for official terms.

            * FR4.3 Document Snippet Translation: Ability to paste larger chunks of text (e.g., from documents) for translation.

            * FR4.4 Conversation Mode: A feature that facilitates two-way conversation, possibly with a split-screen UI showing translations in real-time for both parties.

            * 4.5. Data Management

            * FR5.1 On-Device Storage: Translation history, favorites, and user preferences stored locally on the device Using SQLite 3.  Using SQLite 3, particularly the better-sqlite3 library, on a mobile device for AI applications offers a compelling combination of speed, simplicity, and local data management. Better-sqlite3 is a fast and simple SQLite driver, making it suitable for on-device AI tasks that benefit from low-latency data access.

            * FR5.2 Model Storage: Fine-tuned Gemma-3 models stored on-device.

            * FR5.3 Model Updates: Mechanism for users to download updated versions of the AI models as they are improved (e.g., through app updates or in-app downloads).

5. Non-Functional Requirements

            * NFR1. Performance

            * NFR1.1 Translation Speed: Text translation should appear near-instantaneous (e.g., <1-2 seconds latency for average sentences). STT and TTS should have minimal perceptible delay.

            * NFR1.2 Resource Consumption: Optimized to minimize battery drain and CPU/memory usage on typical Android devices.
            
            * NFR1.3 App Launch Time: Quick app startup.

            * NFR2. Accuracy

            * NFR2.1 Translation Quality: Strive for high BLEU scores (or similar metrics) during development and testing. Crucially, prioritize semantic accuracy, especially for emergency and official contexts.

            * NFR2.2 Dialectal Accuracy: Translations should be accurate and natural for the selected Moroccan Amazigh variant. Avoid generalizations or bleeding from other non-Moroccan Amazigh languages.

            * NFR2.3 Script Accuracy: Correct rendering and processing of Tifinagh script.

            * NFR3. Usability

            * NFR3.1 Learnability: Users should be able to perform core translation tasks within minutes of first use.

            * NFR3.2 Accessibility: Adherence to Responsive Web, Mobile and Android App, accessibility guidelines (e.g., support for screen readers, adjustable font sizes, sufficient color contrast).

            * NFR4. Reliability

            * NFR4.1 Stability: The app should be stable with minimal crashes (e.g., >99.5% crash-free sessions).

            * NFR4.2 Offline Consistency: Translation quality and app performance should not degrade significantly or at all in offline mode as it is designed to be an on-device AI mode fine-tuned specifically for offline use, as well as online use.

            * NFR5. Security & Privacy

            * NFR5.1 Data Privacy: All user-generated content (text input, voice input, translation history) should be processed and stored on-locally on device by default.

            * NFR5.2 Secure Model Storage: On-device AI models should be protected from unauthorized access or modification.

            * NFR5.3 Opt-in for Data Sharing: If any data is to be collected for model improvement, it must be anonymized and require explicit and clear user consent in multiple languages.

            * NFR6. Scalability

            * NFR6.1 Language/Dialect Expansion: The architecture must allow for the addition of new Amazigh variants or other languages in the future.

            * NFR6.2 Model Updates: Efficient delivery and installation of updated AI models.

            * NFR7. Maintainability

            * NFR7.1 Modular Code: Well-structured, documented, and modular codebase (following Responsive Web, Mobile and Android best practices, similar to the structure seen in Apple Product Advertisements 1).

            * NFR7.2 Testability: Code designed for unit and integration testing.

            * NFR8. Compatibility

            * NFR8.1 Android Versions: Support for a wide range of Android versions (e.g., Android 8.0 Oreo and above, to be determined by on-device AI library requirements).

            * NFR8.2 Device Range: Performant on mid-range to high-end Android devices.

6. App Flow Diagram (Text-Based)

            1. App Launch

            * The user opens the the "Multi-Lingo Tamazight Edition app.

            * App checks for model availability.

            * If models not present/corrupted: Prompt user to download/initialize (may require internet for first setup).

            * If models present: Proceed to Main Screen.

            * Brief onboarding for first-time users.

            2. Main Translation Screen

            * Language Selection:

            * The user selects Source Language (Tamazight [variant + script], Arabic, French, English).

            * The user selects Target Language (Tamazight [variant + script], Arabic, French, English).

            * Input Method Selection:

            * Text Input:

            * User types or pastes text into the input field (Tifinagh keyboard available if Tamazight selected).

            * App performs translation.

            * Translated text displayed in the output field.

            * Option for TTS of input or output text.

            * Voice Input (STT):

            * The user taps the microphone icon.

            * The user speaks in the selected source language.

            * The app transcribes speech to text in the input field.

            * The app performs translation.

            * Translated text displayed in the output field.

            * Option for TTS of output text.

            * Features Accessible:

            * Clear Input/Output.

            * Copy Translation.

            * Add to Favorites.

            * Access History.

            * Switch to Emergency Mode.

            * Switch to Government/Parliamentary Mode.

            * Settings (e.g., default languages, theme, model updates).

            3. Emergency Mode Screen

            * User accesses via toggle from Main Screen.

            * Simplified UI, potentially larger fonts/buttons.

            * Phrasebook Access:

            * User browses categorized emergency phrases.

            * The user selects a phrase.

            * The app displays the phrase in selected target languages (Tamazight, Arabic, French, English) and can play TTS.

            * Quick Translation: Access to core text/voice translation with emphasis on speed and clarity.

            4. Government/Parliamentary Mode Screen

            * User accesses via toggle from Main Screen.

            * Glossary Access:

            * User searches or browses specialized terminology.

            * Selected term and its translations displayed.

            * Document Snippet/Conversation Mode:

            * Interface for translating larger text blocks or facilitating real-time translated conversation.

            5. History Screen

            * User accesses from Main Screen.

            * Displays list of past translations.

            * Users can tap a history item to reload it into the Main Translation Screen or delete it.

            6. Favorites Screen

            * User accesses from Main Screen.

            * Displays list of saved favorite translations.

            * Users can tap a favorite item to reload it or remove it from favorites.

6.1 Image Translation (OCR): Ability to translate text from images (e.g., signs, documents) using Gemma 3's Multimodal Features.  (Implemented in future releases.)
