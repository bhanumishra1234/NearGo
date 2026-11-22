import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Zap,
  Sparkles,
  Volume2,
  Navigation,
  Car,
  HelpCircle,
  Gift,
  Moon,
  Sun,
  MapPin,
  Compass,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { executeVoiceTask } from '../utils/voiceTaskEngine.js';
import { transcribeAudioWithSarvam, stopCurrentAudio } from '../utils/sarvamAudio.js';

export default function VoiceAssistantHUD({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  activeTab,
  setActiveTab,
  onOpenAskModal,
  onOpenFareModal,
  onOpenVibeModal,
  onOpenCouponModal,
  onOpenMerchantModal,
  onOpenTrailsModal,
  darkMode,
  setDarkMode,
  onRequestLocation,
  onHighlightOnMap,
  questions,
  onShowToast,
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [statusMessage, setStatusMessage] = useState('Listening... Speak naturally');
  const [isExecuting, setIsExecuting] = useState(false);
  const [micError, setMicError] = useState(null);

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const silenceTimerRef = useRef(null);
  const transcriptRef = useRef('');

  // Example Interactive Quick Task Chips
  const QUICK_COMMANDS = [
    { label: '🚇 Nearest Metro', command: 'Find the nearest metro station' },
    { label: '🛺 Check Auto Fare', command: 'Check auto fare from Rajiv Chowk to Chandni Chowk' },
    { label: '❓ Ask Question', command: 'Ask a question to local community' },
    { label: '🎁 Flash Deals', command: 'Show deals and free chai perks' },
    { label: '✨ Vibe Check', command: 'Explore neighbourhood vibes' },
    { label: '🏛️ Heritage Trails', command: 'Show DMRC heritage trails' },
    { label: darkMode ? '☀️ Light Mode' : '🌙 Dark Mode', command: darkMode ? 'Switch to light mode' : 'Turn on dark mode' },
    { label: '🏙️ Switch City', command: selectedCity === 'Mumbai' ? 'Switch city to Delhi NCR' : 'Switch city to Mumbai' },
  ];

  // Start listening automatically when HUD opens
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setInterimText('');
      transcriptRef.current = '';
      setMicError(null);
      setIsExecuting(false);
      startListening();
    } else {
      stopListening();
    }
    return () => {
      stopListening();
    };
  }, [isOpen]);

  const clearSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  };

  const executeAction = async (textToRun) => {
    const query = (textToRun || transcriptRef.current || transcript).trim();
    if (!query || isExecuting) return;

    setIsExecuting(true);
    setStatusMessage(`⚡ Executing: "${query}"...`);
    stopListening();

    try {
      await executeVoiceTask({
        transcript: query,
        searchQuery,
        setSearchQuery,
        selectedCity,
        setSelectedCity,
        activeTab,
        setActiveTab,
        onOpenAskModal,
        onOpenFareModal,
        onOpenVibeModal,
        onOpenCouponModal,
        onOpenMerchantModal,
        onOpenTrailsModal,
        darkMode,
        setDarkMode,
        onRequestLocation,
        onHighlightOnMap,
        questions,
        onShowToast,
      });

      // Brief delay so user sees task execution before closing HUD
      setTimeout(() => {
        setIsExecuting(false);
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      console.warn('[VoiceAssistantHUD executeAction Error]:', err);
      setIsExecuting(false);
    }
  };

  const startListening = () => {
    stopListening();
    setIsListening(true);
    setMicError(null);
    setStatusMessage('Listening... Speak now');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
          setIsListening(true);
          setStatusMessage('Listening to your voice... Speak now');
        };

        recognition.onresult = (event) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            if (res.isFinal) {
              currentFinal += res[0].transcript;
            } else {
              currentInterim += res[0].transcript;
            }
          }

          const combined = (transcriptRef.current + ' ' + currentFinal).trim();
          if (currentFinal) {
            transcriptRef.current = combined;
            setTranscript(combined);
            if (setSearchQuery) setSearchQuery(combined);
          }
          setInterimText(currentInterim);

          const fullDetected = (combined + ' ' + currentInterim).trim();
          if (fullDetected) {
            setStatusMessage('Voice detected! Click Execute or pause to run.');

            // Auto-execute after 1.5 seconds of silence
            clearSilenceTimer();
            silenceTimerRef.current = setTimeout(() => {
              executeAction(fullDetected);
            }, 1600);
          }
        };

        recognition.onerror = (e) => {
          console.warn('[VoiceAssistantHUD SpeechRecognition Error]:', e.error);
          if (e.error === 'not-allowed') {
            setMicError('Microphone permission blocked. Please allow mic access in your browser bar.');
          } else if (e.error === 'no-speech') {
            setStatusMessage('No speech detected. Please speak closer to microphone.');
          }
        };

        recognition.onend = () => {
          // If stopped naturally and text captured, execute
          if (transcriptRef.current && !isExecuting) {
            clearSilenceTimer();
            silenceTimerRef.current = setTimeout(() => {
              executeAction(transcriptRef.current);
            }, 1000);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (err) {
        console.warn('[SpeechRecognition initialization failed, trying MediaRecorder fallback]:', err);
      }
    }

    // MediaRecorder Fallback if Web Speech API not supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };

          mediaRecorder.onstop = async () => {
            stream.getTracks().forEach((track) => track.stop());
            if (audioChunksRef.current.length > 0) {
              setStatusMessage('Transcribing with Sarvam Saaras AI...');
              const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
              try {
                const text = await transcribeAudioWithSarvam({ audioBlob: blob, languageCode: 'hi-IN' });
                if (text && text.trim()) {
                  setTranscript(text.trim());
                  transcriptRef.current = text.trim();
                  if (setSearchQuery) setSearchQuery(text.trim());
                  executeAction(text.trim());
                } else {
                  setStatusMessage('Could not transcribe audio. Please tap a command below.');
                }
              } catch (e) {
                setStatusMessage('Transcription error. Please tap a command below.');
              }
            }
          };

          mediaRecorder.start();
          setIsListening(true);
          setStatusMessage('Recording with Sarvam Saaras AI... Click Stop when finished speaking.');
        })
        .catch((err) => {
          console.warn('[Microphone permission error]:', err);
          setMicError('Microphone access denied. Tap any command chip below to execute immediately:');
          setIsListening(false);
        });
    } else {
      setMicError('Microphone not supported on this browser. Tap any command chip below:');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    clearSilenceTimer();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
      mediaRecorderRef.current = null;
    }
  };

  const handleChipClick = (cmd) => {
    setTranscript(cmd);
    transcriptRef.current = cmd;
    if (setSearchQuery) setSearchQuery(cmd);
    executeAction(cmd);
  };

  if (!isOpen) return null;

  const currentDisplay = (transcript + ' ' + interimText).trim();

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#111111] border border-stone-200 dark:border-[#222222] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col font-sans transition-all">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-[#1a1a1a] flex items-center justify-between bg-[#FAF8F5] dark:bg-[#161616]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D9532F] text-white flex items-center justify-center shadow-md shadow-terracotta-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">NearGo Voice AI Assistant</h3>
                <span className="text-[10px] bg-terracotta-50 dark:bg-terracotta-950/40 text-[#D9532F] font-bold px-2 py-0.2 rounded-full border border-terracotta-200 dark:border-terracotta-800">
                  Saaras & Bulbul
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Speaks Hindi & English • Controls the entire app
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopListening();
              stopCurrentAudio();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-[#202020] text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Audio Visualizer Orb */}
        <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            {/* Pulsing ring layers */}
            {isListening && (
              <>
                <div className="absolute -inset-4 rounded-full bg-[#D9532F]/20 animate-ping" />
                <div className="absolute -inset-2 rounded-full bg-[#D9532F]/30 animate-pulse" />
              </>
            )}

            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                isListening
                  ? 'bg-[#D9532F] text-white ring-4 ring-[#D9532F]/40 scale-105'
                  : 'bg-stone-100 dark:bg-[#1a1a1a] text-stone-600 dark:text-stone-300 hover:text-[#D9532F]'
              }`}
              title={isListening ? 'Tap to pause' : 'Tap to start speaking'}
            >
              {isExecuting ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isListening ? (
                <Mic className="w-8 h-8 animate-bounce" />
              ) : (
                <MicOff className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Status Badge */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-center gap-1.5">
              {isListening && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
              <span>{statusMessage}</span>
            </div>
            {micError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold px-4">
                {micError}
              </p>
            )}
          </div>

          {/* Real-Time Live Speech Output Display */}
          <div className="w-full bg-[#FAF8F5] dark:bg-[#161616] border border-[#E8E5DF] dark:border-[#222] rounded-2xl p-4 min-h-[70px] flex items-center justify-center text-center shadow-inner">
            {currentDisplay ? (
              <div className="text-base sm:text-lg font-bold text-stone-900 dark:text-white leading-snug">
                "{currentDisplay}"
              </div>
            ) : (
              <div className="text-xs text-stone-400 dark:text-stone-500 italic">
                Speak any task: "Find nearest metro station", "Check auto fare", "Show deals"...
              </div>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2 pt-1 w-full justify-center">
            {currentDisplay && !isExecuting && (
              <button
                type="button"
                onClick={() => executeAction(currentDisplay)}
                className="flex-1 max-w-[200px] px-4 py-2.5 rounded-xl bg-[#D9532F] hover:bg-[#C2411E] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Execute Task</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-[#262626] text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#1a1a1a] text-xs font-bold transition-all cursor-pointer"
            >
              {isListening ? 'Pause Mic' : 'Resume Mic'}
            </button>
          </div>
        </div>

        {/* Quick Clickable Voice Commands Grid */}
        <div className="p-4 sm:p-5 bg-stone-50/60 dark:bg-[#141414] border-t border-stone-100 dark:border-[#1a1a1a] space-y-2.5">
          <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#D9532F]" />
            <span>Try Speaking or Tap Any Task to Perform:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUICK_COMMANDS.map((qc) => (
              <button
                key={qc.label}
                type="button"
                onClick={() => handleChipClick(qc.command)}
                className="p-2 rounded-xl bg-white dark:bg-[#1c1c1c] border border-stone-200/80 dark:border-[#282828] hover:border-[#D9532F] dark:hover:border-[#D9532F] text-[11px] font-bold text-stone-800 dark:text-stone-200 hover:text-[#D9532F] text-center shadow-2xs transition-all active:scale-95 cursor-pointer truncate"
                title={qc.command}
              >
                {qc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
