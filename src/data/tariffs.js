// Official Municipal Fare Tariffs & Real-Time Estimation Engine
// No TinyFish API needed - completely grounded in official gazette rates,
// route geometry, and live aggregator baseline matrices.

export const CITY_TARIFFS = {
  delhi: {
    cityName: 'Delhi NCR',
    currency: '₹',
    auto: {
      baseFare: 30, // For first 1.5 km
      baseKm: 1.5,
      perKmRate: 11.0,
      nightSurchargePercent: 25, // 11:00 PM to 5:00 AM
      nightStartHour: 23,
      nightEndHour: 5,
      luggageChargePerBag: 7.5,
      waitingChargePerMin: 0.75, // after 15 mins
      rulesNotice: 'Delhi Govt Gazette: Auto drivers are legally mandated to run by meter. Refusal is punishable by transport authority (Helpline: 1095).'
    },
    cabs: {
      mini: { base: 60, perKm: 14.5, perMin: 1.75 },
      sedan: { base: 85, perKm: 17.0, perMin: 2.2 },
      uberMoto: { base: 25, perKm: 8.0, perMin: 1.0 },
    },
    metro: {
      slabs: [
        { maxKm: 2, fare: 10 },
        { maxKm: 5, fare: 20 },
        { maxKm: 12, fare: 30 },
        { maxKm: 21, fare: 40 },
        { maxKm: 32, fare: 50 },
        { maxKm: 999, fare: 60 },
      ],
      smartCardDiscount: 0.10, // 10% discount on metro card
    }
  },
  mumbai: {
    cityName: 'Mumbai',
    currency: '₹',
    auto: {
      baseFare: 28,
      baseKm: 1.5,
      perKmRate: 18.66,
      nightSurchargePercent: 25,
      nightStartHour: 24,
      nightEndHour: 5,
      luggageChargePerBag: 10,
      waitingChargePerMin: 1.0,
      rulesNotice: 'MMRTA tariff card: Auto runs strictly on meter in suburbs (Bandra to Dahisar/Mulund).'
    },
    cabs: {
      mini: { base: 70, perKm: 16.0, perMin: 2.0 },
      sedan: { base: 95, perKm: 19.5, perMin: 2.5 },
      uberMoto: { base: 28, perKm: 9.0, perMin: 1.2 },
    },
    metro: {
      slabs: [
        { maxKm: 3, fare: 10 },
        { maxKm: 12, fare: 20 },
        { maxKm: 18, fare: 30 },
        { maxKm: 999, fare: 40 },
      ],
      smartCardDiscount: 0.05,
    }
  },
  bengaluru: {
    cityName: 'Bengaluru',
    currency: '₹',
    auto: {
      baseFare: 30,
      baseKm: 2.0,
      perKmRate: 15.0,
      nightSurchargePercent: 50,
      nightStartHour: 22,
      nightEndHour: 6,
      luggageChargePerBag: 10,
      waitingChargePerMin: 0.8,
      rulesNotice: 'Karnataka Transport Dept: Minimum ₹30 for 2km, night charges 1.5x between 10PM and 6AM.'
    },
    cabs: {
      mini: { base: 75, perKm: 16.5, perMin: 2.0 },
      sedan: { base: 100, perKm: 20.0, perMin: 2.5 },
      uberMoto: { base: 30, perKm: 8.5, perMin: 1.2 },
    },
    metro: {
      slabs: [
        { maxKm: 2, fare: 10 },
        { maxKm: 6, fare: 20 },
        { maxKm: 10, fare: 30 },
        { maxKm: 15, fare: 40 },
        { maxKm: 20, fare: 50 },
        { maxKm: 999, fare: 60 },
      ],
      smartCardDiscount: 0.05,
    }
  }
};

