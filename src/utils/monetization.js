// NearGo Monetization, Affiliate Deep-Links & B2B Partnership Engine
// Powers:
// 1. Ride-Hailing Affiliate Handoff (Uber, Rapido, Ola, inDrive)
// 2. Stay & Heritage Tour Affiliate Widgets (Booking.com, Agoda, Klook, Viator)
// 3. Hyper-Local Merchant B2B SaaS (Verified Partner Claims & Digital Coupons)
// 4. B2G Public Transit & Tourism Board Partnerships (DMRC & State Tourism)

/**
 * Generate 1-Click Ride-Hailing Deep Links with Pre-Filled Destination Coordinates
 * Uses official universal URL schemes and web intents with affiliate attribution tags.
 */
export function generateRideDeepLinks({
  origin = 'Current Location',
  destination = 'Target Destination',
  destLat = 28.6562,
  destLng = 77.2309,
  estimatedFare = null,
}) {
  const encDest = encodeURIComponent(destination);
  const encOrig = encodeURIComponent(origin);
  const refCode = 'neargo_transit_deal';

  return {
    uber: {
      name: 'Uber',
      badge: 'UberGo / Auto',
      color: 'bg-black text-white hover:bg-stone-800',
      icon: '🚗',
      commission: '₹20 - ₹25 per booking',
      // Universal Uber rider web & native app intent with dropoff lat/lng & address
      url: `https://m.uber.com/ul/?action=setPickup&client_id=${refCode}&pickup=my_location&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}&dropoff[formatted_address]=${encDest}`,
    },
    rapido: {
      name: 'Rapido',
      badge: 'Auto & Bike',
      color: 'bg-[#FFDE00] text-black hover:bg-[#ebd000]',
      icon: '🛺',
      commission: '₹12 - ₹18 per ride install',
      // Rapido universal onelink / web search fallback
      url: `https://rapido.onelink.me/5vjY?pid=neargo_app&c=fair_fare_handoff&af_dp=rapido%3A%2F%2Fride%3Fdrop_lat%3D${destLat}%26drop_lng%3D${destLng}%26drop_name%3D${encDest}&af_web_dp=https%3A%2F%2Fwww.rapido.bike%2F`,
    },
    ola: {
      name: 'Ola Cabs',
      badge: 'Mini / Auto',
      color: 'bg-[#98D809] text-stone-900 hover:bg-[#86be07]',
      icon: '🟢',
      commission: '₹15 - ₹20 per booking',
      // Ola web booking intent with pre-filled destination query
      url: `https://book.olacabs.com/?serviceType=p2p&drop_lat=${destLat}&drop_lng=${destLng}&drop_name=${encDest}&utm_source=${refCode}`,
    },
  };
}

/**
 * Generate Stay & Heritage Walk Affiliate Links
 * Connects backpackers & travelers with verified budget hostels and cultural tours.
 */
export function generateStayAndTourLinks({
  locationName = 'Delhi',
  city = 'Delhi NCR',
  category = 'places',
}) {
  const encQuery = encodeURIComponent(`${locationName} ${city}`);
  const encCity = encodeURIComponent(city);
  const affiliateId = 'neargo_partner_2026';

  return {
    booking: {
      name: 'Booking.com',
      label: 'Find Hostels & Boutique Stays',
      badge: '8% - 15% Affiliate Commission',
      icon: '🏨',
      color: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50',
      url: `https://www.booking.com/searchresults.html?ss=${encQuery}&aid=${affiliateId}&label=neargo_stays`,
    },
    agoda: {
      name: 'Agoda',
      label: 'Verified Backpacker Dorms',
      badge: 'Special Student Rates',
      icon: '🛏️',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50',
      url: `https://www.agoda.com/search?text=${encQuery}&cid=${affiliateId}`,
    },
    viator: {
      name: 'Viator / Klook',
      label: 'Book Guided Heritage & Street Food Walk',
      badge: '10% Tour Commission',
      icon: '🎟️',
      color: 'text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50',
      url: `https://www.klook.com/en-IN/search/result/?query=${encCity}%20heritage%20food%20walk&aff_id=${affiliateId}`,
    },
  };
}

