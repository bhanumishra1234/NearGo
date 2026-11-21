// scripts/seed-real-discussions.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const REAL_DISCUSSIONS = [
  // ── MUMBAI DISCUSSIONS ───────────────────────────────────────────────────────
  {
    question: {
      id: 'q-mum-marine-drive-night',
      community: 'c/MumbaiLocal',
      title: 'Best spot for late-night chai & bun maska after Marine Drive police clearing?',
      body: 'Around 1:00 AM police blow whistles on the Marine Drive promenade wall. Where do locals go nearby for late night tea or bun maska that is safe and walking distance?',
      city: 'Mumbai',
      location_name: 'Marine Drive / Churchgate',
      lat: 18.9322,
      lng: 72.8264,
      category: 'food',
      vibe_category: 'late_night',
      tags: ['#MarineDrive', '#LateNightChai', '#BunMaska', '#Churchgate'],
      author_name: 'Aditya Shenoy',
      author_badge: 'South Bombay Explorer',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 68,
      upvotes: 54,
      fare_check: null,
      photos: ['https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'],
    },
    answers: [
      {
        body: 'Head down Maharshi Karve Road towards Churchgate Station Gate 3. The 24/7 tea stalls serve fresh ginger cutting chai (₹15) and toasted maska pav with melted amul butter (₹35). Safe, well-lit, lots of college students and night commuters.',
        insider_tip: 'Autos do not operate in South Mumbai (strict taxi zone). Kaali-Peeli taxis are available all night; flag-drop meter is ₹28.',
        pin_lat: 18.9352,
        pin_lng: 72.8272,
        pin_name: 'Churchgate Gate 3 All-Night Tea Stall',
        pin_neighborhood: 'Churchgate / Marine Lines',
        pin_type: 'food',
        author_name: 'Rohit Kadam',
        author_badge: 'Verified Mumbai Local',
        author_verified: true,
        upvotes: 61,
      },
    ],
  },
  {
    question: {
      id: 'q-mum-bandra-bkc-auto',
      community: 'c/MumbaiTransit',
      title: 'Auto drivers at Bandra East skywalk demanding flat ₹100 to BKC – what is the official rate?',
      body: 'Just deboarded local train at Bandra East. Auto drivers under the skywalk are refusing meter and asking ₹100 flat for 2.5 km to ONE BKC. Is this legal or is there an official share-auto stand?',
      city: 'Mumbai',
      location_name: 'Bandra East Skywalk to BKC',
      lat: 19.0596,
      lng: 72.8458,
      category: 'transport',
      vibe_category: 'student_budget',
      tags: ['#BandraStation', '#BKC', '#AutoFare', '#FairPriceCheck'],
      author_name: 'Kavita Joshi',
      author_badge: 'Daily Commuter',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 42,
      upvotes: 78,
      fare_check: {
        origin: 'Bandra Station East',
        destination: 'Jio World Convention Centre, BKC',
        distanceKm: 2.6,
        officialAutoMeter: '₹38 - ₹45',
        cabEstimate: '₹95 - ₹130',
        metroRoute: 'Walk 40m to official share-auto queue near Guru Nanak Hospital or BEST Bus 181/310',
        metroFare: '₹20 (Share Auto) / ₹6 (BEST Bus)',
        scamWarning: '🚨 Flat ₹100 demand is +130% illegal surge. Always walk past the stairs to the official RTO share-auto stand for ₹20 flat.',
      },
      photos: [],
    },
    answers: [
      {
        body: 'Never take the individual autos standing under the skywalk stairs — they prey on commuters. Walk 50 meters straight towards Kalanagar. There is a regulated share-auto queue where they take exactly ₹20 per passenger straight to BKC connector.',
        insider_tip: 'During heavy monsoon or 6 PM rush, BEST AC Bus 181 or 310 takes 12 mins and costs only ₹6 with the Chalo app.',
        pin_lat: 19.0601,
        pin_lng: 72.8465,
        pin_name: 'Official Bandra East Share-Auto Stand',
        pin_neighborhood: 'Kalanagar / Bandra East',
        pin_type: 'transit',
        author_name: 'Prathamesh Parab',
        author_badge: 'Verified Bandra Commuter',
        author_verified: true,
        upvotes: 89,
      },
    ],
  },
  {
    question: {
      id: 'q-mum-dadar-flower-market',
      community: 'c/StreetFood',
      title: 'Visiting Dadar Phool Galli at 5 AM: safe for photography and where is the best morning Vada Pav?',
      body: 'Want to capture the sunrise wholesale flower market colors. Is 5:00 AM safe for a solo photographer carrying a camera, and which food stall opens earliest?',
      city: 'Mumbai',
      location_name: 'Dadar Flower Market (Phool Galli)',
      lat: 19.0178,
      lng: 72.8478,
      category: 'lifestyle',
      vibe_category: 'heritage',
      tags: ['#DadarPhoolGalli', '#MorningPhotoWalk', '#VadaPav', '#StreetCulture'],
      author_name: 'Sameer Varma',
      author_badge: 'Urban Documentarian',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 35,
      upvotes: 49,
      fare_check: null,
      photos: ['https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=800&q=80'],
    },
    answers: [
      {
        body: '100% safe, it is buzzing with wholesale florists from 4:00 AM. Keep your bag strapped across your chest because porters carrying marigold sacks walk swiftly. Shree Datta Snacks right outside Dadar West opens at 6:00 AM with piping hot Kothimbir Vadi and fresh Vada Pav (₹22).',
        insider_tip: 'Wear shoes with good grip. The flower washing runoff makes the pavement slick around the bridge staircase.',
        pin_lat: 19.0192,
        pin_lng: 72.8441,
        pin_name: 'Shree Datta Snacks (Dadar West)',
        pin_neighborhood: 'Senapati Bapat Marg / Dadar',
        pin_type: 'gem',
        author_name: 'Neha Sawant',
        author_badge: 'Verified Dadar Local',
        author_verified: true,
        upvotes: 56,
      },
    ],
  },
  {
    question: {
      id: 'q-mum-gateway-elephanta-ferry',
      community: 'c/MumbaiTransit',
      title: 'Ferry touts at Gateway claiming ordinary ferry is suspended, pay ₹1200 for speed boat – legit?',
      body: 'Visiting Gateway with family. Multiple guys with laminated cards in the courtyard say state ferries are shut for maintenance today and we must book ₹1200 private speedboat. What is the real ticket counter?',
      city: 'Mumbai',
      location_name: 'Gateway of India Jetty',
      lat: 18.9220,
      lng: 72.8347,
      category: 'tips',
      vibe_category: 'weekend_escape',
      tags: ['#GatewayOfIndia', '#ElephantaCaves', '#FerryFare', '#ScamAlert'],
      author_name: 'Vikram Chawla',
      author_badge: 'Family Traveler',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 20,
      upvotes: 82,
      fare_check: {
        origin: 'Gateway of India Jetty',
        destination: 'Elephanta Island Jetty',
        distanceKm: 11.2,
        officialAutoMeter: 'N/A (Waterway)',
        cabEstimate: 'N/A',
        metroRoute: 'Authorized Maharashtra Tourism Ferry from Jetty #1',
        metroFare: '₹260 Return Ticket (Upper Deck)',
        scamWarning: '🚨 Classic tourist tout trap! State-authorized ferries run continuously every 30 minutes from 9:00 AM to 2:00 PM.',
      },
      photos: [],
    },
    answers: [
      {
        body: 'Complete scam! Do not speak to any touts in the open courtyard. Walk right past the Shivaji statue straight to the stone ticket counter at Jetty 1. Authorized return ticket is ₹260 for upper deck. Ferries depart like clockwork every 30 mins.',
        insider_tip: 'Pay ₹10 extra on the boat to sit on the top open deck for unobstructed sea views and seagull feeding.',
        pin_lat: 18.9218,
        pin_lng: 72.8349,
        pin_name: 'Authorized Gateway Jetty #1 Ticket Kiosk',
        pin_neighborhood: 'Colaba / Apollo Bunder',
        pin_type: 'transit',
        author_name: 'Cyrus Mistry',
        author_badge: 'Verified Heritage Guide',
        author_verified: true,
        upvotes: 94,
      },
    ],
  },
  {
    question: {
      id: 'q-mum-carter-road-sunset',
      community: 'c/MumbaiLocal',
      title: 'Carter Road vs Bandstand on Saturday evening: best sunset stroll, street food & lesser crowd?',
      body: 'Planning a sunset coffee walk in Bandra. Bandstand or Carter Road? Which has better open seating and street snack stalls?',
      city: 'Mumbai',
      location_name: 'Carter Road Promenade, Bandra West',
      lat: 19.0664,
      lng: 72.8248,
      category: 'lifestyle',
      vibe_category: 'chill',
      tags: ['#BandraWest', '#CarterRoad', '#SunsetWalk', '#SeaBreeze'],
      author_name: 'Tanvi Deshmukh',
      author_badge: 'Bandra Resident',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 39,
      upvotes: 43,
      fare_check: null,
      photos: [],
    },
    answers: [
      {
        body: 'Carter Road hands down. Bandstand gets crowded with tour buses outside Mannat. Carter Road has the elevated wooden amphitheater boardwalk, sea breeze, dog park, and Carter’s Blue shawarma / Theobroma brownies are right across the road.',
        insider_tip: 'Reach by 5:45 PM to grab a spot on the wooden steps of the amphitheater right when the Arabian sea sunset peaks.',
        pin_lat: 19.0655,
        pin_lng: 72.8252,
        pin_name: 'Carter Road Promenade Amphitheater',
        pin_neighborhood: 'Bandra West Coastal',
        pin_type: 'gem',
        author_name: 'Ayesha Merchant',
        author_badge: 'Verified Bandra Local',
        author_verified: true,
        upvotes: 48,
      },
    ],
  },

  // ── BENGALURU DISCUSSIONS ────────────────────────────────────────────────────
  {
    question: {
      id: 'q-blr-silk-board-traffic-hack',
      community: 'c/BengaluruTransit',
      title: 'Stuck at Silk Board for 40 mins. Any feeder transit or bypass route to Bellandur ORR?',
      body: 'Autos are canceling or demanding ₹300 for a 5 km stretch to Ecospace Bellandur. What is the smartest local commuter transit to escape the Silk Board gridlock?',
      city: 'Bengaluru',
      location_name: 'Central Silk Board Junction',
      lat: 12.9177,
      lng: 77.6238,
      category: 'transport',
      vibe_category: 'student_budget',
      tags: ['#SilkBoard', '#OuterRingRoad', '#BMTCVolvo', '#TransitHack'],
      author_name: 'Anand Sundaram',
      author_badge: 'ORR Tech Commuter',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 51,
      upvotes: 84,
      fare_check: {
        origin: 'Silk Board Junction',
        destination: 'Bellandur Ecospace, ORR',
        distanceKm: 5.4,
        officialAutoMeter: '₹75 - ₹90',
        cabEstimate: '₹240 - ₹320',
        metroRoute: 'BMTC 500-Series Vajra AC Volvo via bus priority lane',
        metroFare: '₹25 (BMTC AC Ticket)',
        scamWarning: 'Peak hour auto meter refusals are common. Take BMTC 500D/500A every 3 minutes for ₹25 with chilling AC.',
      },
      photos: [],
    },
    answers: [
      {
        body: 'Do not bother with autos during 6-8 PM. Walk to the dedicated BMTC bus platform on the ORR ramp. Take any 500-series AC Volvo (500D, 500A, 500CA). It costs ₹25, has chilling AC, and glides over the HSR flyover to reach Bellandur in 18 minutes.',
        insider_tip: 'Download the Namma BMTC or Tummoc app to track the real-time GPS location of incoming Volvos.',
        pin_lat: 12.9185,
        pin_lng: 77.6242,
        pin_name: 'Silk Board ORR Bus Rapid Shelter',
        pin_neighborhood: 'Silk Board / HSR Layout',
        pin_type: 'transit',
        author_name: 'Karthik Raja',
        author_badge: 'Verified Bengaluru Commuter',
        author_verified: true,
        upvotes: 92,
      },
    ],
  },
  {
    question: {
      id: 'q-blr-church-street-book-crawl',
      community: 'c/BengaluruCulture',
      title: 'Old Blossom vs New Blossom vs Bookworm on Church Street: best secret spots for cheap paperbacks?',
      body: 'Planning a Church Street book haul this weekend. Which store has the best vintage poetry & discounted classics, and where is a good quiet corner to read with filter coffee?',
      city: 'Bengaluru',
      location_name: 'Church Street / Brigade Road',
      lat: 12.9749,
      lng: 77.6074,
      category: 'lifestyle',
      vibe_category: 'chill',
      tags: ['#ChurchStreet', '#BlossomBookHouse', '#Bookworm', '#CafeCulture'],
      author_name: 'Meera Nambisan',
      author_badge: 'Avid Reader',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 44,
      upvotes: 62,
      fare_check: null,
      photos: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80'],
    },
    answers: [
      {
        body: 'Old Blossom (inside the lane next to Coconut Grove) is the real treasure chest. Climb the creaky staircase to the 2nd and 3rd floors — vintage science fiction, theatre scripts, and ₹80 second-hand classics are stacked to the ceiling. Afterwards, walk 100 meters to Indian Coffee House on Church Street for filter coffee.',
        insider_tip: 'Ask Mayi Gowda (the owner) directly if you are looking for out-of-print Indian history books — he knows every stack by memory.',
        pin_lat: 12.9746,
        pin_lng: 77.6071,
        pin_name: 'Old Blossom Book House (Heritage Lane)',
        pin_neighborhood: 'Church Street / MG Road',
        pin_type: 'gem',
        author_name: 'Harish Shankar',
        author_badge: 'Verified Bengaluru Bibliophile',
        author_verified: true,
        upvotes: 71,
      },
    ],
  },
  {
    question: {
      id: 'q-blr-malleswaram-breakfast',
      community: 'c/StreetFood',
      title: 'Veena Stores or CTR (Shri Sagar) for early Saturday breakfast in Malleswaram?',
      body: 'Waking up early at 6:30 AM to explore heritage breakfast in Malleswaram. CTR for Benne Masala Dosa or Veena Stores for Idli-Vada? How bad are the weekend queues?',
      city: 'Bengaluru',
      location_name: 'Malleswaram 8th Cross',
      lat: 12.9988,
      lng: 77.5711,
      category: 'food',
      vibe_category: 'heritage',
      tags: ['#Malleswaram', '#VeenaStores', '#CTR', '#BenneDosa'],
      author_name: 'Deepak Rao',
      author_badge: 'Food Explorer',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 48,
      upvotes: 76,
      fare_check: null,
      photos: [],
    },
    answers: [
      {
        body: 'The veteran local move: Do both in sequence! Reach Veena Stores at 7:00 AM on Margosa Road when there is zero line. Grab 1 plate hot Idli-Vada with endless thick mint chutney (₹45, stand and eat on the footpath). Then take a 7-minute stroll to CTR on 7th Cross for their iconic crisp Benne Masala Dosa + strong filter coffee.',
        insider_tip: 'CTR queue starts multiplying by 7:45 AM. If you reach by 7:15 AM, you will get seated in under 5 minutes.',
        pin_lat: 12.9982,
        pin_lng: 77.5715,
        pin_name: 'Veena Stores (Margosa Road 15th Cross)',
        pin_neighborhood: 'Malleswaram Heritage Belt',
        pin_type: 'food',
        author_name: 'Suresh Bhat',
        author_badge: 'Verified Malleswaram Guide',
        author_verified: true,
        upvotes: 83,
      },
    ],
  },
  {
    question: {
      id: 'q-blr-nandi-hills-sunrise',
      community: 'c/WeekendEscape',
      title: 'What time does the base checkpoint open for Nandi Hills sunrise bike ride on Saturday?',
      body: 'Planning a sunrise ride with friends from Indiranagar. Heard police shut the gate if crowd gets too large. What time should we reach the base toll?',
      city: 'Bengaluru',
      location_name: 'Nandi Hills Toll Gate',
      lat: 13.3702,
      lng: 77.6835,
      category: 'places',
      vibe_category: 'weekend_escape',
      tags: ['#NandiHills', '#SunriseRide', '#WeekendEscape', '#BengaluruRiders'],
      author_name: 'Gautam Menon',
      author_badge: 'Motorcycle Tourer',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 37,
      upvotes: 59,
      fare_check: null,
      photos: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'],
    },
    answers: [
      {
        body: 'The base toll strictly opens at 6:00 AM. If you reach after 6:30 AM on a weekend, the queue of bikes and cars stretches 1.5 km and you will get stuck past sunrise. Leave Hebbal flyover by 4:45 AM. Book your entry pass on the Karnataka Forest portal in advance for the fast-track scanner.',
        insider_tip: 'Stop at Nandi Upachar on the highway return leg for piping hot Rava Idli and Masala Dosa.',
        pin_lat: 13.3688,
        pin_lng: 77.6841,
        pin_name: 'Nandi Hills Base Toll Checkpoint',
        pin_neighborhood: 'Chikkaballapur District',
        pin_type: 'gem',
        author_name: 'Vinay Hegde',
        author_badge: 'Verified Bengaluru Tourer',
        author_verified: true,
        upvotes: 68,
      },
    ],
  },
  {
    question: {
      id: 'q-blr-indiranagar-brewery',
      community: 'c/BengaluruNightlife',
      title: 'Best rooftop craft brewery on 100ft Road Indiranagar with good music and reasonable rates?',
      body: 'Hosting 4 college friends visiting Bengaluru for the first time. Want authentic microbrewery culture with fresh Hefeweizen or IPA, outdoor vibe, and not crazy expensive.',
      city: 'Bengaluru',
      location_name: '100ft Road / 12th Main, Indiranagar',
      lat: 12.9719,
      lng: 77.6412,
      category: 'food',
      vibe_category: 'nightlife',
      tags: ['#Indiranagar', '#CraftBeer', '#Toit', '#100ftRoad'],
      author_name: 'Aishwarya Iyer',
      author_badge: 'Nightlife Enthusiast',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 33,
      upvotes: 47,
      fare_check: null,
      photos: [],
    },
    answers: [
      {
        body: 'Toit is the legendary pioneer of Bengaluru craft brewing on 100ft Road. Order the Tint-in-Wit (Belgian witbier) or Basmati Blonde with the baked potato skins and wood-fired pizza. Weekday lunch before 6 PM offers 30% off on all brew tasters and pints.',
        insider_tip: 'Reserve 1 day in advance on Zomato or arrive by 12:45 PM for afternoon walk-ins to avoid the 1-hour evening waitlist.',
        pin_lat: 12.9792,
        pin_lng: 77.6408,
        pin_name: 'Toit Brewpub (100ft Road Indiranagar)',
        pin_neighborhood: 'Indiranagar 1st Stage',
        pin_type: 'food',
        author_name: 'Nikhil Rathi',
        author_badge: 'Verified Indiranagar Resident',
        author_verified: true,
        upvotes: 52,
      },
    ],
  },

  // ── DELHI NCR DISCUSSIONS ───────────────────────────────────────────────────
  {
    question: {
      id: 'q-del-mkt-tibetan-colony',
      community: 'c/DelhiLocal',
      title: 'How to reach Majnu Ka Tilla Tibetan Colony from Kashmere Gate without paying ₹150 for auto?',
      body: 'Autos outside Kashmere Gate ISBT quote ₹150-₹200 to drop at Majnu Ka Tilla monastery. Is there a shared e-rickshaw stand or direct metro route?',
      city: 'Delhi NCR',
      location_name: 'Majnu Ka Tilla, New Aruna Nagar',
      lat: 28.7013,
      lng: 77.2274,
      category: 'transport',
      vibe_category: 'student_budget',
      tags: ['#MajnuKaTilla', '#MKT', '#TibetanFood', '#DelhiMetro'],
      author_name: 'Tenzin Norbu',
      author_badge: 'North Campus Student',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 38,
      upvotes: 73,
      fare_check: {
        origin: 'Vidhan Sabha Metro Station Gate 2',
        destination: 'Majnu Ka Tilla Main Monastery Gate',
        distanceKm: 2.3,
        officialAutoMeter: '₹35 - ₹42',
        cabEstimate: '₹80 - ₹110',
        metroRoute: 'Yellow Line to Vidhan Sabha → Shared E-rickshaw from Gate 2',
        metroFare: '₹20 (Metro) + ₹20 (E-rickshaw)',
        scamWarning: 'Never take unmetered autos outside Kashmere Gate. Shared e-rickshaws from Vidhan Sabha Gate 2 are strictly ₹20 per seat.',
      },
      photos: ['https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'],
    },
    answers: [
      {
        body: 'Never take an auto from Kashmere Gate! Board the Yellow Line towards Samaypur Badli, deboard at Vidhan Sabha (2 stops, ₹20). Come out of Gate 2: there is an organized queue of shared e-rickshaws charging ₹20 flat directly to the MKT pedestrian footbridge.',
        insider_tip: 'Once inside MKT, try the spicy cold Laphing at the monastery courtyard stall (₹50) and then walk to AMA Cafe for blueberry cheesecake.',
        pin_lat: 28.7008,
        pin_lng: 77.2278,
        pin_name: 'Majnu Ka Tilla Footbridge Entrance',
        pin_neighborhood: 'Timarpur / Civil Lines',
        pin_type: 'gem',
        author_name: 'Aarav Malhotra',
        author_badge: 'Verified North Delhi Guide',
        author_verified: true,
        upvotes: 88,
      },
    ],
  },
  {
    question: {
      id: 'q-del-sarojini-market-hacks',
      community: 'c/DelhiShopping',
      title: 'Which Sarojini Nagar Metro gate is closest, and what is the baseline bargaining rule for street clothes?',
      body: 'First time going to Sarojini for summer shopping. Which metro gate leads straight to the export surplus lane, and how much can you bargain without annoying shopkeepers?',
      city: 'Delhi NCR',
      location_name: 'Sarojini Nagar Market',
      lat: 28.5772,
      lng: 77.1983,
      category: 'lifestyle',
      vibe_category: 'student_budget',
      tags: ['#SarojiniNagar', '#ThriftShopping', '#BargainingGuide', '#DelhiStreetStyle'],
      author_name: 'Simran Khurana',
      author_badge: 'Fashion Student',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 49,
      upvotes: 91,
      fare_check: null,
      photos: [],
    },
    answers: [
      {
        body: 'Take the Pink Line and exit Gate 1 (puts you directly at the lane 1 entrance). Golden rule of Sarojini bargaining: quote 40% of their opening price. If a jacket is quoted at ₹800, offer ₹300 and settle at ₹350-₹400. Best spots: The central Graffiti Lane for oversized hoodies and the ₹100-₹150 tables in the Subzi Mandi square. Tuesday morning 11 AM has the freshest export drops.',
        insider_tip: 'Carry cash in ₹100 and ₹50 notes. Many small stall owners will give you a better deal if you have exact cash rather than waiting for UPI scanner in crowded lanes.',
        pin_lat: 28.5781,
        pin_lng: 77.1979,
        pin_name: 'Sarojini Nagar Metro Gate 1',
        pin_neighborhood: 'Sarojini Nagar / Safdarjung',
        pin_type: 'transit',
        author_name: 'Ananya Gujral',
        author_badge: 'Verified South Delhi Shopper',
        author_verified: true,
        upvotes: 104,
      },
    ],
  },
  {
    question: {
      id: 'q-del-gurgaon-rapid-metro',
      community: 'c/GurugramTransit',
      title: 'Fastest way from DLF Cyber Hub to Sector 54 Golf Course Road at 7 PM without cab surge?',
      body: 'Cabs on app are quoting ₹450 with 25-minute wait time to cross the Shankar Chowk jam towards Golf Course Road. Is the Rapid Metro running smoothly?',
      city: 'Delhi NCR',
      location_name: 'DLF Cyber Hub, Gurugram',
      lat: 28.4950,
      lng: 77.0895,
      category: 'transport',
      vibe_category: 'student_budget',
      tags: ['#CyberHub', '#GolfCourseRoad', '#RapidMetro', '#GurugramTransit'],
      author_name: 'Deepak Chawla',
      author_badge: 'Cyber City Professional',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 36,
      upvotes: 66,
      fare_check: {
        origin: 'Cyber City Rapid Metro',
        destination: 'Sector 54 Chowk Station',
        distanceKm: 6.8,
        officialAutoMeter: '₹85 - ₹105',
        cabEstimate: '₹380 - ₹480',
        metroRoute: 'Rapid Metro Gurugram (Phase 2 to Sector 55-56 line)',
        metroFare: '₹35 (Token / DMRC Smart Card)',
        scamWarning: 'Cyber City junction is gridlocked from 6:30 to 8:30 PM. Rapid Metro takes 14 minutes flat for ₹35.',
      },
      photos: [],
    },
    answers: [
      {
        body: 'Skip cabs completely! Rapid Metro station is right inside Cyber Hub (walk past Starbucks). You can tap your standard DMRC Smart Card or pay ₹35 via Paytm QR. Trains arrive every 4 minutes, fully air-conditioned, and reach Sector 54 in 14 minutes, gliding right over the bumper-to-bumper traffic.',
        insider_tip: 'If you work in DLF Phase 2 or 3, you can use the covered pedestrian walkway connected from Cyber Hub to the station without stepping onto the road.',
        pin_lat: 28.4942,
        pin_lng: 77.0888,
        pin_name: 'Cyber City Rapid Metro Station',
        pin_neighborhood: 'DLF Cyber City / Gurugram',
        pin_type: 'transit',
        author_name: 'Kunal Singhania',
        author_badge: 'Verified Gurugram Commuter',
        author_verified: true,
        upvotes: 75,
      },
    ],
  },
  {
    question: {
      id: 'q-del-hauz-khas-sunset',
      community: 'c/DelhiHeritage',
      title: 'Is Hauz Khas Fort entry free now, and where is the quiet deer park lake sunset point?',
      body: 'Visiting HKV for an afternoon stroll. Is there an ASI ticket required for the monuments, and is there an uncrowded spot by the lake to watch sunset?',
      city: 'Delhi NCR',
      location_name: 'Hauz Khas Village Fort & Lake',
      lat: 28.5534,
      lng: 77.1943,
      category: 'places',
      vibe_category: 'heritage',
      tags: ['#HauzKhas', '#HKV', '#SunsetPoint', '#DeerPark'],
      author_name: 'Pooja Kashyap',
      author_badge: 'Heritage Walker',
      author_badge_color: 'amber',
      author_verified: false,
      author_reputation: 28,
      upvotes: 57,
      fare_check: null,
      photos: [],
    },
    answers: [
      {
        body: 'ASI ticket is ₹25 (scan the QR code at the iron gate via ASI portal; no cash accepted). Once inside, do not stay in the crowded main courtyard — walk down the stone arches to the rear bastion overlooking the ancient 14th-century reservoir. If you want peace, take the dirt trail connecting directly into Deer Park where peacocks roam freely at 5 PM.',
        insider_tip: 'Autos outside HKV village gate charge ₹100 for 1 km to Green Park metro. Walk 6 minutes to the main Aurobindo Marg road and pay ₹30 on meter.',
        pin_lat: 28.5528,
        pin_lng: 77.1939,
        pin_name: 'Hauz Khas Fort Lake Bastion',
        pin_neighborhood: 'Hauz Khas Village / Green Park',
        pin_type: 'gem',
        author_name: 'Dhruv Sehgal',
        author_badge: 'Verified South Delhi Explorer',
        author_verified: true,
        upvotes: 63,
      },
    ],
  },
];

