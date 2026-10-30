import React, { useState } from 'react';
import { HelpCircle, ShieldCheck, MapPin, Sparkles, Navigation, Send, X } from 'lucide-react';
import { POPULAR_LANDMARKS } from '../data/tariffs.js';
import { VIBE_CATEGORIES } from '../data/vibeData.js';

export default function AskQuestionModal({ onClose, onAddQuestion }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('Traveler ' + Math.floor(100 + Math.random() * 900));
  const [category, setCategory] = useState('transport');
  const [vibeCategory, setVibeCategory] = useState('student_budget');
  const [selectedLandmarkId, setSelectedLandmarkId] = useState('iiitd');
  const [requestFareCheck, setRequestFareCheck] = useState(true);
  const [fareOrigin, setFareOrigin] = useState('Okhla Phase 3 (South Delhi)');
  const [fareDestination, setFareDestination] = useState('Chandni Chowk Market');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const landmark = POPULAR_LANDMARKS.find((l) => l.id === selectedLandmarkId) || POPULAR_LANDMARKS[0];

    const communityMapping = {
      transport: 'c/DelhiTransit',
      food: 'c/StreetFood',
      hidden_gems: 'c/SecretSpots',
      shopping: 'c/BargainBazaars',
    };

    onAddQuestion({
      title,
      body,
      authorName,
      community: communityMapping[category] || 'c/DelhiLocal',
      category,
      vibeCategory,
      locationName: landmark.name,
      lat: landmark.lat,
      lng: landmark.lng,
      tags: [
        category === 'transport' ? '#AutoFare' : `#${category}`,
        requestFareCheck ? '#FairPriceCheck' : '#LocalAdvice',
        `#${vibeCategory}`,
      ],
      requestFareCheck,
      fareOrigin,
      fareDestination,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-stone-900 rounded-2xl border border-[#E8E5DF] max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E5DF] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#D9532F] text-white font-bold flex items-center justify-center text-sm shadow-md shadow-terracotta-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">Ask Locals a Real Question</h2>
              <p className="text-xs text-stone-500">Get authentic answers from residents, pinned on the map with fair transit rates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Traveler Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Your Display Name</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-terracotta-400"
            />
          </div>

          {/* Question Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Question Title <span className="text-[#D9532F]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., What is the fair auto fare from South Delhi to Chandni Chowk right now?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-terracotta-400"
            />
          </div>

          {/* Question Context */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Details & Context <span className="text-[#D9532F]">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain your situation: where you are heading, quotes you received from drivers, or specific preferences (budget, safety, veg/non-veg)..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl p-3 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-terracotta-400"
            />
          </div>

          {/* Category & Vibe Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Topic / Space</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value === 'transport') setRequestFareCheck(true);
                }}
                className="w-full bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-terracotta-400 font-medium"
              >
                <option value="transport">🛺 Auto & Taxi Transit Fares</option>
                <option value="food">🥟 Local Street Food & Chai</option>
                <option value="hidden_gems">💎 Secret Spots & Heritage</option>
                <option value="shopping">🛍️ Street Markets & Bargains</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Vibe</label>
              <select
                value={vibeCategory}
                onChange={(e) => setVibeCategory(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-terracotta-400 font-medium"
              >
                {VIBE_CATEGORIES.filter(v => v.id !== 'all').map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.icon} {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Landmark Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Relevant City Area / Nearest Landmark
            </label>
            <select
              value={selectedLandmarkId}
              onChange={(e) => setSelectedLandmarkId(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-terracotta-400"
            >
              {POPULAR_LANDMARKS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.area})
                </option>
              ))}
            </select>
          </div>

          {/* Live Fair Price Check Attachment */}
          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-terracotta-200 space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requestFareCheck}
                onChange={(e) => setRequestFareCheck(e.target.checked)}
                className="rounded accent-[#D9532F]"
              />
              <span className="text-xs font-bold text-[#D9532F] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D9532F]" />
                <span>Attach Live Fair Price Protection Card</span>
              </span>
            </label>
            <p className="text-[11px] text-stone-500">
              NearGo automatically benchmarks official municipal auto meter ranges, cab aggregator estimates, and metro routes to your question so travelers know what to pay.
            </p>

            {requestFareCheck && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200">
                <div>
                  <label className="block text-[10px] text-stone-600 mb-1 font-semibold">Journey Origin:</label>
                  <input
                    type="text"
                    value={fareOrigin}
                    onChange={(e) => setFareOrigin(e.target.value)}
                    className="w-full bg-white border border-[#E8E5DF] rounded-lg p-2 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-600 mb-1 font-semibold">Journey Destination:</label>
                  <input
                    type="text"
                    value={fareDestination}
                    onChange={(e) => setFareDestination(e.target.value)}
                    className="w-full bg-white border border-[#E8E5DF] rounded-lg p-2 text-xs text-stone-900"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs shadow-md shadow-terracotta-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Question</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
