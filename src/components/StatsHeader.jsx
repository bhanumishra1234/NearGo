import React from 'react';
import { ShieldCheck, Sparkles, X } from 'lucide-react';

export default function StatsHeader({ onOpenFareModal, onOpenVibeModal, onDismiss }) {
  return (
    <div className="border-b border-[#E8E5DF] bg-white py-3.5 sm:py-4 px-3 sm:px-6 transition-all">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-terracotta-50 border border-terracotta-200 text-[#D9532F] text-[11px] font-semibold mb-1">
            <Sparkles className="w-3 h-3 text-[#D9532F]" />
            <span>Hyper-Local City Intelligence & Community Q&A</span>
          </div>
          <h1 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-stone-900 font-sans">
            Like having a <span className="text-[#D9532F]">trusted local friend</span> in every city.
          </h1>
          <p className="text-xs text-stone-500 mt-0.5 max-w-2xl leading-relaxed">
            Skip commercial tourist traps and avoid auto gouging. Get honest answers from verified residents, pinned with exact coordinates and real-time municipal fair prices.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenFareModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#E8E5DF] text-stone-800 text-xs font-semibold transition-all shadow-xs hover:border-terracotta-300"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D9532F]" />
            <span>Auto Fare Checker</span>
          </button>
          <button
            onClick={onOpenVibeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-clay-50 hover:bg-clay-100 border border-clay-200 text-stone-800 text-xs font-semibold transition-all shadow-xs"
          >
            <span className="text-sm">🗣️</span>
            <span>Street Slang</span>
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors ml-1"
              title="Close banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
