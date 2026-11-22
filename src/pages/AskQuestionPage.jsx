import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  ShieldCheck,
  MapPin,
  Sparkles,
  Navigation,
  Send,
  X,
  Camera,
  Compass,
  CheckCircle2,
  Eye,
  Info,
  Car,
  Utensils,
  Gem,
  ShoppingBag,
  Coffee,
  AlertCircle,
  Mic,
  MicOff,
  Loader2
} from 'lucide-react';
import { POPULAR_LANDMARKS } from '../data/tariffs.js';
import { VIBE_CATEGORIES } from '../data/vibeData.js';
import PhotoUploader from '../components/PhotoUploader.jsx';
import LocationPickerMap from '../components/LocationPickerMap.jsx';
import { transcribeAudioWithSarvam } from '../utils/sarvamAudio.js';

const TOPIC_CATEGORIES = [
  { id: 'transport', label: 'Transit & Fares', icon: Car, community: 'c/DelhiTransit' },
  { id: 'food', label: 'Street Food', icon: Utensils, community: 'c/StreetFood' },
  { id: 'hidden_gems', label: 'Secret Spots', icon: Gem, community: 'c/SecretSpots' },
  { id: 'shopping', label: 'Bazaars', icon: ShoppingBag, community: 'c/BargainBazaars' },
  { id: 'cafes', label: 'Indie Cafes', icon: Coffee, community: 'c/IndieSpots' }
];

const CITIES = ['Delhi NCR', 'Mumbai', 'Bengaluru'];

