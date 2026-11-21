/**
 * NearGo Sarvam AI Audio & Language Client Utility
 * Communicates with backend proxy /api/sarvam/*
 * Powers Bulbul:v1 TTS, Mayura:v1 Translation, and Saaras:v1 STT
 */

let currentAudioInstance = null;

/**
 * Play spoken text using Sarvam Bulbul:v1 Indic TTS
 * Falls back cleanly to Web Speech API if offline or API key is unconfigured.
 */
export async function playSarvamSpeech({
  text,
  languageCode = 'hi-IN',
  speaker = 'meera',
  onStart,
  onEnd,
  onError,
}) {
  if (!text || !text.trim()) return null;

  // Stop any currently playing audio
  stopCurrentAudio();

  try {
    if (onStart) onStart();

    const response = await fetch('/api/sarvam/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, languageCode, speaker }),
    });

    if (response.ok) {
      const data = await response.json();

      if (data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        currentAudioInstance = audio;

        audio.onended = () => {
          currentAudioInstance = null;
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('[Sarvam Audio Playback Error]:', e);
          currentAudioInstance = null;
          fallbackBrowserSpeech(text, languageCode, onEnd);
        };

        await audio.play();
        return {
          stop: () => stopCurrentAudio(),
          isLiveSarvam: true,
        };
      }
    }

    // Fallback to browser SpeechSynthesis if backend returned fallback
    fallbackBrowserSpeech(text, languageCode, onEnd);
    return { stop: () => stopCurrentAudio(), isFallback: true };
  } catch (err) {
    console.warn('[Sarvam TTS Fetch Exception, using browser fallback]:', err);
    fallbackBrowserSpeech(text, languageCode, onEnd);
    if (onError) onError(err);
    return { stop: () => stopCurrentAudio(), isFallback: true };
  }
}

/**
 * Stop any ongoing audio playback
 */
export function stopCurrentAudio() {
  if (currentAudioInstance) {
    try {
      currentAudioInstance.pause();
      currentAudioInstance.currentTime = 0;
    } catch (e) {}
    currentAudioInstance = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

/**
 * Browser SpeechSynthesis Fallback
 */
function fallbackBrowserSpeech(text, languageCode = 'hi-IN', onEnd) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.lang = languageCode === 'en-IN' ? 'en-IN' : 'hi-IN';
    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  } else if (onEnd) {
    onEnd();
  }
}

/**
 * Translate text using Sarvam Mayura:v1
 */
export async function translateTextWithSarvam({
  text,
  sourceLang = 'en-IN',
  targetLang = 'hi-IN',
  mode = 'formal',
}) {
  if (!text || !text.trim() || sourceLang === targetLang) {
    return text;
  }

  try {
    const res = await fetch('/api/sarvam/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceLang, targetLang, mode }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.translatedText || text;
    }
    return text;
  } catch (err) {
    console.warn('[Sarvam Translate Client Error]:', err);
    return text;
  }
}

/**
 * Transcribe recorded audio with Sarvam Saaras:v1
 */
export async function transcribeAudioWithSarvam({ audioBlob, languageCode = 'hi-IN' }) {
  if (!audioBlob) return '';

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Audio = reader.result;
        const res = await fetch('/api/sarvam/stt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: base64Audio, languageCode }),
        });

        if (res.ok) {
          const data = await res.json();
          resolve(data.transcript || '');
        } else {
          resolve('');
        }
      } catch (err) {
        console.warn('[Sarvam STT Client Error]:', err);
        resolve('');
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(audioBlob);
  });
}
