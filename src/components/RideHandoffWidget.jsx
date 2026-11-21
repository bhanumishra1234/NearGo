import React from 'react';
import { ExternalLink, Navigation, ShieldCheck, Zap } from 'lucide-react';
import { generateRideDeepLinks } from '../utils/monetization.js';

export default function RideHandoffWidget({
  destination = 'Destination',
  origin = 'Current Location',
  destLat = 28.6562,
  destLng = 77.2309,
  targetFare = '₹85',
  compact = false,
}) {
  const links = generateRideDeepLinks({
    destination,
    origin,
    destLat,
    destLng,
  });

  return (
    <div className={`rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/70 dark:bg-amber-950/20 p-3 ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
          <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500 shrink-0" />
          <span className="text-xs">Instant Ride Handoff (Pre-filled Coordinates)</span>
        </div>
        {targetFare && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[10px] border border-emerald-300 dark:border-emerald-800/60">
            Fair Meter Goal: {targetFare}
          </span>
        )}
      </div>

      <p className="text-[11px] text-stone-600 dark:text-stone-400 mb-2.5">
        Skip unmetered street haggling. Click below to open your preferred ride-hailing app with destination pre-loaded:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Rapido */}
        <a
          href={links.rapido.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (links.rapido.url.startsWith('intent://')) {
              e.preventDefault();
              window.location.href = links.rapido.url;
            }
          }}
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#FFDE00] hover:bg-[#ebd000] text-stone-900 font-bold text-xs transition-all shadow-2xs group"
          title="Book Auto or Bike Taxi on Rapido"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🛺</span>
            <div>
              <div className="leading-tight">Rapido</div>
              <div className="text-[9px] font-normal opacity-85">Auto & Bike</div>
            </div>
          </div>
          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Uber */}
        <a
          href={links.uber.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-black hover:bg-stone-800 text-white font-bold text-xs transition-all shadow-2xs group"
          title="Book UberGo or Auto on Uber"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🚗</span>
            <div>
              <div className="leading-tight">Uber</div>
              <div className="text-[9px] font-normal opacity-75">UberGo / Auto</div>
            </div>
          </div>
          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Ola */}
        <a
          href={links.ola.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#98D809] hover:bg-[#86be07] text-stone-900 font-bold text-xs transition-all shadow-2xs group"
          title="Book Mini or Auto on Ola"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🟢</span>
            <div>
              <div className="leading-tight">Ola Cabs</div>
              <div className="text-[9px] font-normal opacity-85">Mini / Auto</div>
            </div>
          </div>
          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      <div className="mt-2 pt-1.5 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400">
        <span className="truncate">🎯 Destination: <strong>{destination}</strong></span>
        <span className="shrink-0 text-emerald-700 dark:text-emerald-400 font-semibold ml-2">Affiliate Verified ✓</span>
      </div>
    </div>
  );
}