/**
 * Verified Community Partner Flash Deals & Digital Coupons
 * Local cafes & street food gems offering exclusive perks to NearGo community members.
 */
export const COMMUNITY_PARTNER_DEALS = [
  {
    id: 'deal-moolchand-chai',
    merchantName: 'Moolchand Paratha Heritage',
    city: 'Delhi NCR',
    area: 'Moolchand Metro Flyover',
    lat: 28.5653,
    lng: 77.2341,
    badge: '⭐ Verified Community Partner',
    perk: 'Complimentary Hot Masala Chai with any Paratha',
    couponCode: 'NEARGO-CHAI-100',
    validUntil: 'Dec 31, 2026',
    discountValue: '₹35 Value',
    terms: 'Show this digital voucher on NearGo to the counter chef before billing.',
    claimedCount: 428,
  },
  {
    id: 'deal-ama-cafe-mkt',
    merchantName: 'AMA Cafe (Majnu Ka Tilla)',
    city: 'Delhi NCR',
    area: 'Tibetan Settlement, New Aruna Nagar',
    lat: 28.7018,
    lng: 77.2279,
    badge: '⭐ Verified Community Partner',
    perk: '10% Off on Artisanal Himalayan Pour-Over & Pastries',
    couponCode: 'NEARGO-MKT-AMA',
    validUntil: 'Dec 31, 2026',
    discountValue: '10% Off',
    terms: 'Valid on dine-in orders between 11 AM and 6 PM on weekdays.',
    claimedCount: 890,
  },
  {
    id: 'deal-raju-sandwich-mumbai',
    merchantName: 'Raju Sandwich & Cutting Tea (Churchgate)',
    city: 'Mumbai',
    area: 'Opp. KC College, Churchgate',
    lat: 18.9328,
    lng: 72.8279,
    badge: '⭐ Verified Community Partner',
    perk: 'Free Double Cheese Upgrade on Mumbai Panini Grill',
    couponCode: 'NEARGO-MUM-RAJU',
    validUntil: 'Dec 31, 2026',
    discountValue: '₹30 Value',
    terms: 'Valid on student or community badge presentation at counter.',
    claimedCount: 612,
  },
  {
    id: 'deal-toit-indiranagar',
    merchantName: 'Toit Brewpub Indiranagar',
    city: 'Bengaluru',
    area: '100ft Road, Indiranagar',
    lat: 12.9792,
    lng: 77.6408,
    badge: '⭐ Verified Community Partner',
    perk: 'Complimentary Taster Flight (4 Signature Brews) with Food Order',
    couponCode: 'NEARGO-BLR-TOIT',
    validUntil: 'Dec 31, 2026',
    discountValue: '₹180 Value',
    terms: 'Valid for groups of 2+ on weekday lunch hours (12 PM - 5 PM).',
    claimedCount: 534,
  },
  {
    id: 'deal-veena-stores-malleswaram',
    merchantName: 'Veena Stores Malleswaram',
    city: 'Bengaluru',
    area: 'Margosa Road, 15th Cross',
    lat: 12.9982,
    lng: 77.5715,
    badge: '⭐ Verified Community Partner',
    perk: 'Complimentary Second Cup of Degree Filter Coffee',
    couponCode: 'NEARGO-BLR-VEENA',
    validUntil: 'Dec 31, 2026',
    discountValue: '₹20 Value',
    terms: 'Valid with any order of 2 plates Idli-Vada before 10 AM.',
    claimedCount: 715,
  },
];

/**
 * Official B2G Government & Public Transit Collaboration Trails
 * Prepared for DMRC & Delhi Tourism Board Partnerships
 */
