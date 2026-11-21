// Seed Data for NearGo - Real-World Hyper-Local City Guide
// Synchronized with live Supabase Database across Delhi NCR, Mumbai, and Bengaluru

export const INITIAL_QUESTIONS = [
  {
    "id": "q-del-hauz-khas-sunset",
    "community": "c/DelhiHeritage",
    "communityName": "DelhiHeritage Community",
    "title": "Is Hauz Khas Fort entry free now, and where is the quiet deer park lake sunset point?",
    "body": "Visiting HKV for an afternoon stroll. Is there an ASI ticket required for the monuments, and is there an uncrowded spot by the lake to watch sunset?",
    "author": {
      "name": "Pooja Kashyap",
      "badge": "Heritage Walker",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 28
    },
    "city": "Delhi NCR",
    "locationName": "Hauz Khas Village Fort & Lake",
    "lat": 28.5534,
    "lng": 77.1943,
    "category": "places",
    "vibeCategory": "heritage",
    "tags": [
      "#HauzKhas",
      "#HKV",
      "#SunsetPoint",
      "#DeerPark"
    ],
    "createdAt": "Recently",
    "upvotes": 57,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-1795285328",
        "author": {
          "name": "Dhruv Sehgal",
          "badge": "Verified South Delhi Explorer",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "ASI ticket is ₹25 (scan the QR code at the iron gate via ASI portal; no cash accepted). Once inside, do not stay in the crowded main courtyard — walk down the stone arches to the rear bastion overlooking the ancient 14th-century reservoir. If you want peace, take the dirt trail connecting directly into Deer Park where peacocks roam freely at 5 PM.",
        "pin": {
          "lat": 28.5528,
          "lng": 77.1939,
          "name": "Hauz Khas Fort Lake Bastion",
          "neighborhood": "Hauz Khas Village / Green Park",
          "type": "gem"
        },
        "insiderTip": "Autos outside HKV village gate charge ₹100 for 1 km to Green Park metro. Walk 6 minutes to the main Aurobindo Marg road and pay ₹30 on meter.",
        "upvotes": 63,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-del-gurgaon-rapid-metro",
    "community": "c/GurugramTransit",
    "communityName": "GurugramTransit Community",
    "title": "Fastest way from DLF Cyber Hub to Sector 54 Golf Course Road at 7 PM without cab surge?",
    "body": "Cabs on app are quoting ₹450 with 25-minute wait time to cross the Shankar Chowk jam towards Golf Course Road. Is the Rapid Metro running smoothly?",
    "author": {
      "name": "Deepak Chawla",
      "badge": "Cyber City Professional",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 36
    },
    "city": "Delhi NCR",
    "locationName": "DLF Cyber Hub, Gurugram",
    "lat": 28.495,
    "lng": 77.0895,
    "category": "transport",
    "vibeCategory": "student_budget",
    "tags": [
      "#CyberHub",
      "#GolfCourseRoad",
      "#RapidMetro",
      "#GurugramTransit"
    ],
    "createdAt": "Recently",
    "upvotes": 66,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": {
      "origin": "Cyber City Rapid Metro",
      "metroFare": "₹35 (Token / DMRC Smart Card)",
      "distanceKm": 6.8,
      "metroRoute": "Rapid Metro Gurugram (Phase 2 to Sector 55-56 line)",
      "cabEstimate": "₹380 - ₹480",
      "destination": "Sector 54 Chowk Station",
      "scamWarning": "Cyber City junction is gridlocked from 6:30 to 8:30 PM. Rapid Metro takes 14 minutes flat for ₹35.",
      "officialAutoMeter": "₹85 - ₹105"
    },
    "answers": [
      {
        "id": "ans-1795285480151-nirld",
        "author": {
          "name": "Kunal Singhania",
          "badge": "Verified Gurugram Commuter",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Skip cabs completely! Rapid Metro station is right inside Cyber Hub (walk past Starbucks). You can tap your standard DMRC Smart Card or pay ₹35 via Paytm QR. Trains arrive every 4 minutes, fully air-conditioned, and reach Sector 54 in 14 minutes, gliding right over the bumper-to-bumper traffic.",
        "pin": {
          "lat": 28.4942,
          "lng": 77.0888,
          "name": "Cyber City Rapid Metro Station",
          "neighborhood": "DLF Cyber City / Gurugram",
          "type": "transit"
        },
        "insiderTip": "If you work in DLF Phase 2 or 3, you can use the covered pedestrian walkway connected from Cyber Hub to the station without stepping onto the road.",
        "upvotes": 75,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-del-sarojini-market-hacks",
    "community": "c/DelhiShopping",
    "communityName": "DelhiShopping Community",
    "title": "Which Sarojini Nagar Metro gate is closest, and what is the baseline bargaining rule for street clothes?",
    "body": "First time going to Sarojini for summer shopping. Which metro gate leads straight to the export surplus lane, and how much can you bargain without annoying shopkeepers?",
    "author": {
      "name": "Simran Khurana",
      "badge": "Fashion Student",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 49
    },
    "city": "Delhi NCR",
    "locationName": "Sarojini Nagar Market",
    "lat": 28.5772,
    "lng": 77.1983,
    "category": "lifestyle",
    "vibeCategory": "student_budget",
    "tags": [
      "#SarojiniNagar",
      "#ThriftShopping",
      "#BargainingGuide",
      "#DelhiStreetStyle"
    ],
    "createdAt": "Recently",
    "upvotes": 91,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-1795285479865-fqv5e",
        "author": {
          "name": "Ananya Gujral",
          "badge": "Verified South Delhi Shopper",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Take the Pink Line and exit Gate 1 (puts you directly at the lane 1 entrance). Golden rule of Sarojini bargaining: quote 40% of their opening price. If a jacket is quoted at ₹800, offer ₹300 and settle at ₹350-₹400. Best spots: The central Graffiti Lane for oversized hoodies and the ₹100-₹150 tables in the Subzi Mandi square. Tuesday morning 11 AM has the freshest export drops.",
        "pin": {
          "lat": 28.5781,
          "lng": 77.1979,
          "name": "Sarojini Nagar Metro Gate 1",
          "neighborhood": "Sarojini Nagar / Safdarjung",
          "type": "transit"
        },
        "insiderTip": "Carry cash in ₹100 and ₹50 notes. Many small stall owners will give you a better deal if you have exact cash rather than waiting for UPI scanner in crowded lanes.",
        "upvotes": 104,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-del-mkt-tibetan-colony",
    "community": "c/DelhiLocal",
    "communityName": "DelhiLocal Community",
    "title": "How to reach Majnu Ka Tilla Tibetan Colony from Kashmere Gate without paying ₹150 for auto?",
    "body": "Autos outside Kashmere Gate ISBT quote ₹150-₹200 to drop at Majnu Ka Tilla monastery. Is there a shared e-rickshaw stand or direct metro route?",
    "author": {
      "name": "Tenzin Norbu",
      "badge": "North Campus Student",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 38
    },
    "city": "Delhi NCR",
    "locationName": "Majnu Ka Tilla, New Aruna Nagar",
    "lat": 28.7013,
    "lng": 77.2274,
    "category": "transport",
    "vibeCategory": "student_budget",
    "tags": [
      "#MajnuKaTilla",
      "#MKT",
      "#TibetanFood",
      "#DelhiMetro"
    ],
    "createdAt": "Recently",
    "upvotes": 73,
    "userUpvoted": false,
    "photos": [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
    ],
    "fareCheck": {
      "origin": "Vidhan Sabha Metro Station Gate 2",
      "metroFare": "₹20 (Metro) + ₹20 (E-rickshaw)",
      "distanceKm": 2.3,
      "metroRoute": "Yellow Line to Vidhan Sabha → Shared E-rickshaw from Gate 2",
      "cabEstimate": "₹80 - ₹110",
      "destination": "Majnu Ka Tilla Main Monastery Gate",
      "scamWarning": "Never take unmetered autos outside Kashmere Gate. Shared e-rickshaws from Vidhan Sabha Gate 2 are strictly ₹20 per seat.",
      "officialAutoMeter": "₹35 - ₹42"
    },
    "answers": [
      {
        "id": "ans-1795285327",
        "author": {
          "name": "Aarav Malhotra",
          "badge": "Verified North Delhi Guide",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Never take an auto from Kashmere Gate! Board the Yellow Line towards Samaypur Badli, deboard at Vidhan Sabha (2 stops, ₹20). Come out of Gate 2: there is an organized queue of shared e-rickshaws charging ₹20 flat directly to the MKT pedestrian footbridge.",
        "pin": {
          "lat": 28.7008,
          "lng": 77.2278,
          "name": "Majnu Ka Tilla Footbridge Entrance",
          "neighborhood": "Timarpur / Civil Lines",
          "type": "gem"
        },
        "insiderTip": "Once inside MKT, try the spicy cold Laphing at the monastery courtyard stall (₹50) and then walk to AMA Cafe for blueberry cheesecake.",
        "upvotes": 88,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-blr-indiranagar-brewery",
    "community": "c/BengaluruNightlife",
    "communityName": "BengaluruNightlife Community",
    "title": "Best rooftop craft brewery on 100ft Road Indiranagar with good music and reasonable rates?",
    "body": "Hosting 4 college friends visiting Bengaluru for the first time. Want authentic microbrewery culture with fresh Hefeweizen or IPA, outdoor vibe, and not crazy expensive.",
    "author": {
      "name": "Aishwarya Iyer",
      "badge": "Nightlife Enthusiast",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 33
    },
    "city": "Bengaluru",
    "locationName": "100ft Road / 12th Main, Indiranagar",
    "lat": 12.9719,
    "lng": 77.6412,
    "category": "food",
    "vibeCategory": "nightlife",
    "tags": [
      "#Indiranagar",
      "#CraftBeer",
      "#Toit",
      "#100ftRoad"
    ],
    "createdAt": "Recently",
    "upvotes": 47,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-1795285479416-tdguk",
        "author": {
          "name": "Nikhil Rathi",
          "badge": "Verified Indiranagar Resident",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Toit is the legendary pioneer of Bengaluru craft brewing on 100ft Road. Order the Tint-in-Wit (Belgian witbier) or Basmati Blonde with the baked potato skins and wood-fired pizza. Weekday lunch before 6 PM offers 30% off on all brew tasters and pints.",
        "pin": {
          "lat": 12.9792,
          "lng": 77.6408,
          "name": "Toit Brewpub (100ft Road Indiranagar)",
          "neighborhood": "Indiranagar 1st Stage",
          "type": "food"
        },
        "insiderTip": "Reserve 1 day in advance on Zomato or arrive by 12:45 PM for afternoon walk-ins to avoid the 1-hour evening waitlist.",
        "upvotes": 52,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-blr-nandi-hills-sunrise",
    "community": "c/WeekendEscape",
    "communityName": "WeekendEscape Community",
    "title": "What time does the base checkpoint open for Nandi Hills sunrise bike ride on Saturday?",
    "body": "Planning a sunrise ride with friends from Indiranagar. Heard police shut the gate if crowd gets too large. What time should we reach the base toll?",
    "author": {
      "name": "Gautam Menon",
      "badge": "Motorcycle Tourer",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 37
    },
    "city": "Bengaluru",
    "locationName": "Nandi Hills Toll Gate",
    "lat": 13.3702,
    "lng": 77.6835,
    "category": "places",
    "vibeCategory": "weekend_escape",
    "tags": [
      "#NandiHills",
      "#SunriseRide",
      "#WeekendEscape",
      "#BengaluruRiders"
    ],
    "createdAt": "Recently",
    "upvotes": 59,
    "userUpvoted": false,
    "photos": [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-1795285326",
        "author": {
          "name": "Vinay Hegde",
          "badge": "Verified Bengaluru Tourer",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "The base toll strictly opens at 6:00 AM. If you reach after 6:30 AM on a weekend, the queue of bikes and cars stretches 1.5 km and you will get stuck past sunrise. Leave Hebbal flyover by 4:45 AM. Book your entry pass on the Karnataka Forest portal in advance for the fast-track scanner.",
        "pin": {
          "lat": 13.3688,
          "lng": 77.6841,
          "name": "Nandi Hills Base Toll Checkpoint",
          "neighborhood": "Chikkaballapur District",
          "type": "gem"
        },
        "insiderTip": "Stop at Nandi Upachar on the highway return leg for piping hot Rava Idli and Masala Dosa.",
        "upvotes": 68,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-blr-malleswaram-breakfast",
    "community": "c/StreetFood",
    "communityName": "StreetFood Community",
    "title": "Veena Stores or CTR (Shri Sagar) for early Saturday breakfast in Malleswaram?",
    "body": "Waking up early at 6:30 AM to explore heritage breakfast in Malleswaram. CTR for Benne Masala Dosa or Veena Stores for Idli-Vada? How bad are the weekend queues?",
    "author": {
      "name": "Deepak Rao",
      "badge": "Food Explorer",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 48
    },
    "city": "Bengaluru",
    "locationName": "Malleswaram 8th Cross",
    "lat": 12.9988,
    "lng": 77.5711,
    "category": "food",
    "vibeCategory": "heritage",
    "tags": [
      "#Malleswaram",
      "#VeenaStores",
      "#CTR",
      "#BenneDosa"
    ],
    "createdAt": "Recently",
    "upvotes": 76,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-1795285478949-arb4h",
        "author": {
          "name": "Suresh Bhat",
          "badge": "Verified Malleswaram Guide",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "The veteran local move: Do both in sequence! Reach Veena Stores at 7:00 AM on Margosa Road when there is zero line. Grab 1 plate hot Idli-Vada with endless thick mint chutney (₹45, stand and eat on the footpath). Then take a 7-minute stroll to CTR on 7th Cross for their iconic crisp Benne Masala Dosa + strong filter coffee.",
        "pin": {
          "lat": 12.9982,
          "lng": 77.5715,
          "name": "Veena Stores (Margosa Road 15th Cross)",
          "neighborhood": "Malleswaram Heritage Belt",
          "type": "food"
        },
        "insiderTip": "CTR queue starts multiplying by 7:45 AM. If you reach by 7:15 AM, you will get seated in under 5 minutes.",
        "upvotes": 83,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-blr-church-street-book-crawl",
    "community": "c/BengaluruCulture",
    "communityName": "BengaluruCulture Community",
    "title": "Old Blossom vs New Blossom vs Bookworm on Church Street: best secret spots for cheap paperbacks?",
    "body": "Planning a Church Street book haul this weekend. Which store has the best vintage poetry & discounted classics, and where is a good quiet corner to read with filter coffee?",
    "author": {
      "name": "Meera Nambisan",
      "badge": "Avid Reader",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 44
    },
    "city": "Bengaluru",
    "locationName": "Church Street / Brigade Road",
    "lat": 12.9749,
    "lng": 77.6074,
    "category": "lifestyle",
    "vibeCategory": "chill",
    "tags": [
      "#ChurchStreet",
      "#BlossomBookHouse",
      "#Bookworm",
      "#CafeCulture"
    ],
    "createdAt": "Recently",
    "upvotes": 62,
    "userUpvoted": false,
    "photos": [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
    ],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-1795285325",
        "author": {
          "name": "Harish Shankar",
          "badge": "Verified Bengaluru Bibliophile",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Old Blossom (inside the lane next to Coconut Grove) is the real treasure chest. Climb the creaky staircase to the 2nd and 3rd floors — vintage science fiction, theatre scripts, and ₹80 second-hand classics are stacked to the ceiling. Afterwards, walk 100 meters to Indian Coffee House on Church Street for filter coffee.",
        "pin": {
          "lat": 12.9746,
          "lng": 77.6071,
          "name": "Old Blossom Book House (Heritage Lane)",
          "neighborhood": "Church Street / MG Road",
          "type": "gem"
        },
        "insiderTip": "Ask Mayi Gowda (the owner) directly if you are looking for out-of-print Indian history books — he knows every stack by memory.",
        "upvotes": 71,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-blr-silk-board-traffic-hack",
    "community": "c/BengaluruTransit",
    "communityName": "BengaluruTransit Community",
    "title": "Stuck at Silk Board for 40 mins. Any feeder transit or bypass route to Bellandur ORR?",
    "body": "Autos are canceling or demanding ₹300 for a 5 km stretch to Ecospace Bellandur. What is the smartest local commuter transit to escape the Silk Board gridlock?",
    "author": {
      "name": "Anand Sundaram",
      "badge": "ORR Tech Commuter",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 51
    },
    "city": "Bengaluru",
    "locationName": "Central Silk Board Junction",
    "lat": 12.9177,
    "lng": 77.6238,
    "category": "transport",
    "vibeCategory": "student_budget",
    "tags": [
      "#SilkBoard",
      "#OuterRingRoad",
      "#BMTCVolvo",
      "#TransitHack"
    ],
    "createdAt": "Recently",
    "upvotes": 84,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": {
      "origin": "Silk Board Junction",
      "metroFare": "₹25 (BMTC AC Ticket)",
      "distanceKm": 5.4,
      "metroRoute": "BMTC 500-Series Vajra AC Volvo via bus priority lane",
      "cabEstimate": "₹240 - ₹320",
      "destination": "Bellandur Ecospace, ORR",
      "scamWarning": "Peak hour auto meter refusals are common. Take BMTC 500D/500A every 3 minutes for ₹25 with chilling AC.",
      "officialAutoMeter": "₹75 - ₹90"
    },
    "answers": [
      {
        "id": "ans-1795285324",
        "author": {
          "name": "Karthik Raja",
          "badge": "Verified Bengaluru Commuter",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Do not bother with autos during 6-8 PM. Walk to the dedicated BMTC bus platform on the ORR ramp. Take any 500-series AC Volvo (500D, 500A, 500CA). It costs ₹25, has chilling AC, and glides over the HSR flyover to reach Bellandur in 18 minutes.",
        "pin": {
          "lat": 12.9185,
          "lng": 77.6242,
          "name": "Silk Board ORR Bus Rapid Shelter",
          "neighborhood": "Silk Board / HSR Layout",
          "type": "transit"
        },
        "insiderTip": "Download the Namma BMTC or Tummoc app to track the real-time GPS location of incoming Volvos.",
        "upvotes": 92,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-mum-carter-road-sunset",
    "community": "c/MumbaiLocal",
    "communityName": "MumbaiLocal Community",
    "title": "Carter Road vs Bandstand on Saturday evening: best sunset stroll, street food & lesser crowd?",
    "body": "Planning a sunset coffee walk in Bandra. Bandstand or Carter Road? Which has better open seating and street snack stalls?",
    "author": {
      "name": "Tanvi Deshmukh",
      "badge": "Bandra Resident",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 39
    },
    "city": "Mumbai",
    "locationName": "Carter Road Promenade, Bandra West",
    "lat": 19.0664,
    "lng": 72.8248,
    "category": "lifestyle",
    "vibeCategory": "chill",
    "tags": [
      "#BandraWest",
      "#CarterRoad",
      "#SunsetWalk",
      "#SeaBreeze"
    ],
    "createdAt": "Recently",
    "upvotes": 43,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-1795285478241-ojmn9",
        "author": {
          "name": "Ayesha Merchant",
          "badge": "Verified Bandra Local",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Carter Road hands down. Bandstand gets crowded with tour buses outside Mannat. Carter Road has the elevated wooden amphitheater boardwalk, sea breeze, dog park, and Carter’s Blue shawarma / Theobroma brownies are right across the road.",
        "pin": {
          "lat": 19.0655,
          "lng": 72.8252,
          "name": "Carter Road Promenade Amphitheater",
          "neighborhood": "Bandra West Coastal",
          "type": "gem"
        },
        "insiderTip": "Reach by 5:45 PM to grab a spot on the wooden steps of the amphitheater right when the Arabian sea sunset peaks.",
        "upvotes": 48,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-mum-gateway-elephanta-ferry",
    "community": "c/MumbaiTransit",
    "communityName": "MumbaiTransit Community",
    "title": "Ferry touts at Gateway claiming ordinary ferry is suspended, pay ₹1200 for speed boat – legit?",
    "body": "Visiting Gateway with family. Multiple guys with laminated cards in the courtyard say state ferries are shut for maintenance today and we must book ₹1200 private speedboat. What is the real ticket counter?",
    "author": {
      "name": "Vikram Chawla",
      "badge": "Family Traveler",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 20
    },
    "city": "Mumbai",
    "locationName": "Gateway of India Jetty",
    "lat": 18.922,
    "lng": 72.8347,
    "category": "tips",
    "vibeCategory": "weekend_escape",
    "tags": [
      "#GatewayOfIndia",
      "#ElephantaCaves",
      "#FerryFare",
      "#ScamAlert"
    ],
    "createdAt": "Recently",
    "upvotes": 82,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": {
      "origin": "Gateway of India Jetty",
      "metroFare": "₹260 Return Ticket (Upper Deck)",
      "distanceKm": 11.2,
      "metroRoute": "Authorized Maharashtra Tourism Ferry from Jetty #1",
      "cabEstimate": "N/A",
      "destination": "Elephanta Island Jetty",
      "scamWarning": "🚨 Classic tourist tout trap! State-authorized ferries run continuously every 30 minutes from 9:00 AM to 2:00 PM.",
      "officialAutoMeter": "N/A (Waterway)"
    },
    "answers": [
      {
        "id": "ans-1795285323",
        "author": {
          "name": "Cyrus Mistry",
          "badge": "Verified Heritage Guide",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Complete scam! Do not speak to any touts in the open courtyard. Walk right past the Shivaji statue straight to the stone ticket counter at Jetty 1. Authorized return ticket is ₹260 for upper deck. Ferries depart like clockwork every 30 mins.",
        "pin": {
          "lat": 18.9218,
          "lng": 72.8349,
          "name": "Authorized Gateway Jetty #1 Ticket Kiosk",
          "neighborhood": "Colaba / Apollo Bunder",
          "type": "transit"
        },
        "insiderTip": "Pay ₹10 extra on the boat to sit on the top open deck for unobstructed sea views and seagull feeding.",
        "upvotes": 94,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-mum-dadar-flower-market",
    "community": "c/StreetFood",
    "communityName": "StreetFood Community",
    "title": "Visiting Dadar Phool Galli at 5 AM: safe for photography and where is the best morning Vada Pav?",
    "body": "Want to capture the sunrise wholesale flower market colors. Is 5:00 AM safe for a solo photographer carrying a camera, and which food stall opens earliest?",
    "author": {
      "name": "Sameer Varma",
      "badge": "Urban Documentarian",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 35
    },
    "city": "Mumbai",
    "locationName": "Dadar Flower Market (Phool Galli)",
    "lat": 19.0178,
    "lng": 72.8478,
    "category": "lifestyle",
    "vibeCategory": "heritage",
    "tags": [
      "#DadarPhoolGalli",
      "#MorningPhotoWalk",
      "#VadaPav",
      "#StreetCulture"
    ],
    "createdAt": "Recently",
    "upvotes": 49,
    "userUpvoted": false,
    "photos": [
      "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=800&q=80"
    ],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-1795285477733-dhvvs",
        "author": {
          "name": "Neha Sawant",
          "badge": "Verified Dadar Local",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "100% safe, it is buzzing with wholesale florists from 4:00 AM. Keep your bag strapped across your chest because porters carrying marigold sacks walk swiftly. Shree Datta Snacks right outside Dadar West opens at 6:00 AM with piping hot Kothimbir Vadi and fresh Vada Pav (₹22).",
        "pin": {
          "lat": 19.0192,
          "lng": 72.8441,
          "name": "Shree Datta Snacks (Dadar West)",
          "neighborhood": "Senapati Bapat Marg / Dadar",
          "type": "gem"
        },
        "insiderTip": "Wear shoes with good grip. The flower washing runoff makes the pavement slick around the bridge staircase.",
        "upvotes": 56,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-mum-bandra-bkc-auto",
    "community": "c/MumbaiTransit",
    "communityName": "MumbaiTransit Community",
    "title": "Auto drivers at Bandra East skywalk demanding flat ₹100 to BKC – what is the official rate?",
    "body": "Just deboarded local train at Bandra East. Auto drivers under the skywalk are refusing meter and asking ₹100 flat for 2.5 km to ONE BKC. Is this legal or is there an official share-auto stand?",
    "author": {
      "name": "Kavita Joshi",
      "badge": "Daily Commuter",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 42
    },
    "city": "Mumbai",
    "locationName": "Bandra East Skywalk to BKC",
    "lat": 19.0596,
    "lng": 72.8458,
    "category": "transport",
    "vibeCategory": "student_budget",
    "tags": [
      "#BandraStation",
      "#BKC",
      "#AutoFare",
      "#FairPriceCheck"
    ],
    "createdAt": "Recently",
    "upvotes": 78,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": {
      "origin": "Bandra Station East",
      "metroFare": "₹20 (Share Auto) / ₹6 (BEST Bus)",
      "distanceKm": 2.6,
      "metroRoute": "Walk 40m to official share-auto queue near Guru Nanak Hospital or BEST Bus 181/310",
      "cabEstimate": "₹95 - ₹130",
      "destination": "Jio World Convention Centre, BKC",
      "scamWarning": "🚨 Flat ₹100 demand is +130% illegal surge. Always walk past the stairs to the official RTO share-auto stand for ₹20 flat.",
      "officialAutoMeter": "₹38 - ₹45"
    },
    "answers": [
      {
        "id": "ans-1795285322",
        "author": {
          "name": "Prathamesh Parab",
          "badge": "Verified Bandra Commuter",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Never take the individual autos standing under the skywalk stairs — they prey on commuters. Walk 50 meters straight towards Kalanagar. There is a regulated share-auto queue where they take exactly ₹20 per passenger straight to BKC connector.",
        "pin": {
          "lat": 19.0601,
          "lng": 72.8465,
          "name": "Official Bandra East Share-Auto Stand",
          "neighborhood": "Kalanagar / Bandra East",
          "type": "transit"
        },
        "insiderTip": "During heavy monsoon or 6 PM rush, BEST AC Bus 181 or 310 takes 12 mins and costs only ₹6 with the Chalo app.",
        "upvotes": 89,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-mum-marine-drive-night",
    "community": "c/MumbaiLocal",
    "communityName": "MumbaiLocal Community",
    "title": "Best spot for late-night chai & bun maska after Marine Drive police clearing?",
    "body": "Around 1:00 AM police blow whistles on the Marine Drive promenade wall. Where do locals go nearby for late night tea or bun maska that is safe and walking distance?",
    "author": {
      "name": "Aditya Shenoy",
      "badge": "South Bombay Explorer",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 68
    },
    "city": "Mumbai",
    "locationName": "Marine Drive / Churchgate",
    "lat": 18.9322,
    "lng": 72.8264,
    "category": "food",
    "vibeCategory": "late_night",
    "tags": [
      "#MarineDrive",
      "#LateNightChai",
      "#BunMaska",
      "#Churchgate"
    ],
    "createdAt": "Recently",
    "upvotes": 54,
    "userUpvoted": false,
    "photos": [
      "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80"
    ],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-1795285321",
        "author": {
          "name": "Rohit Kadam",
          "badge": "Verified Mumbai Local",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Head down Maharshi Karve Road towards Churchgate Station Gate 3. The 24/7 tea stalls serve fresh ginger cutting chai (₹15) and toasted maska pav with melted amul butter (₹35). Safe, well-lit, lots of college students and night commuters.",
        "pin": {
          "lat": 18.9352,
          "lng": 72.8272,
          "name": "Churchgate Gate 3 All-Night Tea Stall",
          "neighborhood": "Churchgate / Marine Lines",
          "type": "food"
        },
        "insiderTip": "Autos do not operate in South Mumbai (strict taxi zone). Kaali-Peeli taxis are available all night; flag-drop meter is ₹28.",
        "upvotes": 61,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-1795271456",
    "community": "c/DelhiTransit",
    "communityName": "DelhiTransit Community",
    "title": "cheap and best place for sweets",
    "body": "cheap and best place for sweets",
    "author": {
      "name": "Traveler 645",
      "badge": "Curious Traveler",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 10
    },
    "city": "Delhi NCR",
    "locationName": "Okhla Phase 3 (South Delhi)",
    "lat": 28.5459,
    "lng": 77.2732,
    "category": "transport",
    "vibeCategory": "student_budget",
    "tags": [
      "#AutoFare",
      "#FairPriceCheck",
      "#student_budget"
    ],
    "createdAt": "Recently",
    "upvotes": 1,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": {
      "origin": "Okhla Phase 3 (South Delhi)",
      "metroFare": "₹40 Token",
      "distanceKm": 16.6,
      "cabEstimate": "₹416 - ₹520",
      "destination": "Chandni Chowk Market",
      "scamWarning": "Official meter: ₹196. Avoid unmetered tourist surge.",
      "officialAutoMeter": "₹196 - ₹226"
    },
    "answers": []
  },
  {
    "id": "q-blr-filter-coffee-dosa",
    "community": "c/StreetFood",
    "communityName": "StreetFood Community",
    "title": "Top 3 heritage breakfast spots for crispy Benne Masala Dosa & degree filter coffee?",
    "body": "New to Bangalore and want to experience true traditional breakfast culture before 9 AM. CTR, Vidyarthi Bhavan or hidden neighborhood Darshinis?",
    "author": {
      "name": "Suhas Kulkarni",
      "badge": "Early Morning Explorer",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 50
    },
    "city": "Bengaluru",
    "locationName": "Malleswaram / Basavanagudi",
    "lat": 12.9756,
    "lng": 77.6066,
    "category": "food",
    "vibeCategory": "street_food",
    "tags": [
      "#BenneDosa",
      "#FilterCoffee",
      "#Malleswaram",
      "#Darshini"
    ],
    "createdAt": "Recently",
    "upvotes": 75,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-blr-food-1",
        "author": {
          "name": "Pradeep Gowda",
          "badge": "Malleswaram Heritage Native",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "1) CTR (Shri Sagar) in Malleswaram 7th Cross: Unrivaled Benne Masala Dosa, super crispy outer layer with soft cloud interior. 2) Brahmin’s Coffee Bar in Shankarapuram: Softest idlis drowning in spicy coconut chutney + strong froth coffee (no sambar served, pure purity). 3) Taaza Thindi in Jayanagar for ₹30 cleanest crispy dosa in town.",
        "pin": {
          "lat": 12.9982,
          "lng": 77.5702,
          "name": "CTR Shri Sagar (Malleswaram 7th Cross)",
          "neighborhood": "Malleswaram",
          "type": "food"
        },
        "insiderTip": "Reach CTR before 8:15 AM on weekends to avoid the 45-minute street waiting queue. Always order Filter Coffee \"Medium Sugar\".",
        "upvotes": 95,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-blr-peak-traffic-auto",
    "community": "c/BengaluruTransit",
    "communityName": "BengaluruTransit Community",
    "title": "How to survive peak 6 PM traffic from Koramangala to Indiranagar without paying ₹400?",
    "body": "Autos on ride apps are either canceling or charging 3x surge. What is the smartest local transit workaround to commute between Koramangala and Indiranagar during evening hours?",
    "author": {
      "name": "Nikhil Rathi",
      "badge": "Tech Commuter",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 35
    },
    "city": "Bengaluru",
    "locationName": "Koramangala 5th Block to Indiranagar",
    "lat": 12.9352,
    "lng": 77.6245,
    "category": "transport",
    "vibeCategory": "student_budget",
    "tags": [
      "#NammaMetro",
      "#PeakTraffic",
      "#Koramangala",
      "#Indiranagar"
    ],
    "createdAt": "Recently",
    "upvotes": 49,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": {
      "origin": "Koramangala 5th Block",
      "metroFare": "₹20 (Metro) + ₹15 (Bus)",
      "distanceKm": 6.8,
      "metroRoute": "Quick 10-min bus/bike to Trinity or Halasuru Metro Station → Purple Line to Indiranagar",
      "cabEstimate": "₹220 - ₹290",
      "destination": "Indiranagar 100ft Road",
      "durationMin": 38,
      "scamWarning": "Autos often refuse meter in peak hours. Use Rapido bike taxi or the Purple Line corridor from MG Road/Halasuru to bypass Sony World junction bottlenecks.",
      "metroDuration": "24 mins",
      "officialAutoMeter": "₹102 - ₹120"
    },
    "answers": [
      {
        "id": "ans-blr-1",
        "author": {
          "name": "Divya Hegde",
          "badge": "Verified Bengaluru Resident",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Peak hour Sony World junction and Intermediate Ring Road are total gridlock between 5:30 PM and 8:30 PM. The secret local hack: Hop on a Rapido bike taxi down to Trinity Metro Station (takes 10 mins via inner residential lanes), then take Namma Metro Purple Line directly to Indiranagar Station. Saves 30 mins and under ₹60 total!",
        "pin": {
          "lat": 12.9784,
          "lng": 77.6408,
          "name": "Indiranagar Metro Station & 100ft Rd",
          "neighborhood": "Indiranagar",
          "type": "transit"
        },
        "insiderTip": "Namma Metro smart tokens/cards save 5% and let you avoid long token counter queues at interchange stations.",
        "upvotes": 68,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-mumbai-street-food",
    "community": "c/StreetFood",
    "communityName": "StreetFood Community",
    "title": "Authentic Vada Pav & Bun Maska spots that locals swear by in South Mumbai?",
    "body": "Looking for generational Irani cafes and authentic spicy Vada Pav places near CST or Churchgate that are not overpriced tourist traps.",
    "author": {
      "name": "Aditya Verma",
      "badge": "Food Explorer",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 45
    },
    "city": "Mumbai",
    "locationName": "Fort / CST / Colaba",
    "lat": 18.9401,
    "lng": 72.8354,
    "category": "food",
    "vibeCategory": "street_food",
    "tags": [
      "#VadaPav",
      "#IraniChai",
      "#CST",
      "#OldBombay"
    ],
    "createdAt": "Recently",
    "upvotes": 61,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-mum-food-1",
        "author": {
          "name": "Ketaki Joshi",
          "badge": "South Bombay Local",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "1) Aram Milk Bar right opposite CST station: Top tier authentic spicy Vada Pav with dry garlic chutney for ₹25. 2) Yazdani Bakery in Fort: 70-year-old Parsi bakery for wood-fired Brun Maska and sweet Chai. 3) Ashok Vada Pav near Kirti College (Dadar) for the original Chura Vada Pav.",
        "pin": {
          "lat": 18.9412,
          "lng": 72.834,
          "name": "Aram Vada Pav & Milk Bar (Opposite CST)",
          "neighborhood": "Fort / CST",
          "type": "food"
        },
        "insiderTip": "Brun Maska is best eaten warm dipped straight into hot cutting chai. Don’t miss Yazdani’s apple pie if it’s fresh out of the oven!",
        "upvotes": 79,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-mumbai-bandra-auto",
    "community": "c/MumbaiTransit",
    "communityName": "MumbaiTransit Community",
    "title": "Do auto rickshaws in Mumbai strictly run on meter or quote random prices?",
    "body": "Traveling to Mumbai for the first time. Landing at T2 and heading to Bandra (West). Will auto drivers run strictly on meter like people say, or do they try to quote fixed tourist fares? What is the fair price?",
    "author": {
      "name": "Pooja Nair",
      "badge": "First-time Traveler",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 30
    },
    "city": "Mumbai",
    "locationName": "CSMIA Terminal 2 to Bandra West",
    "lat": 19.0896,
    "lng": 72.8656,
    "category": "transport",
    "vibeCategory": "student_budget",
    "tags": [
      "#MumbaiAuto",
      "#MeterStrict",
      "#Bandra",
      "#AirportTransit"
    ],
    "createdAt": "Recently",
    "upvotes": 38,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": {
      "origin": "Mumbai Airport T2",
      "metroFare": "₹20 (Metro) + ₹10 (Local Train)",
      "distanceKm": 12.4,
      "metroRoute": "Airport Road Metro Line 1 → Western Line Train to Bandra",
      "cabEstimate": "₹320 - ₹380",
      "destination": "Bandra West (Bandstand)",
      "durationMin": 35,
      "scamWarning": "Unlike Delhi, autos in Mumbai suburbs (Bandra upwards) legally run 100% on electronic meter! Never accept a flat quote.",
      "metroDuration": "40 mins",
      "officialAutoMeter": "₹230 - ₹255"
    },
    "answers": [
      {
        "id": "ans-mum-1",
        "author": {
          "name": "Farhan Merchant",
          "badge": "Verified Bandra Resident",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Welcome to Mumbai! Autos here are very disciplined compared to other cities. They strictly put the meter down (minimum ₹28 for first 1.5 km, then ₹18.66/km). Just get in the official auto queue at T2 level 1. Do NOT take unmetered private cabs outside!",
        "pin": {
          "lat": 19.0434,
          "lng": 72.8197,
          "name": "Bandra Bandstand (Chai & Sunset Spot)",
          "neighborhood": "Bandra West",
          "type": "gem"
        },
        "insiderTip": "Autos cannot enter South Mumbai (past Mahim/Sion). For South Mumbai, use the iconic Black & Yellow (Kaali Peeli) cabs or the Local Train.",
        "upvotes": 52,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-state-bhavan-thalis-central-delhi",
    "community": "c/SecretSpots",
    "communityName": "SecretSpots Community",
    "title": "Secret regional State Bhavan canteens in Central Delhi for authentic budget feasts?",
    "body": "Tired of generic North Indian butter chicken. I heard state government guest houses in Delhi serve authentic regional food cooked by native chefs at subsidized prices. Which ones are open to the public and what should I order?",
    "author": {
      "name": "Gaurav Kulkarni",
      "badge": "Food Connoisseur",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 39
    },
    "city": "Delhi NCR",
    "locationName": "Central Delhi State Bhavan Corridor",
    "lat": 28.6003,
    "lng": 77.227,
    "category": "hidden_gems",
    "vibeCategory": "heritage_raw",
    "tags": [
      "#StateBhavan",
      "#AuthenticFood",
      "#CentralDelhi",
      "#BudgetFeast"
    ],
    "createdAt": "Recently",
    "upvotes": 82,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-bhavan-1",
        "author": {
          "name": "Maitreyi Krishnan",
          "badge": "Delhi Culinary Historian",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Central Delhi State Bhavans are the best kept culinary secret of the capital! Top 2 that are completely open to the general public: 1) Andhra Bhavan on Ashoka Road: Unlimited South Indian vegetarian thali with gun powder (podi), ghee, and sambar for ₹180, plus legendary mutton fry. 2) Kerala House on Jantar Mantar Road: Malabar parotta, beef fry, and fish curry for under ₹150.",
        "pin": {
          "lat": 28.621,
          "lng": 77.2225,
          "name": "Andhra Bhavan Canteen (Ashoka Road)",
          "neighborhood": "Central Delhi",
          "type": "food"
        },
        "insiderTip": "Sunday Andhra Bhavan Hyderabadi Dum Biryani starts at 12:00 noon and sells out by 1:30 PM. Arrive at 11:45 AM for tokens!",
        "upvotes": 64,
        "userUpvoted": false,
        "createdAt": "Recently"
      },
      {
        "id": "ans-bhavan-2",
        "author": {
          "name": "Arjun Dasgupta",
          "badge": "Central Delhi Local",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Don’t forget Banga Bhavan (Hailey Road near Mandi House) for authentic mustard fish (Hilsa/Rahu paturi) and Kosha Mangsho, and Odisha Niwas (Chanakyapuri) for authentic coastal dalma and chena poda dessert.",
        "pin": {
          "lat": 28.627,
          "lng": 77.217,
          "name": "Kerala House Samrudhi Canteen (Jantar Mantar Road)",
          "neighborhood": "Connaught Place / Jantar Mantar",
          "type": "food"
        },
        "insiderTip": "Nearest metro for Andhra Bhavan is Patel Chowk (Yellow Line), 600m walk.",
        "upvotes": 43,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-delhi-airport-transit-fair-fare",
    "community": "c/DelhiTransit",
    "communityName": "DelhiTransit Community",
    "title": "Landing at IGI Airport Terminal 3 late night: Prepaid taxi booth vs Uber vs Airport Metro?",
    "body": "First time flying into New Delhi. Landing at T3 at 11:45 PM with luggage, heading to South Delhi / Connaught Place. Touts inside the arrivals lounge are quoting ₹1,400. What is the real official price?",
    "author": {
      "name": "Benjamin Miller",
      "badge": "International Backpacker",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 31
    },
    "city": "Delhi NCR",
    "locationName": "IGI Airport Terminal 3 / Aerocity",
    "lat": 28.5562,
    "lng": 77.0999,
    "category": "transport",
    "vibeCategory": "student_budget",
    "tags": [
      "#IGIAirport",
      "#AirportExpress",
      "#PrepaidTaxi",
      "#DelhiPolice"
    ],
    "createdAt": "Recently",
    "upvotes": 75,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": {
      "origin": "IGI Airport Terminal 3",
      "metroFare": "₹60 per passenger",
      "distanceKm": 18.2,
      "metroRoute": "Orange Line (Airport Express) from T3 basement directly to New Delhi Metro Station",
      "cabEstimate": "₹420 - ₹550 (App pickup at Pillar 10)",
      "destination": "Connaught Place (Central Delhi)",
      "durationMin": 32,
      "scamWarning": "🚨 Never accept rides from unregistered touts standing inside terminal arrivals quoting ₹1,200+. Walk outside to Pillar 14 for the official Delhi Police Prepaid Booth or take the Airport Express Metro!",
      "metroDuration": "19 minutes (Air-conditioned, luggage racks)",
      "officialAutoMeter": "₹210 - ₹235 (+ 25% night fare = ~₹275)"
    },
    "answers": [
      {
        "id": "ans-air-2",
        "author": {
          "name": "Deepak Rao",
          "badge": "Aerocity Hospitality Host",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "If you have an overnight layover or early morning flight, head to Aerocity Worldmark (just 1 metro stop or ₹80 cab away). It has 24/7 bakeries, high-security pedestrian plazas, and clean transit dining.",
        "pin": {
          "lat": 28.5502,
          "lng": 77.1215,
          "name": "Aerocity Worldmark Plaza & Food Capital",
          "neighborhood": "Aerocity Hospitality District",
          "type": "hidden_gem"
        },
        "insiderTip": "Free shuttle buses run between T3, T2, and Aerocity metro station every 20 minutes.",
        "upvotes": 35,
        "userUpvoted": false,
        "createdAt": "Recently"
      },
      {
        "id": "ans-air-1",
        "author": {
          "name": "Capt. Rajesh Bakshi",
          "badge": "Aviation & Delhi Veteran",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "The safest and most reliable late-night options: 1) If landing before 11:30 PM, take the Airport Express Metro (Orange Line) right from the basement. Costs ₹60, takes exactly 19 mins to New Delhi / CP with zero traffic. 2) If landing past midnight, walk out of Gate 4 to Pillar 14 to the Delhi Police Prepaid Taxi Counter. You pay the fixed government receipt at the counter. Connaught Place is ₹450-₹500 fixed.",
        "pin": {
          "lat": 28.5562,
          "lng": 77.0999,
          "name": "Delhi Police Official Prepaid Taxi Counter (Pillar 14 Arrivals)",
          "neighborhood": "IGI Airport T3",
          "type": "transit"
        },
        "insiderTip": "Only hand over the pink slip to the driver AFTER you have safely arrived at your destination hotel.",
        "upvotes": 68,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-du-north-campus-cafes",
    "community": "c/DULife",
    "communityName": "DULife Community",
    "title": "Cozy study cafes with Wi-Fi & budget meals in DU North Campus?",
    "body": "Studying for upcoming exams with batchmates. We need chill spots around Hudson Lane or Kamla Nagar with reliable charging sockets, decent filter coffee/tea, and meal combos under ₹250.",
    "author": {
      "name": "Harshita Bose",
      "badge": "DU Student",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 17
    },
    "city": "Delhi NCR",
    "locationName": "DU North Campus (Hudson Lane)",
    "lat": 28.6942,
    "lng": 77.2064,
    "category": "student_spots",
    "vibeCategory": "student_budget",
    "tags": [
      "#DUNorthCampus",
      "#HudsonLane",
      "#KamlaNagar",
      "#StudentCafes"
    ],
    "createdAt": "Recently",
    "upvotes": 59,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-du-1",
        "author": {
          "name": "Siddharth Varma",
          "badge": "Kirori Mal College Alumni",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Hudson Lane is literally student central. Exit GTB Nagar Metro Gate 4 and you are on the cafe strip. Cafes like Woodbox, Big Yellow Door, and Rico’s have dedicated charging ports at almost every table and student platters under ₹220.",
        "pin": {
          "lat": 28.6942,
          "lng": 77.2064,
          "name": "Hudson Lane Cafe Strip (GTB Nagar Gate 4)",
          "neighborhood": "North Campus / GTB Nagar",
          "type": "food"
        },
        "insiderTip": "Show your college ID card for 10% to 15% student discounts at most Hudson Lane eateries.",
        "upvotes": 49,
        "userUpvoted": false,
        "createdAt": "Recently"
      },
      {
        "id": "ans-du-2",
        "author": {
          "name": "Manish Kaul",
          "badge": "Street Food Veteran",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Whenever you need a study break, walk 10 minutes to Kamla Nagar market for Chache Di Hatti’s iconic Chole Bhature with pickled green chilies and special aloo. Costs ₹80 for a legendary plate.",
        "pin": {
          "lat": 28.6806,
          "lng": 77.2038,
          "name": "Chache Di Hatti (Iconic Chole Bhature)",
          "neighborhood": "Kamla Nagar",
          "type": "food"
        },
        "insiderTip": "They open at 9:30 AM and sell out by 2:30 PM. Go early!",
        "upvotes": 42,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-noida-streetfood-electronics",
    "community": "c/NoidaInsider",
    "communityName": "NoidaInsider Community",
    "title": "Where do locals eat and shop in Noida without paying luxury mall prices?",
    "body": "Visiting friends staying in Noida. Everyone points to DLF Mall of India, but I want authentic street food (sizzling kebabs, chaat, momos) and reasonable mobile repair shops where you can bargain. Pinned recommendations appreciated!",
    "author": {
      "name": "Tanvi Deshmukh",
      "badge": "Explorer",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 22
    },
    "city": "Delhi NCR",
    "locationName": "Noida Sector 18 & Atta Market",
    "lat": 28.5708,
    "lng": 77.326,
    "category": "street_food",
    "vibeCategory": "foodie_paradise",
    "tags": [
      "#Noida",
      "#AttaMarket",
      "#BrahmaputraMarket",
      "#StreetFood"
    ],
    "createdAt": "Recently",
    "upvotes": 51,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-noida-1",
        "author": {
          "name": "Rishabh Tyagi",
          "badge": "Verified Noida Resident",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Cross the road right behind Sector 18 Metro Gate 2 into Atta Market. It is Noida’s miniature Sarojini + Nehru Place! The inner alleys have over 50 mobile accessories and repair stalls at 1/3rd mall prices. For food, grab crispy Ram Laddu and authentic Tandoori momos at the corner lane.",
        "pin": {
          "lat": 28.5701,
          "lng": 77.3255,
          "name": "Atta Market Inner Food & Electronics Lane",
          "neighborhood": "Sector 18 / Noida",
          "type": "shopping"
        },
        "insiderTip": "E-rickshaws anywhere within Sector 18 and Sector 27 cost ₹10 to ₹15 per seat.",
        "upvotes": 41,
        "userUpvoted": false,
        "createdAt": "Recently"
      },
      {
        "id": "ans-noida-2",
        "author": {
          "name": "Ananya Roy",
          "badge": "Noida Food Blogger",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "If you want the ultimate evening dinner vibe, head to Brahmaputra Market (BP Market) in Sector 29, just 5 minutes away. Sizzling chicken shawarmas, galouti kebabs, fresh fruit juices, and classic kathi rolls. A full hearty meal under ₹150.",
        "pin": {
          "lat": 28.562,
          "lng": 77.336,
          "name": "Brahmaputra Market (BP Market)",
          "neighborhood": "Sector 29 / Noida",
          "type": "food"
        },
        "insiderTip": "Visit between 6:30 PM and 10:30 PM. Parking is tight, so take a ₹10 e-rickshaw from Botanical Garden metro.",
        "upvotes": 38,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-cybercity-gurgaon-transit",
    "community": "c/GurgaonCommuters",
    "communityName": "GurgaonCommuters Community",
    "title": "How to reach DLF Cyber City from South Delhi without paying ₹700 surge on Uber/Ola?",
    "body": "Starting an office job in Cyber City Building 10. Morning cab surge routinely crosses ₹650-₹750, and the NH-48 Sirhaul border toll jam eats up 45 minutes. What is the fastest and most economical way to reach Cyber City every day?",
    "author": {
      "name": "Aditya Singhal",
      "badge": "Corporate Daily Commuter",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 28
    },
    "city": "Delhi NCR",
    "locationName": "DLF CyberHub & Cyber City",
    "lat": 28.495,
    "lng": 77.0895,
    "category": "transport",
    "vibeCategory": "student_budget",
    "tags": [
      "#CyberCity",
      "#GurgaonCommute",
      "#RapidMetro",
      "#FairPriceCheck"
    ],
    "createdAt": "Recently",
    "upvotes": 68,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": {
      "origin": "Okhla / Govindpuri (South Delhi)",
      "metroFare": "₹50 (Token) / ₹45 (Smart Card) + ₹20 Rapid Metro",
      "distanceKm": 22.4,
      "metroRoute": "Magenta Line (Kalkaji Mandir) → Hauz Khas → Yellow Line to Sikanderpur → Switch to Rapid Metro (1 stop to Cyber City)",
      "cabEstimate": "₹480 - ₹680 (surge common)",
      "destination": "DLF Cyber City (Gurgaon)",
      "durationMin": 58,
      "scamWarning": "🚨 Peak-hour morning cabs charge up to ₹800. The Magenta-Yellow-Rapid Metro connection is 100% jam-free and drops you directly into CyberHub skywalk!",
      "metroDuration": "48 mins",
      "officialAutoMeter": "₹260 - ₹290 (+ toll)"
    },
    "answers": [
      {
        "id": "ans-cyber-1",
        "author": {
          "name": "Karan Mehra",
          "badge": "Gurgaon Tech Resident",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Do NOT take a cab in peak morning hours between 8:30 AM and 10:30 AM. Board the Magenta Line at Kalkaji Mandir, interchange at Hauz Khas to the Yellow Line towards Millennium City Centre, deboard at Sikanderpur, and hop onto the Rapid Metro for just 1 stop to Cyber City. The skybridge leads right into Building 10 without crossing any road!",
        "pin": {
          "lat": 28.4944,
          "lng": 77.089,
          "name": "Cyber City Rapid Metro Station (Skywalk Entrance)",
          "neighborhood": "DLF Phase 2 / Cyber City",
          "type": "transit"
        },
        "insiderTip": "For evening food and casual craft beers after office, walk 10 minutes from CyberHub to Sector 29 Leisure Valley market.",
        "upvotes": 45,
        "userUpvoted": false,
        "createdAt": "Recently"
      },
      {
        "id": "ans-cyber-2",
        "author": {
          "name": "Simran Bajaj",
          "badge": "Gurgaon Food & Culture Guide",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "If you want good dinner after work that isn’t overpriced, Sector 29 is the local hub. Auto from Cyber City to Sector 29 should be ₹80-₹100 on meter, never pay ₹250.",
        "pin": {
          "lat": 28.4682,
          "lng": 77.0632,
          "name": "Sector 29 Leisure Valley Market & Food District",
          "neighborhood": "Sector 29 / Gurgaon",
          "type": "food"
        },
        "insiderTip": "Shared autos wait outside Sikanderpur metro station and charge ₹20 fixed to Cyber City Gate 2.",
        "upvotes": 29,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-peaceful-heritage-sunset",
    "community": "c/SecretSpots",
    "communityName": "SecretSpots Community",
    "title": "Where can I watch the sunset peacefully without paying heavy entry tickets?",
    "body": "Looking for a calm, quiet heritage spot to read a book or sketch during golden hour. Not India Gate or Red Fort where thousands of tourists crowd the lawn.",
    "author": {
      "name": "Vikramaditya Rao",
      "badge": "Solo Traveler",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 33
    },
    "city": "Delhi NCR",
    "locationName": "Hauz Khas & Mehrauli",
    "lat": 28.5535,
    "lng": 77.1945,
    "category": "hidden_gems",
    "vibeCategory": "heritage_raw",
    "tags": [
      "#Heritage",
      "#SunsetSpot",
      "#QuietDelhi",
      "#FreeEntry"
    ],
    "createdAt": "Recently",
    "upvotes": 46,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-6",
        "author": {
          "name": "Devika Sengupta",
          "badge": "Heritage Architect",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Go to Jamali Kamali Tomb & Mosque inside Mehrauli Archaeological Park. Unlike Qutub Minar, entry is completely FREE! 200 acres of 1000-year-old Tombs, peacocks wandering freely, and you can see the Qutub Minar lit up from the stepwell (Rajon ki Baoli).",
        "pin": {
          "lat": 28.5208,
          "lng": 77.1858,
          "name": "Mehrauli Archaeological Park & Rajon Ki Baoli",
          "neighborhood": "Mehrauli",
          "type": "hidden_gem"
        },
        "insiderTip": "Nearest metro is Qutub Minar (Yellow line). Exit gate 2 and walk 400m into the park. Pure peace.",
        "upvotes": 52,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-sarojini-nagar-bargaining",
    "community": "c/BargainBazaars",
    "communityName": "BargainBazaars Community",
    "title": "What should basic thrift jackets & t-shirts cost at Sarojini Nagar?",
    "body": "Going street shopping at Sarojini for the first time. Heard shopkeepers quote triple prices if you look like an out-of-station visitor. What are the actual baseline prices?",
    "author": {
      "name": "Sneha Patel",
      "badge": "First-time Visitor",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 19
    },
    "city": "Delhi NCR",
    "locationName": "Sarojini Nagar Market",
    "lat": 28.5772,
    "lng": 77.1983,
    "category": "shopping",
    "vibeCategory": "shopping_hustle",
    "tags": [
      "#SarojiniNagar",
      "#ThriftShopping",
      "#BargainTips",
      "#StudentBudget"
    ],
    "createdAt": "Recently",
    "upvotes": 54,
    "userUpvoted": false,
    "photos": [
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80"
    ],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-5",
        "author": {
          "name": "Meher Chadha",
          "badge": "Delhi Fashion Resident",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Here is the golden rule: graphic tees ₹100-₹200 max. Jeans ₹300-₹450. Winter jackets / coats ₹500-₹800 max. If they quote ₹1200 for a coat, start your bid at ₹450 with \"Bhaiya sahi rate lagao\". Go on Tuesday morning right after fresh stock arrives.",
        "pin": {
          "lat": 28.5772,
          "lng": 77.1983,
          "name": "Sarojini Lane 4 (Behind Babu Market)",
          "neighborhood": "Sarojini Nagar",
          "type": "shopping"
        },
        "insiderTip": "Carry hard cash in small denominations (₹50, ₹100). Hawkers use lack of change as a trick to not lower prices.",
        "upvotes": 62,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-majnu-ka-tilla-hidden-spots",
    "community": "c/SecretSpots",
    "communityName": "SecretSpots Community",
    "title": "Secret rooftop cafes or quiet lanes in Majnu Ka Tilla (Tibetan Colony)?",
    "body": "Visiting MKT tomorrow afternoon with friends. Want to avoid the massive crowds at AMA Cafe and find peaceful authentic Tibetan or Korean food with rooftop views.",
    "author": {
      "name": "Aditya Sen",
      "badge": "City Explorer",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 45
    },
    "city": "Delhi NCR",
    "locationName": "Majnu Ka Tilla",
    "lat": 28.7032,
    "lng": 77.2289,
    "category": "hidden_gems",
    "vibeCategory": "aesthetic_chill",
    "tags": [
      "#HiddenGems",
      "#TibetanColony",
      "#Momos",
      "#RooftopView"
    ],
    "createdAt": "Recently",
    "upvotes": 38,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": null,
    "answers": [
      {
        "id": "ans-4",
        "author": {
          "name": "Tenzin Dolma",
          "badge": "MKT Resident (12 yrs)",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Skip AMA on weekends (2 hr waiting list!). Instead, walk deeper past the monastery to Tee Dee or Himalayan Restaurant. For views, head up to Kalsang Rooftop or Rigo Coffee. Also try the aunties selling cold spicy Laphing right in front of the central stupa for ₹60.",
        "pin": {
          "lat": 28.7035,
          "lng": 77.2294,
          "name": "Tee Dee Restaurant & Monastery Square",
          "neighborhood": "Majnu Ka Tilla",
          "type": "hidden_gem"
        },
        "insiderTip": "From Vidhan Sabha Metro, shared e-rickshaws take ₹20 fixed. Solo autos will ask ₹100 — ignore them.",
        "upvotes": 41,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-late-night-eats-south-delhi",
    "community": "c/StreetFood",
    "communityName": "StreetFood Community",
    "title": "Safe late-night food spot open till 3 AM near South Delhi / Okhla?",
    "body": "Working late with colleagues on a project and starving at 1:30 AM. Need hearty, authentic budget food that isn’t just instant noodles. Where do locals actually eat at this hour?",
    "author": {
      "name": "Priya Nambiar",
      "badge": "Backpacker",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 15
    },
    "city": "Delhi NCR",
    "locationName": "Nehru Place / Kalkaji",
    "lat": 28.5494,
    "lng": 77.2528,
    "category": "food",
    "vibeCategory": "late_night",
    "tags": [
      "#LateNight",
      "#StreetFood",
      "#StudentBudget",
      "#Parathas"
    ],
    "createdAt": "Recently",
    "upvotes": 29,
    "userUpvoted": false,
    "photos": [],
    "fareCheck": {
      "origin": "Okhla Phase 3",
      "metroFare": "N/A",
      "distanceKm": 5.8,
      "metroRoute": "Metro closed post 11:30 PM. Use Rapido / Auto / Quick Cab.",
      "cabEstimate": "₹140 - ₹175",
      "destination": "Moolchand Metro Flyover",
      "durationMin": 14,
      "scamWarning": "Night auto tariff adds 25% to standard meter rate. ₹80-₹100 is fair.",
      "metroDuration": "N/A",
      "officialAutoMeter": "₹77 - ₹90 (incl. 25% night tariff)"
    },
    "answers": [
      {
        "id": "ans-3",
        "author": {
          "name": "Kabir Vats",
          "badge": "Night Owl & Local Guide",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Head straight to Moolchand Paratha under the flyover! Open till 4:30 AM. It’s an iconic South Delhi ritual. Get the Egg Bhurji Paratha or Butter Paneer Paratha with iced tea. Safe crowd, lots of doctors from AIIMS and college students.",
        "pin": {
          "lat": 28.567,
          "lng": 77.2389,
          "name": "Moolchand Paratha Corner",
          "neighborhood": "Lajpat Nagar / Moolchand",
          "type": "food"
        },
        "insiderTip": "Auto from Okhla takes 12 mins at night. Fair fare with night surcharge is ₹85. Do not pay ₹200.",
        "upvotes": 27,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  },
  {
    "id": "q-iiitd-chandni-chowk",
    "community": "c/DelhiTransit",
    "communityName": "DelhiTransit Community",
    "title": "What is the fair auto fare from Okhla / South Delhi to Chandni Chowk right now?",
    "body": "First time visiting Delhi and staying near South Delhi / Okhla. An auto driver right outside the gate is quoting ₹500 to drop me at Chandni Chowk. Is this normal or am I getting taken for a ride? What is the quickest and most authentic way to reach without being ripped off?",
    "author": {
      "name": "Rohan Sharma",
      "badge": "First-time Traveler",
      "badgeColor": "amber",
      "isVerified": false,
      "reputation": 24
    },
    "city": "Delhi NCR",
    "locationName": "Okhla Phase 3 (South Delhi)",
    "lat": 28.5459,
    "lng": 77.2732,
    "category": "transport",
    "vibeCategory": "student_budget",
    "tags": [
      "#AutoFare",
      "#FairPriceCheck",
      "#SouthDelhi",
      "#OldDelhi"
    ],
    "createdAt": "Recently",
    "upvotes": 42,
    "userUpvoted": false,
    "photos": [
      "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800&q=80"
    ],
    "fareCheck": {
      "origin": "Okhla Phase 3 (South Delhi)",
      "metroFare": "₹40 (Token) / ₹36 (Smart Card)",
      "distanceKm": 18.6,
      "metroRoute": "Violet Line (Govindpuri) → Mandi House / Central Secretariat → Yellow Line to Chandni Chowk",
      "cabEstimate": "₹310 - ₹370",
      "destination": "Chandni Chowk (Old Delhi)",
      "durationMin": 52,
      "scamWarning": "🚨 ₹500 is over +113% above legal meter rate! Do not pay more than ₹240 for auto, or walk 8 mins to Govindpuri metro station.",
      "metroDuration": "44 mins",
      "officialAutoMeter": "₹218 - ₹245"
    },
    "answers": [
      {
        "id": "ans-2",
        "author": {
          "name": "Zoya Khan",
          "badge": "Old Delhi Food Curator",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "Once you reach Chandni Chowk, get off at Chawri Bazar Gate 3 instead of main Chandni Chowk if you want street food. It puts you 200m from Ashok Chaat Corner and Matia Mahal. Pinned the exact corner!",
        "pin": {
          "lat": 28.6496,
          "lng": 77.2268,
          "name": "Chawri Bazar Gate 3 (Street Food Alley)",
          "neighborhood": "Old Delhi",
          "type": "food"
        },
        "insiderTip": "Cycle rickshaws from metro to Jama Masjid should be ₹20-₹30 per head max. Never pay ₹100.",
        "upvotes": 21,
        "userUpvoted": false,
        "createdAt": "Recently"
      },
      {
        "id": "ans-1",
        "author": {
          "name": "Aarav Malhotra",
          "badge": "Verified South Delhi Local",
          "badgeColor": "emerald",
          "isVerified": true,
          "reputation": 350
        },
        "body": "₹500 is a total ripoff! Do NOT pay that. Walk 8 minutes down to Govindpuri Metro Station (Violet Line). Board towards Kashmere Gate, interchange at Central Secretariat to the Yellow Line, and deboard at Chawri Bazar or Chandni Chowk. Costs ₹40, takes under 45 mins, and you skip the Ashram-ITO traffic jam.",
        "pin": {
          "lat": 28.5283,
          "lng": 77.2625,
          "name": "Govindpuri Metro Station Gate 2",
          "neighborhood": "Kalkaji / Okhla",
          "type": "transit"
        },
        "insiderTip": "If taking an auto, tell him: \"Bhaiya ₹220 me chalo ya meter chalao\". If he refuses, 3 other autos near Harkesh Nagar will agree.",
        "upvotes": 35,
        "userUpvoted": false,
        "createdAt": "Recently"
      }
    ]
  }
];
