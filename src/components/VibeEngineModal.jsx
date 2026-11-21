import React, { useState } from 'react';
import { Sparkles, Compass, Volume2, Check, Copy, Flame, MapPin, Zap, X } from 'lucide-react';
import { VIBE_CATEGORIES, INDIC_SLANG_DICTIONARY, VIBE_CURATED_SPOTS } from '../data/vibeData.js';

export default function VibeEngineModal({ onClose, onHighlightOnMap }) {
  const [activeTab, setActiveTab] = useState('slang'); // 'slang' | 'vibe_spots'
  const [selectedVibeTag, setSelectedVibeTag] = useState('late_night');
  const [copiedPhrase, setCopiedPhrase] = useState(null);

  const handleCopy = (phrase) => {
    navigator.clipboard?.writeText(phrase);
    setCopiedPhrase(phrase);
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  const handlePlaySound = (phrase) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredSpots = VIBE_CURATED_SPOTS.filter(
    (s) => selectedVibeTag === 'all' || s.tag === selectedVibeTag
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white text-stone-900 rounded-2xl border border-[#E8E5DF] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E5DF] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-[#D9532F] text-white font-bold flex items-center justify-center shadow-md shadow-terracotta-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-stone-900">Indic Street Lexicon & Vibe Engine</h2>
                <span className="text-[10px] bg-clay-100 text-[#75583E] border border-clay-300 px-2 py-0.5 rounded-full font-bold">
                  City Intelligence
                </span>
              </div>
              <p className="text-xs text-stone-500">Street-smart negotiation phrases, phonetics, and high-vibe curated corners</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-stone-200 flex items-center gap-2 bg-[#FAF8F5]">
          <button
            onClick={() => setActiveTab('slang')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'slang'
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            🗣️ Street Slang & Negotiation
          </button>
          <button
            onClick={() => setActiveTab('vibe_spots')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'vibe_spots'
                ? 'bg-[#D9532F] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            ⚡ Curated Vibe Hotspots
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'slang' ? (
            <div className="space-y-4">
              <div className="bg-clay-50 border border-clay-200 p-3 rounded-xl text-xs text-stone-700">
                <strong>Street-Smart Rule:</strong> Auto drivers and market vendors respect travelers who speak with quiet confidence and drop natural local phrases like <em>"Meter se chalo bhaiya"</em>.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {INDIC_SLANG_DICTIONARY.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl p-4 space-y-2 hover:border-terracotta-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-base font-bold text-stone-900">
                          {item.phrase}
                        </div>
                        <div className="text-[11px] font-mono text-[#D9532F] font-semibold">
                          {item.phonetic}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePlaySound(item.phrase)}
                          className="w-7 h-7 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center transition-colors shadow-xs"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#D9532F]" />
                        </button>
                        <button
                          onClick={() => handleCopy(item.phrase)}
                          className="w-7 h-7 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center transition-colors shadow-xs"
                          title="Copy phrase"
                        >
                          {copiedPhrase === item.phrase ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed">
                      {item.meaning}
                    </p>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px]">
                      <span className="text-stone-500 font-medium">When to use: {item.situation}</span>
                      <span className="bg-white border border-stone-200 text-[#D9532F] px-2 py-0.5 rounded font-mono font-bold shadow-xs">
                        {item.effectivenessScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Vibe Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {VIBE_CATEGORIES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVibeTag(v.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedVibeTag === v.id
                        ? 'bg-[#1C1917] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>

              {/* Spots List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredSpots.map((spot) => (
                  <div
                    key={spot.id}
                    className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-xl p-4 space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{spot.name}</h4>
                        <div className="text-[11px] text-stone-500 font-medium">📍 {spot.neighborhood}</div>
                      </div>
                      <div className="flex items-center gap-1 bg-terracotta-50 text-[#D9532F] border border-terracotta-200 px-2 py-0.5 rounded-full font-mono text-xs font-bold">
                        <Flame className="w-3.5 h-3.5 fill-[#D9532F]" />
                        <span>{spot.vibeScore}% Vibe</span>
                      </div>
                    </div>

                    <div className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-lg border border-stone-200">
                      <strong>Insider Tip:</strong> {spot.insiderTip}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 font-medium">
                      <span>🕒 Open: {spot.openTill}</span>
                      <span className="font-mono text-emerald-700 font-bold">{spot.avgCost}</span>
                    </div>

                    <button
                      onClick={() => {
                        onHighlightOnMap({
                          lat: spot.lat,
                          lng: spot.lng,
                          name: spot.name,
                          neighborhood: spot.neighborhood,
                        });
                        onClose();
                      }}
                      className="w-full py-1.5 rounded-full bg-white hover:bg-[#FAF8F5] text-stone-800 hover:text-[#D9532F] font-bold text-xs border border-stone-200 hover:border-terracotta-300 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#D9532F]" />
                      <span>View Spot on Map</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
