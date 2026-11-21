import React, { useState } from 'react';
import {
  Store,
  Star,
  CheckCircle2,
  Sparkles,
  X,
  CreditCard,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Send,
  Zap
} from 'lucide-react';
import { MERCHANT_SUBSCRIPTION_PLANS } from '../utils/monetization.js';

export default function MerchantPartnerModal({ isOpen, onClose, defaultMerchantName = '' }) {
  const [selectedPlan, setSelectedPlan] = useState('pro-growth');
  const [businessName, setBusinessName] = useState(defaultMerchantName);
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [area, setArea] = useState('');
  const [dealOffer, setDealOffer] = useState('');
  const [menuUrl, setMenuUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Persist merchant claim in local session
      try {
        const existing = JSON.parse(localStorage.getItem('neargo_claimed_merchants') || '[]');
        existing.push({
          businessName,
          ownerName,
          phone,
          city,
          area,
          dealOffer,
          plan: selectedPlan,
          claimedAt: new Date().toISOString(),
        });
        localStorage.setItem('neargo_claimed_merchants', JSON.stringify(existing));
      } catch (_) {}
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-[#0c0c0c] border border-stone-200 dark:border-[#1e1e1e] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-stone-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-[#1e1e1e] flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-[#17120a] dark:to-[#1a0f0a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D9532F] text-white flex items-center justify-center shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">Merchant Partner Portal</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white tracking-wide">
                  B2B SaaS & Ads
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Claim your spot, get verified, and drive high-intent footfall from daily travelers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">Partner Claim Registered!</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto">
                Congratulations! <strong>{businessName || 'Your Business'}</strong> has been registered for the <strong>{selectedPlan === 'pro-growth' ? 'Promoted Gem (₹999/mo)' : 'Verified Partner (₹499/mo)'}</strong> plan.
              </p>
              <div className="p-3 bg-stone-50 dark:bg-[#141414] rounded-xl border border-stone-200 dark:border-[#222222] text-xs max-w-sm mx-auto space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Partner Badge:</span>
                  <span className="font-bold text-amber-600">⭐ Verified Community Partner</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Promoted Pin:</span>
                  <span className="font-bold text-emerald-600">Active on Live Map</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="mt-3 px-6 py-2 rounded-xl bg-[#D9532F] text-white font-bold text-xs shadow-md hover:bg-[#C2411E] transition-all"
              >
                Back to NearGo
              </button>
            </div>
          ) : (
            <>
              {/* Plan Tier Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                  Select Your Monetization / Partnership Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MERCHANT_SUBSCRIPTION_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? 'border-[#D9532F] bg-orange-50/30 dark:bg-orange-950/20 shadow-xs'
                          : 'border-stone-200 dark:border-[#202020] hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-[#121212]'
                      }`}
                    >
                      {plan.recommended && (
                        <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-[#D9532F] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                          Highest ROI (₹999)
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-stone-900 dark:text-white">{plan.name}</span>
                        <span className="font-mono font-extrabold text-[#D9532F] text-base">{plan.priceFormatted}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 mb-2.5">{plan.target}</p>
                      <ul className="space-y-1 text-[11px] text-stone-600 dark:text-stone-300">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold shrink-0">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Claim Registration Form */}
              <form onSubmit={handleSubmitClaim} className="space-y-3 pt-2 border-t border-stone-200 dark:border-[#1e1e1e]">
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9532F]" />
                  <span>Business Verification & Promotion Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Business / Food Stall Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Moolchand Paratha Heritage"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-[#D9532F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Owner Name / Manager *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Kumar"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-[#D9532F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-[#D9532F]"
                    >
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bengaluru">Bengaluru</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Neighborhood / Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Near Moolchand Metro Station"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-[#D9532F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Special Community Deal / Flash Coupon for NearGo Users (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free ginger chai or 10% off on all student bills"
                    value={dealOffer}
                    onChange={(e) => setDealOffer(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-[#D9532F]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-[#D9532F] to-[#C2411E] hover:from-amber-600 hover:to-[#B23818] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Verifying Merchant Credentials...</span>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Confirm & Activate Partner Listing ({selectedPlan === 'pro-growth' ? '₹999/mo' : '₹499/mo'})</span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-stone-500 mt-1.5">
                    🛡️ Instant zero-friction onboarding • Cancel anytime • 100% verified footfall guarantee
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
