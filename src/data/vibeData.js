// NearGo Vibe Engine & Indic Traveler Lexicon
// Translates raw street culture into structured traveler clarity

export const VIBE_CATEGORIES = [
  {
    id: 'all',
    label: 'All Vibes',
    icon: '✨',
    description: 'Explore all local questions and pinned recommendations'
  },
  {
    id: 'student_budget',
    label: 'Student Budget (₹)',
    icon: '🎓',
    description: 'Pocket-friendly spots where you can feast under ₹150 with zero pretension'
  },
  {
    id: 'late_night',
    label: 'Late Night Vibe',
    icon: '🌙',
    description: 'Open past 1:00 AM, safe, buzzing midnight parathas & kulhad chai'
  },
  {
    id: 'street_food',
    label: 'Street Food Heaven',
    icon: '🥟',
    description: 'Spicy, secret alleys, generational recipes passed down decades'
  },
  {
    id: 'heritage_raw',
    label: 'Heritage & Old Soul',
    icon: '🏛️',
    description: 'Stepwells, Mughal lanes, sufi music, hidden historic rooftops'
  },
  {
    id: 'aesthetic_chill',
    label: 'Aesthetic & Work',
    icon: '☕',
    description: 'Chill vibe, greenery, good coffee, fast Wi-Fi for nomads & students'
  },
  {
    id: 'shopping_hustle',
    label: 'Flea & Bargain',
    icon: '🛍️',
    description: 'Bustling bazaars with genuine insider bargaining formulas'
  }
];

export const INDIC_SLANG_DICTIONARY = [
  {
    phrase: 'Meter se chalo bhaiya',
    phonetic: 'Mee-ter say chal-oh bhai-yaa',
    literal: 'Run by the meter, brother',
    meaning: 'The magic phrase for auto-rickshaws. Auto drivers in Delhi are legally required to start the electronic meter. If they refuse, quote the NearGo fair meter fare.',
    situation: 'Hailing an auto outside metro stations, railway terminals, or busy markets.',
    effectivenessScore: '92% success rate',
    category: 'transport'
  },
  {
    phrase: 'Bhaiya, thoda theek lagao',
    phonetic: 'Bhai-yaa, tho-da theek lah-gao',
    literal: 'Brother, quote a proper/fair price',
    meaning: 'A polite yet firm bargaining opener that signals you know the local market rates and cannot be easily overcharged as a naive tourist.',
    situation: 'Street shopping at Sarojini Nagar, Janpath, or negotiating an unmetered rickshaw.',
    effectivenessScore: '85% success rate',
    category: 'bargaining'
  },
  {
    phrase: 'Jugaad',
    phonetic: 'Joo-gaad',
    literal: 'Clever hack / resourceful workaround',
    meaning: 'A flexible, innovative fix to any logistical problem (e.g., catching a shared e-rickshaw for ₹10 instead of a ₹150 solo cab).',
    situation: 'Navigating crowded alleys or last-mile college transit.',
    effectivenessScore: 'Universal',
    category: 'culture'
  },
  {
    phrase: 'Gedi route',
    phonetic: 'Gay-dee route',
    literal: 'Cruising / leisure stroll strip',
    meaning: 'A lively, scenic street popular in the evening for friends walking, street food hopping, and people-watching.',
    situation: 'North Campus Hudson Lane or Connaught Place outer circle.',
    effectivenessScore: 'High Vibe',
    category: 'lifestyle'
  },
  {
    phrase: 'Khaoo Gali',
    phonetic: 'Kha-ooh Gah-lee',
    literal: 'Eat Street',
    meaning: 'A dedicated pedestrian alley packed wall-to-wall with sizzling street food stalls, chai joints, and desserts.',
    situation: 'Matia Mahal (Jama Masjid) or Chache Di Hatti in Kamla Nagar.',
    effectivenessScore: 'Gastronomic Gold',
    category: 'food'
  },
  {
    phrase: 'Pehli baar thodi aaye hain!',
    phonetic: 'Pehl-ee baar tho-dee aaye hain',
    literal: 'It’s not my first time here!',
    meaning: 'Used to casually deflect absurd initial price quotes with a smile.',
    situation: 'When an auto driver quotes ₹300 for a 2km ride.',
    effectivenessScore: '88% discount triggered',
    category: 'bargaining'
  }
];

export const VIBE_CURATED_SPOTS = [
  {
    id: 'vibe-1',
    name: 'Moolchand Metro Parathas',
    tag: 'late_night',
    vibeScore: 97,
    neighborhood: 'South Delhi (Moolchand)',
    openTill: '4:30 AM',
    avgCost: '₹120 for two',
    insiderTip: 'Get the Egg-Keema or Paneer Onion paratha with amul butter slab and spicy mint chutney. Autos wait right beside.',
    lat: 28.5670,
    lng: 77.2389,
    crowdVibe: 'Lively midnight student hangout, quick takeaway'
  },
  {
    id: 'vibe-2',
    name: 'Majnu Ka Tilla AMA Cafe & Laphing Stalls',
    tag: 'aesthetic_chill',
    vibeScore: 94,
    neighborhood: 'North Delhi (MKT)',
    openTill: '10:30 PM',
    avgCost: '₹200 - ₹350',
    insiderTip: 'Take Yellow Line to Vidhan Sabha, then an e-rickshaw for ₹20 fixed. Cold spicy laphing in the monastery courtyard is ₹60.',
    lat: 28.7032,
    lng: 77.2289,
    crowdVibe: 'Tibetan prayer flags, indie bakeries, peaceful vibe'
  },
  {
    id: 'vibe-3',
    name: 'Agrasen Ki Baoli',
    tag: 'heritage_raw',
    vibeScore: 91,
    neighborhood: 'Central Delhi (Near CP)',
    openTill: '5:30 PM',
    avgCost: 'Free entry',
    insiderTip: 'Hidden right behind high-rise buildings near KG Marg. Go around 8:00 AM on weekdays to avoid social media crowds.',
    lat: 28.6258,
    lng: 77.2250,
    crowdVibe: 'Ancient 14th century stone stepwell, silent acoustic echoes'
  },
  {
    id: 'vibe-4',
    name: 'Sarojini Nagar Export Lane 4',
    tag: 'shopping_hustle',
    vibeScore: 96,
    neighborhood: 'South Delhi',
    openTill: '8:30 PM (Closed Mondays)',
    avgCost: '₹100 - ₹500',
    insiderTip: 'Rule of thumb: Counter whatever price the hawker says with 40-50% less with a friendly smile.',
    lat: 28.5772,
    lng: 77.1983,
    crowdVibe: 'High-energy, hyper-budget fashion bargain bazaar'
  },
  {
    id: 'vibe-5',
    name: 'Okhla Student Tapri & Dhaba Corner',
    tag: 'student_budget',
    vibeScore: 95,
    neighborhood: 'Okhla Phase 3',
    openTill: '3:00 AM',
    avgCost: '₹30 - ₹90',
    insiderTip: 'College students and late night workers gather here for ₹15 adrak chai, bun maska, and hot maggi.',
    lat: 28.5459,
    lng: 77.2732,
    crowdVibe: 'Youthful night crowd, student banter, budget midnight fuel'
  }
];
