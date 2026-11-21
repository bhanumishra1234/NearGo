import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  QrCode
} from 'lucide-react';
import { COMMUNITY_PARTNER_DEALS } from '../utils/monetization.js';
import { calculateDistance } from '../data/tariffs.js';

export default function CouponRedeemModal({ isOpen, onClose, selectedCity = 'Delhi NCR' }) {
  const [copiedId, setCopiedId] = useState(null);
  const [activeTabCity, setActiveTabCity] = useState(selectedCity);
  const [redeemingDeal, setRedeemingDeal] = useState(null); // active deal being redeemed in counter mode
  const [countdown, setCountdown] = useState(300); // 5 min countdown
  const [redeemedMap, setRedeemedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('neargo_redeemed_deals') || '{}');
    } catch {
      return {};
    }
  });

  // Countdown timer for active voucher
  useEffect(() => {
    let timer;
    if (redeemingDeal && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [redeemingDeal, countdown]);

  if (!isOpen) return null;

  const filteredDeals = COMMUNITY_PARTNER_DEALS.filter(
    (d) => !activeTabCity || d.city.toLowerCase().includes(activeTabCity.toLowerCase().split(' ')[0])
  );

  const handleCopyCode = (id, code) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartRedemption = (deal) => {
    setRedeemingDeal(deal);
    setCountdown(300); // 5 minutes validity
  };

  const handleConfirmStorekeeper = (dealId) => {
    const updated = {
      ...redeemedMap,
      [dealId]: {
        redeemedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }),
      }
    };
    setRedeemedMap(updated);
    try {
      localStorage.setItem('neargo_redeemed_deals', JSON.stringify(updated));
    } catch {}
    setRedeemingDeal(null);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
                  Geo-Verified
                </span>
              </div>
              <p className="text-xs text-orange-100">
                Exclusive digital vouchers with storekeeper validation.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setRedeemingDeal(null);
              onClose();
            }}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Mode Active Modal (If in-store verification is underway) */}
        {redeemingDeal ? (
          <div className="p-6 space-y-4 text-center bg-stone-50 dark:bg-[#111] overflow-y-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-300 dark:border-amber-700">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Counter Pass Active • Expires in {formatTime(countdown)}</span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-stone-900 dark:text-white">
                {redeemingDeal.merchantName}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                📍 {redeemingDeal.area} ({redeemingDeal.city})
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-xl border border-dashed border-[#D9532F] max-w-xs mx-auto space-y-2">
              <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                Show Voucher Code to Storekeeper:
              </div>
              <div className="font-mono text-xl font-black text-[#D9532F] select-all tracking-wider">
                {redeemingDeal.couponCode}
              </div>
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                🎁 {redeemingDeal.perk}
              </div>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              Please present this screen to the counter staff before placing your order. Staff will verify your perk.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setRedeemingDeal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-200 transition-colors"
              >
                Back to Deals
              </button>
              <button
                onClick={() => handleConfirmStorekeeper(redeemingDeal.id)}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Redeemed at Counter</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* City Filter Pills */}
            <div className="flex border-b border-stone-200 dark:border-[#1e1e1e] px-4 py-2 bg-stone-50 dark:bg-[#121212] gap-2 overflow-x-auto text-xs font-bold">
              {['All Cities', 'Delhi NCR', 'Mumbai', 'Bengaluru'].map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveTabCity(c === 'All Cities' ? '' : c)}
                  className={`px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
                    activeTabCity === c || (!activeTabCity && c === 'All Cities')
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
                filteredDeals.map((deal) => {
                  const isRedeemed = Boolean(redeemedMap[deal.id]);
                  return (
                    <div
                      key={deal.id}
                      className={`p-3.5 rounded-xl border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                        isRedeemed
                          ? 'bg-stone-100 dark:bg-[#141414] border-stone-300 dark:border-[#262626] opacity-75'
                          : 'border-amber-200 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/40 via-white to-orange-50/20 dark:from-amber-950/20 dark:via-[#111111] dark:to-orange-950/10'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                            {deal.badge}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">({deal.city})</span>
                          {isRedeemed && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                              ✓ Redeemed {redeemedMap[deal.id].redeemedAt}
                            </span>
                          )}
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

                        {isRedeemed ? (
                          <div className="px-3 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-500 font-bold text-xs flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Claimed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyCode(deal.id, deal.couponCode)}
                              className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-stone-900"
                              title="Copy Code"
                            >
                              {copiedId === deal.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleStartRedemption(deal)}
                              className="px-3 py-1.5 rounded-lg bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                            >
                              <Store className="w-3.5 h-3.5" />
                              <span>Redeem in Store</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-[#1e1e1e] bg-stone-50 dark:bg-[#141414] flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified in-store redemption with counter staff</span>
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 text-white dark:text-stone-900 font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
