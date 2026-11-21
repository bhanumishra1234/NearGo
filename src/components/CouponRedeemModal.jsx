import React, { useState } from 'react';
import {
  Tag,
  Gift,
  Copy,
  Check,
  X,
  Sparkles,
  Clock,
  Store,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { COMMUNITY_PARTNER_DEALS } from '../utils/monetization.js';

export default function CouponRedeemModal({ isOpen, onClose, selectedCity = 'Delhi NCR' }) {
  const [copiedId, setCopiedId] = useState(null);
  const [activeTabCity, setActiveTabCity] = useState(selectedCity);

  if (!isOpen) return null;

  const filteredDeals = COMMUNITY_PARTNER_DEALS.filter(
    (d) => !activeTabCity || d.city.toLowerCase().includes(activeTabCity.toLowerCase().split(' ')[0])
  );

  const handleCopyCode = (id, code) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-[#0c0c0c] border border-stone-200 dark:border-[#1e1e1e] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-stone-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-[#1e1e1e] flex items-center justify-between bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">Community Flash Deals & Perks</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-orange-600 tracking-wide">
                  Verified Local
                </span>
              </div>
              <p className="text-xs text-orange-100">
                Exclusive digital vouchers sponsored by Verified Community Partners.
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

        {/* City Filter Pills */}
        <div className="flex border-b border-stone-200 dark:border-[#1e1e1e] px-4 py-2 bg-stone-50 dark:bg-[#121212] gap-2 overflow-x-auto text-xs font-bold">
          {['All Cities', 'Delhi NCR', 'Mumbai', 'Bengaluru'].map((c) => (
            <button
              key={c}
              onClick={() => setActiveTabCity(c === 'All Cities' ? '' : c)}
              className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
                (activeTabCity === c || (!activeTabCity && c === 'All Cities'))
                  ? 'bg-[#D9532F] text-white shadow-2xs'
                  : 'bg-white dark:bg-[#181818] border border-stone-200 dark:border-[#222222] text-stone-700 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Deals List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredDeals.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              No active vouchers in this city right now. Check back soon!
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20 dark:from-amber-950/20 dark:via-[#111111] dark:to-orange-950/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                      {deal.badge}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">({deal.city})</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#D9532F]" />
                    <span>{deal.merchantName}</span>
                  </h4>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    🎁 {deal.perk}
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                    {deal.terms}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-stone-800">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Voucher Code:</span>
                    <span className="font-mono font-extrabold text-xs text-stone-900 dark:text-white bg-stone-100 dark:bg-[#1a1a1a] px-2 py-1 rounded border border-dashed border-stone-300 dark:border-stone-700 select-all">
                      {deal.couponCode}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyCode(deal.id, deal.couponCode)}
                    className="px-3 py-1.5 rounded-lg bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    {copiedId === deal.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Redeem Deal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-[#1e1e1e] bg-stone-50 dark:bg-[#141414] flex items-center justify-between text-xs text-stone-500">
          <span>Show digital voucher at counter • Zero printed coupons needed</span>
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
