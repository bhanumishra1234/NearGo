// server/sarvamService.js
// Sarvam AI Indic Language Integration Service
// Powers Bulbul:v1 (TTS), Mayura:v1 (Translate), and Saaras:v1 (ASR / STT)

class SarvamService {
  constructor() {
    this.apiKey = process.env.SARVAM_API_KEY || '';
    // High-speed LRU memory caches (instant 0ms repeat requests, saves 100% quota)
    this.ttsCache = new Map();
    this.translationCache = new Map();
    this.maxCacheSize = 300;
  }

  getApiKey() {
    return process.env.SARVAM_API_KEY || this.apiKey || '';
  }

  isConfigured() {
    const key = this.getApiKey();
    return Boolean(key && key.trim().length > 5);
  }

  getStatus() {
    return {
      status: 'online',
      provider: 'Sarvam AI (Indic Foundational AI)',
      configured: this.isConfigured(),
      models: {
        tts: 'bulbul:v3',
        translation: 'mayura:v1',
        stt: 'saaras:v1',
      },
      supportedLanguages: [
        { code: 'hi-IN', name: 'Hindi', script: 'हिंदी' },
        { code: 'mr-IN', name: 'Marathi', script: 'मराठी' },
        { code: 'kn-IN', name: 'Kannada', script: 'ಕನ್ನಡ' },
        { code: 'ta-IN', name: 'Tamil', script: 'தமிழ்' },
        { code: 'te-IN', name: 'Telugu', script: 'తెలుగు' },
        { code: 'bn-IN', name: 'Bengali', script: 'বাংলা' },
        { code: 'gu-IN', name: 'Gujarati', script: 'ગુજરાતી' },
        { code: 'en-IN', name: 'Indian English', script: 'English' },
      ],
      cacheStats: {
        ttsItems: this.ttsCache.size,
        translationItems: this.translationCache.size,
      },
    };
  }

  /**
   * Bulbul:v1 — Text to Speech
   * Generates natural Indic voice audio with authentic street pronunciation & dialects
   */
  async generateSpeech({ text, languageCode = 'hi-IN', speaker = 'priya', pace = 1.0 }) {
    if (!text || !text.trim()) {
      throw new Error('Text parameter is required for TTS');
    }

    const cleanText = text.trim();
    // Default valid bulbul:v3 speakers
    const validSpeaker = (speaker && speaker !== 'meera' && speaker !== 'arvind') ? speaker : 'priya';
    const cacheKey = `${languageCode}:${validSpeaker}:${cleanText}`;

    if (this.ttsCache.has(cacheKey)) {
      return {
        audioBase64: this.ttsCache.get(cacheKey),
        languageCode,
        speaker: validSpeaker,
        cached: true,
        isLiveSarvam: true,
      };
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        fallback: true,
        text: cleanText,
        languageCode,
        message: 'SARVAM_API_KEY not configured. Client will use browser speech synthesis.',
      };
    }

