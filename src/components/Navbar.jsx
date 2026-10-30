import React from 'react';
import {
  MapPin,
  ShieldCheck,
  Compass,
  MessageSquarePlus,
  Sparkles,
  Navigation,
  Search,
  Bell,
  MessageSquare,
  Globe,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function Navbar({
  selectedCity,
  setSelectedCity,
  activeTab,
  setActiveTab,
  onOpenAskModal,
  onOpenFareModal,
  onOpenVibeModal,
  searchQuery,
  setSearchQuery,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E5DF] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {setSidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                title="Toggle Sidebar"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}

            <div
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              onClick={() => setActiveTab('feed')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#C2411E] via-[#D9532F] to-[#EB7E56] flex items-center justify-center shadow-md shadow-terracotta-500/20 text-white font-extrabold text-lg transition-transform group-hover:scale-105">
                <span className="tracking-tighter">N</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-stone-900 font-sans">
                    Near<span className="text-[#D9532F]">Go</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] bg-terracotta-50 text-[#D9532F] border border-terracotta-200 px-1.5 py-0.5 rounded-full font-semibold">
                    Local
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 -mt-1 hidden md:block font-medium">
                  Hyper-Local Answers & Fair Transit Guide
                </p>
              </div>
            </div>

            {/* City Dropdown Pill */}
            <div className="hidden md:flex items-center ml-2 pl-3 border-l border-stone-200">
              <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E8E5DF] hover:border-terracotta-300 px-2.5 py-1.5 rounded-full text-xs transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#D9532F]" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-stone-700 font-semibold outline-none cursor-pointer text-xs"
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>
            </div>
          </div>

          {/* Center: Reddit/Quora-style Search Input */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions, auto fares, hidden spots, metro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F4F1EA] hover:bg-[#EFECE5] focus:bg-white border border-transparent focus:border-terracotta-400 rounded-full pl-9 pr-8 py-2 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Quick Action Buttons & Add Question */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* View Tabs Pill */}
            <div className="hidden sm:flex items-center bg-[#F4F1EA] p-1 rounded-full border border-stone-200 text-xs">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  activeTab === 'feed'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Discussions
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1 rounded-full font-semibold flex items-center gap-1 transition-all ${
                  activeTab === 'map'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#D9532F]" />
                <span>Map Pins</span>
              </button>
            </div>

            {/* Fair Fare Quick Checker */}
            <button
              onClick={onOpenFareModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 text-xs font-semibold transition-colors"
              title="Official Auto & Cab Fair Price Engine"
            >
              <Navigation className="w-3.5 h-3.5 text-[#D9532F]" />
              <span>Fare Checker</span>
            </button>

            {/* Vibe & Slang Button */}
            <button
              onClick={onOpenVibeModal}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-clay-50 hover:bg-clay-100 text-stone-700 border border-clay-200 text-xs font-semibold transition-colors"
              title="Indic Slang & Vibe Engine"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B57850]" />
              <span>Vibes & Slang</span>
            </button>

            {/* Quora / Reddit Style "Add Question" Button */}
            <button
              onClick={onOpenAskModal}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white text-xs sm:text-sm font-bold shadow-md shadow-terracotta-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Question</span>
              <span className="sm:hidden">Ask</span>
            </button>

            {/* User Profile Avatar Pill */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-amber-400 to-terracotta-500 text-white font-bold flex items-center justify-center text-xs shadow-inner cursor-pointer ml-1">
              <span>U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