export const OFFICIAL_HERITAGE_TRAILS = [
  {
    id: 'trail-mughal-corridor',
    title: 'Imperial Mughal Heritage Corridor',
    agency: 'DMRC & Delhi Tourism Official Transit Trail',
    badge: 'DMRC Verified Cultural Corridor',
    metroLine: 'Yellow & Violet Line Interchange',
    keyStations: ['Chandni Chowk', 'Chawri Bazar', 'Lal Quila', 'Jama Masjid'],
    distanceKm: 4.2,
    walkingTimeMin: 45,
    highlights: ['Red Fort (Lal Quila)', 'Fatehpuri Mosque', 'Khari Baoli Spice Market', 'Paranthe Wali Gali'],
    publicTransitAdvice: 'Deboard at Lal Quila Metro Station Gate 1. Zero auto scam risk: 100% pedestrian-friendly pedestrianised heritage boulevard.',
    ticketPortal: 'https://asi.payumoney.com/',
  },
  {
    id: 'trail-sufi-garden-circuit',
    title: 'Sufi & UNESCO Garden Heritage Trail',
    agency: 'Delhi Tourism & INTACH Collaborative Circuit',
    badge: 'UNESCO Heritage Transit Walk',
    metroLine: 'Violet Line (JLN Stadium / Jangpura)',
    keyStations: ['JLN Stadium', 'Jangpura', 'Khan Market'],
    distanceKm: 3.8,
    walkingTimeMin: 40,
    highlights: ["Humayun's Tomb", 'Sunder Nursery Ecological Park', 'Nizamuddin Dargah Qawwali Courtyard'],
    publicTransitAdvice: 'Take Violet Line to JLN Stadium Gate 2. Shared electric feeder bus connects to Sunder Nursery for ₹10.',
    ticketPortal: 'https://asi.payumoney.com/',
  },
  {
    id: 'trail-colonial-central-vista',
    title: 'Imperial Rajpath & Museum Transit Circuit',
    agency: 'DMRC Heritage Commuter Guide',
    badge: 'DMRC Clean & Green Transit Loop',
    metroLine: 'Yellow Line (Central Secretariat / Udyog Bhawan)',
    keyStations: ['Central Secretariat', 'Udyog Bhawan', 'Janpath'],
    distanceKm: 3.5,
    walkingTimeMin: 35,
    highlights: ['National Museum', 'Kartavya Path', 'India Gate War Memorial', 'National Gallery of Modern Art (NGMA)'],
    publicTransitAdvice: 'Central Secretariat Gate 3 opens right onto the museum corridor with dedicated cycling and electric buggy paths.',
    ticketPortal: 'https://nationalmuseumindia.gov.in/',
  },
];

/**
 * B2B SaaS Merchant Pricing Tiers
 * For Local Vendors, Indie Cafes & Heritage Stalls to claim listings and sponsor pins.
 */
export const MERCHANT_SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'Verified Local Partner',
    pricePerMonth: 499,
    priceFormatted: '₹499/mo',
    target: 'Small street food kiosks, chai bars, and indie bakeries',
    features: [
      '⭐ Golden "Verified Community Partner" Badge on Map & Feed',
      'Publish Official Operating Hours & Real-Time Specials',
      'Upload Digital Menu (PDF / Image link)',
      'Verified Merchant Response badge in community threads',
      'Basic Footfall & Profile View Analytics',
    ],
    recommended: false,
    cta: 'Claim Listing for ₹499',
  },
  {
    id: 'pro-growth',
    name: 'Promoted Gem & Flash Deals',
    pricePerMonth: 999,
    priceFormatted: '₹999/mo',
    target: 'Boutique cafes, heritage restaurants & curated craft breweries',
    features: [
      'Everything in Starter Plan',
      '📍 Glowing Promoted Star Marker on NearGo Interactive Map',
      '🎁 Publish 1 Exclusive NearGo Digital Flash Deal / Coupon Code',
      'Top-3 placement in City Gem Recommendations & Vibe search',
      'Pay-per-redemption commission tracker (₹20/redeemed customer)',
      'Direct WhatsApp booking & inquiry integration button',
    ],
    recommended: true,
    cta: 'Get Promoted Pin & Deals for ₹999',
  },
];