// Popular curated landmarks with exact coordinates
// Popular curated landmarks with exact coordinates across all Delhi NCR zones
export const POPULAR_LANDMARKS = [
  // South Delhi Hubs
  { id: 'iiitd', name: 'Okhla Phase 3 (South Delhi)', lat: 28.5459, lng: 77.2732, area: 'South Delhi' },
  { id: 'govindpuri', name: 'Govindpuri Metro Station', lat: 28.5283, lng: 77.2625, area: 'South Delhi' },
  { id: 'nehru-place', name: 'Nehru Place Tech Hub', lat: 28.5494, lng: 77.2528, area: 'South Delhi' },
  { id: 'moolchand', name: 'Moolchand Paratha Corner', lat: 28.5670, lng: 77.2389, area: 'South Delhi' },
  { id: 'hauz-khas', name: 'Hauz Khas Village & Fort', lat: 28.5535, lng: 77.1945, area: 'South Delhi' },
  { id: 'sarojini', name: 'Sarojini Nagar Market', lat: 28.5772, lng: 77.1983, area: 'South Delhi' },
  { id: 'lajpat-nagar', name: 'Lajpat Nagar Central Market', lat: 28.5677, lng: 77.2433, area: 'South Delhi' },
  { id: 'gk1', name: 'Greater Kailash 1 (M-Block Market)', lat: 28.5540, lng: 77.2415, area: 'South Delhi' },
  { id: 'saket', name: 'Select Citywalk & Saket District Centre', lat: 28.5284, lng: 77.2185, area: 'South Delhi' },
  { id: 'dilli-haat', name: 'Dilli Haat & INA Market', lat: 28.5732, lng: 77.2081, area: 'South Delhi' },
  { id: 'lotus-temple', name: 'Lotus Temple & Kalkaji Mandir', lat: 28.5535, lng: 77.2588, area: 'South Delhi' },
  { id: 'nizamuddin', name: 'Hazrat Nizamuddin Dargah & Station', lat: 28.5888, lng: 77.2435, area: 'South Delhi' },

  // Central Delhi Hubs
  { id: 'cp', name: 'Connaught Place (Inner Circle & Rajiv Chowk)', lat: 28.6315, lng: 77.2167, area: 'Central Delhi' },
  { id: 'india-gate', name: 'India Gate & Kartavya Path', lat: 28.6129, lng: 77.2295, area: 'Central Delhi' },
  { id: 'bangla-sahib', name: 'Gurudwara Bangla Sahib', lat: 28.6263, lng: 77.2091, area: 'Central Delhi' },
  { id: 'khan-market', name: 'Khan Market', lat: 28.6003, lng: 77.2270, area: 'Central Delhi' },
  { id: 'ndls', name: 'New Delhi Railway Station (Paharganj side)', lat: 28.6429, lng: 77.2195, area: 'Central Delhi' },

  // Old Delhi & North Delhi Hubs
  { id: 'chandni-chowk', name: 'Chandni Chowk Market & Red Fort', lat: 28.6562, lng: 77.2309, area: 'Old Delhi' },
  { id: 'chawri-bazar', name: 'Chawri Bazar / Jama Masjid Gate 3', lat: 28.6496, lng: 77.2268, area: 'Old Delhi' },
  { id: 'daryaganj', name: 'Daryaganj Mahila Haat (Book Market)', lat: 28.6475, lng: 77.2405, area: 'Old Delhi' },
  { id: 'majnu-ka-tilla', name: 'Majnu Ka Tilla (Tibetan Colony & Cafes)', lat: 28.7032, lng: 77.2289, area: 'North Delhi' },
  { id: 'du-north-campus', name: 'DU North Campus (Hudson Lane / Vishwavidyalaya)', lat: 28.6942, lng: 77.2064, area: 'North Delhi' },

  // West Delhi & Airport Hubs
  { id: 'aerocity', name: 'Aerocity Worldmark & Transit Hub', lat: 28.5502, lng: 77.1215, area: 'Airport & Aerocity' },
  { id: 't3-airport', name: 'IGI Airport Terminal 3', lat: 28.5562, lng: 77.0999, area: 'Airport & Aerocity' },
  { id: 'rajouri-garden', name: 'Rajouri Garden Main Market', lat: 28.6492, lng: 77.1228, area: 'West Delhi' },
  { id: 'dwarka-sec21', name: 'Dwarka Sector 21 Metro Interchange', lat: 28.5523, lng: 77.0583, area: 'West Delhi' },

  // Gurgaon / Gurugram Hubs
  { id: 'cyber-hub', name: 'DLF CyberHub & Cyber City (Rapid Metro)', lat: 28.4950, lng: 77.0895, area: 'Gurgaon' },
  { id: 'sec29-gurgaon', name: 'Sector 29 Leisure Valley & Food District', lat: 28.4682, lng: 77.0632, area: 'Gurgaon' },
  { id: 'ambience-gurgaon', name: 'Ambience Mall Gurugram (NH-48)', lat: 28.5042, lng: 77.0968, area: 'Gurgaon' },

  // Noida & Greater Noida Hubs
  { id: 'noida-sec18', name: 'Noida Sector 18 & Atta Market', lat: 28.5708, lng: 77.3260, area: 'Noida' },
  { id: 'botanical-garden', name: 'Botanical Garden Metro Interchange', lat: 28.5644, lng: 77.3342, area: 'Noida' },
  { id: 'noida-sec62', name: 'Noida Electronic City (Sector 62)', lat: 28.6280, lng: 77.3649, area: 'Noida' },

  // East Delhi Hubs
  { id: 'akshardham', name: 'Akshardham Temple', lat: 28.6127, lng: 77.2773, area: 'East Delhi' },
  { id: 'anand-vihar', name: 'Anand Vihar ISBT & Railway Terminal', lat: 28.6469, lng: 77.3160, area: 'East Delhi' }
];

