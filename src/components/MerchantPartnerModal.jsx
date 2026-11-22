import React, { useState } from 'react';
import {
  Store,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  X,
  KeyRound,
  Users,
  Award,
  Clock,
  ArrowRight,
  HelpCircle,
  Check,
  Building2
} from 'lucide-react';
import { GUILD_INVITE_CODES, validateGuildInviteCode } from '../utils/monetization.js';

export default function MerchantPartnerModal({ isOpen, onClose, defaultMerchantName = '' }) {
  const [activeTab, setActiveTab] = useState('invite'); // 'invite' | 'request'
  const [inviteCode, setInviteCode] = useState('');
  const [validatedVouch, setValidatedVouch] = useState(null);
  const [validationError, setValidationError] = useState('');
  
  // Registration Fields
  const [businessName, setBusinessName] = useState(defaultMerchantName);
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [area, setArea] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [perkOffer, setPerkOffer] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleVerifyCode = (codeToTest) => {
    const code = codeToTest || inviteCode;
    const result = validateGuildInviteCode(code);
    if (result.valid) {
      setValidatedVouch(result);
      setValidationError('');
      if (!city && result.city) setCity(result.city);
      if (!area && result.area) setArea(result.area);
    } else {
      setValidatedVouch(null);
      setValidationError(result.error || 'Invalid invite code.');
    }
  };

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    if (activeTab === 'invite' && !validatedVouch) {
      setValidationError('Please validate a legitimate Guild invite code first.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      try {
        const existing = JSON.parse(localStorage.getItem('neargo_claimed_merchants') || '[]');
        existing.push({
          businessName,
          ownerName,
          phone,
          city,
          area,
          speciality,
          perkOffer,
          type: activeTab === 'invite' ? 'guild_member' : 'vouch_requested',
          vouchedBy: validatedVouch ? validatedVouch.vouchedBy : 'Pending Community Scout Audit',
          claimedAt: new Date().toISOString(),
        });
        localStorage.setItem('neargo_claimed_merchants', JSON.stringify(existing));
      } catch (_) {}
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white dark:bg-[#0c0c0c] border border-stone-200 dark:border-[#1e1e1e] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-stone-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-[#1e1e1e] flex items-center justify-between bg-amber-50/80 dark:bg-[#17120a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">NearGo Local Guild</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 tracking-wide flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-500" />
                  Invite-Only Circle
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Vouched by genuine neighborhood residents — zero ads, zero pay-to-rank.
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

        {/* Anti-Pay-to-Win Pledge Banner */}
        <div className="px-4 py-2 bg-stone-100 dark:bg-[#141414] border-b border-stone-200 dark:border-[#1c1c1c] text-[11px] text-stone-600 dark:text-stone-400 flex items-center gap-2">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">🛡️ Community Pledge:</span>
          <span>NearGo never sells sponsored rankings, glowing pins, or paid reviews. Spots are unlocked solely through peer vouches.</span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                {activeTab === 'invite' ? 'Welcome to the Local Guild!' : 'Community Audit Request Logged!'}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                {activeTab === 'invite' ? (
                  <>
                    Congratulations! <strong>{businessName || 'Your Stall'}</strong> has been verified via invite token and is now recognized as a <strong>Vouched Community Spot</strong>.
                  </>
                ) : (
                  <>
                    We have dispatched a request for a local <strong>Transit Elder / Verified Guide</strong> in {city} to visit <strong>{businessName || 'your stall'}</strong>, taste your specials, verify honest street pricing, and issue your official Guild Invite.
                  </>
                )}
              </p>
              
              <div className="p-3 bg-stone-50 dark:bg-[#141414] rounded-xl border border-stone-200 dark:border-[#222222] text-xs max-w-sm mx-auto space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Guild Status:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {activeTab === 'invite' ? 'Active Guild Member' : 'Pending Local Scout Visit'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Vouched By:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200 truncate max-w-[200px]">
                    {validatedVouch ? validatedVouch.vouchedBy : 'Community Scout Protocol'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Subscription Fee:</span>
                  <span className="font-bold text-emerald-600">₹0 (Free Forever)</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-3 px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Return to NearGo
              </button>
            </div>
          ) : (
            <>
              {/* Tab Switcher */}
              <div className="flex p-1 bg-stone-100 dark:bg-[#141414] rounded-xl border border-stone-200 dark:border-[#222222]">
                <button
                  type="button"
                  onClick={() => setActiveTab('invite')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'invite'
                      ? 'bg-white dark:bg-[#202020] text-amber-700 dark:text-amber-300 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>I Have an Invite Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('request')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'request'
                      ? 'bg-white dark:bg-[#202020] text-amber-700 dark:text-amber-300 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Request Community Vouch</span>
                </button>
              </div>

              {/* TAB 1: Enter Invite Code */}
              {activeTab === 'invite' && (
                <div className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      <span>Enter Your Guild Invitation Token *</span>
                    </label>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 font-mono">Issued by High-Cred Locals</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. OLD-DELHI-HERITAGE"
                      value={inviteCode}
                      onChange={(e) => {
                        setInviteCode(e.target.value);
                        setValidationError('');
                      }}
                      className="flex-1 px-3 py-1.5 text-xs font-mono uppercase bg-white dark:bg-[#121212] border border-amber-300 dark:border-amber-800 rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-amber-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleVerifyCode(inviteCode)}
                      className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
                    >
                      Validate Token
                    </button>
                  </div>

                  {/* Quick Preset Tokens for Demo */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-stone-500">
                    <span className="font-semibold">Sample Guild Codes:</span>
                    {Object.keys(GUILD_INVITE_CODES).map((codeKey) => (
                      <button
                        key={codeKey}
                        type="button"
                        onClick={() => {
                          setInviteCode(codeKey);
                          handleVerifyCode(codeKey);
                        }}
                        className="px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-stone-800 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-stone-700 dark:text-stone-300 font-mono transition-colors"
                      >
                        {codeKey}
                      </button>
                    ))}
                  </div>

                  {/* Validation Feedback */}
                  {validatedVouch && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Legitimate Guild Invitation Verified!</div>
                        <div className="text-[11px] opacity-90">
                          {validatedVouch.vouchedBy} • Chapter: {validatedVouch.area} ({validatedVouch.credScore} ⭐ Local Cred)
                        </div>
                      </div>
                    </div>
                  )}

                  {validationError && (
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                      ⚠️ {validationError}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Request Community Vouch Explanation */}
              {activeTab === 'request' && (
                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-[#222222] bg-stone-50 dark:bg-[#121212] space-y-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-500" />
                    <span>How Community Vouch Audits Work</span>
                  </div>
                  <p>
                    Don't have an invite code yet? No problem! Tell us about your stall or heritage eatery below.
                    A top <strong>Local Guide</strong> or <strong>Transit Elder (500+ Cred)</strong> will anonymously visit, check for fair pricing, taste your specialty, and issue you an invite code.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 pt-1">
                    <span>✓ 100% Free of Cost</span>
                    <span>✓ Zero Platform Fees</span>
                    <span>✓ Authentic Verification</span>
                  </div>
                </div>
              )}

              {/* Form Details */}
              <form onSubmit={handleSubmitClaim} className="space-y-3 pt-2 border-t border-stone-200 dark:border-[#1e1e1e]">
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>Stall & Owner Information</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Business / Food Stall Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Panditji Rabdi Jalebi Heritage"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      Owner / Shopkeeper Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sharma"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-amber-600"
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
                      placeholder="e.g. Dariba Kalan, Chandni Chowk"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Signature Street Specialty / Dish *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Desi Ghee Jalebi with Saffron Rabdi or Butter Bun Maska"
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                    Authentic Community Perk for High-Cred Travelers (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Complimentary hot cutting chai with food order or 10% student discount"
                    value={perkOffer}
                    onChange={(e) => setPerkOffer(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 dark:bg-[#141414] border border-stone-300 dark:border-[#222222] rounded-lg text-stone-900 dark:text-white focus:outline-none focus:border-amber-600"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    NearGo charges zero subscription fee. We only facilitate this perk to drive respectful local footfall.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || (activeTab === 'invite' && !validatedVouch)}
                    className={`w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                      activeTab === 'invite' && !validatedVouch
                        ? 'bg-stone-400 dark:bg-stone-800 cursor-not-allowed text-stone-200'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <span>Recording Guild Registration...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>
                          {activeTab === 'invite'
                            ? 'Activate Guild Spot (Free Forever)'
                            : 'Submit Request for Local Scout Audit'}
                        </span>
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-stone-500 mt-1.5">
                    🏅 100% Peer-vouched community discovery • Zero ads • Zero paid ranking manipulation
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
