// Seed Data for NearGo - Real-World Hyper-Local City Guide
// Grounded in real local knowledge, exact GeoJSON coordinates, and fair price benchmarks

export const INITIAL_QUESTIONS = [
  {
    id: 'q-iiitd-chandni-chowk',
    community: 'c/DelhiTransit',
    communityName: 'Delhi Transit & Fares',
    title: 'What is the fair auto fare from Okhla / South Delhi to Chandni Chowk right now?',
    body: 'First time visiting Delhi and staying near South Delhi / Okhla. An auto driver right outside the gate is quoting ₹500 to drop me at Chandni Chowk. Is this normal or am I getting taken for a ride? What is the quickest and most authentic way to reach without being ripped off?',
    author: {
      name: 'Rohan Sharma',
      badge: 'First-time Traveler',
      badgeColor: 'amber',
      isVerified: false,
      reputation: 24,
    },
    city: 'Delhi NCR',
    locationName: 'Okhla Phase 3 (South Delhi)',
    lat: 28.5459,
    lng: 77.2732,
    category: 'transport',
    vibeCategory: 'student_budget',
    tags: ['#AutoFare', '#FairPriceCheck', '#SouthDelhi', '#OldDelhi'],
    createdAt: '18 minutes ago',
    upvotes: 42,
    userUpvoted: false,
    fareCheck: {
      origin: 'Okhla Phase 3 (South Delhi)',
      destination: 'Chandni Chowk (Old Delhi)',
      distanceKm: 18.6,
      durationMin: 52,
      officialAutoMeter: '₹218 - ₹245',
      cabEstimate: '₹310 - ₹370',
      metroRoute: 'Violet Line (Govindpuri) → Mandi House / Central Secretariat → Yellow Line to Chandni Chowk',
      metroFare: '₹40 (Token) / ₹36 (Smart Card)',
      metroDuration: '44 mins',
      scamWarning: '🚨 ₹500 is over +113% above legal meter rate! Do not pay more than ₹240 for auto, or walk 8 mins to Govindpuri metro station.'
    },
    answers: [
      {
        id: 'ans-1',
        author: {
          name: 'Aarav Malhotra',
          badge: 'Verified South Delhi Local',
          badgeColor: 'emerald',
          isVerified: true,
          reputation: 380,
        },
        body: '₹500 is a total ripoff! Do NOT pay that. Walk 8 minutes down to Govindpuri Metro Station (Violet Line). Board towards Kashmere Gate, interchange at Central Secretariat to the Yellow Line, and deboard at Chawri Bazar or Chandni Chowk. Costs ₹40, takes under 45 mins, and you skip the Ashram-ITO traffic jam.',
        pin: {
          lat: 28.5283,
          lng: 77.2625,
          name: 'Govindpuri Metro Station Gate 2',
          neighborhood: 'Kalkaji / Okhla',
          type: 'transit'
        },
        insiderTip: 'If taking an auto, tell him: "Bhaiya ₹220 me chalo ya meter chalao". If he refuses, 3 other autos near Harkesh Nagar will agree.',
        upvotes: 35,
        userUpvoted: false,
        createdAt: '12 minutes ago',
      },
      {
        id: 'ans-2',
        author: {
          name: 'Zoya Khan',
          badge: 'Old Delhi Food Curator',
          badgeColor: 'emerald',
          isVerified: true,
          reputation: 512,
        },
        body: 'Once you reach Chandni Chowk, get off at Chawri Bazar Gate 3 instead of main Chandni Chowk if you want street food. It puts you 200m from Ashok Chaat Corner and Matia Mahal. Pinned the exact corner!',
        pin: {
          lat: 28.6496,
          lng: 77.2268,
          name: 'Chawri Bazar Gate 3 (Street Food Alley)',
          neighborhood: 'Old Delhi',
          type: 'food'
        },
        insiderTip: 'Cycle rickshaws from metro to Jama Masjid should be ₹20-₹30 per head max. Never pay ₹100.',
        upvotes: 21,
        userUpvoted: false,
        createdAt: '6 minutes ago',
      }
    ]
  },
  {
    id: 'q-late-night-eats-south-delhi',
    community: 'c/StreetFood',
    communityName: 'Street Food & Midnight Chai',
    title: 'Safe late-night food spot open till 3 AM near South Delhi / Okhla?',
    body: 'Working late with colleagues on a project and starving at 1:30 AM. Need hearty, authentic budget food that isn’t just instant noodles. Where do locals actually eat at this hour?',
    author: {
      name: 'Priya Nambiar',
      badge: 'Backpacker',
      badgeColor: 'amber',
      isVerified: false,
      reputation: 15,
    },
    city: 'Delhi NCR',
    locationName: 'Nehru Place / Kalkaji',
    lat: 28.5494,
    lng: 77.2528,
    category: 'food',
    vibeCategory: 'late_night',
    tags: ['#LateNight', '#StreetFood', '#StudentBudget', '#Parathas'],
    createdAt: '1 hour ago',
    upvotes: 29,
    userUpvoted: false,
    fareCheck: {
      origin: 'Okhla Phase 3',
      destination: 'Moolchand Metro Flyover',
      distanceKm: 5.8,
      durationMin: 14,
      officialAutoMeter: '₹77 - ₹90 (incl. 25% night tariff)',
      cabEstimate: '₹140 - ₹175',
      metroRoute: 'Metro closed post 11:30 PM. Use Rapido / Auto / Quick Cab.',
      metroFare: 'N/A',
      metroDuration: 'N/A',
      scamWarning: 'Night auto tariff adds 25% to standard meter rate. ₹80-₹100 is fair.'
    },
    answers: [
      {
        id: 'ans-3',
        author: {
          name: 'Kabir Vats',
          badge: 'Night Owl & Local Guide',
          badgeColor: 'emerald',
          isVerified: true,
          reputation: 420,
        },
        body: 'Head straight to Moolchand Paratha under the flyover! Open till 4:30 AM. It’s an iconic South Delhi ritual. Get the Egg Bhurji Paratha or Butter Paneer Paratha with iced tea. Safe crowd, lots of doctors from AIIMS and college students.',
        pin: {
          lat: 28.5670,
          lng: 77.2389,
          name: 'Moolchand Paratha Corner',
          neighborhood: 'Lajpat Nagar / Moolchand',
          type: 'food'
        },
        insiderTip: 'Auto from Okhla takes 12 mins at night. Fair fare with night surcharge is ₹85. Do not pay ₹200.',
        upvotes: 27,
        userUpvoted: false,
        createdAt: '45 minutes ago',
      }
    ]
  },
  {
    id: 'q-majnu-ka-tilla-hidden-spots',
    community: 'c/SecretSpots',
    communityName: 'Secret Spots & Hidden Corners',
    title: 'Secret rooftop cafes or quiet lanes in Majnu Ka Tilla (Tibetan Colony)?',
    body: 'Visiting MKT tomorrow afternoon with friends. Want to avoid the massive crowds at AMA Cafe and find peaceful authentic Tibetan or Korean food with rooftop views.',
    author: {
      name: 'Aditya Sen',
      badge: 'City Explorer',
      badgeColor: 'amber',
      isVerified: false,
      reputation: 45,
    },
    city: 'Delhi NCR',
    locationName: 'Majnu Ka Tilla',
    lat: 28.7032,
    lng: 77.2289,
    category: 'hidden_gems',
    vibeCategory: 'aesthetic_chill',
    tags: ['#HiddenGems', '#TibetanColony', '#Momos', '#RooftopView'],
    createdAt: '3 hours ago',
    upvotes: 38,
    userUpvoted: false,
    fareCheck: null,
    answers: [
      {
        id: 'ans-4',
        author: {
          name: 'Tenzin Dolma',
          badge: 'MKT Resident (12 yrs)',
          badgeColor: 'emerald',
          isVerified: true,
          reputation: 670,
        },
        body: 'Skip AMA on weekends (2 hr waiting list!). Instead, walk deeper past the monastery to Tee Dee or Himalayan Restaurant. For views, head up to Kalsang Rooftop or Rigo Coffee. Also try the aunties selling cold spicy Laphing right in front of the central stupa for ₹60.',
        pin: {
          lat: 28.7035,
          lng: 77.2294,
          name: 'Tee Dee Restaurant & Monastery Square',
          neighborhood: 'Majnu Ka Tilla',
          type: 'hidden_gem'
        },
        insiderTip: 'From Vidhan Sabha Metro, shared e-rickshaws take ₹20 fixed. Solo autos will ask ₹100 — ignore them.',
        upvotes: 41,
        userUpvoted: false,
        createdAt: '2 hours ago',
      }
    ]
  },
  {
    id: 'q-sarojini-nagar-bargaining',
    community: 'c/BargainBazaars',
    communityName: 'Street Markets & Bargains',
    title: 'What should basic thrift jackets & t-shirts cost at Sarojini Nagar?',
    body: 'Going street shopping at Sarojini for the first time. Heard shopkeepers quote triple prices if you look like an out-of-station visitor. What are the actual baseline prices?',
    author: {
      name: 'Sneha Patel',
      badge: 'First-time Visitor',
      badgeColor: 'amber',
      isVerified: false,
      reputation: 19,
    },
    city: 'Delhi NCR',
    locationName: 'Sarojini Nagar Market',
    lat: 28.5772,
    lng: 77.1983,
    category: 'shopping',
    vibeCategory: 'shopping_hustle',
    tags: ['#SarojiniNagar', '#ThriftShopping', '#BargainTips', '#StudentBudget'],
    createdAt: '5 hours ago',
    upvotes: 54,
    userUpvoted: false,
    fareCheck: null,
    answers: [
      {
        id: 'ans-5',
        author: {
          name: 'Meher Chadha',
          badge: 'Delhi Fashion Resident',
          badgeColor: 'emerald',
          isVerified: true,
          reputation: 490,
        },
        body: 'Here is the golden rule: graphic tees ₹100-₹200 max. Jeans ₹300-₹450. Winter jackets / coats ₹500-₹800 max. If they quote ₹1200 for a coat, start your bid at ₹450 with "Bhaiya sahi rate lagao". Go on Tuesday morning right after fresh stock arrives.',
        pin: {
          lat: 28.5772,
          lng: 77.1983,
          name: 'Sarojini Lane 4 (Behind Babu Market)',
          neighborhood: 'Sarojini Nagar',
          type: 'shopping'
        },
        insiderTip: 'Carry hard cash in small denominations (₹50, ₹100). Hawkers use lack of change as a trick to not lower prices.',
        upvotes: 62,
        userUpvoted: false,
        createdAt: '4 hours ago',
      }
    ]
  },
  {
    id: 'q-peaceful-heritage-sunset',
    community: 'c/SecretSpots',
    communityName: 'Secret Spots & Hidden Corners',
    title: 'Where can I watch the sunset peacefully without paying heavy entry tickets?',
    body: 'Looking for a calm, quiet heritage spot to read a book or sketch during golden hour. Not India Gate or Red Fort where thousands of tourists crowd the lawn.',
    author: {
      name: 'Vikramaditya Rao',
      badge: 'Solo Traveler',
      badgeColor: 'amber',
      isVerified: false,
      reputation: 33,
    },
    city: 'Delhi NCR',
    locationName: 'Hauz Khas & Mehrauli',
    lat: 28.5535,
    lng: 77.1945,
    category: 'hidden_gems',
    vibeCategory: 'heritage_raw',
    tags: ['#Heritage', '#SunsetSpot', '#QuietDelhi', '#FreeEntry'],
    createdAt: '8 hours ago',
    upvotes: 46,
    userUpvoted: false,
    fareCheck: null,
    answers: [
      {
        id: 'ans-6',
        author: {
          name: 'Devika Sengupta',
          badge: 'Heritage Architect',
          badgeColor: 'emerald',
          isVerified: true,
          reputation: 610,
        },
        body: 'Go to Jamali Kamali Tomb & Mosque inside Mehrauli Archaeological Park. Unlike Qutub Minar, entry is completely FREE! 200 acres of 1000-year-old Tombs, peacocks wandering freely, and you can see the Qutub Minar lit up from the stepwell (Rajon ki Baoli).',
        pin: {
          lat: 28.5208,
          lng: 77.1858,
          name: 'Mehrauli Archaeological Park & Rajon Ki Baoli',
          neighborhood: 'Mehrauli',
          type: 'hidden_gem'
        },
        insiderTip: 'Nearest metro is Qutub Minar (Yellow line). Exit gate 2 and walk 400m into the park. Pure peace.',
        upvotes: 52,
        userUpvoted: false,
        createdAt: '6 hours ago',
      }
    ]
  }
];