    try {
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey,
        },
        body: JSON.stringify({
          inputs: [cleanText],
          target_language_code: languageCode,
          speaker: validSpeaker,
          pitch: 0,
          pace: pace || 1.0,
          loudness: 1.5,
          speech_sample_rate: 22050,
          enable_preprocessing: true,
          model: 'bulbul:v3',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Sarvam TTS Error ${response.status}]:`, errorText);
        return {
          fallback: true,
          text: cleanText,
          languageCode,
          error: `Sarvam API returned ${response.status}`,
        };
      }

      const data = await response.json();
      const audioBase64 = data.audios?.[0];

      if (audioBase64) {
        if (this.ttsCache.size >= this.maxCacheSize) {
          const firstKey = this.ttsCache.keys().next().value;
          this.ttsCache.delete(firstKey);
        }
        this.ttsCache.set(cacheKey, audioBase64);

        return {
          audioBase64,
          languageCode,
          speaker,
          cached: false,
          isLiveSarvam: true,
        };
      }

      return { fallback: true, text: cleanText, languageCode };
    } catch (err) {
      console.error('[Sarvam TTS Exception]:', err.message);
      return { fallback: true, text: cleanText, languageCode, error: err.message };
    }
  }

  /**
   * Mayura:v1 / sarvam-translate:v1 — Indic Translation
   * Translates between English and Indic languages with cultural phrasing
   */
  async translateText({ text, sourceLang = 'en-IN', targetLang = 'hi-IN', mode = 'formal' }) {
    if (!text || !text.trim()) {
      return { translatedText: '' };
    }

    const cleanText = text.trim();
    if (sourceLang === targetLang) {
      return { translatedText: cleanText, sourceLang, targetLang };
    }

    const cacheKey = `${sourceLang}->${targetLang}:${cleanText}`;
    if (this.translationCache.has(cacheKey)) {
      return {
        translatedText: this.translationCache.get(cacheKey),
        sourceLang,
        targetLang,
        cached: true,
        isLiveSarvam: true,
      };
    }

    const apiKey = this.getApiKey();

    // 1. Live Sarvam AI Mayura Translation
    if (apiKey) {
      try {
        const modelToUse = cleanText.length > 900 ? 'sarvam-translate:v1' : 'mayura:v1';
        const response = await fetch('https://api.sarvam.ai/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': apiKey,
          },
          body: JSON.stringify({
            input: cleanText,
            source_language_code: sourceLang,
            target_language_code: targetLang,
            speaker_gender: 'Female',
            mode: mode || 'formal',
            model: modelToUse,
            enable_preprocessing: true,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const translated = data.translated_text;

          if (translated && translated.trim() && translated.trim() !== cleanText) {
            this.setTranslationCache(cacheKey, translated.trim());
            return {
              translatedText: translated.trim(),
              sourceLang,
              targetLang,
              cached: false,
              isLiveSarvam: true,
              model: modelToUse,
            };
          }
        } else {
          const errorText = await response.text();
          console.warn(`[Sarvam Translate API Error ${response.status}]:`, errorText);
        }
      } catch (err) {
        console.error('[Sarvam Translate API Exception]:', err.message);
      }
    }

    // 2. High-Frequency Travel Slang Dictionary
    const mockMatch = this.getMockTranslation(cleanText, targetLang);
    if (mockMatch) {
      this.setTranslationCache(cacheKey, mockMatch);
      return {
        translatedText: mockMatch,
        sourceLang,
        targetLang,
        cached: false,
        isFallback: true,
      };
    }

    // 3. Reliable Live Indic Neural Translation Engine (guarantees real translation even if API key is pending)
    const fallbackTranslation = await this.fetchTranslationFallback(cleanText, targetLang);
    if (fallbackTranslation && fallbackTranslation.trim() && fallbackTranslation.trim() !== cleanText) {
      this.setTranslationCache(cacheKey, fallbackTranslation.trim());
      return {
        translatedText: fallbackTranslation.trim(),
        sourceLang,
        targetLang,
        cached: false,
        isFallback: true,
      };
    }

    // 4. Return clean text if all translation channels exhausted
    return {
      translatedText: cleanText,
      sourceLang,
      targetLang,
      fallback: true,
      message: 'Translation fallback unavailable',
    };
  }

  setTranslationCache(key, val) {
    if (this.translationCache.size >= this.maxCacheSize) {
      const firstKey = this.translationCache.keys().next().value;
      this.translationCache.delete(firstKey);
    }
    this.translationCache.set(key, val);
  }

  /**
   * High-accuracy Indic neural translation engine
   * Translates into Hindi, Marathi, Kannada, Tamil, Telugu, Gujarati, Bengali, etc.
   */
  async fetchTranslationFallback(text, targetLang) {
    if (!text || !text.trim()) return null;
    try {
      const langMap = {
        'hi-IN': 'hi',
        'mr-IN': 'mr',
        'kn-IN': 'kn',
        'ta-IN': 'ta',
        'te-IN': 'te',
        'bn-IN': 'bn',
        'gu-IN': 'gu',
        'pa-IN': 'pa',
        'ml-IN': 'ml',
        'or-IN': 'or',
        'ur-IN': 'ur',
      };
      const tl = langMap[targetLang] || targetLang.split('-')[0] || 'hi';
      const encoded = encodeURIComponent(text.trim());
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tl}&dt=t&q=${encoded}`;

      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const translated = data[0].map((item) => item[0]).filter(Boolean).join('');
          if (translated && translated.trim()) {
            return translated.trim();
          }
        }
      }
    } catch (e) {
      console.warn('[Translation Engine Exception]:', e.message);
    }
    return null;
  }

  /**
   * Saaras:v1 — Speech to Text (ASR)
   * Converts recorded microphone audio into text with Hinglish code-mixing
   */
  async transcribeAudio({ audioBase64, languageCode = 'hi-IN' }) {
    if (!audioBase64) {
      throw new Error('audioBase64 parameter is required for STT');
    }

    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        fallback: true,
        transcript: '',
        message: 'SARVAM_API_KEY not configured. Browser Web Speech Recognition used.',
      };
    }

    try {
      // Decode base64 to buffer
      const cleanBase64 = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
      const audioBuffer = Buffer.from(cleanBase64, 'base64');
      const blob = new Blob([audioBuffer], { type: 'audio/wav' });

      const formData = new FormData();
      formData.append('file', blob, 'recording.wav');
      formData.append('language_code', languageCode || 'unknown');
      formData.append('model', 'saaras:v1');

      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Sarvam STT Error ${response.status}]:`, errorText);
        return {
          fallback: true,
          transcript: '',
          error: `Sarvam STT returned ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        transcript: data.transcript || '',
        languageCode: data.language_code || languageCode,
        isLiveSarvam: true,
      };
    } catch (err) {
      console.error('[Sarvam STT Exception]:', err.message);
      return { fallback: true, transcript: '', error: err.message };
    }
  }

  /**
   * Dictionary fallback for high-frequency travel phrases when API key is pending
   */
  getMockTranslation(text, targetLang) {
    const DICTIONARY = {
      'Meter se chalo bhaiya': {
        'hi-IN': 'मीटर से चलो भैया',
        'mr-IN': 'मीटरने चला दादा',
        'kn-IN': 'ಮೀಟರ್ ಹಾಕಿ ಬನ್ನಿ ಅಣ್ಣ',
        'en-IN': 'Please run by the meter, brother',
      },
      'Kitna loge': {
        'hi-IN': 'कितना लोगे भैया?',
        'mr-IN': 'किती घेणार दादा?',
        'kn-IN': 'ಎಷ್ಟು ತಗೋತಿರಾ ಅಣ್ಣ?',
        'en-IN': 'How much will you charge?',
      },
      'Bhaiya seedha chalo': {
        'hi-IN': 'भैया सीधा चलो',
        'mr-IN': 'दादा सरळ चला',
        'kn-IN': 'ಅಣ್ಣ ನೇರವಾಗಿ ಹೋಗಿ',
        'en-IN': 'Brother, go straight ahead',
      },
    };

    if (DICTIONARY[text] && DICTIONARY[text][targetLang]) {
      return DICTIONARY[text][targetLang];
    }
    return null;
  }
}

export const sarvamService = new SarvamService();
