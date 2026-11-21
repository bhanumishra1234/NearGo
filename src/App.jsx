import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import StatsHeader from './components/StatsHeader.jsx';
import QuestionsFeed from './components/QuestionsFeed.jsx';
import MapContainer from './components/MapContainer.jsx';
import FairPriceEngine from './components/FairPriceEngine.jsx';
import QuestionDetailPage from './pages/QuestionDetailPage.jsx';
import AskQuestionPage from './pages/AskQuestionPage.jsx';
import VibeEngineModal from './components/VibeEngineModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import Neo4jGraphModal from './components/Neo4jGraphModal.jsx';
import MerchantPartnerModal from './components/MerchantPartnerModal.jsx';
import CouponRedeemModal from './components/CouponRedeemModal.jsx';
import HeritageTrailsModal from './components/HeritageTrailsModal.jsx';
import NeighbourhoodRadio from './components/NeighbourhoodRadio.jsx';
import { useAuth } from './context/AuthContext.jsx';
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
  Volume2,
  Share2,
  Gift,
  Store,
  Landmark
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

  // Dark/Light Theme state
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('neargo_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('neargo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('neargo_theme', 'light');
    }
  }, [darkMode]);

  // View & Full-Page Navigation Routing ('feed' | 'map' | 'post' | 'ask')
  const [currentView, setCurrentView] = useState('feed');
  const [previousView, setPreviousView] = useState('feed');
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Tool & Utility Modals state
  const [isFareModalOpen, setIsFareModalOpen] = useState(false);
  const [isVibeModalOpen, setIsVibeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isMerchantModalOpen, setIsMerchantModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isTrailsModalOpen, setIsTrailsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Navigation actions
  const navigateToPost = (q) => {
    setPreviousView(currentView === 'ask' ? 'feed' : currentView);
    setSelectedQuestion(q);
    setCurrentView('post');
    window.location.hash = `post/${q.id}`;
  };

  const navigateToAsk = () => {
    setPreviousView(currentView);
    setCurrentView('ask');
    window.location.hash = 'ask';
  };

  const navigateToFeed = () => {
    setSelectedQuestion(null);
    setCurrentView('feed');
    setActiveTab('feed');
    window.location.hash = '';
  };

  const navigateToMap = (pin = null) => {
    if (pin) setHighlightedPin(pin);
    setCurrentView('map');
    setActiveTab('map');
    window.location.hash = 'map';
  };

  // Sync with browser URL hash & Back/Forward buttons
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('post/')) {
        const qId = hash.replace('post/', '');
        const matched = questions.find((q) => String(q.id) === String(qId));
        if (matched) {
          setSelectedQuestion(matched);
          setCurrentView('post');
        }
      } else if (hash === 'ask') {
        setCurrentView('ask');
      } else if (hash === 'map') {
        setCurrentView('map');
        setActiveTab('map');
      } else if (!hash || hash === 'feed') {
        setSelectedQuestion(null);
        setCurrentView('feed');
        setActiveTab('feed');
      }
    };

    window.addEventListener('hashchange', handleHash);
    if (window.location.hash) {
      handleHash();
    }
    return () => window.removeEventListener('hashchange', handleHash);
  }, [questions]);

  const { user, accessToken } = useAuth();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  // Helper to determine closest supported city from coordinates
  const detectNearestCity = (lat, lng) => {
    // City center reference coordinates
    const CITIES = [
      { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    ];

    let closest = CITIES[0];
    let minDiff = Infinity;

    CITIES.forEach((c) => {
      // Euclidean approximate distance
      const diff = Math.hypot(c.lat - lat, c.lng - lng);
      if (diff < minDiff) {
        minDiff = diff;
        closest = c;
      }
    });

    return closest.name;
  };

  // Trigger browser Geolocation permission & auto-select city
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation not supported');
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus('Locating...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const matchedCity = detectNearestCity(latitude, longitude);
        setSelectedCity(matchedCity);
        localStorage.setItem('neargo_selected_city', matchedCity);
        setIsDetectingLocation(false);
        setLocationStatus(`Auto-detected: ${matchedCity}`);
        setTimeout(() => setLocationStatus(null), 3500);
      },
      (err) => {
        setIsDetectingLocation(false);
        if (err.code === 1) {
          setLocationStatus('Permission denied');
        } else {
          setLocationStatus('Could not detect');
        }
        setTimeout(() => setLocationStatus(null), 3500);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Auto-request location or load saved preference on initial mount
  useEffect(() => {
    const savedCity = localStorage.getItem('neargo_selected_city');
    if (savedCity) {
      setSelectedCity(savedCity);
    } else {
      // Automatically request browser location if not explicitly chosen before
      requestLocation();
    }
  }, []);

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

  // Filter questions based on selected city and search query
  const displayedQuestions = questions.filter((q) => {
    // City filter
    if (selectedCity && q.city && !q.city.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }

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

    fetch(`/api/questions/${qId}/upvote`, {
      method: 'POST',
      headers: { ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    }).catch(() => {});
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

    fetch(`/api/questions/${qId}/answers/${ansId}/upvote`, {
      method: 'POST',
      headers: { ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    }).catch(() => {});
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
        name: questionData.authorName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler',
        badge: user ? 'Verified Local' : 'Curious Traveler',
        badgeColor: user ? 'emerald' : 'amber',
        isVerified: !!user,
        reputation: user ? 85 : 12,
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
    navigateToPost(newQuestion);

    fetch('/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ ...questionData, photos: questionData.photos || [] }),
    }).catch(() => {});
  };

  // Handle Add Answer
  const handleAddAnswer = (qId, answerData) => {
    const newAnswer = {
      id: `ans-${Date.now()}`,
      author: {
        name: answerData.authorName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Local Guide',
        badge: answerData.badge || (user ? 'Verified Local' : 'Local Contributor'),
        badgeColor: 'emerald',
        isVerified: true,
        reputation: user ? 180 : 160,
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
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(answerData),
    }).catch(() => {});
  };

  // Handle Accept Answer as Verified Solution (Q&A Lifecycle Business Logic)
  const handleAcceptAnswer = (qId, ansId) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const updatedAnswers = q.answers.map((a) => {
            if (a.id === ansId) {
              const nextAccepted = !a.isAccepted;
              return {
                ...a,
                isAccepted: nextAccepted,
                author: {
                  ...a.author,
                  reputation: (a.author?.reputation || 100) + (nextAccepted ? 15 : -15),
                },
              };
            }
            return { ...a, isAccepted: false };
          });

          return {
            ...q,
            status: updatedAnswers.some((a) => a.isAccepted) ? 'solved' : 'open',
            answers: updatedAnswers,
          };
        }
        return q;
      })
    );

    if (selectedQuestion && selectedQuestion.id === qId) {
      setSelectedQuestion((prev) => {
        const updatedAnswers = prev.answers.map((a) => {
          if (a.id === ansId) {
            const nextAccepted = !a.isAccepted;
            return {
              ...a,
              isAccepted: nextAccepted,
              author: {
                ...a.author,
                reputation: (a.author?.reputation || 100) + (nextAccepted ? 15 : -15),
              },
            };
          }
          return { ...a, isAccepted: false };
        });

        return {
          ...prev,
          status: updatedAnswers.some((a) => a.isAccepted) ? 'solved' : 'open',
          answers: updatedAnswers,
        };
      });
    }
  };

  const handleHighlightOnMap = (target) => {
    setHighlightedPin(target);
    navigateToMap(target);
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
    <div className={`w-full bg-[#ffffff] dark:bg-[#000000] text-[#1C1917] dark:text-[#E7E5E4] flex flex-col font-sans selection:bg-[#D9532F] selection:text-white transition-colors duration-200 ${
      currentView === 'post' || currentView === 'ask' ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'
    }`}>
      {/* Navbar */}
      <Navbar
        selectedCity={selectedCity}
        setSelectedCity={(city) => {
          setSelectedCity(city);
          localStorage.setItem('neargo_selected_city', city);
          if (currentView === 'post' || currentView === 'ask') {
            navigateToFeed();
          }
        }}
        onRequestLocation={requestLocation}
        isDetectingLocation={isDetectingLocation}
        locationStatus={locationStatus}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={currentView === 'map' ? 'map' : 'feed'}
        setActiveTab={(tab) => {
          if (tab === 'map') navigateToMap();
          else navigateToFeed();
        }}
        onOpenAskModal={navigateToAsk}
        onOpenFareModal={() => setIsFareModalOpen(true)}
        onOpenVibeModal={() => setIsVibeModalOpen(true)}
        onOpenAuthModal={(mode) => {
          setAuthMode(mode || 'login');
          setIsAuthModalOpen(true);
        }}
        onOpenCouponModal={() => setIsCouponModalOpen(true)}
        onOpenMerchantModal={() => setIsMerchantModalOpen(true)}
        onOpenTrailsModal={() => setIsTrailsModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Dynamic Content Display: Full Pages for Post View and Put Question, or Feed/Map */}
      {currentView === 'post' && selectedQuestion ? (
        <QuestionDetailPage
          question={selectedQuestion}
          onBack={() => {
            if (previousView === 'map') {
              navigateToMap();
            } else {
              navigateToFeed();
            }
          }}
          onAddAnswer={handleAddAnswer}
          onUpvoteQuestion={handleUpvoteQuestion}
          onUpvoteAnswer={handleUpvoteAnswer}
          onAcceptAnswer={handleAcceptAnswer}
          onHighlightOnMap={(pin) => {
            handleHighlightOnMap(pin);
          }}
          relatedQuestions={questions.filter(
            (q) => q.city === selectedQuestion.city && q.id !== selectedQuestion.id
          )}
          onSelectRelatedQuestion={(q) => navigateToPost(q)}
        />
      ) : currentView === 'ask' ? (
        <AskQuestionPage
          onBack={() => {
            if (previousView === 'map') {
              navigateToMap();
            } else {
              navigateToFeed();
            }
          }}
          onAddQuestion={(newQ) => {
            handleAddQuestion(newQ);
          }}
          initialCity={selectedCity}
        />
      ) : (
        /* Main Reddit/Quora 3-Column Layout: Outer container is strictly fixed/unscrollable */
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 w-full flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
          {currentView === 'feed' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
            {/* 1. Left Sidebar: Navigation & Spaces (3 cols) - STRICTLY NON-SCROLLABLE */}
            <aside aria-label="City Spaces and Topic Navigation" className={`lg:col-span-3 h-full overflow-hidden py-4 ${sidebarOpen ? 'flex' : 'hidden lg:flex'} flex-col space-y-2.5 select-none shrink-0`}>
              {/* Primary Feed Navigation */}
              <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-2.5 shadow-2xs">
                <div className="space-y-0.5 text-xs font-semibold">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedVibe('all');
                      setActiveTab('feed');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#1a1a1a] text-stone-900 dark:text-white transition-colors"
                  >
                    <Home className="w-4 h-4 text-[#D9532F]" />
                    <span>All City Feed</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('map')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-[#141414] transition-colors"
                  >
                    <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Explore Spatial Map</span>
                  </button>

                  <button
                    onClick={() => setIsFareModalOpen(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-[#141414] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Fair Fare Calculator</span>
                  </button>

                  <button
                    onClick={() => setIsVibeModalOpen(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-[#141414] transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#B57850] dark:text-[#d49970]" />
                    <span>Indic Street Slang</span>
                  </button>

                  <button
                    onClick={() => setIsGraphModalOpen(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-[#141414] transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-[#008CC1]" />
                    <div className="flex items-center justify-between w-full">
                      <span>Neo4j Transit Graph</span>
                      <span className="text-[9px] bg-[#008CC1]/10 text-[#008CC1] font-mono font-bold px-1.5 py-0.2 rounded border border-[#008CC1]/30">Cypher</span>
                    </div>
                  </button>

                  {/* 1. Hyper-Local Flash Deals & Perks */}
                  <button
                    onClick={() => setIsCouponModalOpen(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-[#141414] transition-colors cursor-pointer"
                  >
                    <Gift className="w-4 h-4 text-orange-500" />
                    <div className="flex items-center justify-between w-full">
                      <span>Community Flash Deals</span>
                      <span className="text-[9px] bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-1.5 py-0.2 rounded border border-orange-500/30">Free Chai</span>
                    </div>
                  </button>

                  {/* 2. Merchant Claim & Partner Portal (B2B SaaS) */}
                  <button
                    onClick={() => setIsMerchantModalOpen(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-[#141414] transition-colors cursor-pointer"
                  >
                    <Store className="w-4 h-4 text-amber-500" />
                    <div className="flex items-center justify-between w-full">
                      <span>Claim Spot (B2B SaaS)</span>
                      <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">₹499/mo</span>
                    </div>
                  </button>

                  {/* 3. DMRC & Delhi Tourism Heritage Trails (B2G) */}
                  <button
                    onClick={() => setIsTrailsModalOpen(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-[#141414] transition-colors cursor-pointer"
                  >
                    <Landmark className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <div className="flex items-center justify-between w-full">
                      <span>DMRC Heritage Trails</span>
                      <span className="text-[9px] bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold px-1.5 py-0.2 rounded border border-teal-500/30">Official</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Communities / Spaces */}
              <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] p-2.5 shadow-2xs space-y-1.5">
                <div className="text-[10px] font-extrabold text-stone-400 dark:text-stone-500 uppercase tracking-wider px-1">
                  City Spaces & Topics
                </div>
                <div className="space-y-0.5">
                  {COMMUNITIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSearchQuery(c.name.split(' ')[0])}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl text-xs hover:bg-[#FAF8F5] dark:hover:bg-[#141414] transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm">{c.icon}</span>
                        <div className="truncate">
                          <div className="font-semibold text-stone-800 dark:text-stone-200 group-hover:text-[#D9532F] truncate text-[11px]">
                            {c.name}
                          </div>
                          <div className="text-[9px] text-stone-400 dark:text-stone-500">{c.members}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-stone-300 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-300 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* 2. Center Column: Community Feed & Discussions (6 cols) - THE ONLY SCROLLABLE SECTION */}
            <main aria-label="Community Feed and Discussions" className="lg:col-span-6 h-full overflow-y-auto no-scrollbar py-4 px-1 space-y-4">
                <h1 className="sr-only">NearGo — Hyper-Local Community Travel Companion & Real-Time City Guide</h1>
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <span>Recent Local Discussions</span>
                    <span className="text-xs bg-terracotta-50 dark:bg-[#D9532F]/15 text-[#D9532F] dark:text-[#ff7854] border border-terracotta-200 dark:border-[#D9532F]/30 px-2 py-0.5 rounded-full font-mono font-bold">
                      {displayedQuestions.length}
                    </span>
                  </h2>
                </div>

                <button
                  onClick={navigateToAsk}
                  className="px-3.5 py-1.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Ask Local</span>
                </button>
              </div>

              <QuestionsFeed
                questions={displayedQuestions}
                onSelectQuestion={(q) => navigateToPost(q)}
                onHighlightOnMap={handleHighlightOnMap}
                onUpvoteQuestion={handleUpvoteQuestion}
                onOpenAskModal={navigateToAsk}
                onOpenFareModal={() => setIsFareModalOpen(true)}
                selectedVibe={selectedVibe}
                setSelectedVibe={setSelectedVibe}
              />

              {/* Feed Bottom Footer */}
              <div className="border-t border-[#E8E5DF] dark:border-[#1a1a1a] pt-6 pb-10 text-center text-xs text-stone-500 dark:text-stone-400 mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-900 dark:text-white text-xs">
                      Near<span className="text-[#D9532F]">Go</span>
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">•</span>
                    <span>Hyper-Local Community Travel Companion</span>
                  </div>
                  <div className="text-stone-400 dark:text-stone-500 text-[10px]">
                    Powered by OpenStreetMap & Municipal Transit Tariff Intelligence
                  </div>
                </div>
              </div>
            </main>

            {/* 3. Right Sidebar: Mini-Map, Quick Scam Auditor, Slang (3 cols) - STRICTLY NON-SCROLLABLE */}
            <aside aria-label="Live Tools and Spatial Mini-Map" className="hidden lg:flex lg:col-span-3 h-full overflow-hidden py-4 flex-col space-y-2.5 select-none shrink-0">
              {/* Interactive Map Preview Card */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-[#E8E5DF] dark:border-[#1a1a1a] rounded-2xl p-2.5 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#D9532F]" />
                    <h3 className="text-[11px] font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                      Live Spatial Map
                    </h3>
                  </div>
                  <button
                    onClick={navigateToMap}
                    className="text-[11px] text-[#D9532F] hover:underline font-bold"
                  >
                    Expand ➔
                  </button>
                </div>

                <div
                  onClick={navigateToMap}
                  className="h-[155px] rounded-xl overflow-hidden border border-[#E8E5DF] dark:border-[#1a1a1a] cursor-pointer relative group"
                  title="Click to expand full spatial map"
                >
                  <MapContainer
                    questions={questions}
                    onSelectQuestion={(q) => navigateToPost(q)}
                    highlightedPin={highlightedPin}
                    minimal={true}
                    selectedCity={selectedCity}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors pointer-events-none flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/85 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#D9532F]" />
                      <span>Click to Expand Full Map</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-medium px-0.5">
                  <span>Updates dynamically</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{totalPinsCount} Pinned Spots</span>
                </div>
              </div>

              {/* Quick Fair Fare Calculator Card */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-terracotta-200 dark:border-[#1a1a1a] rounded-2xl p-2.5 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#D9532F]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Fair Price Protection</span>
                  </div>
                  <span className="text-[9px] bg-terracotta-50 dark:bg-[#D9532F]/15 text-[#D9532F] dark:text-[#ff7854] px-1.5 py-0.5 rounded-full font-bold">
                    Delhi Meter
                  </span>
                </div>
                <p className="text-[10px] text-stone-600 dark:text-stone-400 leading-snug">
                  Calculate official auto meter rates, compare with cabs, or audit an auto driver quote in seconds.
                </p>
                <button
                  onClick={() => setIsFareModalOpen(true)}
                  className="w-full py-1.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Open Fare & Scam Checker</span>
                </button>
              </div>

              {/* Street Slang Quick Pill (Indic Lexicon) */}
              <div className="bg-[#FAF8F5] dark:bg-[#0a0a0a] border border-[#E8E5DF] dark:border-[#1a1a1a] rounded-2xl p-2.5 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs px-0.5">
                  <span className="font-bold text-stone-800 dark:text-stone-200 text-[11px] flex items-center gap-1">
                    <span>🗣️</span>
                    <span>Slang of the Day</span>
                  </span>
                  <button
                    onClick={() => setIsVibeModalOpen(true)}
                    className="text-[10px] text-[#D9532F] hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>
                <div className="bg-white dark:bg-[#121212] p-2 rounded-xl border border-stone-200 dark:border-[#1a1a1a]">
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100">"Meter se chalo bhaiya"</div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-tight">
                    Say this when an auto quotes a random price. Legally obligates meter run in Delhi.
                  </div>
                </div>
              </div>

              {/* About NearGo Card */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-[#E8E5DF] dark:border-[#1a1a1a] rounded-2xl p-2.5 shadow-2xs text-[10px] space-y-1">
                <div className="font-bold text-stone-900 dark:text-stone-100">About NearGo</div>
                <p className="text-stone-500 dark:text-stone-400 text-[10px] leading-relaxed">
                  Connects travelers with verified local residents, pinned spots on interactive maps, and municipal transit tariff intelligence.
                </p>
                <div className="pt-1.5 border-t border-stone-100 dark:border-[#1a1a1a] flex items-center justify-between text-[9px] text-stone-400 dark:text-stone-500">
                  <span>Delhi • Mumbai • Bengaluru</span>
                  <span>© 2026 NearGo</span>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          /* Full Screen Spatial Map View */
          <div className="h-full w-full py-4 flex flex-col space-y-3 overflow-hidden">
            <div className="flex items-center justify-between bg-white dark:bg-[#0a0a0a] p-3 rounded-2xl border border-[#E8E5DF] dark:border-[#1a1a1a] shadow-xs">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#D9532F]" />
                  <span>Interactive Map & Pinned Recommendations</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Click on any question (❓) or secret spot pin (💎) to read advice, notes, and fair prices
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={navigateToAsk}
                  className="px-3.5 py-1.5 rounded-full bg-[#D9532F] hover:bg-[#C2411E] text-white font-bold text-xs shadow-xs"
                >
                  Pin a Question
                </button>
              </div>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-[#E8E5DF] dark:border-[#1a1a1a] shadow-md">
              <MapContainer
                questions={questions}
                onSelectQuestion={(q) => navigateToPost(q)}
                highlightedPin={highlightedPin}
                selectedCity={selectedCity}
              />
            </div>
          </div>
        )}
      </div>
      )}

      {/* Utility Modals */}

      {isFareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="my-auto w-full max-w-4xl">
            <FairPriceEngine
              onClose={() => setIsFareModalOpen(false)}
              defaultCity={selectedCity === 'Mumbai' ? 'mumbai' : selectedCity === 'Bengaluru' ? 'bengaluru' : 'delhi'}
            />
          </div>
        </div>
      )}

      {isVibeModalOpen && (
        <VibeEngineModal
          onClose={() => setIsVibeModalOpen(false)}
          onHighlightOnMap={handleHighlightOnMap}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Neo4j Knowledge Graph Modal */}
      <Neo4jGraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        defaultCity={selectedCity}
      />

      {/* Merchant Partner Claim Modal (B2B SaaS) */}
      <MerchantPartnerModal
        isOpen={isMerchantModalOpen}
        onClose={() => setIsMerchantModalOpen(false)}
      />

      {/* Community Digital Flash Deals & Coupons */}
      <CouponRedeemModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        selectedCity={selectedCity}
      />

      {/* DMRC & Delhi Tourism Heritage Trails (B2G) */}
      <HeritageTrailsModal
        isOpen={isTrailsModalOpen}
        onClose={() => setIsTrailsModalOpen(false)}
      />

      {/* 📻 Desi Neighbourhood Walkie-Talkie Radio (GPS Audio Stories powered by Sarvam AI) */}
      <NeighbourhoodRadio
        selectedCity={selectedCity}
        onFlyToSpot={(spot) => {
          handleHighlightOnMap(spot);
        }}
      />
    </div>
  );
}