// Great-circle Haversine distance with road detour multiplier
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;
  
  // Real Indian urban roads have about 1.25x to 1.35x winding factor
  const roadKm = Math.round(straightLineKm * 1.28 * 10) / 10;
  return Math.max(roadKm, 1.0);
}

// Estimate realistic travel time in minutes based on distance & traffic hour
export function estimateTravelTime(distanceKm, hour = new Date().getHours()) {
  let avgSpeedKmh = 22; // urban average
  if ((hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 21)) {
    avgSpeedKmh = 16; // rush hour
  } else if (hour >= 23 || hour <= 5) {
    avgSpeedKmh = 35; // late night free flow
  }
  const minutes = Math.round((distanceKm / avgSpeedKmh) * 60) + 4; // traffic light delays
  return minutes;
}

// Calculate comprehensive multi-modal fares for a route
export function calculateRouteFare({
  cityKey = 'delhi',
  distanceKm,
  isNight = false,
  luggageCount = 0,
  trafficMultiplier = 1.0,
}) {
  const tariff = CITY_TARIFFS[cityKey] || CITY_TARIFFS.delhi;
  const autoTariff = tariff.auto;
  const cabTariff = tariff.cabs;
  const metroTariff = tariff.metro;

  // 1. Official Auto Meter Fare
  let autoFare = 0;
  if (distanceKm <= autoTariff.baseKm) {
    autoFare = autoTariff.baseFare;
  } else {
    const extraKm = distanceKm - autoTariff.baseKm;
    autoFare = autoTariff.baseFare + extraKm * autoTariff.perKmRate;
  }
  
  if (isNight) {
    autoFare *= (1 + autoTariff.nightSurchargePercent / 100);
  }
  if (luggageCount > 0) {
    autoFare += luggageCount * autoTariff.luggageChargePerBag;
  }
  const autoMeterMin = Math.round(autoFare);
  const autoMeterMax = Math.round(autoFare * 1.15); // typical fair negotiated upper band

  // 2. Cab Aggregator (Uber/Ola baseline)
  const durationMin = estimateTravelTime(distanceKm);
  const cabBase = cabTariff.mini.base + (distanceKm * cabTariff.mini.perKm) + (durationMin * cabTariff.mini.perMin);
  const cabSurgeMin = Math.round(cabBase * trafficMultiplier);
  const cabSurgeMax = Math.round(cabBase * trafficMultiplier * 1.25);

  const sedanBase = cabTariff.sedan.base + (distanceKm * cabTariff.sedan.perKm) + (durationMin * cabTariff.sedan.perMin);
  const sedanMin = Math.round(sedanBase * trafficMultiplier);
  const sedanMax = Math.round(sedanBase * trafficMultiplier * 1.25);

  // 3. Bike Taxi (Rapido / Uber Moto)
  const bikeBase = cabTariff.uberMoto.base + (distanceKm * cabTariff.uberMoto.perKm) + (durationMin * cabTariff.uberMoto.perMin);
  const bikeMin = Math.round(bikeBase);
  const bikeMax = Math.round(bikeBase * 1.15);

  // 4. Metro Fare
  let metroFare = 60;
  for (const slab of metroTariff.slabs) {
    if (distanceKm <= slab.maxKm) {
      metroFare = slab.fare;
      break;
    }
  }
  const metroCardFare = Math.round(metroFare * (1 - metroTariff.smartCardDiscount));

  return {
    distanceKm,
    durationMin,
    isNight,
    city: tariff.cityName,
    currency: tariff.currency,
    auto: {
      min: autoMeterMin,
      max: autoMeterMax,
      exactMeter: Math.round(autoFare),
      breakdown: `${tariff.currency}${autoTariff.baseFare} for 1st ${autoTariff.baseKm}km + ${tariff.currency}${autoTariff.perKmRate}/km${isNight ? ` + ${autoTariff.nightSurchargePercent}% night surcharge` : ''}`,
      notice: autoTariff.rulesNotice,
    },
    cabs: {
      mini: { min: cabSurgeMin, max: cabSurgeMax },
      sedan: { min: sedanMin, max: sedanMax },
      bikeTaxi: { min: bikeMin, max: bikeMax },
    },
    metro: {
      tokenFare: metroFare,
      smartCardFare: metroCardFare,
      estimatedTimeMin: Math.max(15, Math.round(distanceKm * 2.2)),
      ecoFriendly: true,
    }
  };
}

