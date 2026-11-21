import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  Languages,
  Loader2,
  X,
  Compass
} from 'lucide-react';
import { NEIGHBOURHOOD_AUDIO_STORIES } from '../data/neighbourhoodAudioStories.js';
import { playSarvamSpeech, stopCurrentAudio } from '../utils/sarvamAudio.js';

const LANGUAGES = [
  { code: 'en-IN', label: 'English', flag: '🇬🇧' },
  { code: 'hi-IN', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr-IN', label: 'मराठी', flag: '🇮🇳' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

export default function NeighbourhoodRadio({ selectedCity = 'Delhi NCR', currentCoords = null, onFlyToSpot }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [channelIndex, setChannelIndex] = useState(0);

  // Filter stories for current city
  const cityStories = NEIGHBOURHOOD_AUDIO_STORIES.filter(
    (s) => s.city.toLowerCase() === selectedCity.toLowerCase()
  );
  const availableStories = cityStories.length > 0 ? cityStories : NEIGHBOURHOOD_AUDIO_STORIES;

  const currentStory = availableStories[channelIndex % availableStories.length];

  // Stop audio when component unmounts or city changes
  useEffect(() => {
    stopCurrentAudio();
    setIsPlaying(false);
    setChannelIndex(0);
  }, [selectedCity]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopCurrentAudio();
      setIsPlaying(false);
      return;
    }

    if (!currentStory) return;

    const transcript = currentStory.transcripts[selectedLang] || currentStory.transcripts['en-IN'];
    setLoadingAudio(true);

    try {
      await playSarvamSpeech({
        text: transcript,
        languageCode: selectedLang,
        speaker: selectedLang === 'hi-IN' ? 'meera' : 'arvind',
        onStart: () => {
          setLoadingAudio(false);
          setIsPlaying(true);
        },
        onEnd: () => {
          setIsPlaying(false);
        },
        onError: () => {
          setLoadingAudio(false);
          setIsPlaying(false);
        },
      });
    } catch (e) {
      setLoadingAudio(false);
      setIsPlaying(false);
    }
  };

  const handleNextChannel = () => {
    stopCurrentAudio();
    setIsPlaying(false);
    setChannelIndex((prev) => (prev + 1) % availableStories.length);
  };

  const handleChangeLanguage = async (newLang) => {
    setSelectedLang(newLang);
    if (isPlaying && currentStory) {
      stopCurrentAudio();
      setIsPlaying(false);
      const transcript = currentStory.transcripts[newLang] || currentStory.transcripts['en-IN'];
      setLoadingAudio(true);
      await playSarvamSpeech({
        text: transcript,
        languageCode: newLang,
        speaker: newLang === 'hi-IN' ? 'meera' : 'arvind',
        onStart: () => {
          setLoadingAudio(false);
          setIsPlaying(true);
        },
        onEnd: () => setIsPlaying(false),
      });
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none font-sans">
      {/* Minimized Floating Radio Pill */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg border transition-all duration-300 group ${
            isPlaying
              ? 'bg-[#D9532F] text-white border-terracotta-400 shadow-terracotta-500/30 scale-105'
              : 'bg-stone-900/90 hover:bg-stone-900 dark:bg-[#141414]/90 dark:hover:bg-[#181818] text-white border-stone-700/60 backdrop-blur-md'
          }`}
        >
          <div className="relative flex items-center justify-center">
            <Radio className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-white' : 'text-[#D9532F]'}`} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>

          <div className="text-left">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300/90 font-bold flex items-center gap-1">
              <span>📻</span>
              <span>{currentStory.frequency}</span>
            </div>
            <div className="text-xs font-bold text-white max-w-[140px] truncate leading-tight">
              {currentStory.neighborhood}
            </div>
          </div>

          {/* Soundwave Animation */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-3.5 pl-1">
              <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
              <span className="w-1 bg-white rounded-full animate-bounce [animation-delay:-0.15s] h-2" />
              <span className="w-1 bg-white rounded-full animate-bounce h-3.5" />
            </div>
          )}

          <ChevronUp className="w-3.5 h-3.5 text-stone-400 group-hover:text-white transition-colors" />
        </button>
      ) : (
        /* Expanded Retro Walkie-Talkie Radio Console */
        <div className="w-[340px] sm:w-[380px] bg-[#1C1917] dark:bg-[#0c0c0c] text-white rounded-3xl border-2 border-stone-700/80 shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Radio Top Header & Dial */}
          <div className="p-4 bg-gradient-to-b from-stone-800 to-stone-900 border-b border-stone-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#D9532F] text-white flex items-center justify-center shadow-inner">
                <Radio className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-extrabold tracking-wide text-white flex items-center gap-1.5">
                  <span>NearGo Desi Radio</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                    Sarvam Bulbul AI
                  </span>
                </div>
                <div className="text-[10px] font-mono text-amber-400/90 font-semibold">
                  ⚡ GPS Audio Walk • {selectedCity}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* LED Frequency Display Banner */}
          <div className="mx-4 mt-3 bg-black/80 rounded-xl p-3 border border-amber-900/40 space-y-1 font-mono">
            <div className="flex items-center justify-between text-[11px] text-amber-400">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>{currentStory.frequency}</span>
              </span>
              <span className="text-stone-500 text-[10px]">
                CH {((channelIndex % availableStories.length) + 1)}/{availableStories.length}
              </span>
            </div>
            <div className="text-xs font-bold text-amber-200 tracking-wide truncate">
              {currentStory.channelName} • {currentStory.neighborhood}
            </div>
          </div>

          {/* Story Content & Narrator Card */}
          <div className="p-4 space-y-3">
            <div>
              <div className="text-sm font-bold text-stone-100 leading-snug">
                {currentStory.title}
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-2 leading-relaxed">
                {currentStory.tagline}
              </p>
            </div>

            {/* Narrator Persona */}
            <div className="flex items-center justify-between text-[11px] bg-stone-800/60 rounded-xl p-2 border border-stone-700/40">
              <span className="text-stone-300 font-medium">
                🎙️ Narrator: <strong className="text-amber-300">{currentStory.narrator}</strong>
              </span>
              <span className="text-[10px] text-stone-400">
                🔊 {currentStory.ambientSound.split(',')[0]}
              </span>
            </div>

            {/* Insider Golden Tip */}
            <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-xl leading-relaxed">
              <strong>💡 Insider Secret:</strong> {currentStory.insiderSecret}
            </div>

            {/* Multi-Lingual Narration Switcher */}
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1">
                <Languages className="w-3 h-3 text-[#D9532F]" />
                <span>Narration Language (Sarvam Mayura)</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleChangeLanguage(lang.code)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      selectedLang === lang.code
                        ? 'bg-[#D9532F] text-white shadow-xs'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700/40'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Controls Console */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-stone-800">
              {onFlyToSpot && (
                <button
                  onClick={() => onFlyToSpot({
                    name: currentStory.neighborhood,
                    lat: currentStory.lat,
                    lng: currentStory.lng,
                    type: 'gem'
                  })}
                  className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Show location on map"
                >
                  <Compass className="w-3.5 h-3.5 text-[#D9532F]" />
                  <span className="hidden sm:inline">View on Map</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleNextChannel}
                  className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Next Neighbourhood Channel"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Next Spot</span>
                </button>

                <button
                  onClick={handleTogglePlay}
                  disabled={loadingAudio}
                  className="px-5 py-2.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs shadow-md shadow-terracotta-500/30 flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {loadingAudio ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Tuning in...</span>
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Radio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Listen Live</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