async function seedDiscussions() {
  console.log('[NearGo Seed] Connecting to Supabase...');
  
  let insertedQuestions = 0;
  let insertedAnswers = 0;

  for (const item of REAL_DISCUSSIONS) {
    const q = item.question;
    
    // Check if question exists by id or title
    const { data: existingQ } = await supabase
      .from('questions')
      .select('id')
      .or(`id.eq.${q.id},title.eq."${q.title.replace(/"/g, '')}"`)
      .maybeSingle();

    let questionId = q.id;

    if (!existingQ) {
      const { data: newQ, error: qErr } = await supabase
        .from('questions')
        .insert({
          id: q.id,
          title: q.title,
          body: q.body,
          community: q.community,
          city: q.city,
          location_name: q.location_name,
          lat: q.lat,
          lng: q.lng,
          category: q.category,
          vibe_category: q.vibe_category,
          tags: q.tags,
          author_name: q.author_name,
          author_badge: q.author_badge,
          author_badge_color: q.author_badge_color || 'amber',
          author_verified: q.author_verified,
          author_reputation: q.author_reputation,
          upvotes: q.upvotes || 10,
          fare_check: q.fare_check,
          photos: q.photos || [],
        })
        .select()
        .single();

      if (qErr) {
        console.error(`Failed to insert question "${q.title}":`, qErr.message);
        continue;
      }
      questionId = newQ.id;
      insertedQuestions++;
      console.log(`✓ Inserted question [${q.city}]: ${q.title.slice(0, 45)}...`);
    } else {
      questionId = existingQ.id;
      console.log(`- Question exists [${q.city}]: ${q.title.slice(0, 45)}...`);
    }

    // Insert Answers if any
    for (const ans of item.answers) {
      const { data: existingAns } = await supabase
        .from('answers')
        .select('id')
        .eq('question_id', questionId)
        .ilike('body', `%${ans.body.slice(0, 30)}%`)
        .maybeSingle();

      if (!existingAns) {
        const answerId = 'ans-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
        const { error: ansErr } = await supabase
          .from('answers')
          .insert({
            id: answerId,
            question_id: questionId,
            body: ans.body,
            insider_tip: ans.insider_tip,
            pin_lat: ans.pin_lat,
            pin_lng: ans.pin_lng,
            pin_name: ans.pin_name,
            pin_neighborhood: ans.pin_neighborhood,
            pin_type: ans.pin_type || 'gem',
            author_name: ans.author_name,
            author_badge: ans.author_badge,
            author_verified: ans.author_verified,
            upvotes: ans.upvotes || 5,
            photos: [],
          });

        if (ansErr) {
          console.error(`  Failed to insert answer for "${q.title}":`, ansErr.message);
        } else {
          insertedAnswers++;
          console.log(`  ✓ Inserted verified answer by ${ans.author_name}`);
        }
      }
    }
  }

  console.log(`\n🎉 Seed Complete! Inserted ${insertedQuestions} questions and ${insertedAnswers} answers.`);
}

seedDiscussions().catch((err) => {
  console.error('Seed execution error:', err);
  process.exit(1);
});
