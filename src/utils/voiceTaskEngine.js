/**
 * NearGo Intelligent Voice Task & Intent Execution Engine
 * Interprets user spoken commands and immediately interacts with the page:
 * - Opening modals (Fair Price, Ask Question, Deals, Vibe, Trails, Merchant)
 * - Tab switching (Interactive Map, Feed Discussions)
 * - Highlighting nearest metro stations and landmarks on the map
 * - Switching active cities (Delhi, Mumbai, Bengaluru)
 * - Toggling themes (Dark / Light mode)
 * - Executing filtered local search with spoken Bulbul audio feedback
 */

import { playSarvamSpeech } from './sarvamAudio.js';
import { NCR_METRO_STATIONS } from '../data/metroData.js';
import { POPULAR_LANDMARKS } from '../data/tariffs.js';

/**
 * Execute task based on voice transcript
 */
export async function executeVoiceTask({
  transcript,
  searchQuery,
  setSearchQuery,
  selectedCity = 'Delhi NCR',
  setSelectedCity,
  activeTab,
  setActiveTab,
  onOpenAskModal,
  onOpenFareModal,
  onOpenVibeModal,
  onOpenCouponModal,
  onOpenMerchantModal,
  onOpenTrailsModal,
  darkMode,
  setDarkMode,
  onRequestLocation,
  onHighlightOnMap,
  questions = [],
  onShowToast,
}) {
  if (!transcript || !transcript.trim()) return null;
  const raw = transcript.trim();
  const lower = raw.toLowerCase();

  let executedTask = null;
  let feedbackSpoken = '';
  let toastMessage = '';

  // 1. FARE / TARIFF CALCULATION INTENT
  // "Check fare", "auto fare", "how much is auto", "meter fare", "calculate fare", "kiraya kitna hai"
  if (
    lower.includes('fare') ||
    lower.includes('kiraya') ||
    lower.includes('meter') ||
    lower.includes('price gouge') ||
    lower.includes('scam audit') ||
    lower.includes('how much is auto') ||
    lower.includes('auto price') ||
    lower.includes('cab price') ||
    lower.includes('fair price') ||
    lower.includes('taxi fare')
  ) {
    if (onOpenFareModal) {
      onOpenFareModal();
      executedTask = 'OPEN_FARE_MODAL';
      toastMessage = '⚡ Voice Task: Opening Municipal Fair Price Engine';
      feedbackSpoken = 'Opening Municipal Fair Price Engine to calculate legal meter and cab fares.';
    }
  }

  // 2. METRO STATION / SPATIAL FINDER INTENT
  // "Find the nearest metro station", "search metro", "nearest metro", "metro station", "rajiv chowk metro"
  else if (
    lower.includes('metro') ||
    lower.includes('subway') ||
    (lower.includes('nearest') && lower.includes('station')) ||
    lower.includes('metro station') ||
    lower.includes('yellow line') ||
    lower.includes('blue line') ||
    lower.includes('violet line')
  ) {
    // Check if a specific metro station name was mentioned
    let targetStation = null;

    for (const stn of NCR_METRO_STATIONS) {
      const cleanStnName = stn.name.toLowerCase();
      const firstWord = cleanStnName.split(' ')[0];
      if (lower.includes(cleanStnName) || (firstWord.length > 3 && lower.includes(firstWord))) {
        targetStation = stn;
        break;
      }
    }

    // Default to central interchange hub if no specific station named
    if (!targetStation) {
      targetStation = NCR_METRO_STATIONS.find((s) => s.name.toLowerCase().includes('rajiv chowk')) || NCR_METRO_STATIONS[0];
    }

    if (setSearchQuery) {
      setSearchQuery('metro station');
    }

    if (onHighlightOnMap && targetStation) {
      onHighlightOnMap({
        id: targetStation.id,
        name: `🚇 ${targetStation.name} (${targetStation.network})`,
        lat: targetStation.lat,
        lng: targetStation.lng,
        area: targetStation.zone || 'Metro Corridor',
        isMetro: true,
      });
      executedTask = 'HIGHLIGHT_METRO';
      toastMessage = `⚡ Voice Task: Found ${targetStation.name} Metro. Highlighting on map.`;
      feedbackSpoken = `Found nearest metro station: ${targetStation.name}. Highlighting on map.`;
    } else if (setActiveTab) {
      setActiveTab('map');
      executedTask = 'SEARCH_METRO';
      toastMessage = '⚡ Voice Task: Finding nearest metro stations';
      feedbackSpoken = `Locating nearest metro stations in ${selectedCity}.`;
    }
  }

  // 3. ASK QUESTION INTENT
  // "Ask a question", "post question", "ask community", "sawal poocho"
  else if (
    lower.includes('ask a question') ||
    lower.includes('ask question') ||
    lower.includes('post question') ||
    lower.includes('ask local') ||
    lower.includes('ask community') ||
    lower.includes('i want to ask') ||
    lower.includes('sawal poocho')
  ) {
    if (onOpenAskModal) {
      onOpenAskModal();
      executedTask = 'OPEN_ASK_MODAL';
      toastMessage = '⚡ Voice Task: Opening Ask Local Community page';
      feedbackSpoken = 'Opening Ask Local Community page to post your question.';
    }
  }

  // 4. DEALS & PERKS INTENT
  // "Show deals", "coupons", "free chai", "offers", "discounts", "flash deals"
  else if (
    lower.includes('deal') ||
    lower.includes('coupon') ||
    lower.includes('free chai') ||
    lower.includes('offer') ||
    lower.includes('perk') ||
    lower.includes('discount')
  ) {
    if (onOpenCouponModal) {
      onOpenCouponModal();
      executedTask = 'OPEN_COUPON_MODAL';
      toastMessage = '⚡ Voice Task: Opening Community Flash Deals';
      feedbackSpoken = 'Opening Community Flash Deals and Free Chai Perks.';
    }
  }

  // 5. VIBE ENGINE INTENT
  // "Vibe check", "explore vibes", "night vibes", "cozy cafes"
  else if (
    lower.includes('vibe') ||
    lower.includes('vibes') ||
    lower.includes('mood') ||
    lower.includes('night life') ||
    lower.includes('cozy cafe')
  ) {
    if (onOpenVibeModal) {
      onOpenVibeModal();
      executedTask = 'OPEN_VIBE_MODAL';
      toastMessage = '⚡ Voice Task: Opening Hyper-Local Vibe Explorer';
      feedbackSpoken = 'Opening Hyper-Local Vibe Explorer.';
    }
  }

  // 6. HERITAGE TRAILS INTENT
  // "Heritage trails", "walking tour", "monument trail", "historical trail"
  else if (
    lower.includes('heritage') ||
    lower.includes('trail') ||
    lower.includes('monument') ||
    lower.includes('walking tour') ||
    lower.includes('historical')
  ) {
    if (onOpenTrailsModal) {
      onOpenTrailsModal();
      executedTask = 'OPEN_TRAILS_MODAL';
      toastMessage = '⚡ Voice Task: Opening DMRC Heritage Trails';
      feedbackSpoken = 'Opening DMRC Heritage Trails and Walking Corridors.';
    }
  }

  // 7. MERCHANT GUILD INTENT
  // "Merchant guild", "local business", "partner store", "local guild"
  else if (
    lower.includes('guild') ||
    lower.includes('merchant') ||
    lower.includes('partner store') ||
    lower.includes('cred shop')
  ) {
    if (onOpenMerchantModal) {
      onOpenMerchantModal();
      executedTask = 'OPEN_MERCHANT_MODAL';
      toastMessage = '⚡ Voice Task: Opening Local Merchant Guild';
      feedbackSpoken = 'Opening Verified Local Merchant Guild.';
    }
  }

  // 8. VIEW SWITCHING INTENT
  // "Show map", "open map", "go to map", "interactive map"
  else if (
    lower.includes('show map') ||
    lower.includes('open map') ||
    lower.includes('go to map') ||
    lower.includes('view map') ||
    lower.includes('map view')
  ) {
    if (setActiveTab) {
      setActiveTab('map');
      executedTask = 'SWITCH_TO_MAP';
      toastMessage = '⚡ Voice Task: Switched to Interactive Map';
      feedbackSpoken = 'Switching to interactive city map.';
    }
  }
  // "Show feed", "go to feed", "discussions", "show questions", "home"
  else if (
    lower.includes('show feed') ||
    lower.includes('go to feed') ||
    lower.includes('discussion') ||
    lower.includes('community feed') ||
    lower.includes('show questions') ||
    lower.includes('home page')
  ) {
    if (setActiveTab) {
      setActiveTab('feed');
      executedTask = 'SWITCH_TO_FEED';
      toastMessage = '⚡ Voice Task: Switched to Community Discussions';
      feedbackSpoken = 'Opening community discussions feed.';
    }
  }

  // 9. CITY SWITCHING INTENT
  // "Switch to Mumbai", "Go to Mumbai"
  else if (lower.includes('mumbai') || lower.includes('bombay')) {
    if (setSelectedCity) {
      setSelectedCity('Mumbai');
      executedTask = 'SWITCH_CITY_MUMBAI';
      toastMessage = '⚡ Voice Task: Switched City to Mumbai';
      feedbackSpoken = 'Switched active city to Mumbai.';
    }
  }
  // "Switch to Bengaluru", "Go to Bangalore"
  else if (lower.includes('bengaluru') || lower.includes('bangalore')) {
    if (setSelectedCity) {
      setSelectedCity('Bengaluru');
      executedTask = 'SWITCH_CITY_BENGALURU';
      toastMessage = '⚡ Voice Task: Switched City to Bengaluru';
      feedbackSpoken = 'Switched active city to Bengaluru.';
    }
  }
  // "Switch to Delhi", "Delhi NCR"
  else if (lower.includes('delhi') || lower.includes('gurugram') || lower.includes('noida')) {
    if (setSelectedCity) {
      setSelectedCity('Delhi NCR');
      executedTask = 'SWITCH_CITY_DELHI';
      toastMessage = '⚡ Voice Task: Switched City to Delhi NCR';
      feedbackSpoken = 'Switched active city to Delhi NCR.';
    }
  }

  // 10. THEME / DARK MODE INTENT
  // "Turn on dark mode", "dark theme"
  else if (lower.includes('dark mode') || lower.includes('dark theme') || lower.includes('night mode')) {
    if (setDarkMode) {
      setDarkMode(true);
      executedTask = 'SET_DARK_MODE';
      toastMessage = '⚡ Voice Task: Dark Mode Enabled';
      feedbackSpoken = 'Dark mode enabled.';
    }
  }
  // "Light mode", "light theme", "day mode"
  else if (lower.includes('light mode') || lower.includes('light theme') || lower.includes('day mode')) {
    if (setDarkMode) {
      setDarkMode(false);
      executedTask = 'SET_LIGHT_MODE';
      toastMessage = '⚡ Voice Task: Light Mode Enabled';
      feedbackSpoken = 'Light mode enabled.';
    }
  }

  // 11. LOCATION DETECTION INTENT
  // "Detect location", "where am i", "current location"
  else if (lower.includes('detect location') || lower.includes('where am i') || lower.includes('my location')) {
    if (onRequestLocation) {
      onRequestLocation();
      executedTask = 'DETECT_LOCATION';
      toastMessage = '⚡ Voice Task: Auto-Detecting Nearest Location';
      feedbackSpoken = 'Auto-detecting your nearest city location.';
    }
  }

  // 12. CLEAR SEARCH INTENT
  else if (lower.includes('clear search') || lower.includes('reset search')) {
    if (setSearchQuery) {
      setSearchQuery('');
      executedTask = 'CLEAR_SEARCH';
      toastMessage = '⚡ Voice Task: Search Filter Cleared';
      feedbackSpoken = 'Search cleared.';
    }
  }

  // 13. GENERAL SPOT / FOOD / QUESTION SEARCH FALLBACK
  else {
    // Clean search phrase
    const cleanSearch = lower
      .replace(/^(find|search|show me|search for|tell me about|where is|how to get to|kahan milega|kahan hai)\s+/gi, '')
      .trim();

    if (setSearchQuery && cleanSearch) {
      setSearchQuery(cleanSearch);
      if (setActiveTab) setActiveTab('feed');
      executedTask = 'EXECUTE_SEARCH';
      toastMessage = `⚡ Voice Task: Searching for "${cleanSearch}"`;
      feedbackSpoken = `Searching community advice for ${cleanSearch} in ${selectedCity}.`;
    }
  }

  // Trigger Visual Toast if callback provided
  if (onShowToast && toastMessage) {
    onShowToast(toastMessage);
  }

  // Speak Bulbul Voice Feedback
  if (feedbackSpoken) {
    try {
      await playSarvamSpeech({
        text: feedbackSpoken,
        languageCode: 'en-IN',
        speaker: 'meera',
      });
    } catch (e) {
      console.warn('[Voice Task Spoken Audio Notice]:', e);
    }
  }

  return { executedTask, toastMessage, feedbackSpoken };
}

