import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Compass,
  MessageSquarePlus,
  Navigation,
  Search,
  SlidersHorizontal,
  X,
  LogOut,
  LogIn,
  ChevronDown,
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({
  selectedCity,
  setSelectedCity,
  onRequestLocation,
  isDetectingLocation,
  locationStatus,
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  onOpenAskModal,
  onOpenFareModal,
  onOpenVibeModal,
  onOpenAuthModal,
  searchQuery,
  setSearchQuery,
  sidebarOpen,
  setSidebarOpen,
}) {
  const { user, signOut } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#000000]/95 backdrop-blur-md border-b border-[#E8E5DF] dark:border-[#1a1a1a]">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Left: Brand & City Selector */}
          <div className="flex items-center gap-3 shrink-0">
            {setSidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#161616] transition-colors"
                title="Toggle Sidebar"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            <div
              className="flex items-center gap-1 cursor-pointer select-none"
              onClick={() => setActiveTab('feed')}
            >
              <span className="text-xl font-black tracking-tight text-stone-900 dark:text-white font-sans">
                Near<span className="text-[#D9532F]">Go</span>
              </span>
            </div>

            {/* City Dropdown Pill */}
            <div className="hidden sm:flex items-center ml-1 pl-3 border-l border-stone-200 dark:border-[#1f1f1f] gap-1">
              <div className="flex items-center gap-1.5 bg-[#F7F6F3] dark:bg-[#111111] border border-[#E8E5DF] dark:border-[#1e1e1e] hover:border-stone-300 dark:hover:border-stone-600 px-2.5 py-1 rounded-full text-xs transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#D9532F]" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-stone-800 dark:text-stone-100 font-semibold outline-none cursor-pointer text-xs pr-1"
                >
                  <option value="Delhi NCR" className="bg-white dark:bg-[#111111] text-stone-900 dark:text-stone-100">Delhi NCR</option>
                  <option value="Mumbai" className="bg-white dark:bg-[#111111] text-stone-900 dark:text-stone-100">Mumbai</option>
                  <option value="Bengaluru" className="bg-white dark:bg-[#111111] text-stone-900 dark:text-stone-100">Bengaluru</option>
                </select>
              </div>

              {/* Auto Detect Location Button */}
              <button
                onClick={onRequestLocation}
                disabled={isDetectingLocation}
                title="Auto-detect nearest city"
                className={`p-1.5 rounded-full border text-xs flex items-center transition-all ${
                  isDetectingLocation
                    ? 'bg-terracotta-50 dark:bg-[#D9532F]/20 border-terracotta-300 dark:border-[#D9532F]/50 text-[#D9532F] animate-pulse'
                    : 'bg-[#F7F6F3] dark:bg-[#111111] border-[#E8E5DF] dark:border-[#1e1e1e] text-stone-500 dark:text-stone-400 hover:text-[#D9532F] hover:border-stone-300 dark:hover:border-stone-600'
                }`}
              >
                <Navigation className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                {locationStatus && (
                  <span className="text-[10px] font-semibold px-1 text-[#D9532F]">
                    {locationStatus}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Center: Search Input */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search local questions, fares, gems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F4F1EA] dark:bg-[#111111] hover:bg-[#EFECE5] dark:hover:bg-[#161616] focus:bg-white dark:focus:bg-[#141414] border border-transparent focus:border-stone-300 dark:focus:border-[#2a2a2a] rounded-full pl-8 pr-7 py-1.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right: View Tabs, Ask Button, & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Tabs Pill */}
            <div className="hidden sm:flex items-center bg-[#F4F1EA] dark:bg-[#111111] p-0.5 rounded-full border border-stone-200/80 dark:border-[#1e1e1e] text-xs">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  activeTab === 'feed'
                    ? 'bg-white dark:bg-[#222222] text-stone-900 dark:text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Discussions
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1 rounded-full font-semibold flex items-center gap-1 transition-all ${
                  activeTab === 'map'
                    ? 'bg-white dark:bg-[#222222] text-stone-900 dark:text-white shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#D9532F]" />
                <span>Map</span>
              </button>
            </div>

            {/* Minimal Add Question Button */}
            <button
              onClick={onOpenAskModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white text-xs font-bold transition-all shadow-xs"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Local</span>
              <span className="sm:hidden">Ask</span>
            </button>

            {/* Profile Avatar Pill */}
            <div className="relative ml-0.5" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1 p-0.5 rounded-full hover:bg-stone-100 dark:hover:bg-[#161616] transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-stone-900 dark:bg-stone-800 text-white font-bold flex items-center justify-center text-[11px] border border-stone-700">
                  <span>{initial}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#0c0c0c] rounded-xl border border-[#E8E5DF] dark:border-[#1e1e1e] shadow-lg py-1.5 z-50 text-xs">
                  {user ? (
                    <>
                      <div className="px-3.5 py-2 border-b border-stone-100">
                        <div className="font-bold text-stone-900 truncate">{displayName}</div>
                        <div className="text-[10px] text-stone-400 truncate mt-0.5">{user.email}</div>
                        <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[9px]">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>Verified Local</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenAskModal();
                          }}
                          className="w-full text-left px-3.5 py-1.5 hover:bg-stone-50 flex items-center gap-2 text-stone-700"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5 text-[#D9532F]" />
                          <span>My Questions</span>
                        </button>
                      </div>

                      {/* Theme Toggle Slider */}
                      <div className="px-3.5 py-2 border-t border-stone-100 flex items-center justify-between text-stone-700">
                        <div className="flex items-center gap-2">
                          {darkMode ? <Moon className="w-3.5 h-3.5 text-indigo-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                          <span className="text-xs font-medium">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                            darkMode ? 'bg-[#D9532F]' : 'bg-stone-300 dark:bg-stone-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                              darkMode ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="pt-1 border-t border-stone-100">
                        <button
                          onClick={async () => {
                            setProfileDropdownOpen(false);
                            await signOut();
                          }}
                          className="w-full text-left px-3.5 py-1.5 hover:bg-stone-50 flex items-center gap-2 text-red-600 font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-3.5 py-2 border-b border-stone-100">
                        <div className="font-bold text-stone-900">Welcome to NearGo</div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          Sign in to post questions and vote.
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenAuthModal('login');
                          }}
                          className="w-full py-1.5 rounded-lg bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>Sign In</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenAuthModal('signup');
                          }}
                          className="w-full py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-center transition-colors"
                        >
                          <span>Create Account</span>
                        </button>
                      </div>

                      {/* Theme Toggle Slider for guest users */}
                      <div className="px-3.5 py-2 border-t border-stone-100 flex items-center justify-between text-stone-700">
                        <div className="flex items-center gap-2">
                          {darkMode ? <Moon className="w-3.5 h-3.5 text-indigo-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                          <span className="text-xs font-medium">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDarkMode(!darkMode)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                            darkMode ? 'bg-[#D9532F]' : 'bg-stone-300 dark:bg-stone-700'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                              darkMode ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
