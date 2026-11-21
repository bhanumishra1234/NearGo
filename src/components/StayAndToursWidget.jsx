import React from 'react';
import { ExternalLink, Bed, Compass, Sparkles, ShieldCheck } from 'lucide-react';
import { generateStayAndTourLinks } from '../utils/monetization.js';

export default function StayAndToursWidget({
  locationName = 'Delhi',
  city = 'Delhi NCR',
  category = 'places',
}) {
  const links = generateStayAndTourLinks({ locationName, city, category });

  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-3 text-xs">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-200">
          <Bed className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Verified Hostels & Cultural Walk Bookings</span>
        </div>
        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-800">
          Zero Inventory Handoff
        </span>
      </div>

      <p className="text-[11px] text-stone-600 dark:text-stone-400 mb-2.5">
        Explore backpacker hostels, boutique havelis, and guided street food walks near <strong>{locationName}</strong>:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Booking.com */}
        <a
          href={links.booking.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#111111] border border-blue-200 dark:border-blue-900/40 hover:border-blue-400 hover:shadow-xs transition-all group"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🏨</span>
            <div>
              <div className="font-bold text-blue-900 dark:text-blue-200">Booking.com</div>
              <div className="text-[9px] text-stone-500 dark:text-stone-400">Hostels & Guesthouses</div>
            </div>
          </div>
          <ExternalLink className="w-3 h-3 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Agoda */}
        <a
          href={links.agoda.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#111111] border border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-400 hover:shadow-xs transition-all group"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🛏️</span>
            <div>
              <div className="font-bold text-emerald-900 dark:text-emerald-200">Agoda Stays</div>
              <div className="text-[9px] text-stone-500 dark:text-stone-400">Backpacker Dorms</div>
            </div>
          </div>
          <ExternalLink className="w-3 h-3 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Viator / Klook */}
        <a
          href={links.viator.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#111111] border border-amber-200 dark:border-amber-900/40 hover:border-amber-400 hover:shadow-xs transition-all group"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🎟️</span>
            <div>
              <div className="font-bold text-amber-900 dark:text-amber-200">Klook / Viator</div>
              <div className="text-[9px] text-stone-500 dark:text-stone-400">Heritage Food Walks</div>
            </div>
          </div>
          <ExternalLink className="w-3 h-3 text-amber-500 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>
      </div>

      <div className="mt-2 pt-1.5 border-t border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400">
        <span>Partner Attribution: 8% - 15% booking affiliate handoff</span>
        <span className="text-blue-700 dark:text-blue-400 font-semibold">Instant Confirmation ✓</span>
      </div>
    </div>
  );
}