export default function AskQuestionPage({ onBack, onAddQuestion, initialCity = 'Delhi NCR' }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isRecording, setIsRecording] = useState(null); // 'title' | 'body' | null
  const [recordingStatus, setRecordingStatus] = useState('');
  const recognitionRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const audioStreamRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);
  const capturedTextRef = React.useRef('');
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [authorName, setAuthorName] = useState('Traveler ' + Math.floor(100 + Math.random() * 900));
  const [category, setCategory] = useState('transport');
  const [vibeCategory, setVibeCategory] = useState('student_budget');
  const [locationMode, setLocationMode] = useState('landmark'); // 'landmark' | 'map'
  const [selectedLandmarkId, setSelectedLandmarkId] = useState('iiitd');
  const [customSpotName, setCustomSpotName] = useState('');
  const [customCoords, setCustomCoords] = useState({
    lat: 28.5459,
    lng: 77.2732,
    area: 'South Delhi',
    nearestLandmark: 'Okhla Phase 3',
    description: 'South Delhi (near Okhla Phase 3)',
  });
  const [requestFareCheck, setRequestFareCheck] = useState(true);
  const [fareOrigin, setFareOrigin] = useState('Okhla Phase 3 (South Delhi)');
  const [fareDestination, setFareDestination] = useState('Chandni Chowk Market');
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const stopVoiceCapture = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (e) {}
    }
    if (audioStreamRef.current) {
      try { audioStreamRef.current.getTracks().forEach(t => t.stop()); } catch (e) {}
      audioStreamRef.current = null;
    }
    setIsRecording(null);
    setRecordingStatus('');
  };

  const handleToggleVoice = async (field) => {
    if (isRecording) {
      stopVoiceCapture();
      return;
    }

    setIsRecording(field);
    setRecordingStatus('Listening... Speak now');
    capturedTextRef.current = '';
    audioChunksRef.current = [];

    // 1. Start browser SpeechRecognition for live interim preview
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = 'hi-IN';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            capturedTextRef.current = currentTranscript.trim();
            if (field === 'title') {
              setTitle(currentTranscript.trim());
            } else {
              setBody(currentTranscript.trim());
            }
          }
        };

        recognition.onerror = (e) => {
          console.warn('[SpeechRecognition notice]:', e.error);
        };

        recognition.onend = () => {
          // Handled on stop
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('[SpeechRecognition initialization error]:', err);
      }
    }

    // 2. Start MediaRecorder as backup & for Sarvam Saaras AI
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
          if (!capturedTextRef.current && audioChunksRef.current.length > 0) {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            try {
              const transcribed = await transcribeAudioWithSarvam({ audioBlob: blob, languageCode: 'hi-IN' });
              if (transcribed && transcribed.trim()) {
                if (field === 'title') {
                  setTitle(prev => prev ? prev + ' ' + transcribed.trim() : transcribed.trim());
                } else {
                  setBody(prev => prev ? prev + ' ' + transcribed.trim() : transcribed.trim());
                }
              }
            } catch (err) {
              console.warn('[Sarvam STT failed]:', err);
            }
          }
        };

        mediaRecorder.start(250);
      } catch (micErr) {
        console.warn('[Mic permission or access issue]:', micErr);
        if (!SpeechRec) {
          alert('Microphone access is needed for voice dictation. Please allow microphone permissions in your browser.');
          stopVoiceCapture();
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsSubmitting(true);

    let locationName = '';
    let lat = 28.5459;
    let lng = 77.2732;

    if (locationMode === 'landmark') {
      const lm = POPULAR_LANDMARKS.find((l) => l.id === selectedLandmarkId) || POPULAR_LANDMARKS[0];
      locationName = customSpotName ? `${customSpotName} (Near ${lm.name})` : lm.name;
      lat = lm.lat;
      lng = lm.lng;
    } else {
      locationName = customSpotName || customCoords.description || 'Custom Pin';
      lat = customCoords.lat;
      lng = customCoords.lng;
    }

    const currentCatObj = TOPIC_CATEGORIES.find(c => c.id === category);
    const communityName = currentCatObj?.community || 'c/LocalAdvice';

    onAddQuestion({
      title,
      body,
      city: selectedCity,
      authorName,
      community: communityName,
      category,
      vibeCategory,
      locationName,
      lat,
      lng,
      isCustomLocation: locationMode === 'map',
      tags: [
        category === 'transport' ? '#AutoFare' : `#${category}`,
        requestFareCheck ? '#FairPriceCheck' : '#LocalAdvice',
        `#${vibeCategory}`,
      ],
      requestFareCheck,
      fareOrigin,
      fareDestination,
      photos,
    });
  };

  return (
    <div className="w-full pb-10 bg-[#F4F1EA] dark:bg-[#050505] min-h-[calc(100vh-65px)]">
      {/* Top Bar - Compact Header */}
      <div className="border-b border-[#E8E5DF] dark:border-[#1a1a1a] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-[#D9532F] dark:hover:text-[#D9532F] bg-stone-100 dark:bg-[#141414] hover:bg-stone-200 dark:hover:bg-[#1f1f1f] px-3 py-1 rounded-full transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>

          <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D9532F]" />
            <span>Ask Local Studio</span>
          </span>
        </div>
      </div>

      {/* Main Form + Live Preview Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        
        {/* Compact Title + City Selector Row */}
        <div className="mb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E8E5DF]/70 dark:border-[#1a1a1a]">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Ask Locals a Real Question
            </h1>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Get genuine local answers, pinpoint custom spots, and verify legal meter fares.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">City:</span>
            <div className="flex items-center gap-1 bg-stone-100 dark:bg-[#141414] p-1 rounded-xl">
              {CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCity(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedCity === c
                      ? 'bg-[#D9532F] text-white shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {c.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Main Creation Form (7 cols) - Space-Efficient */}
          <main className="lg:col-span-7 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-4 sm:p-5 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Category Pills (Horizontal Scrollbar-free) */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Topic Category
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {TOPIC_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                          isSelected
                            ? 'bg-terracotta-50 dark:bg-terracotta-950/40 border-[#D9532F] text-[#D9532F] shadow-2xs'
                            : 'bg-[#FAF8F5] dark:bg-[#121212] border-stone-200 dark:border-[#222] text-stone-600 dark:text-stone-400 hover:border-stone-300'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D9532F]' : 'text-stone-500'}`} />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    Discussion Title
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleVoice('title')}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                        isRecording === 'title'
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-stone-100 dark:bg-[#1c1c1c] text-[#D9532F] hover:bg-stone-200'
                      }`}
                      title="Speak title in Hindi/English (Sarvam Saaras AI)"
                    >
                      <Mic className={`w-2.5 h-2.5 ${isRecording === 'title' ? 'animate-bounce' : ''}`} />
                      <span>{isRecording === 'title' ? '🔴 Stop Listening' : '🎙️ Speak (Sarvam)'}</span>
                    </button>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {title.length}/100
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Fair auto fare from Nizamuddin Station to Karol Bagh at 10 PM?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-400 font-medium"
                />
                {isRecording === 'title' && (
                  <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold animate-pulse mt-1 flex items-center gap-1">
                    <span>🔴</span>
                    <span>Listening in Hindi or English... Speak into your mic, then tap Stop.</span>
                  </p>
                )}
              </div>

              {/* Body / Context (Compact) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    Details & Context
                  </label>
                  <button
                    type="button"
                    onClick={() => handleToggleVoice('body')}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${
                      isRecording === 'body'
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-stone-100 dark:bg-[#1c1c1c] text-[#D9532F] hover:bg-stone-200'
                    }`}
                    title="Speak details in Hindi/English (Sarvam Saaras AI)"
                  >
                    <Mic className={`w-2.5 h-2.5 ${isRecording === 'body' ? 'animate-bounce' : ''}`} />
                    <span>{isRecording === 'body' ? '🔴 Stop Listening' : '🎙️ Speak (Sarvam)'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Provide context (e.g. driver quoted ₹350, or looking for authentic late night street food)..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-xl p-2.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-400 leading-relaxed"
                />
                {isRecording === 'body' && (
                  <p className="text-[10px] text-red-600 dark:text-red-400 font-semibold animate-pulse mt-1 flex items-center gap-1">
                    <span>🔴</span>
                    <span>Listening in Hindi or English... Speak into your mic, then tap Stop.</span>
                  </p>
                )}
              </div>

              {/* Location Pinning (Compact Row) */}
              <div className="bg-[#FAF8F5] dark:bg-[#121212] p-2.5 rounded-xl border border-stone-200 dark:border-[#222] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D9532F]" />
                    <span>Pin Location</span>
                  </span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setLocationMode('landmark')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                        locationMode === 'landmark'
                          ? 'bg-white dark:bg-[#252525] text-[#D9532F] shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      🏛️ Hub/Metro
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationMode('map')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                        locationMode === 'map'
                          ? 'bg-white dark:bg-[#252525] text-[#D9532F] shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      📍 Interactive Pin
                    </button>
                  </div>
                </div>

                {locationMode === 'landmark' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      id="ask-landmark"
                      aria-label="Nearby Hub or Metro"
                      value={selectedLandmarkId}
                      onChange={(e) => setSelectedLandmarkId(e.target.value)}
                      className="bg-white dark:bg-[#181818] border border-[#E8E5DF] dark:border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-white font-medium"
                    >
                      {POPULAR_LANDMARKS.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} ({l.area})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Custom area (e.g. Near Exit Gate 2)"
                      value={customSpotName}
                      onChange={(e) => setCustomSpotName(e.target.value)}
                      className="bg-white dark:bg-[#181818] border border-[#E8E5DF] dark:border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-white"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <LocationPickerMap
                      initialLat={28.5459}
                      initialLng={77.2732}
                      spotName={customSpotName}
                      onSpotNameChange={setCustomSpotName}
                      onSelectLocation={setCustomCoords}
                      height="170px"
                    />
                    <div className="flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40 font-medium">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#D9532F]" />
                        <span>Interactive Spatial Pinning Active</span>
                      </span>
                      <span className="font-bold text-[9px] bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded">50+ Local Cred Unlocked</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Fair Fare Check Request (Collapsible Minimal Row) */}
              <div className="bg-[#FAF8F5] dark:bg-[#121212] p-2.5 rounded-xl border border-stone-200 dark:border-[#222] space-y-2">
                <label className="text-xs font-bold text-stone-900 dark:text-white flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D9532F]" />
                    <span>Include Fair Fare Tariff Audit</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={requestFareCheck}
                    onChange={(e) => setRequestFareCheck(e.target.checked)}
                    className="rounded accent-[#D9532F] w-3.5 h-3.5"
                  />
                </label>

                {requestFareCheck && (
                  <div className="pt-2 border-t border-stone-200/80 dark:border-[#1f1f1f] grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Origin (e.g. New Delhi Station)"
                      value={fareOrigin}
                      onChange={(e) => setFareOrigin(e.target.value)}
                      className="bg-white dark:bg-[#181818] border border-[#E8E5DF] dark:border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Destination (e.g. India Gate)"
                      value={fareDestination}
                      onChange={(e) => setFareDestination(e.target.value)}
                      className="bg-white dark:bg-[#181818] border border-[#E8E5DF] dark:border-[#262626] rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* Photos & User Profile (Compact Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Attach Photos (Optional)
                  </label>
                  <PhotoUploader
                    photos={photos}
                    onChange={setPhotos}
                    label="Attach Photos (0/4)"
                    maxPhotos={4}
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Display Name & Vibe
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-lg px-2.5 py-1.5 text-xs text-stone-900 dark:text-white font-medium"
                      />
                      <select
                        aria-label="Vibe Preference"
                        value={vibeCategory}
                        onChange={(e) => setVibeCategory(e.target.value)}
                        className="bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-lg px-2 py-1.5 text-xs text-stone-900 dark:text-white font-medium"
                      >
                        <option value="student_budget">🎓 Student</option>
                        <option value="heritage">🏰 Heritage</option>
                        <option value="street_food">🥟 Foodie</option>
                        <option value="night_owl">🌙 Late Night</option>
                        <option value="family_friendly">👨‍👩‍👧 Family</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Action */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={onBack}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#181818] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !title.trim() || !body.trim()}
                      className="px-5 py-2 rounded-xl bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs shadow-md shadow-terracotta-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02] disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Posting...' : 'Publish Question'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </main>

          {/* Right Column: Compact Live Post Preview (5 cols) */}
          <aside className="lg:col-span-5 space-y-3 lg:sticky lg:top-14">
            
            {/* Live Card Preview */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-3.5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#D9532F]" />
                  <span>Live Feed Preview</span>
                </span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-semibold">
                  Real-time
                </span>
              </div>

              {/* Preview Card */}
              <div className="bg-[#FAF8F5] dark:bg-[#121212] rounded-xl border border-[#E8E5DF] dark:border-[#222] p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#D9532F] bg-white dark:bg-[#181818] px-2 py-0.5 rounded-full border border-terracotta-200">
                    {TOPIC_CATEGORIES.find(c => c.id === category)?.community || 'c/DelhiTransit'}
                  </span>
                  <span className="text-[10px] text-stone-400">📍 {selectedCity}</span>
                </div>

                <div className="text-xs font-bold text-stone-900 dark:text-white line-clamp-2">
                  {title || 'Your question title will appear here...'}
                </div>

                <div className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2">
                  {body || 'Provide details about what you want to know from local residents...'}
                </div>

                {photos.length > 0 && (
                  <div className="flex gap-1.5 pt-1">
                    {photos.slice(0, 3).map((p, i) => (
                      <img key={i} src={p} alt="preview" className="w-10 h-10 object-cover rounded-md border border-stone-200" />
                    ))}
                    {photos.length > 3 && (
                      <div className="w-10 h-10 rounded-md bg-stone-200 text-stone-600 text-[10px] font-bold flex items-center justify-center">
                        +{photos.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-1.5 border-t border-stone-200/80 dark:border-[#1e1e1e] flex items-center justify-between text-[10px] text-stone-400">
                  <span>By {authorName}</span>
                  <span>0 Answers • 0 Upvotes</span>
                </div>
              </div>
            </div>

            {/* Quick Tips Badge */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 text-[11px] text-stone-700 dark:text-stone-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Tips for Fast Local Answers</span>
              </div>
              <p className="text-[10px] text-stone-600 dark:text-stone-400 leading-snug">
                Mention specific exits or landmark gates, time of day for night tariffs, and attach a quote photo for 3x faster local replies.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
