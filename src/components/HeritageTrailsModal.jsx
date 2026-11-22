import React from 'react';
import {
  Compass,
  Train,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Clock,
  ArrowRight,
  X,
  Landmark
} from 'lucide-react';
import { OFFICIAL_HERITAGE_TRAILS } from '../utils/monetization.js';

export default function HeritageTrailsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-[#0c0c0c] border border-stone-200 dark:border-[#1e1e1e] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-stone-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-[#1e1e1e] flex items-center justify-between bg-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">DMRC & Delhi Tourism Heritage Trails</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-emerald-950 tracking-wide">
                  Official B2G Partnership
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Survey of India Compliant • Public Transit & Pedestrian Heritage Corridors.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trails Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs flex items-center gap-2.5 text-emerald-900 dark:text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              NearGo collaborates with public transport operators and tourism boards to promote uncrowded cultural exploration with zero auto scam risk.
            </span>
          </div>

          <div className="space-y-3">
            {OFFICIAL_HERITAGE_TRAILS.map((trail) => (
              <div
                key={trail.id}
                className="p-4 rounded-xl border border-stone-200 dark:border-[#1e1e1e] bg-stone-50/50 dark:bg-[#121212] hover:border-emerald-500/50 transition-all space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    {trail.badge}
                  </span>
                  <div className="flex items-center gap-2 text-stone-500 text-[11px] font-mono">
                    <span>{trail.distanceKm} km walk</span>
                    <span>•</span>
                    <span>~{trail.walkingTimeMin} mins</span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{trail.title}</span>
                </h4>

                <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
                  <Train className="w-3.5 h-3.5 text-blue-600" />
                  <span>Metro Line: {trail.metroLine}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {trail.keyStations.map((st, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1a1a1a] border border-stone-200 dark:border-[#262626] text-[10px] text-stone-600 dark:text-stone-300 font-medium"
                    >
                      🚇 {st}
                    </span>
                  ))}
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-[#0c0c0c] border border-stone-200 dark:border-[#1a1a1a] text-xs text-stone-600 dark:text-stone-400">
                  <strong className="text-stone-900 dark:text-white">Public Transit Advice: </strong>
                  {trail.publicTransitAdvice}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[11px] text-stone-500">
                    Highlights: {trail.highlights.slice(0, 3).join(', ')}
                  </div>
                  {trail.ticketPortal && (
                    <a
                      href={trail.ticketPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <span>ASI Official Pass</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-[#1e1e1e] bg-stone-50 dark:bg-[#141414] flex items-center justify-between text-xs text-stone-500">
          <span>Survey of India Sovereign Boundary Compliant • DMRC Smart Transit</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 text-white dark:text-stone-900 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
