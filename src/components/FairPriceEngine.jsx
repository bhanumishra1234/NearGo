import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Navigation,
  Car,
  Clock,
  Zap,
  Info,
  AlertTriangle,
  CheckCircle2,
  Moon,
  Sun,
  ArrowRight,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import {
  CITY_TARIFFS,
  POPULAR_LANDMARKS,
  calculateDistance,
  calculateRouteFare,
  evaluateDriverQuote
} from '../data/tariffs.js';

export default function FairPriceEngine({ onClose }) {
  const [cityKey, setCityKey] = useState('delhi');
  const [originId, setOriginId] = useState('iiitd');
  const [destId, setDestId] = useState('chandni-chowk');
  const [isNight, setIsNight] = useState(false);
  const [luggageCount, setLuggageCount] = useState(0);
  const [customDistance, setCustomDistance] = useState(null);
  const [driverQuoteInput, setDriverQuoteInput] = useState('500');
  const [auditResult, setAuditResult] = useState(null);

  // Landmark objects
  const originLandmark = POPULAR_LANDMARKS.find((l) => l.id === originId) || POPULAR_LANDMARKS[0];
  const destLandmark = POPULAR_LANDMARKS.find((l) => l.id === destId) || POPULAR_LANDMARKS[1];

  // Calculated distance in KM
  const computedDistance = useMemo(() => {
    if (customDistance !== null) return customDistance;
    return calculateDistance(
      originLandmark.lat,
      originLandmark.lng,
      destLandmark.lat,
      destLandmark.lng
    );
  }, [originLandmark, destLandmark, customDistance]);

  // Route Fare Breakdown
  const fareData = useMemo(() => {
    return calculateRouteFare({
      cityKey,
      distanceKm: computedDistance,
      isNight,
      luggageCount,
    });
  }, [cityKey, computedDistance, isNight, luggageCount]);

  // Run audit on driver quote
  const handleAuditQuote = () => {
    const quoted = parseFloat(driverQuoteInput);
    if (isNaN(quoted) || quoted <= 0) return;
    const result = evaluateDriverQuote(quoted, fareData);
    setAuditResult(result);
  };

  // Quick preset triggers
  const setPreset = (orig, dest, night = false, quote = '500') => {
    setOriginId(orig);
    setDestId(dest);
    setIsNight(night);
    setCustomDistance(null);
    setDriverQuoteInput(quote);
    setAuditResult(null);
  };

  return (
    <div className="bg-white text-stone-900 rounded-2xl border border-[#E8E5DF] shadow-xl overflow-hidden max-w-4xl w-full mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#E8E5DF] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D9532F] flex items-center justify-center text-white font-bold shadow-md shadow-terracotta-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">Live Municipal Fair Price Engine</h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                Legal Gazette Grounded
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Zero guessing, zero tourist gouging. Official municipal meter formulas & multi-modal transit benchmarks.
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Quick Popular Routes */}
        <div>
          <div className="text-xs font-semibold text-stone-500 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D9532F]" />
            <span>Popular Benchmark Routes:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPreset('iiitd', 'chandni-chowk', false, '500')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                originId === 'iiitd' && destId === 'chandni-chowk'
                  ? 'bg-terracotta-50 border-terracotta-400 text-[#D9532F] font-bold'
                  : 'bg-[#FAF8F5] border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              📍 South Delhi (Okhla) ➔ Chandni Chowk
            </button>
            <button
              onClick={() => setPreset('iiitd', 'moolchand', true, '200')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                originId === 'iiitd' && destId === 'moolchand'
                  ? 'bg-terracotta-50 border-terracotta-400 text-[#D9532F] font-bold'
                  : 'bg-[#FAF8F5] border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              🌙 South Delhi ➔ Moolchand Paratha (Midnight Shift)
            </button>
            <button
              onClick={() => setPreset('ndls', 'cp', false, '300')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                originId === 'ndls' && destId === 'cp'
                  ? 'bg-terracotta-50 border-terracotta-400 text-[#D9532F] font-bold'
                  : 'bg-[#FAF8F5] border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              🚆 New Delhi Railway Stn ➔ Connaught Place
            </button>
          </div>
        </div>

        {/* Route Selector Box */}
        <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8E5DF] space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Origin Landmark */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Starting Location (Origin)
              </label>
              <select
                value={originId}
                onChange={(e) => {
                  setOriginId(e.target.value);
                  setCustomDistance(null);
                  setAuditResult(null);
                }}
                className="w-full bg-white border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-terracotta-400"
              >
                {POPULAR_LANDMARKS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.area})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Landmark */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Destination Landmark
              </label>
              <select
                value={destId}
                onChange={(e) => {
                  setDestId(e.target.value);
                  setCustomDistance(null);
                  setAuditResult(null);
                }}
                className="w-full bg-white border border-[#E8E5DF] rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-terracotta-400"
              >
                {POPULAR_LANDMARKS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.area})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Road Distance & Condition Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Road Distance:</span>
              <span className="font-mono font-bold text-[#D9532F] text-sm">
                {computedDistance} km
              </span>
              <span className="text-stone-400">| Est. Travel Time:</span>
              <span className="font-mono text-stone-700 font-semibold">
                ~{fareData.durationMin} mins
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Night Surcharge Toggle */}
              <button
                type="button"
                onClick={() => setIsNight(!isNight)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                  isNight
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
                }`}
              >
                {isNight ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <span>Night Shift (+25% legal tariff)</span>
              </button>

              {/* Luggage Counter */}
              <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-2.5 py-1 rounded-full">
                <span className="text-stone-500 font-medium">Bags:</span>
                <button
                  type="button"
                  onClick={() => setLuggageCount(Math.max(0, luggageCount - 1))}
                  className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold hover:bg-stone-200"
                >
                  -
                </button>
                <span className="w-4 text-center font-mono font-bold text-stone-900">{luggageCount}</span>
                <button
                  type="button"
                  onClick={() => setLuggageCount(luggageCount + 1)}
                  className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold hover:bg-stone-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Modal Comparison Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Official Auto Meter (Highlight) */}
          <div className="bg-[#FAF8F5] border-2 border-terracotta-400 rounded-xl p-4 relative shadow-xs">
            <div className="absolute -top-2.5 right-3 bg-[#D9532F] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Legal Meter Baseline
            </div>
            <div className="flex items-center gap-2 text-[#D9532F] text-xs font-bold mb-1">
              <span>🛺 Auto Rickshaw Meter</span>
            </div>
            <div className="text-2xl font-extrabold text-stone-900 font-mono mt-1">
              ₹{fareData.auto.min} - ₹{fareData.auto.max}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Formula: {fareData.auto.breakdown}
            </p>
            <div className="mt-2.5 pt-2 border-t border-terracotta-200 text-[11px] text-[#A03216] font-semibold">
              💡 Say: "Bhaiya meter se chalo"
            </div>
          </div>

          {/* 2. Cab Aggregator (Uber / Ola Mini) */}
          <div className="bg-white border border-[#E8E5DF] rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-stone-600 text-xs font-bold mb-1">
              <Car className="w-3.5 h-3.5 text-blue-600" />
              <span>UberGo / Ola Mini</span>
            </div>
            <div className="text-2xl font-extrabold text-stone-900 font-mono mt-1">
              ₹{fareData.cabs.mini.min} - ₹{fareData.cabs.mini.max}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Door-to-door • AC Hatchback
            </p>
            <div className="mt-2.5 pt-2 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              Sedan: ₹{fareData.cabs.sedan.min} - ₹{fareData.cabs.sedan.max}
            </div>
          </div>

          {/* 3. Delhi Metro (Best Value & Speed) */}
          <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1">
              <span>🚇 Delhi Metro</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">Fastest</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
              ₹{fareData.metro.smartCardFare}
              <span className="text-xs text-stone-500 font-normal"> (Card) / ₹{fareData.metro.tokenFare}</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Zero traffic jams • AC transit
            </p>
            <div className="mt-2.5 pt-2 border-t border-emerald-100 text-[11px] text-stone-500 font-medium">
              Est. time: ~{fareData.metro.estimatedTimeMin} mins
            </div>
          </div>

          {/* 4. Bike Taxi (Rapido) */}
          <div className="bg-white border border-[#E8E5DF] rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-1.5 text-stone-600 text-xs font-bold mb-1">
              <span>🏍️ Rapido / Bike Taxi</span>
            </div>
            <div className="text-2xl font-extrabold text-stone-900 font-mono mt-1">
              ₹{fareData.cabs.bikeTaxi.min} - ₹{fareData.cabs.bikeTaxi.max}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Solo rider • Cuts through alleys
            </p>
            <div className="mt-2.5 pt-2 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
              Quickest road option in traffic
            </div>
          </div>
        </div>

        {/* Interactive Driver Price Gouge & Scam Auditor */}
        <div className="bg-[#FAF8F5] border border-rose-200 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 mb-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Driver Price Gouge & Scam Auditor</span>
          </div>
          <p className="text-xs text-stone-600 mb-3">
            Did an auto or cab driver quote a lump-sum fare without turning on the meter? Test it here to check if you are being overcharged.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">₹</span>
              <input
                type="number"
                value={driverQuoteInput}
                onChange={(e) => setDriverQuoteInput(e.target.value)}
                placeholder="Driver Quote (e.g. 500)"
                className="w-full bg-white border border-[#E8E5DF] rounded-xl pl-8 pr-3 py-2 text-sm text-stone-900 font-mono font-bold focus:outline-none focus:border-rose-400"
              />
            </div>

            <button
              onClick={handleAuditQuote}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Audit This Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Audit Result Display */}
          {auditResult && (
            <div className={`mt-3.5 p-4 rounded-xl border ${
              auditResult.status === 'severe_gouge'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : auditResult.status === 'slight_premium'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sm flex items-center gap-2">
                  {auditResult.status === 'severe_gouge' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  {auditResult.status === 'fair' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {auditResult.badge}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white border border-stone-200">
                  {auditResult.percentageDiff > 0 ? `+${auditResult.percentageDiff}% over meter` : 'Within Legal Meter'}
                </span>
              </div>
              <p className="text-xs font-medium mb-2">{auditResult.message}</p>
              <div className="text-xs bg-white p-2.5 rounded-lg border border-stone-200 text-stone-800">
                <strong>Insider Advice:</strong> {auditResult.advice}
              </div>
            </div>
          )}
        </div>

        {/* Delhi Transport Authority Mandate Note */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E5DF] text-[11px] text-stone-600">
          <Info className="w-4 h-4 text-[#D9532F] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-stone-800">Municipal Transport Mandate: </span>
            {fareData.auto.notice} If an auto driver refuses the electronic meter outside stations or terminals, use the prepaid booth or report to the traffic police helpline (<strong>1095</strong>).
          </div>
        </div>
      </div>
    </div>
  );
}
