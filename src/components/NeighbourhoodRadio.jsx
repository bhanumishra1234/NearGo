import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  SkipForward,
  Compass,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  X,
  Volume2
} from 'lucide-react';
import { NEIGHBOURHOOD_AUDIO_STORIES } from '../data/neighbourhoodAudioStories.js';
import { playSarvamSpeech, stopCurrentAudio } from '../utils/sarvamAudio.js';

const LANGUAGES = [
  { code: 'hi-IN', label: 'HI' },
  { code: 'en-IN', label: 'EN' },
  { code: 'mr-IN', label: 'MR' },
  { code: 'kn-IN', label: 'KN' },
];

export default function NeighbourhoodRadio({ selectedCity = 'Delhi NCR', onFlyToSpot }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi-IN');
  const [channelIndex, setChannelIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Filter stories for current city
  const cityStories = NEIGHBOURHOOD_AUDIO_STORIES.filter(
    (s) => s.city.toLowerCase() === selectedCity.toLowerCase()
  );
  const availableStories = cityStories.length > 0 ? cityStories : NEIGHBOURHOOD_AUDIO_STORIES;
  const currentStory = availableStories[channelIndex % availableStories.length];

  // Reset when city changes
  useEffect(() => {
    stopCurrentAudio();
    setIsPlaying(false);
    setChannelIndex(0);
    setShowTip(false);
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
        speaker: 'priya',
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
    } catch {
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
        speaker: 'priya',
        onStart: () => {
          setLoadingAudio(false);
          setIsPlaying(true);
        },
        onEnd: () => setIsPlaying(false),
      });
    }
  };

  if (!currentStory) return null;

  // If user dismissed the floating bar completely, show an unobtrusive mini button
  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 left-4 z-[1050] p-2.5 rounded-full bg-stone-900/95 text-stone-300 hover:text-white border border-stone-800 shadow-2xl backdrop-blur-md transition-all hover:scale-105"
        title="Open Desi Audio Radio"
      >
        <Radio className="w-4 h-4 text-[#D9532F]" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[1050] select-none font-sans">
      {!isOpen ? (
        /* ================= ULTRA-MINIMAL FLOATING CAPSULE ================= */
        <div className="flex items-center gap-2 bg-stone-950/90 text-white pl-3 pr-2 py-1.5 rounded-full border border-stone-800/80 shadow-xl backdrop-blur-md hover:border-stone-700 transition-all">
          
          {/* Frequency & Live Indicator */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-left group"
            title="Expand Radio Details"
          >
            <span className="relative flex h-2 w-2">
              {isPlaying && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-red-500' : 'bg-stone-500'}`} />
            </span>

            <span className="text-[11px] font-mono font-bold text-amber-300">
              {currentStory.frequency.split(' ')[0]}
            </span>

            <span className="text-xs text-stone-300 font-medium max-w-[120px] truncate">
              {currentStory.neighborhood.split('&')[0].trim()}
            </span>

            {/* Sound Wave Animation */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3 px-0.5">
                <span className="w-0.5 bg-[#D9532F] rounded-full animate-bounce [animation-delay:-0.3s] h-2.5" />
                <span className="w-0.5 bg-[#D9532F] rounded-full animate-bounce [animation-delay:-0.15s] h-1.5" />
                <span className="w-0.5 bg-[#D9532F] rounded-full animate-bounce h-3" />
              </div>
            )}
          </button>

          {/* Quick Language Switcher */}
          <div className="flex items-center bg-stone-900 rounded-full p-0.5 border border-stone-800">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleChangeLanguage(l.code)}
                className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-full transition-colors ${
                  selectedLang === l.code
                    ? 'bg-[#D9532F] text-white'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={handleTogglePlay}
            disabled={loadingAudio}
            className="w-7 h-7 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white flex items-center justify-center transition-transform hover:scale-105 shrink-0"
            title={isPlaying ? 'Pause' : 'Play Audio Story'}
          >
            {loadingAudio ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-3 h-3 fill-white" />
            ) : (
              <Play className="w-3 h-3 fill-white ml-0.5" />
            )}
          </button>

          {/* Next Channel */}
          <button
            onClick={handleNextChannel}
            className="p-1 text-stone-400 hover:text-white transition-colors"
            title="Next Story"
          >
            <SkipForward className="w-3 h-3" />
          </button>

          {/* Expand & Dismiss */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-1 text-stone-400 hover:text-white transition-colors"
            title="Expand"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-stone-500 hover:text-stone-300 transition-colors"
            title="Dismiss Radio"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        /* ================= MINIMAL EXPANDED MICRO-CARD ================= */
        <div className="w-[300px] bg-stone-950/95 text-white rounded-2xl border border-stone-800/90 shadow-2xl p-3 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150 space-y-2">
          
          {/* Header Row */}
          <div className="flex items-center justify-between pb-1.5 border-b border-stone-800/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-amber-300">
                {currentStory.frequency}
              </span>
              <span className="text-[9px] px-1 py-0.2 bg-stone-800 text-stone-400 rounded font-mono">
                Sarvam AI
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white transition-colors p-0.5"
                title="Collapse"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-stone-500 hover:text-stone-300 transition-colors p-0.5"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {currentStory.title}
              </div>
              <div className="text-[10px] text-stone-400 truncate">
                📍 {currentStory.neighborhood}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleNextChannel}
                className="w-6 h-6 rounded-full bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                title="Next Spot"
              >
                <SkipForward className="w-3 h-3" />
              </button>
              <button
                onClick={handleTogglePlay}
                disabled={loadingAudio}
                className="w-7 h-7 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white flex items-center justify-center transition-transform hover:scale-105"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {loadingAudio ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-3 h-3 fill-white" />
                ) : (
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Languages & Quick Actions */}
          <div className="flex items-center justify-between pt-1 border-t border-stone-850 text-[10px]">
            <div className="flex items-center gap-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleChangeLanguage(l.code)}
                  className={`px-1.5 py-0.5 rounded font-mono font-bold text-[9px] transition-colors ${
                    selectedLang === l.code
                      ? 'bg-[#D9532F] text-white'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowTip(!showTip)}
                className={`text-[9px] font-semibold flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors ${
                  showTip ? 'bg-amber-950/70 text-amber-300' : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Secret Insider Tip"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Tip</span>
              </button>

              {onFlyToSpot && (
                <button
                  onClick={() =>
                    onFlyToSpot({
                      name: currentStory.neighborhood,
                      lat: currentStory.lat,
                      lng: currentStory.lng,
                      type: 'gem',
                    })
                  }
                  className="text-[9px] font-semibold text-stone-400 hover:text-[#D9532F] flex items-center gap-0.5 px-1.5 py-0.5 rounded transition-colors"
                  title="Show on map"
                >
                  <Compass className="w-2.5 h-2.5" />
                  <span>Map</span>
                </button>
              )}
            </div>
          </div>

          {/* Inline Tip */}
          {showTip && (
            <div className="text-[10px] text-amber-200/90 bg-amber-950/40 border border-amber-900/40 p-2 rounded-lg leading-relaxed animate-in fade-in duration-100">
              💡 {currentStory.insiderSecret}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
