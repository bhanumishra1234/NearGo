import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Compass,
  MessageSquarePlus,
  Navigation,
  Search,
  SlidersHorizontal,
  X,
  LogOut,
  LogIn,
  ChevronDown,
  ShieldCheck,
  Moon,
  Sun,
  Sparkles,
  User,
  Gift,
  Store,
  Landmark,
  Award,
  Mic,
  MicOff,
  Volume2,
  Zap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserCredTier } from '../utils/credEngine.js';
import { transcribeAudioWithSarvam } from '../utils/sarvamAudio.js';
import { executeVoiceTask } from '../utils/voiceTaskEngine.js';

export default function Navbar({
  selectedCity,
  setSelectedCity,
  onRequestLocation,
  isDetectingLocation,
  locationStatus,
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  onOpenAskModal,
  onOpenFareModal,
  onOpenVibeModal,
  onOpenAuthModal,
  onOpenCouponModal,
  onOpenMerchantModal,
  onOpenTrailsModal,
  onHighlightOnMap,
  questions,
  searchQuery,
  setSearchQuery,
  sidebarOpen,
  setSidebarOpen,
}) {
  const { user, signOut, signInAsDemo } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Saaras AI Voice Search & Action Execution State
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [voiceToast, setVoiceToast] = useState(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);
  const capturedTextRef = useRef('');

  const triggerVoiceTask = async (text) => {
    if (!text || !text.trim()) return;
    try {
      setVoiceStatus('⚡ Executing task...');
      await executeVoiceTask({
        transcript: text,
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
        onShowToast: (msg) => {
          setVoiceToast(msg);
          setTimeout(() => setVoiceToast(null), 4500);
        },
      });
    } catch (err) {
      console.warn('[Voice Task Execution Error]:', err);
    }
  };

  const stopVoiceSearch = (executeImmediately = false) => {
    setIsListening(false);
    setVoiceStatus('');
    const textToExecute = capturedTextRef.current;
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
    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      } catch (e) {}
      audioStreamRef.current = null;
    }
    if (executeImmediately && textToExecute && textToExecute.trim()) {
      triggerVoiceTask(textToExecute.trim());
    }
  };

  const handleToggleVoiceSearch = async () => {
    if (isListening) {
      stopVoiceSearch(true);
      return;
    }

    capturedTextRef.current = '';
    audioChunksRef.current = [];
    setIsListening(true);
    setVoiceStatus('Listening... Speak now (e.g. "Find the nearest metro station")');

    // 1. Browser Speech Recognition (Instant streaming transcript)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            capturedTextRef.current = currentTranscript.trim();
            setSearchQuery(currentTranscript.trim());
            if (setActiveTab) setActiveTab('feed');
          }
        };

        recognition.onerror = (e) => {
          console.warn('[Navbar SpeechRecognition error]:', e.error);
        };

        recognition.onend = () => {
          const text = capturedTextRef.current;
          stopVoiceSearch();
          if (text && text.trim()) {
            triggerVoiceTask(text.trim());
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('[Navbar SpeechRecognition init error]:', err);
      }
    }

    // 2. MediaRecorder + Sarvam Saaras AI Speech-to-Text Fallback/Parallel
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          let text = capturedTextRef.current;
          if (!text && audioChunksRef.current.length > 0) {
            setVoiceStatus('Transcribing with Sarvam Saaras AI...');
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            try {
              const transcript = await transcribeAudioWithSarvam({ audioBlob: blob, languageCode: 'hi-IN' });
              if (transcript && transcript.trim()) {
                text = transcript.trim();
                capturedTextRef.current = text;
                setSearchQuery(text);
              }
            } catch (err) {
              console.warn('[Navbar Sarvam Saaras STT Error]:', err);
            }
          }
          stopVoiceSearch();
          if (text && text.trim()) {
            triggerVoiceTask(text.trim());
          }
        };

        mediaRecorder.start();
      } catch (err) {
        console.warn('[Navbar Mic Access Error]:', err);
        setVoiceStatus('Microphone permission required');
        setTimeout(() => stopVoiceSearch(), 2500);
      }
    } else if (!SpeechRecognition) {
      setVoiceStatus('Audio recording not supported');
      setTimeout(() => stopVoiceSearch(), 2500);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user ? (user.user_metadata?.full_name || user.email?.split('@')[0] || 'User') : '';
  const initial = user && displayName ? displayName.charAt(0).toUpperCase() : '';
  const userCred = getUserCredTier(user?.reputation || user?.user_metadata?.reputation || 98);

  return (
    <header aria-label="Main Site Navigation" className="sticky top-0 z-[1100] bg-white/95 dark:bg-[#000000]/95 backdrop-blur-md border-b border-[#E8E5DF] dark:border-[#1a1a1a]">
      {/* Interactive Voice Task Execution Toast */}
      {voiceToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[2000] bg-stone-900/95 dark:bg-stone-100/95 text-white dark:text-stone-900 px-4 py-2 rounded-full shadow-2xl border border-stone-700 dark:border-stone-300 flex items-center gap-2.5 text-xs font-bold animate-fadeIn backdrop-blur-md pointer-events-auto">
          <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>{voiceToast}</span>
          <button
            type="button"
            onClick={() => setVoiceToast(null)}
            className="ml-2 text-stone-400 hover:text-white dark:hover:text-stone-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Left: Brand & City Selector */}
          <div className="flex items-center gap-3 shrink-0">
            {setSidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#161616] transition-colors"
                title="Toggle Sidebar"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            <div
              className="flex items-center gap-1 cursor-pointer select-none"
              onClick={() => setActiveTab('feed')}
            >
              <span className="text-xl font-black tracking-tight text-stone-900 dark:text-white font-sans">
                Near<span className="text-[#D9532F]">Go</span>
              </span>
            </div>

            {/* City Dropdown Pill */}
            <div className="hidden sm:flex items-center ml-1 pl-3 border-l border-stone-200 dark:border-[#1f1f1f] gap-1">
              <div className="flex items-center gap-1.5 bg-[#F7F6F3] dark:bg-[#111111] border border-[#E8E5DF] dark:border-[#1e1e1e] hover:border-stone-300 dark:hover:border-stone-600 px-2.5 py-1 rounded-full text-xs transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#D9532F]" />
                <select id="navbar-city-select" aria-label="Select Active City"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-stone-800 dark:text-stone-100 font-semibold outline-none cursor-pointer text-xs pr-1"
                >
                  <option value="Delhi NCR" className="bg-white dark:bg-[#111111] text-stone-900 dark:text-stone-100">Delhi NCR</option>
                  <option value="Mumbai" className="bg-white dark:bg-[#111111] text-stone-900 dark:text-stone-100">Mumbai</option>
                  <option value="Bengaluru" className="bg-white dark:bg-[#111111] text-stone-900 dark:text-stone-100">Bengaluru</option>
                </select>
              </div>

              {/* Auto Detect Location Button */}
              <button
                onClick={onRequestLocation}
                disabled={isDetectingLocation}
                title="Auto-detect nearest city"
                className={`p-1.5 rounded-full border text-xs flex items-center transition-all ${
                  isDetectingLocation
                    ? 'bg-terracotta-50 dark:bg-[#D9532F]/20 border-terracotta-300 dark:border-[#D9532F]/50 text-[#D9532F] animate-pulse'
                    : 'bg-[#F7F6F3] dark:bg-[#111111] border-[#E8E5DF] dark:border-[#1e1e1e] text-stone-500 dark:text-stone-400 hover:text-[#D9532F] hover:border-stone-300 dark:hover:border-stone-600'
                }`}
              >
                <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                {locationStatus && (
                  <span className="text-[10px] font-semibold px-1 text-[#D9532F]">
                    {locationStatus}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Center: Search Input & Saaras Voice Search */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6 relative">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isListening ? 'Listening... Speak (e.g. "Find nearest metro")' : 'Search local questions, fares, gems...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-[#F4F1EA] dark:bg-[#111111] hover:bg-[#EFECE5] dark:hover:bg-[#161616] focus:bg-white dark:focus:bg-[#141414] border rounded-full pl-8 pr-16 py-1.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none transition-all ${
                  isListening
                    ? 'border-rose-400 ring-2 ring-rose-200 dark:ring-rose-950/60 bg-rose-50/50'
                    : 'border-transparent focus:border-stone-300 dark:focus:border-[#2a2a2a]'
                }`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleToggleVoiceSearch}
                  className={`p-1.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-md'
                      : 'text-stone-500 hover:text-[#D9532F] hover:bg-stone-200/60 dark:hover:bg-[#202020]'
                  }`}
                  title={isListening ? 'Stop voice listening' : 'Voice Search with Sarvam Saaras AI (e.g. "Find nearest metro station")'}
                  aria-label="Voice Search with Sarvam Saaras"
                >
                  <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-bounce' : ''}`} />
                </button>
              </div>
            </div>

            {/* Live Voice Search Transcription Status Pill */}
            {isListening && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-stone-900 text-white text-[11px] font-semibold py-1 px-3 rounded-full shadow-lg flex items-center justify-between border border-stone-700 animate-fadeIn">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="truncate">{voiceStatus || 'Listening... Speak now (e.g. "Find the nearest metro station")'}</span>
                </span>
                <button
                  type="button"
                  onClick={stopVoiceSearch}
                  className="ml-2 text-stone-300 hover:text-white underline text-[10px] uppercase font-bold shrink-0"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Right: View Tabs, Ask Button, & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Tabs Pill */}
            <div className="hidden sm:flex items-center bg-[#F4F1EA] dark:bg-[#111111] p-0.5 rounded-full border border-stone-200/80 dark:border-[#1e1e1e] text-xs">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  activeTab === 'feed'
                    ? 'bg-white dark:bg-[#222222] text-stone-900 dark:text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Discussions
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1 rounded-full font-semibold flex items-center gap-1 transition-all ${
                  activeTab === 'map'
                    ? 'bg-white dark:bg-[#222222] text-stone-900 dark:text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#D9532F]" />
                <span>Map</span>
              </button>
            </div>

            {/* Flash Deals & Perks Button */}
            {onOpenCouponModal && (
              <button
                onClick={onOpenCouponModal}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/50 text-xs font-bold hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-all shadow-2xs cursor-pointer"
                title="Community Flash Deals & Free Chai Perks"
              >
                <Gift className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Deals</span>
              </button>
            )}

            {/* Minimal Add Question Button */}
            <button
              onClick={onOpenAskModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Local</span>
              <span className="sm:hidden">Ask</span>
            </button>

            {/* Direct 1-Click Sign In Button for Guests */}
            {!user && (
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-300 dark:border-[#262626] hover:border-[#D9532F] text-xs font-bold text-stone-800 dark:text-stone-200 hover:text-[#D9532F] transition-all cursor-pointer shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 text-[#D9532F]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Profile Avatar Pill */}
            <div className="relative ml-0.5" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1 p-0.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#161616] transition-colors focus:outline-none cursor-pointer"
                title={user ? displayName : 'Account Menu (Sign In)'}
              >
                <div className={`w-7 h-7 rounded-full ${user ? 'bg-stone-900 dark:bg-stone-800 text-white border border-stone-700' : 'bg-stone-100 dark:bg-[#181818] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-[#262626]'} font-bold flex items-center justify-center text-[11px]`}>
                  {user ? (
                    <span>{initial}</span>
                  ) : (
                    <User className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                  )}
                </div>
                <ChevronDown className={`w-3 h-3 text-stone-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0c0c0c] rounded-xl border border-[#E8E5DF] dark:border-[#1e1e1e] shadow-xl py-1.5 z-50 text-xs animate-fadeIn">
                  {user ? (
                    <>
                      <div className="px-3.5 py-2.5 border-b border-stone-100 dark:border-[#1a1a1a] space-y-1.5">
                        <div className="font-bold text-stone-900 dark:text-white truncate">{displayName}</div>
                        <div className="text-[10px] text-stone-400 dark:text-stone-500 truncate">{user.email}</div>
                        
                        {/* Local Cred Tier Badge & Score */}
                        <div className="pt-1">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-[#D9532F] flex items-center gap-1">
                              ⭐ {userCred.score} Local Cred
                            </span>
                            <span className="text-stone-500 font-semibold">{userCred.tier.name}</span>
                          </div>
                          {userCred.nextTier && (
                            <div className="mt-1">
                              <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#D9532F] h-full rounded-full transition-all duration-500"
                                  style={{ width: `${userCred.progressPercent}%` }}
                                />
                              </div>
                              <div className="text-[9px] text-stone-400 mt-0.5">
                                {userCred.pointsToNextTier} Cred to unlock {userCred.nextTier.name}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenAskModal();
                          }}
                          className="w-full text-left px-3.5 py-1.5 hover:bg-stone-50 dark:hover:bg-[#161616] flex items-center gap-2 text-stone-700 dark:text-stone-300"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5 text-[#D9532F]" />
                          <span>My Questions</span>
                        </button>

                        {onOpenCouponModal && (
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onOpenCouponModal();
                            }}
                            className="w-full text-left px-3.5 py-1.5 hover:bg-stone-50 dark:hover:bg-[#161616] flex items-center gap-2 text-stone-700 dark:text-stone-300"
                          >
                            <Gift className="w-3.5 h-3.5 text-orange-500" />
                            <span>Community Flash Deals</span>
                          </button>
                        )}

                        {onOpenMerchantModal && (
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onOpenMerchantModal();
                            }}
                            className="w-full text-left px-3.5 py-1.5 hover:bg-stone-50 dark:hover:bg-[#161616] flex items-center gap-2 text-stone-700 dark:text-stone-300"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>Local Guild (Invite Only)</span>
                          </button>
                        )}

                        {onOpenTrailsModal && (
                          <button
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              onOpenTrailsModal();
                            }}
                            className="w-full text-left px-3.5 py-1.5 hover:bg-stone-50 dark:hover:bg-[#161616] flex items-center gap-2 text-stone-700 dark:text-stone-300"
                          >
                            <Landmark className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span>DMRC Heritage Trails</span>
                          </button>
                        )}
                      </div>

                      {/* Theme Toggle Slider */}
                      <div className="px-3.5 py-2 border-t border-stone-100 dark:border-[#1a1a1a] flex items-center justify-between text-stone-700 dark:text-stone-300">
                        <div className="flex items-center gap-2">
                          {darkMode ? <Moon className="w-3.5 h-3.5 text-indigo-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                          <span className="text-xs font-medium">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                            darkMode ? 'bg-[#D9532F]' : 'bg-stone-300 dark:bg-stone-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                              darkMode ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="pt-1 border-t border-stone-100 dark:border-[#1a1a1a]">
                        <button
                          onClick={async () => {
                            setProfileDropdownOpen(false);
                            await signOut();
                          }}
                          className="w-full text-left px-3.5 py-1.5 hover:bg-stone-50 dark:hover:bg-[#161616] flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-3.5 py-2 border-b border-stone-100 dark:border-[#1a1a1a]">
                        <div className="font-bold text-stone-900 dark:text-white">Welcome to NearGo</div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                          Sign in to post questions, submit gems, and vote.
                        </div>
                      </div>

                      {/* 1-Click Demo Login for Judges/Evaluators */}
                      <div className="p-2 pb-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            signInAsDemo('Aarav Sharma (Verified Local)');
                          }}
                          className="w-full py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-[#D9532F] hover:from-amber-600 hover:to-[#C2411E] text-white font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>⚡ 1-Click Demo Login</span>
                        </button>
                      </div>

                      <div className="p-2 pt-1 space-y-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenAuthModal('login');
                          }}
                          className="w-full py-1.5 rounded-lg bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>Sign In</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenAuthModal('signup');
                          }}
                          className="w-full py-1.5 rounded-lg bg-stone-100 dark:bg-[#181818] hover:bg-stone-200 dark:hover:bg-[#222222] text-stone-700 dark:text-stone-300 font-semibold text-center transition-colors border border-transparent dark:border-[#222222]"
                        >
                          <span>Create Account</span>
                        </button>
                      </div>

                      {/* Theme Toggle Slider for guest users */}
                      <div className="px-3.5 py-2 border-t border-stone-100 dark:border-[#1a1a1a] flex items-center justify-between text-stone-700 dark:text-stone-300">
                        <div className="flex items-center gap-2">
                          {darkMode ? <Moon className="w-3.5 h-3.5 text-indigo-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                          <span className="text-xs font-medium">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                            darkMode ? 'bg-[#D9532F]' : 'bg-stone-300 dark:bg-stone-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                              darkMode ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
