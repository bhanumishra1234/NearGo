import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import StatsHeader from './components/StatsHeader.jsx';
import QuestionsFeed from './components/QuestionsFeed.jsx';
import MapContainer from './components/MapContainer.jsx';
import FairPriceEngine from './components/FairPriceEngine.jsx';
import QuestionDetailModal from './components/QuestionDetailModal.jsx';
import AskQuestionModal from './components/AskQuestionModal.jsx';
import VibeEngineModal from './components/VibeEngineModal.jsx';
import { INITIAL_QUESTIONS } from './data/seedData.js';
import { calculateDistance, calculateRouteFare } from './data/tariffs.js';
import {
  ShieldCheck,
  Compass,
  MessageSquarePlus,
  Sparkles,
  Navigation,
  Home,
  MapPin,
  Flame,
  Coffee,
  ShoppingBag,
  Building2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Volume2
} from 'lucide-react';

export default function App() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [highlightedPin, setHighlightedPin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Modals state
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isFareModalOpen, setIsFareModalOpen] = useState(false);
  const [isVibeModalOpen, setIsVibeModalOpen] = useState(false);

  // Sync with backend API if running
  useEffect(() => {
    fetch('/api/questions')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API offline');
      })
      .then((data) => {
        if (data && data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      })
      .catch(() => {
        // Standalone fallback: uses seedData seamlessly
      });
  }, []);

  // Filter questions based on search query
  const displayedQuestions = questions.filter((q) => {
    if (!searchQuery) return true;
    const s = searchQuery.toLowerCase();
    return (
      q.title.toLowerCase().includes(s) ||
      q.body.toLowerCase().includes(s) ||
      q.locationName.toLowerCase().includes(s) ||
      (q.community && q.community.toLowerCase().includes(s)) ||
      q.tags.some((t) => t.toLowerCase().includes(s))
    );
  });

  // Calculate total pinned spots
  const totalPinsCount = questions.reduce(
    (acc, q) => acc + (q.lat ? 1 : 0) + q.answers.filter((a) => a.pin).length,
    0
  );

  // Handle Question Upvote
  const handleUpvoteQuestion = (qId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const nextUpvoted = !q.userUpvoted;
          return {
            ...q,
            userUpvoted: nextUpvoted,
            upvotes: q.upvotes + (nextUpvoted ? 1 : -1),
          };
        }
        return q;
      })
    );

    if (selectedQuestion && selectedQuestion.id === qId) {
      setSelectedQuestion((prev) => ({
        ...prev,
        userUpvoted: !prev.userUpvoted,
        upvotes: prev.upvotes + (!prev.userUpvoted ? 1 : -1),
      }));
    }

    fetch(`/api/questions/${qId}/upvote`, { method: 'POST' }).catch(() => {});
  };

  // Handle Answer Upvote
  const handleUpvoteAnswer = (qId, ansId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            answers: q.answers.map((a) => {
              if (a.id === ansId) {
                const nextUpvoted = !a.userUpvoted;
                return {
                  ...a,
                  userUpvoted: nextUpvoted,
                  upvotes: a.upvotes + (nextUpvoted ? 1 : -1),
                };
              }
              return a;
            }),
          };
        }
        return q;
      })
    );

    if (selectedQuestion && selectedQuestion.id === qId) {
      setSelectedQuestion((prev) => ({
        ...prev,
        answers: prev.answers.map((a) => {
          if (a.id === ansId) {
            const nextUpvoted = !a.userUpvoted;
            return {
              ...a,
              userUpvoted: nextUpvoted,
              upvotes: a.upvotes + (nextUpvoted ? 1 : -1),
            };
          }
          return a;
        }),
      }));
    }

    fetch(`/api/questions/${qId}/answers/${ansId}/upvote`, { method: 'POST' }).catch(() => {});
  };

  // Handle Add New Question
  const handleAddQuestion = (questionData) => {
    let fareCheck = null;
    if (questionData.requestFareCheck && questionData.fareOrigin && questionData.fareDestination) {
      const distance = 18.4;
      const fare = calculateRouteFare({ cityKey: 'delhi', distanceKm: distance });
      fareCheck = {
        origin: questionData.fareOrigin,
        destination: questionData.fareDestination,
        distanceKm: distance,
        durationMin: fare.durationMin,
        officialAutoMeter: `₹${fare.auto.min} - ₹${fare.auto.max}`,
        cabEstimate: `₹${fare.cabs.mini.min} - ₹${fare.cabs.mini.max}`,
        metroRoute: 'Direct Delhi Metro Corridor (Violet/Yellow line)',
        metroFare: `₹${fare.metro.tokenFare} Token / ₹${fare.metro.smartCardFare} Card`,
        metroDuration: `${fare.metro.estimatedTimeMin} mins`,
        scamWarning: `Always verify against municipal meter fare: ₹${fare.auto.exactMeter}. Avoid paying unmetered tourist surge.`,
      };
    }

    const newQuestion = {
      id: `q-${Date.now()}`,
      community: questionData.community || 'c/DelhiLocal',
      title: questionData.title,
      body: questionData.body,
      author: {
        name: questionData.authorName || 'Traveler',
        badge: 'Curious Traveler',
        badgeColor: 'amber',
        isVerified: false,
        reputation: 12,
      },
      city: selectedCity,
      locationName: questionData.locationName,
      lat: questionData.lat || 28.5459,
      lng: questionData.lng || 77.2732,
      category: questionData.category,
      vibeCategory: questionData.vibeCategory,
      tags: questionData.tags,
      createdAt: 'Just now',
      upvotes: 1,
      userUpvoted: true,
      fareCheck,
      photos: questionData.photos || [],
      answers: [],
    };

    setQuestions([newQuestion, ...questions]);

    fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...questionData, photos: questionData.photos || [] }),
    }).catch(() => {});
  };

  // Handle Add Answer
  const handleAddAnswer = (qId, answerData) => {
    const newAnswer = {
      id: `ans-${Date.now()}`,
      author: {
        name: answerData.authorName,
        badge: answerData.badge || 'Verified Local',
        badgeColor: 'emerald',
        isVerified: true,
        reputation: 160,
      },
      body: answerData.body,
      pin: answerData.pin,
      insiderTip: answerData.insiderTip,
      photos: answerData.photos || [],
      upvotes: 1,
      userUpvoted: true,
      createdAt: 'Just now',
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            answers: [...q.answers, newAnswer],
          };
        }
        return q;
      })
    );

    if (selectedQuestion && selectedQuestion.id === qId) {
      setSelectedQuestion((prev) => ({
        ...prev,
        answers: [...prev.answers, newAnswer],
      }));
    }

    fetch(`/api/questions/${qId}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answerData),
    }).catch(() => {});
  };

  const handleHighlightOnMap = (target) => {
    setHighlightedPin(target);
    setActiveTab('map');
  };

  // Communities list (Reddit/Quora spaces style)
  const COMMUNITIES = [
    { id: 'c/DelhiTransit', name: 'Delhi Transit & Fares', icon: '🛺', members: '14.2k locals' },
    { id: 'c/StreetFood', name: 'Street Food & Chai', icon: '🥟', members: '28.9k foodies' },
    { id: 'c/SecretSpots', name: 'Secret Spots & Heritage', icon: '🏛️', members: '9.4k explorers' },
    { id: 'c/BargainBazaars', name: 'Flea Markets & Thrift', icon: '🛍️', members: '18.1k shoppers' },
    { id: 'c/StudentBudget', name: 'Student Living & Eats', icon: '🎓', members: '22.3k students' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1C1917] flex flex-col font-sans selection:bg-[#D9532F] selection:text-white">
      {/* Navbar */}
      <Navbar
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAskModal={() => setIsAskModalOpen(true)}
        onOpenFareModal={() => setIsFareModalOpen(true)}
        onOpenVibeModal={() => setIsVibeModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Optional Clean Welcome Header */}
      {showBanner && (
        <StatsHeader
          onOpenFareModal={() => setIsFareModalOpen(true)}
          onOpenVibeModal={() => setIsVibeModalOpen(true)}
          onDismiss={() => setShowBanner(false)}
        />
      )}

      {/* Main Reddit/Quora 3-Column Layout */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6 w-full flex-1">
        {activeTab === 'feed' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 1. Left Sidebar: Reddit/Quora Spaces & Navigation (3 cols) */}
            <aside className={`lg:col-span-3 ${sidebarOpen ? 'block' : 'hidden lg:block'} space-y-4`}>
              {/* Primary Feed Navigation */}
              <div className="bg-white rounded-2xl border border-[#E8E5DF] p-3 shadow-xs">
                <div className="space-y-1 text-xs sm:text-sm font-semibold">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedVibe('all');
                      setActiveTab('feed');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-stone-100 text-stone-900 transition-colors"
                  >
                    <Home className="w-4 h-4 text-[#D9532F]" />
                    <span>Home / All City Feed</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('map')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                  >
                    <Compass className="w-4 h-4 text-emerald-600" />
                    <span>Explore Spatial Map</span>
                  </button>

                  <button
                    onClick={() => setIsFareModalOpen(true)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Fair Fare Calculator</span>
                  </button>

                  <button
                    onClick={() => setIsVibeModalOpen(true)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#B57850]" />
                    <span>Indic Street Slang</span>
                  </button>
                </div>
              </div>

              {/* Communities / Spaces (Reference Image 1 Reddit style) */}
              <div className="bg-white rounded-2xl border border-[#E8E5DF] p-3.5 shadow-xs space-y-2.5">
                <div className="text-[11px] font-extrabold text-stone-400 uppercase tracking-wider px-2">
                  City Spaces & Topics
                </div>
                <div className="space-y-1">
                  {COMMUNITIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSearchQuery(c.name.split(' ')[0])}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs hover:bg-[#FAF8F5] transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{c.icon}</span>
                        <div className="truncate">
                          <div className="font-bold text-stone-800 group-hover:text-[#D9532F] truncate">
                            {c.name}
                          </div>
                          <div className="text-[10px] text-stone-400">{c.members}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* City Gazette Notice Card */}
              <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E5DF] p-3.5 shadow-xs text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#D9532F] font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Delhi Gazette Meter Notice</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Auto drivers in Delhi NCR are legally required to start the electronic meter (₹30 first 1.5 km, ₹11/km). Night tariff applies 11 PM – 5 AM (+25%).
                </p>
                <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-200">
                  Traffic Police Helpline: 1095
                </div>
              </div>
            </aside>

            {/* 2. Center Column: Community Feed & Discussions (6 cols) */}
            <main className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <span>Recent Local Discussions</span>
                    <span className="text-xs bg-terracotta-50 text-[#D9532F] border border-terracotta-200 px-2 py-0.5 rounded-full font-mono font-bold">
                      {displayedQuestions.length}
                    </span>
                  </h2>
                </div>

                <button
                  onClick={() => setIsAskModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Ask Local</span>
                </button>
              </div>

              <QuestionsFeed
                questions={displayedQuestions}
                onSelectQuestion={(q) => setSelectedQuestion(q)}
                onHighlightOnMap={handleHighlightOnMap}
                onUpvoteQuestion={handleUpvoteQuestion}
                onOpenAskModal={() => setIsAskModalOpen(true)}
                onOpenFareModal={() => setIsFareModalOpen(true)}
                selectedVibe={selectedVibe}
                setSelectedVibe={setSelectedVibe}
              />
            </main>

            {/* 3. Right Sidebar: Mini-Map, Quick Scam Auditor, Slang (3 cols) */}
            <aside className="hidden lg:block lg:col-span-3 space-y-4">
              <div className="sticky top-20 space-y-4">
                {/* Interactive Map Preview Card */}
                <div className="bg-white border border-[#E8E5DF] rounded-2xl p-3.5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#D9532F]" />
                      <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Live Spatial Map
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('map')}
                      className="text-xs text-[#D9532F] hover:underline font-bold"
                    >
                      Expand ➔
                    </button>
                  </div>

                  <div className="h-[220px] rounded-xl overflow-hidden border border-[#E8E5DF]">
                    <MapContainer
                      questions={questions}
                      onSelectQuestion={(q) => setSelectedQuestion(q)}
                      highlightedPin={highlightedPin}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium pt-1">
                    <span>Updates dynamically</span>
                    <span className="font-mono text-emerald-700 font-bold">{totalPinsCount} Pinned Spots</span>
                  </div>
                </div>

                {/* Quick Fair Fare Calculator Card */}
                <div className="bg-white border border-terracotta-200 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#D9532F]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Fair Price Protection</span>
                    </div>
                    <span className="text-[10px] bg-terracotta-50 text-[#D9532F] px-2 py-0.5 rounded-full font-bold">
                      Delhi Meter
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Heading out? Calculate official auto meter rates, compare with cabs, or audit an auto driver quote in seconds.
                  </p>
                  <button
                    onClick={() => setIsFareModalOpen(true)}
                    className="w-full py-2 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Open Fare & Scam Checker</span>
                  </button>
                </div>

                {/* Street Slang Quick Pill (Indic Lexicon) */}
                <div className="bg-[#FAF8F5] border border-[#E8E5DF] rounded-2xl p-3.5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <span>🗣️</span>
                      <span>Slang of the Day</span>
                    </span>
                    <button
                      onClick={() => setIsVibeModalOpen(true)}
                      className="text-[11px] text-[#D9532F] hover:underline font-semibold"
                    >
                      View All
                    </button>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                    <div className="font-bold text-xs text-stone-900">"Meter se chalo bhaiya"</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">
                      Say this when an auto quotes a random price. Legally obligates meter run in Delhi.
                    </div>
                  </div>
                </div>

                {/* About NearGo Card (Reddit Right-Rail style) */}
                <div className="bg-white border border-[#E8E5DF] rounded-2xl p-3.5 shadow-xs text-xs space-y-2">
                  <div className="font-bold text-stone-900">About NearGo</div>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    NearGo connects travelers with authentic local residents, pinned spots on interactive maps, and real-time municipal fair transit rates. No tourist gouging, zero sponsored clutter.
                  </p>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
                    <span>Delhi • Mumbai • Bengaluru</span>
                    <span>© 2026 NearGo</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          /* Full Screen Spatial Map View */
          <div className="h-[calc(100vh-210px)] min-h-[550px] w-full flex flex-col space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-[#E8E5DF] shadow-xs">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#D9532F]" />
                  <span>Interactive Map & Pinned Recommendations</span>
                </h2>
                <p className="text-xs text-stone-500">
                  Click on any question (❓) or secret spot pin (💎) to read advice, notes, and fair prices
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAskModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs shadow-xs"
                >
                  Pin a Question
                </button>
              </div>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-md">
              <MapContainer
                questions={questions}
                onSelectQuestion={(q) => setSelectedQuestion(q)}
                highlightedPin={highlightedPin}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E8E5DF] bg-white py-6 px-4 text-center text-xs text-stone-500 mt-auto">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-900 text-sm">
              Near<span className="text-[#D9532F]">Go</span>
            </span>
            <span className="text-stone-300">•</span>
            <span>Hyper-Local Community Travel Companion & Real-Time City Guide</span>
          </div>
          <div className="text-stone-500">
            Powered by OpenStreetMap, CartoDB & Municipal Transit Tariff Intelligence
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedQuestion && (
        <QuestionDetailModal
          question={selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
          onAddAnswer={handleAddAnswer}
          onUpvoteQuestion={handleUpvoteQuestion}
          onUpvoteAnswer={handleUpvoteAnswer}
          onHighlightOnMap={handleHighlightOnMap}
        />
      )}

      {isAskModalOpen && (
        <AskQuestionModal
          onClose={() => setIsAskModalOpen(false)}
          onAddQuestion={handleAddQuestion}
        />
      )}

      {isFareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-4xl">
            <FairPriceEngine onClose={() => setIsFareModalOpen(false)} />
          </div>
        </div>
      )}

      {isVibeModalOpen && (
        <VibeEngineModal
          onClose={() => setIsVibeModalOpen(false)}
          onHighlightOnMap={handleHighlightOnMap}
        />
      )}
    </div>
  );
}
