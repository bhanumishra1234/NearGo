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
        <div className="p-4 sm:p-5 border-b border-stone-100 dark:border-[#1e1e1e] flex items-center justify-between bg-white dark:bg-[#0c0c0c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-[#161616] text-[#D9532F] flex items-center justify-center shrink-0">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-white">
                  Community Perks & Vouchers
                </h2>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 dark:bg-[#1a1a1a] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-[#262626]">
                  Geo-Verified
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Exclusive digital vouchers with storekeeper validation
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setRedeemingDeal(null);
              onClose();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#181818] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Mode Active Modal (If in-store verification is underway) */}
        {redeemingDeal ? (
          <div className="p-6 space-y-4 text-center bg-white dark:bg-[#0c0c0c] overflow-y-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-[#1a1a1a] text-stone-700 dark:text-stone-300 font-semibold text-xs border border-stone-200 dark:border-[#262626]">
              <Clock className="w-3.5 h-3.5 text-[#D9532F]" />
              <span>Counter Pass Active • Expires in {formatTime(countdown)}</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                {redeemingDeal.merchantName}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {redeemingDeal.area} ({redeemingDeal.city})
              </p>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-[#141414] rounded-xl border border-stone-200 dark:border-[#262626] max-w-xs mx-auto space-y-2">
              <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                Show Voucher Code to Storekeeper
              </div>
              <div className="font-mono text-2xl font-black text-stone-900 dark:text-white select-all tracking-wider">
                {redeemingDeal.couponCode}
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {redeemingDeal.perk}
              </div>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              Present this screen to the counter staff before billing. Staff will verify your perk.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setRedeemingDeal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-[#181818] transition-colors"
              >
                Back to Deals
              </button>
              <button
                onClick={() => handleConfirmStorekeeper(redeemingDeal.id)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Redeemed at Counter</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* City Filter Pills */}
            <div className="flex border-b border-stone-100 dark:border-[#1a1a1a] px-4 py-2.5 bg-stone-50/60 dark:bg-[#101010] gap-1.5 overflow-x-auto text-xs font-medium">
              {['All Cities', 'Delhi NCR', 'Mumbai', 'Bengaluru'].map((c) => {
                const isActive = activeTabCity === c || (!activeTabCity && c === 'All Cities');
                return (
                  <button
                    key={c}
                    onClick={() => setActiveTabCity(c === 'All Cities' ? '' : c)}
                    className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap text-xs font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                        : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#181818]'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Deals List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
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
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isRedeemed
                          ? 'bg-stone-50 dark:bg-[#101010] border-stone-200 dark:border-[#202020] opacity-60'
                          : 'bg-white dark:bg-[#121212] border-stone-200 dark:border-[#222222] hover:border-stone-300 dark:hover:border-[#333333]'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-semibold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-[#1c1c1c] px-2 py-0.5 rounded-md">
                            {deal.badge}
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">({deal.city})</span>
                          {isRedeemed && (
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                              ✓ Redeemed {redeemedMap[deal.id].redeemedAt}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-[#D9532F]" />
                          <span>{deal.merchantName}</span>
                        </h4>
                        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          {deal.perk}
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                          {deal.terms}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-[#1a1a1a]">
                        <div className="text-right">
                          <span className="text-[10px] text-stone-400 block mb-0.5">Voucher Code:</span>
                          <span className="font-mono font-bold text-xs text-stone-900 dark:text-white bg-stone-100 dark:bg-[#181818] px-2 py-1 rounded-md border border-stone-200 dark:border-[#262626] select-all">
                            {deal.couponCode}
                          </span>
                        </div>

                        {isRedeemed ? (
                          <div className="px-3 py-1 rounded-lg bg-stone-100 dark:bg-[#1a1a1a] text-stone-400 font-semibold text-xs flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Claimed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyCode(deal.id, deal.couponCode)}
                              className="p-1.5 rounded-lg border border-stone-200 dark:border-[#262626] text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-[#181818] cursor-pointer"
                              title="Copy Code"
                            >
                              {copiedId === deal.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleStartRedemption(deal)}
                              className="px-3 py-1.5 rounded-lg bg-[#D9532F] hover:bg-[#C2411E] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
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
            <div className="p-3 sm:p-4 border-t border-stone-100 dark:border-[#1a1a1a] bg-stone-50/50 dark:bg-[#101010] flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified in-store redemption with counter staff</span>
              </span>
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] text-stone-700 dark:text-stone-300 font-semibold transition-colors cursor-pointer"
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