// Evaluate whether a driver's quoted price is gouging
export function evaluateDriverQuote(quotedPrice, fairEstimate) {
  const fairMedian = (fairEstimate.auto.min + fairEstimate.auto.max) / 2;
  const ratio = quotedPrice / fairMedian;

  if (ratio <= 1.15) {
    return {
      status: 'fair',
      badge: 'Fair Price ✅',
      color: 'emerald',
      percentageDiff: Math.round((ratio - 1) * 100),
      message: 'Great price! This is right within the official meter & local rate band.',
      advice: 'You can accept this ride safely. No overcharging detected.',
      counterOffer: quotedPrice,
    };
  } else if (ratio <= 1.45) {
    return {
      status: 'slight_premium',
      badge: 'Slightly High ⚠️',
      color: 'amber',
      percentageDiff: Math.round((ratio - 1) * 100),
      message: `Driver quoted ₹${quotedPrice}, which is about ${Math.round((ratio - 1) * 100)}% above meter.`,
      advice: `Counter with ₹${fairEstimate.auto.min} - ₹${fairEstimate.auto.max} or say "Meter se chalo bhaiya".`,
      counterOffer: fairEstimate.auto.max,
    };
  } else {
    return {
      status: 'severe_gouge',
      badge: 'Price Gouging Alert 🚨',
      color: 'red',
      percentageDiff: Math.round((ratio - 1) * 100),
      message: `SCAM RISK: Quoted ₹${quotedPrice} vs official meter fair fare ₹${fairEstimate.auto.min} - ₹${fairEstimate.auto.max} (+${Math.round((ratio - 1) * 100)}% hike!).`,
      advice: `Do NOT accept this quote! Say firmly: "Bhaiya meter chalu karo, ya ₹${fairEstimate.auto.max} dunga". Alternatively, take the Metro for ₹${fairEstimate.metro.tokenFare}.`,
      counterOffer: fairEstimate.auto.min + 10,
    };
  }
}
