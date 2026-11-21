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
import PhotoGallery from './PhotoGallery.jsx';

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
    { id: 'all', label: 'All Discussions' },
    { id: 'transport', label: 'Transit & Fares' },
    { id: 'food', label: 'Street Food' },
    { id: 'hidden_gems', label: 'Secret Spots' },
    { id: 'shopping', label: 'Flea Markets' },
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
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-3.5 sm:p-4 shadow-sm hover:shadow transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-[#D9532F] text-white font-bold flex items-center justify-center shrink-0 shadow-inner">
            <span>U</span>
          </div>
          <button
            onClick={onOpenAskModal}
            className="flex-1 text-left bg-[#F4F1EA] dark:bg-[#121212] hover:bg-[#EFECE5] dark:hover:bg-[#181818] text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors border border-transparent hover:border-stone-300 dark:hover:border-[#222222]"
          >
            What do you want to ask locals or share about the city?
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-100 dark:border-[#1a1a1a] text-xs text-stone-600 dark:text-stone-300 font-semibold">
          <button
            onClick={onOpenAskModal}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-[#141414] hover:text-[#D9532F] transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-[#D9532F]" />
            <span>Ask Local</span>
          </button>
          <button
            onClick={onOpenFareModal}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-[#141414] hover:text-[#D9532F] transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Fair Fare</span>
          </button>
          <button
            onClick={onOpenAskModal}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-[#FAF8F5] dark:hover:bg-[#141414] hover:text-[#D9532F] transition-colors"
          >
            <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Drop Pin</span>
          </button>
        </div>
      </div>

      {/* 2. Category & Vibe Filter Navigation (Minimal & Clean) */}
      <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-3 shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#1C1917] dark:bg-[#202020] text-white shadow-xs border border-transparent dark:border-[#333333]'
                    : 'bg-[#F4F1EA] dark:bg-[#121212] text-stone-700 dark:text-stone-300 hover:bg-[#ECE7DC] dark:hover:bg-[#181818]'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Toggle for Fair Price Protected */}
          <button
            onClick={() => setOnlyFareQuestions(!onlyFareQuestions)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border flex items-center gap-1.5 transition-colors shrink-0 ml-1 ${
              onlyFareQuestions
                ? 'bg-terracotta-50 dark:bg-[#D9532F]/15 border-terracotta-400 dark:border-[#D9532F]/40 text-[#D9532F]'
                : 'bg-white dark:bg-[#121212] border-stone-200 dark:border-[#1e1e1e] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-[#2a2a2a]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D9532F]" />
            <span>Fair Price ({questions.filter((q) => q.fareCheck).length})</span>
          </button>
        </div>

        {/* Vibe Chips Sub-row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-stone-100/80 dark:border-[#1a1a1a] text-xs py-0.5">
          <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 shrink-0 uppercase tracking-wider pl-1">
            Vibe:
          </span>
          {VIBE_CATEGORIES.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVibe(v.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedVibe === v.id
                  ? 'bg-stone-200 dark:bg-[#242424] text-stone-900 dark:text-white font-bold border border-stone-300 dark:border-[#383838]'
                  : 'bg-[#FAF8F5] dark:bg-[#101010] text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#181818] border border-stone-200/80 dark:border-[#1a1a1a]'
              }`}
            >
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
              className="bg-white dark:bg-[#0a0a0a] border border-[#E8E5DF] dark:border-[#1a1a1a] hover:border-stone-300 dark:hover:border-[#2a2a2a] rounded-2xl p-4 sm:p-5 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-md group"
            >
              {/* Reddit/Quora-style Community Tag & Author Row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {/* Community / Subreddit style badge */}
                  <span className="font-extrabold text-[#D9532F] bg-terracotta-50 dark:bg-[#D9532F]/15 border border-terracotta-200/80 dark:border-[#D9532F]/30 px-2.5 py-0.5 rounded-full text-[11px]">
                    {q.community || 'c/DelhiLocal'}
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-800 dark:text-stone-100">{q.author.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-semibold border ${
                        q.author.isVerified
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
                          : 'bg-stone-100 dark:bg-[#161616] text-stone-600 dark:text-stone-300 border-stone-200 dark:border-[#222222]'
                      }`}
                    >
                      {q.author.badge}
                    </span>
                  </div>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">{q.createdAt}</span>
                </div>

                {/* Location indicator */}
                <button
                  onClick={() => onHighlightOnMap(q)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-300 hover:text-[#D9532F] bg-[#FAF8F5] dark:bg-[#121212] px-2 py-0.5 rounded-full border border-stone-200 dark:border-[#1a1a1a] transition-colors shrink-0"
                >
                  <MapPin className="w-3 h-3 text-[#D9532F]" />
                  <span>{q.locationName}</span>
                </button>
              </div>

              {/* Title & Body */}
              <div className="cursor-pointer" onClick={() => onSelectQuestion(q)}>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white group-hover:text-[#D9532F] dark:group-hover:text-[#D9532F] transition-colors leading-snug">
                  {q.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed">
                  {q.body}
                </p>
              </div>

              {/* Attached Photos Gallery on Feed */}
              {q.photos && q.photos.length > 0 && (
                <div onClick={(e) => e.stopPropagation()}>
                  <PhotoGallery photos={q.photos} title={q.title} />
                </div>
              )}

              {/* Tags */}
              {q.tags && q.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  {q.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium text-stone-500 dark:text-stone-400 bg-[#F4F1EA] dark:bg-[#141414] px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* EMBEDDED FAIR PRICE CARD */}
              {q.fareCheck && (
                <div className="mt-4 bg-[#FAF8F5] dark:bg-[#0e0e0e] border border-terracotta-200/90 dark:border-[#1e1e1e] rounded-xl p-3.5 sm:p-4 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-[#D9532F] font-bold uppercase tracking-wider text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-[#D9532F]" />
                      <span>REAL-TIME FAIR FARE BENCHMARK</span>
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono font-medium">
                      {q.fareCheck.distanceKm} km route
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-2">
                    <div className="bg-white dark:bg-[#141414] p-2.5 rounded-lg border border-terracotta-200 dark:border-[#222222] shadow-xs">
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">Official Auto Meter</div>
                      <div className="text-sm font-extrabold text-[#D9532F] font-mono">
                        {q.fareCheck.officialAutoMeter}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-[#141414] p-2.5 rounded-lg border border-stone-200 dark:border-[#222222] shadow-xs">
                      <div className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold">Cab Aggregators</div>
                      <div className="text-sm font-extrabold text-stone-800 dark:text-stone-200 font-mono">
                        {q.fareCheck.cabEstimate}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-[#141414] p-2.5 rounded-lg border border-emerald-200 dark:border-[#222222] shadow-xs">
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Delhi Metro</div>
                      <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">
                        {q.fareCheck.metroFare}
                      </div>
                    </div>
                  </div>

                  {q.fareCheck.scamWarning && (
                    <div className="text-[11px] text-amber-900 dark:text-amber-300 bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-2 rounded-lg mt-2 font-medium">
                      <strong>Fair Fare Alert:</strong> {q.fareCheck.scamWarning}
                    </div>
                  )}
                </div>
              )}

              {/* Verified Local Answer Preview */}
              {q.answers.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-stone-100 dark:border-[#1a1a1a] space-y-2">
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Top Local Advice • {q.answers[0].author.name} ({q.answers[0].author.badge})</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-[#FAF8F5] dark:bg-[#111111] p-3 rounded-xl border border-[#E8E5DF] dark:border-[#1a1a1a]">
                    "{q.answers[0].body}"
                  </p>

                  {/* Attached pin & insider tip if available */}
                  {q.answers[0].pin && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-lg">
                      <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-100 dark:border-[#1a1a1a] text-xs">
                <div className="flex items-center gap-2">
                  {/* Upvote Pill Button */}
                  <div className="flex items-center bg-[#F4F1EA] dark:bg-[#121212] rounded-full border border-stone-200 dark:border-[#1c1c1c]">
                    <button
                      onClick={() => onUpvoteQuestion(q.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-colors ${
                        q.userUpvoted
                          ? 'bg-[#D9532F] text-white'
                          : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-[#EAE5DC] dark:hover:bg-[#181818]'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${q.userUpvoted ? 'fill-white' : ''}`} />
                      <span>{q.upvotes}</span>
                    </button>
                  </div>

                  {/* Comments/Answers Pill */}
                  <button
                    onClick={() => onSelectQuestion(q)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] dark:bg-[#121212] hover:bg-[#EAE5DC] dark:hover:bg-[#181818] text-stone-700 dark:text-stone-300 font-medium border border-stone-200 dark:border-[#1c1c1c] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                    <span>{q.answers.length} {q.answers.length === 1 ? 'Answer' : 'Answers'}</span>
                  </button>

                  {/* Share Pill */}
                  <button
                    onClick={(e) => handleShare(q, e)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-stone-100 dark:hover:bg-[#161616] text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
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
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-900 dark:bg-stone-800 hover:bg-[#D9532F] dark:hover:bg-[#D9532F] text-white text-xs font-bold transition-all shadow-xs"
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
