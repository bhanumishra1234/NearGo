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
  AlertCircle
} from 'lucide-react';
import { POPULAR_LANDMARKS } from '../data/tariffs.js';
import { VIBE_CATEGORIES } from '../data/vibeData.js';
import PhotoUploader from '../components/PhotoUploader.jsx';
import LocationPickerMap from '../components/LocationPickerMap.jsx';

const TOPIC_CATEGORIES = [
  { id: 'transport', label: 'Transit & Fares', icon: Car, community: 'c/DelhiTransit' },
  { id: 'food', label: 'Street Food & Dining', icon: Utensils, community: 'c/StreetFood' },
  { id: 'hidden_gems', label: 'Secret Spots', icon: Gem, community: 'c/SecretSpots' },
  { id: 'shopping', label: 'Bargain Bazaars', icon: ShoppingBag, community: 'c/BargainBazaars' },
  { id: 'cafes', label: 'Indie Cafes & Chai', icon: Coffee, community: 'c/IndieSpots' }
];

const CITIES = ['Delhi NCR', 'Mumbai', 'Bengaluru'];

export default function AskQuestionPage({ onBack, onAddQuestion, initialCity = 'Delhi NCR' }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsSubmitting(true);

    let locationName = '';
    let lat = 28.5459;
    let lng = 77.2732;

    if (locationMode === 'map') {
      locationName = customSpotName.trim() || customCoords.description || 'Custom Pinpointed Area';
      lat = customCoords.lat;
      lng = customCoords.lng;
    } else {
      const landmark = POPULAR_LANDMARKS.find((l) => l.id === selectedLandmarkId) || POPULAR_LANDMARKS[0];
      locationName = customSpotName.trim() || landmark.name;
      lat = landmark.lat;
      lng = landmark.lng;
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
    <div className="w-full pb-16 bg-[#F4F1EA] dark:bg-[#050505] min-h-[calc(100vh-65px)]">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-[#E8E5DF] dark:border-[#1a1a1a] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-[#D9532F] dark:hover:text-[#D9532F] bg-stone-100 dark:bg-[#141414] hover:bg-stone-200 dark:hover:bg-[#1f1f1f] px-3.5 py-1.5 rounded-full transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D9532F]" />
              <span>Full-Page Creation Studio</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Form + Live Preview Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Page Hero Header */}
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Ask Locals a Real Question
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Get authentic answers from genuine city residents, pinpoint custom spots, and calculate legal municipal meter fares.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Creation Form (7 cols) */}
          <main className="lg:col-span-7 bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-6 sm:p-7 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* City Selector Pills */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">
                  1. Select Target City
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedCity(c)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCity === c
                          ? 'bg-[#D9532F] text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-[#141414] text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                      }`}
                    >
                      📍 {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Category */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">
                  2. Choose Topic Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOPIC_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-terracotta-50/70 dark:bg-terracotta-950/40 border-[#D9532F] text-[#D9532F]'
                            : 'bg-white dark:bg-[#121212] border-stone-200 dark:border-[#222] text-stone-700 dark:text-stone-300 hover:border-stone-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#D9532F]' : 'text-stone-500'}`} />
                        <span className="text-xs font-bold leading-tight">{cat.label}</span>
                        <span className="text-[10px] text-stone-400">{cat.community}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    3. Discussion Title
                  </label>
                  <span className="text-[11px] text-stone-400">
                    {title.length}/100
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Fair auto fare from Nizamuddin Station to Karol Bagh at 10 PM?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-400 font-medium"
                />
              </div>

              {/* Body / Context */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                  4. Details & Context
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide context (e.g., driver quoted ₹350, wanted to check if metered rate is lower, or looking for cheap late night food)..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-xl p-4 text-xs sm:text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-terracotta-400 leading-relaxed"
                />
              </div>

              {/* Location Pinning Section */}
              <div className="bg-[#FAF8F5] dark:bg-[#121212] p-4 sm:p-5 rounded-2xl border border-terracotta-200 dark:border-terracotta-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#D9532F]" />
                    <span>5. Pin Location on City Map</span>
                  </span>
                  <span className="text-[10px] text-[#D9532F] font-bold bg-terracotta-50 dark:bg-terracotta-950/60 px-2.5 py-0.5 rounded-full border border-terracotta-200/50">
                    Spatial Map Pin
                  </span>
                </div>

                {/* Location Mode Tabs */}
                <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-[#181818] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLocationMode('landmark')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      locationMode === 'landmark'
                        ? 'bg-white dark:bg-[#252525] text-[#D9532F] shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-stone-500" />
                    <span>🏛️ Major Landmark / Metro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationMode('map')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      locationMode === 'map'
                        ? 'bg-white dark:bg-[#252525] text-[#D9532F] shadow-xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#D9532F]" />
                    <span>📍 Pinpoint on Interactive Map</span>
                  </button>
                </div>

                {locationMode === 'landmark' ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="ask-landmark" className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                          Select nearby hub / metro:
                        </label>
                        <select
                          id="ask-landmark"
                          aria-label="Nearby Hub or Metro"
                          value={selectedLandmarkId}
                          onChange={(e) => setSelectedLandmarkId(e.target.value)}
                          className="w-full bg-white dark:bg-[#181818] border border-[#E8E5DF] dark:border-[#262626] rounded-xl p-2.5 text-xs text-stone-900 dark:text-white font-medium"
                        >
                          {POPULAR_LANDMARKS.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.name} ({l.area})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                          Custom area / place title:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Near Exit Gate 2"
                          value={customSpotName}
                          onChange={(e) => setCustomSpotName(e.target.value)}
                          className="w-full bg-white dark:bg-[#181818] border border-[#E8E5DF] dark:border-[#262626] rounded-xl p-2.5 text-xs text-stone-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <LocationPickerMap
                      initialLat={28.5459}
                      initialLng={77.2732}
                      spotName={customSpotName}
                      onSpotNameChange={setCustomSpotName}
                      onSelectLocation={setCustomCoords}
                      height="240px"
                    />
                    <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Custom Pin Active:</strong> Your question will be pinned directly on the map with custom coordinates!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Fair Fare Check Request */}
              <div className="bg-[#FAF8F5] dark:bg-[#121212] p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-[#222] space-y-3">
                <label className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requestFareCheck}
                    onChange={(e) => setRequestFareCheck(e.target.checked)}
                    className="rounded accent-[#D9532F] w-4 h-4"
                  />
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#D9532F]" />
                    <span>Include Fair Fare Tariff Audit for this route</span>
                  </span>
                </label>

                {requestFareCheck && (
                  <div className="pt-2 border-t border-stone-200 dark:border-[#1f1f1f] grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                        Starting Point (Origin)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. New Delhi Railway Station"
                        value={fareOrigin}
                        onChange={(e) => setFareOrigin(e.target.value)}
                        className="w-full bg-white dark:bg-[#181818] border border-[#E8E5DF] dark:border-[#262626] rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                        Destination
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. India Gate"
                        value={fareDestination}
                        onChange={(e) => setFareDestination(e.target.value)}
                        className="w-full bg-white dark:bg-[#181818] border border-[#E8E5DF] dark:border-[#262626] rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Photos Attachment (Cloudinary CDN) */}
              <div>
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">
                  6. Attach Photos (Auto-compressed to WebP & Cloudinary CDN)
                </label>
                <PhotoUploader
                  photos={photos}
                  onChange={setPhotos}
                  label="Attach Photos (Auto meter, bill, stall, menu...)"
                  maxPhotos={4}
                />
              </div>

              {/* Author Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Your Display Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Vibe Preference
                  </label>
                  <select
                    aria-label="Vibe Preference"
                    value={vibeCategory}
                    onChange={(e) => setVibeCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] dark:bg-[#141414] border border-[#E8E5DF] dark:border-[#222] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 dark:text-white font-medium"
                  >
                    <option value="student_budget">🎓 Student Budget</option>
                    <option value="heritage">🏰 Heritage & Culture</option>
                    <option value="street_food">🥟 Street Food Lover</option>
                    <option value="night_owl">🌙 Late Night Safe</option>
                    <option value="family_friendly">👨‍👩‍👧 Family Friendly</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100 dark:border-[#1a1a1a]">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#181818] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !body.trim()}
                  className="px-7 py-3 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs shadow-md shadow-terracotta-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Publishing...' : 'Publish Discussion to Community'}</span>
                </button>
              </div>
            </form>
          </main>

          {/* Right Column: Live Post Preview & Guidelines (5 cols) */}
          <aside className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            
            {/* Live Card Preview */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-stone-900 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#D9532F]" />
                  <span>Live Feed Preview</span>
                </span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-semibold">
                  Real-time
                </span>
              </div>

              {/* Preview Card */}
              <div className="bg-[#FAF8F5] dark:bg-[#121212] rounded-xl border border-[#E8E5DF] dark:border-[#222] p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#D9532F] bg-white dark:bg-[#181818] px-2 py-0.5 rounded-full border border-terracotta-200">
                    {TOPIC_CATEGORIES.find(c => c.id === category)?.community || 'c/DelhiTransit'}
                  </span>
                  <span className="text-[10px] text-stone-400">📍 {selectedCity}</span>
                </div>

                <div className="text-sm font-bold text-stone-900 dark:text-white line-clamp-2">
                  {title || 'Your question title will appear here...'}
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3">
                  {body || 'Provide details about what you want to know from local residents...'}
                </div>

                {photos.length > 0 && (
                  <div className="flex gap-1.5 pt-1">
                    {photos.slice(0, 3).map((p, i) => (
                      <img key={i} src={p} alt="preview" className="w-12 h-12 object-cover rounded-md border border-stone-200" />
                    ))}
                    {photos.length > 3 && (
                      <div className="w-12 h-12 rounded-md bg-stone-200 text-stone-600 text-xs font-bold flex items-center justify-center">
                        +{photos.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200/80 dark:border-[#1e1e1e] flex items-center justify-between text-[11px] text-stone-400">
                  <span>By {authorName}</span>
                  <span>0 Answers • 0 Upvotes</span>
                </div>
              </div>
            </div>

            {/* Quality Advice Guidelines */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tips for Fastest Verified Answers</span>
              </h4>
              <ul className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Mention the time of day:</strong> Auto fares in Indian cities carry legal night surcharges (11 PM - 5 AM).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Include the specific gate or exit:</strong> Transit stations like Rajiv Chowk or Dadar have dozens of exits.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Attach a photo:</strong> Photos of quotes or meters receive 3x more local upvotes.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
