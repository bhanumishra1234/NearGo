import React, { useState } from 'react';
import {
  ThumbsUp,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Share2,
  Bookmark,
  HelpCircle,
  ChevronDown,
  Navigation,
  Check,
  Flame,
  Tag
} from 'lucide-react';
import { VIBE_CATEGORIES } from '../data/vibeData.js';

export default function QuestionsFeed({
  questions = [],
  onSelectQuestion,
  onHighlightOnMap,
  onUpvoteQuestion,
  onOpenAskModal,
  onOpenFareModal,
  selectedVibe,
  setSelectedVibe,
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [onlyFareQuestions, setOnlyFareQuestions] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const CATEGORIES = [
    { id: 'all', label: 'All Discussions', icon: '🔥' },
    { id: 'transport', label: 'Transit & Fares', icon: '🛺' },
    { id: 'food', label: 'Street Food', icon: '🥟' },
    { id: 'hidden_gems', label: 'Secret Spots', icon: '💎' },
    { id: 'shopping', label: 'Flea Markets', icon: '🛍️' },
  ];

  const filteredQuestions = questions.filter((q) => {
    if (activeCategory !== 'all' && q.category !== activeCategory) return false;
    if (selectedVibe !== 'all' && q.vibeCategory !== selectedVibe) return false;
    if (onlyFareQuestions && !q.fareCheck) return false;
    return true;
  });

  const handleShare = (q, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. Quora / Reddit-Style Composer Box */}
      <div className="bg-white rounded-2xl border border-[#E8E5DF] p-3.5 sm:p-4 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-[#D9532F] text-white font-bold flex items-center justify-center shrink-0 shadow-inner">
            <span>U</span>
          </div>
          <button
            onClick={onOpenAskModal}
            className="flex-1 text-left bg-[#F4F1EA] hover:bg-[#EFECE5] text-stone-500 hover:text-stone-700 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors border border-transparent hover:border-stone-300"
          >
            What do you want to ask locals or share about the city?
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600 font-semibold">
          <button
            onClick={onOpenAskModal}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-[#FAF8F5] hover:text-[#D9532F] transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#D9532F]" />
            <span>Ask Local</span>
          </button>
          <button
            onClick={onOpenFareModal}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-[#FAF8F5] hover:text-[#D9532F] transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fair Fare</span>
          </button>
          <button
            onClick={onOpenAskModal}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-[#FAF8F5] hover:text-[#D9532F] transition-colors"
          >
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Drop Pin</span>
          </button>
        </div>
      </div>

      {/* 2. Category & Vibe Filter Navigation */}
      <div className="bg-white rounded-2xl border border-[#E8E5DF] p-3 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-[#1C1917] text-white shadow-sm'
                    : 'bg-[#F4F1EA] text-stone-700 hover:bg-[#ECE7DC] border border-transparent'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Toggle for Fair Price Protected */}
          <button
            onClick={() => setOnlyFareQuestions(!onlyFareQuestions)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border flex items-center gap-1.5 transition-colors ${
              onlyFareQuestions
                ? 'bg-terracotta-50 border-terracotta-400 text-[#D9532F]'
                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D9532F]" />
            <span>Fair Price Checked ({questions.filter((q) => q.fareCheck).length})</span>
          </button>
        </div>

        {/* Vibe Chips Sub-row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-stone-100 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-stone-400 shrink-0 uppercase tracking-wider pl-1">
            Vibe:
          </span>
          {VIBE_CATEGORIES.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVibe(v.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedVibe === v.id
                  ? 'bg-clay-200 text-stone-900 font-bold border border-clay-300'
                  : 'bg-[#FAF8F5] text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{v.icon}</span>
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Feed List */}
      <div className="space-y-3.5">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white border border-[#E8E5DF] rounded-2xl p-10 text-center shadow-sm">
            <Sparkles className="w-8 h-8 text-[#D9532F] mx-auto mb-2 opacity-60" />
            <h3 className="text-stone-900 font-bold text-sm">No discussions found in this filter</h3>
            <p className="text-stone-500 text-xs mt-1">Be the first to ask a local question or check fair transit prices!</p>
            <button
              onClick={onOpenAskModal}
              className="mt-4 px-4 py-2 rounded-full bg-[#D9532F] text-white font-bold text-xs shadow-md shadow-terracotta-500/20"
            >
              Ask the Community
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <article
              key={q.id}
              className="bg-white border border-[#E8E5DF] hover:border-stone-300 rounded-2xl p-4 sm:p-5 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md group"
            >
              {/* Reddit/Quora-style Community Tag & Author Row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {/* Community / Subreddit style badge */}
                  <span className="font-extrabold text-[#D9532F] bg-terracotta-50 border border-terracotta-200/80 px-2.5 py-0.5 rounded-full text-[11px]">
                    {q.community || 'c/DelhiLocal'}
                  </span>
                  <span className="text-stone-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-800">{q.author.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-semibold border ${
                        q.author.isVerified
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      {q.author.badge}
                    </span>
                  </div>
                  <span className="text-stone-300">•</span>
                  <span className="text-[11px] text-stone-400">{q.createdAt}</span>
                </div>

                {/* Location indicator */}
                <button
                  onClick={() => onHighlightOnMap(q)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-[#D9532F] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-stone-200 transition-colors shrink-0"
                >
                  <MapPin className="w-3 h-3 text-[#D9532F]" />
                  <span>{q.locationName}</span>
                </button>
              </div>

              {/* Title & Body */}
              <div className="cursor-pointer" onClick={() => onSelectQuestion(q)}>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-[#D9532F] transition-colors leading-snug">
                  {q.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                  {q.body}
                </p>
              </div>

              {/* Tags */}
              {q.tags && q.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  {q.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium text-stone-500 bg-[#F4F1EA] px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* EMBEDDED FAIR PRICE CARD (Clean White & Clay Theme) */}
              {q.fareCheck && (
                <div className="mt-4 bg-[#FAF8F5] border border-terracotta-200/90 rounded-xl p-3.5 sm:p-4 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-[#D9532F] font-bold uppercase tracking-wider text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-[#D9532F]" />
                      <span>REAL-TIME FAIR FARE BENCHMARK</span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-mono font-medium">
                      {q.fareCheck.distanceKm} km route
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-2">
                    <div className="bg-white p-2.5 rounded-lg border border-terracotta-200 shadow-xs">
                      <div className="text-[10px] text-stone-500 font-semibold">Official Auto Meter</div>
                      <div className="text-sm font-extrabold text-[#D9532F] font-mono">
                        {q.fareCheck.officialAutoMeter}
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-xs">
                      <div className="text-[10px] text-stone-500 font-semibold">Cab Aggregators</div>
                      <div className="text-sm font-extrabold text-stone-800 font-mono">
                        {q.fareCheck.cabEstimate}
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 shadow-xs">
                      <div className="text-[10px] text-emerald-700 font-semibold">Delhi Metro</div>
                      <div className="text-sm font-extrabold text-emerald-700 font-mono">
                        {q.fareCheck.metroFare}
                      </div>
                    </div>
                  </div>

                  {q.fareCheck.scamWarning && (
                    <div className="text-[11px] text-amber-900 bg-amber-50/90 border border-amber-200 p-2 rounded-lg mt-2 font-medium">
                      <strong>Fair Fare Alert:</strong> {q.fareCheck.scamWarning}
                    </div>
                  )}
                </div>
              )}

              {/* Verified Local Answer Preview */}
              {q.answers.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Top Local Advice • {q.answers[0].author.name} ({q.answers[0].author.badge})</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E5DF]">
                    "{q.answers[0].body}"
                  </p>

                  {/* Attached pin & insider tip if available */}
                  {q.answers[0].pin && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pinned: <strong>{q.answers[0].pin.name}</strong></span>
                      </div>
                      <button
                        onClick={() => onHighlightOnMap(q.answers[0].pin)}
                        className="text-[#D9532F] hover:underline font-bold text-[11px]"
                      >
                        View on Map ➔
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Reddit-Style Bottom Interaction Pill Bar */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 text-xs">
                <div className="flex items-center gap-2">
                  {/* Upvote Pill Button */}
                  <div className="flex items-center bg-[#F4F1EA] rounded-full border border-stone-200">
                    <button
                      onClick={() => onUpvoteQuestion(q.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-colors ${
                        q.userUpvoted
                          ? 'bg-[#D9532F] text-white'
                          : 'text-stone-700 hover:text-stone-900 hover:bg-[#EAE5DC]'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${q.userUpvoted ? 'fill-white' : ''}`} />
                      <span>{q.upvotes}</span>
                    </button>
                  </div>

                  {/* Comments/Answers Pill */}
                  <button
                    onClick={() => onSelectQuestion(q)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] hover:bg-[#EAE5DC] text-stone-700 font-medium border border-stone-200 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-stone-500" />
                    <span>{q.answers.length} {q.answers.length === 1 ? 'Answer' : 'Answers'}</span>
                  </button>

                  {/* Share Pill */}
                  <button
                    onClick={(e) => handleShare(q, e)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors"
                    title="Copy Link"
                  >
                    {copiedId === q.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">{copiedId === q.id ? 'Copied' : 'Share'}</span>
                  </button>
                </div>

                <div>
                  <button
                    onClick={() => onSelectQuestion(q)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-[#D9532F] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Read & Answer</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
