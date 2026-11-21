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
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar({
  selectedCity,
  setSelectedCity,
  onRequestLocation,
  isDetectingLocation,
  locationStatus,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E5DF]">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          {/* Left: Brand & City Selector */}
          <div className="flex items-center gap-3 shrink-0">
            {setSidebarOpen && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                title="Toggle Sidebar"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            <div
              className="flex items-center gap-1 cursor-pointer select-none"
              onClick={() => setActiveTab('feed')}
            >
              <span className="text-xl font-black tracking-tight text-stone-900 font-sans">
                Near<span className="text-[#D9532F]">Go</span>
              </span>
            </div>

            {/* City Dropdown Pill */}
            <div className="hidden sm:flex items-center ml-1 pl-3 border-l border-stone-200 gap-1">
              <div className="flex items-center gap-1.5 bg-[#F7F6F3] border border-[#E8E5DF] hover:border-stone-300 px-2.5 py-1 rounded-full text-xs transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#D9532F]" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-stone-800 font-semibold outline-none cursor-pointer text-xs pr-1"
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              {/* Auto Detect Location Button */}
              <button
                onClick={onRequestLocation}
                disabled={isDetectingLocation}
                title="Auto-detect nearest city"
                className={`p-1.5 rounded-full border text-xs flex items-center transition-all ${
                  isDetectingLocation
                    ? 'bg-terracotta-50 border-terracotta-300 text-[#D9532F] animate-pulse'
                    : 'bg-[#F7F6F3] border-[#E8E5DF] text-stone-500 hover:text-[#D9532F] hover:border-stone-300'
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
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search local questions, fares, gems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F4F1EA] hover:bg-[#EFECE5] focus:bg-white border border-transparent focus:border-stone-300 rounded-full pl-8 pr-7 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right: View Tabs, Ask Button, & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Tabs Pill */}
            <div className="hidden sm:flex items-center bg-[#F4F1EA] p-0.5 rounded-full border border-stone-200/80 text-xs">
              <button
                onClick={() => setActiveTab('feed')}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  activeTab === 'feed'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Discussions
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1 rounded-full font-semibold flex items-center gap-1 transition-all ${
                  activeTab === 'map'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#D9532F]" />
                <span>Map</span>
              </button>
            </div>

            {/* Minimal Add Question Button */}
            <button
              onClick={onOpenAskModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white text-xs font-bold transition-all"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Local</span>
              <span className="sm:hidden">Ask</span>
            </button>

            {/* Profile Avatar Pill */}
            <div className="relative ml-0.5" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1 p-0.5 rounded-full hover:bg-stone-100 transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold flex items-center justify-center text-[11px]">
                  <span>{initial}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-[#E8E5DF] shadow-lg py-1.5 z-50 text-xs">
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
                      <div className="px-4 py-2 border-b border-stone-100">
                        <div className="font-bold text-stone-900">Welcome to NearGo</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Sign in to post questions, submit local pins, and vote.
                        </div>
                      </div>

                      <div className="p-2 space-y-1.5">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenAuthModal('login');
                          }}
                          className="w-full py-2 rounded-xl bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-center flex items-center justify-center gap-2 transition-colors"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Sign In</span>
                        </button>

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenAuthModal('signup');
                          }}
                          className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-center transition-colors"
                        >
                          <span>Create Account</span>
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
