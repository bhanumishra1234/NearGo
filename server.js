// NearGo REST API Server (Node.js + Express)
// Powers live question persistence, map pin GeoJSON queries, and fair price benchmarking

import express from 'express';
import cors from 'cors';
import { INITIAL_QUESTIONS } from './src/data/seedData.js';
import {
  CITY_TARIFFS,
  POPULAR_LANDMARKS,
  calculateDistance,
  calculateRouteFare,
  evaluateDriverQuote
} from './src/data/tariffs.js';
import { VIBE_CATEGORIES, INDIC_SLANG_DICTIONARY, VIBE_CURATED_SPOTS } from './src/data/vibeData.js';
import { NCR_METRO_STATIONS, METRO_LINES, getStationsByLine, searchMetroStations } from './src/data/metroData.js';
import { runScheduledFareSync } from './scripts/cron-job.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory persistent state (seeded with authentic local data)
let questions = JSON.parse(JSON.stringify(INITIAL_QUESTIONS));

// 1. Health & status endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'NearGo',
    edition: 'Community City Edition',
    engine: 'NearGo Municipal Tariff & Aggregator Fair Price Intelligence',
    activeQuestionsCount: questions.length,
    activePinsCount: questions.reduce((acc, q) => acc + 1 + q.answers.filter(a => a.pin).length, 0),
  });
});

// 2. Landmarks list for quick route selection
app.get('/api/landmarks', (req, res) => {
  res.json({ landmarks: POPULAR_LANDMARKS });
});

// 2b. NCR Metro Stations (Delhi Metro, Noida Metro, Rapid Metro Gurugram)
app.get('/api/metro-stations', (req, res) => {
  const { line, search, network } = req.query;
  let stations = [...NCR_METRO_STATIONS];

  if (line && line !== 'all') {
    stations = stations.filter(s => s.line === line || (s.interchangeLines && s.interchangeLines.includes(line)));
  }
  if (network && network !== 'all') {
    stations = stations.filter(s => s.network.toLowerCase() === network.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    stations = stations.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.zone.toLowerCase().includes(q)
    );
  }

  res.json({
    count: stations.length,
    networks: ['DMRC', 'NMRC (Aqua Line)', 'Rapid Metro Gurugram'],
    stations,
  });
});

app.get('/api/metro-lines', (req, res) => {
  res.json({ lines: METRO_LINES });
});

// 3. Get Questions (with filtering & search)
app.get('/api/questions', (req, res) => {
  const { city, vibe, category, search, hasFare } = req.query;
  let filtered = [...questions];

  if (city) {
    filtered = filtered.filter(q => q.city.toLowerCase().includes(city.toLowerCase()));
  }
  if (vibe && vibe !== 'all') {
    filtered = filtered.filter(q => q.vibeCategory === vibe);
  }
  if (category && category !== 'all') {
    filtered = filtered.filter(q => q.category === category);
  }
  if (hasFare === 'true') {
    filtered = filtered.filter(q => Boolean(q.fareCheck));
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      q =>
        q.title.toLowerCase().includes(s) ||
        q.body.toLowerCase().includes(s) ||
        q.locationName.toLowerCase().includes(s) ||
        q.tags.some(t => t.toLowerCase().includes(s))
    );
  }

  res.json({ count: filtered.length, questions: filtered });
});

// 4. Create a new traveler question
app.post('/api/questions', (req, res) => {
  const {
    title,
    body,
    locationName,
    city = 'Delhi NCR',
    lat,
    lng,
    category = 'general',
    vibeCategory = 'student_budget',
    tags = [],
    authorName = 'Anonymous Traveler',
    requestFareCheck = false,
    fareOrigin,
    fareDestination,
  } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and question body are required' });
  }

  let computedFareCheck = null;
  if (requestFareCheck && fareOrigin && fareDestination) {
    // Lookup landmarks or calculate distance
    const origL = POPULAR_LANDMARKS.find(l => l.name.toLowerCase().includes(fareOrigin.toLowerCase()));
    const destL = POPULAR_LANDMARKS.find(l => l.name.toLowerCase().includes(fareDestination.toLowerCase()));

    const oLat = origL ? origL.lat : (lat || 28.5459);
    const oLng = origL ? origL.lng : (lng || 77.2732);
    const dLat = destL ? destL.lat : 28.6562;
    const dLng = destL ? destL.lng : 77.2309;

    const distance = calculateDistance(oLat, oLng, dLat, dLng);
    const fareResult = calculateRouteFare({ cityKey: 'delhi', distanceKm: distance });

    computedFareCheck = {
      origin: fareOrigin,
      destination: fareDestination,
      distanceKm: distance,
      durationMin: fareResult.durationMin,
      officialAutoMeter: `₹${fareResult.auto.min} - ₹${fareResult.auto.max}`,
      cabEstimate: `₹${fareResult.cabs.mini.min} - ₹${fareResult.cabs.mini.max}`,
      metroRoute: `Direct metro network corridor (${distance} km transit)`,
      metroFare: `₹${fareResult.metro.tokenFare} Token / ₹${fareResult.metro.smartCardFare} Card`,
      metroDuration: `${fareResult.metro.estimatedTimeMin} mins`,
      scamWarning: `Always verify against municipal meter fare: ₹${fareResult.auto.exactMeter}. Avoid paying unmetered tourist surge.`,
    };
  }

  const newQuestion = {
    id: `q-${Date.now()}`,
    title,
    body,
    author: {
      name: authorName,
      badge: 'Curious Traveler',
      badgeColor: 'amber',
      isVerified: false,
      reputation: 10,
    },
    city,
    locationName: locationName || 'Delhi NCR',
    lat: lat || 28.5459,
    lng: lng || 77.2732,
    category,
    vibeCategory,
    tags: tags.length ? tags : ['#TravelHelp', '#LocalAdvice'],
    createdAt: 'Just now',
    upvotes: 1,
    userUpvoted: true,
    fareCheck: computedFareCheck,
    photos: req.body.photos || [],
    answers: [],
  };

  questions.unshift(newQuestion);
  res.status(201).json({ success: true, question: newQuestion });
});

// 5. Post a verified local answer to a question
app.post('/api/questions/:id/answers', (req, res) => {
  const { id } = req.params;
  const {
    body,
    authorName = 'Delhi Local Guide',
    badge = 'Verified Local',
    pinName,
    pinLat,
    pinLng,
    neighborhood,
    pinType = 'gem',
    insiderTip,
  } = req.body;

  const question = questions.find(q => q.id === id);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  if (!body) {
    return res.status(400).json({ error: 'Answer content is required' });
  }

  let pin = req.body.pin || null;
  if (!pin && pinLat && pinLng && pinName) {
    pin = {
      lat: parseFloat(pinLat),
      lng: parseFloat(pinLng),
      name: pinName,
      neighborhood: neighborhood || question.locationName,
      type: pinType,
    };
  }

  const newAnswer = {
    id: `ans-${Date.now()}`,
    author: {
      name: authorName,
      badge: badge || 'Helpful Local',
      badgeColor: 'emerald',
      isVerified: true,
      reputation: 150,
    },
    body,
    pin,
    insiderTip: insiderTip || null,
    photos: req.body.photos || [],
    upvotes: 1,
    userUpvoted: true,
    createdAt: 'Just now',
  };

  question.answers.push(newAnswer);
  res.status(201).json({ success: true, answer: newAnswer, question });
});

// 6. Upvote Question
app.post('/api/questions/:id/upvote', (req, res) => {
  const { id } = req.params;
  const question = questions.find(q => q.id === id);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  question.userUpvoted = !question.userUpvoted;
  question.upvotes += question.userUpvoted ? 1 : -1;
  res.json({ success: true, upvotes: question.upvotes, userUpvoted: question.userUpvoted });
});

// 7. Upvote Answer
app.post('/api/questions/:qId/answers/:ansId/upvote', (req, res) => {
  const { qId, ansId } = req.params;
  const question = questions.find(q => q.id === qId);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const answer = question.answers.find(a => a.id === ansId);
  if (!answer) return res.status(404).json({ error: 'Answer not found' });

  answer.userUpvoted = !answer.userUpvoted;
  answer.upvotes += answer.userUpvoted ? 1 : -1;
  res.json({ success: true, upvotes: answer.upvotes, userUpvoted: answer.userUpvoted });
});

// 8. Fair Price Engine Route Fare Calculation
app.post('/api/fares/calculate', (req, res) => {
  const {
    cityKey = 'delhi',
    origin,
    destination,
    originCoords,
    destCoords,
    isNight = false,
    luggageCount = 0,
    trafficMultiplier = 1.0,
  } = req.body;

  let distanceKm = 10;
  if (originCoords && destCoords) {
    distanceKm = calculateDistance(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);
  } else if (origin && destination) {
    const origL = POPULAR_LANDMARKS.find(l => l.name.toLowerCase().includes(origin.toLowerCase()) || l.id === origin);
    const destL = POPULAR_LANDMARKS.find(l => l.name.toLowerCase().includes(destination.toLowerCase()) || l.id === destination);
    if (origL && destL) {
      distanceKm = calculateDistance(origL.lat, origL.lng, destL.lat, destL.lng);
    }
  }

  const result = calculateRouteFare({
    cityKey,
    distanceKm,
    isNight,
    luggageCount,
    trafficMultiplier,
  });

  res.json({ success: true, result, origin, destination });
});

// 9. Scam / Price Gouge Detector
app.post('/api/fares/scam-check', (req, res) => {
  const { quotedPrice, distanceKm, cityKey = 'delhi', isNight = false } = req.body;
  if (!quotedPrice || !distanceKm) {
    return res.status(400).json({ error: 'Quoted price and distanceKm are required' });
  }

  const fairEstimate = calculateRouteFare({ cityKey, distanceKm: parseFloat(distanceKm), isNight });
  const evaluation = evaluateDriverQuote(parseFloat(quotedPrice), fairEstimate);

  res.json({
    success: true,
    evaluation,
    fairEstimate,
  });
});

// 10. Vibe Engine & Slang Dictionary
app.get('/api/vibe/curated', (req, res) => {
  res.json({
    categories: VIBE_CATEGORIES,
    dictionary: INDIC_SLANG_DICTIONARY,
    curatedSpots: VIBE_CURATED_SPOTS,
  });
});

// 11. Scheduled Cron Job Endpoint (Vercel Cron & Webhook Trigger)
app.all('/api/cron/sync-fares', async (req, res) => {
  try {
    const report = await runScheduledFareSync();
    res.json({
      success: true,
      trigger: req.headers['x-vercel-cron'] ? 'vercel-cron' : 'webhook-or-client',
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve built frontend assets if dist exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.json({
    app: 'NearGo REST API Engine',
    status: 'online',
    frontend: 'https://neargo-sandy.vercel.app',
    endpoints: {
      health: '/api/health',
      questions: '/api/questions',
      landmarks: '/api/landmarks',
      fairPrice: '/api/fare-check',
      cron: '/api/cron/sync-fares'
    }
  });
});

// Periodic in-process fallback cron timer (every 6 hours)
const SIX_HOURS = 6 * 60 * 60 * 1000;
setInterval(() => {
  runScheduledFareSync().catch((err) => console.error('[In-process Cron Error]', err));
}, SIX_HOURS);

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`[NearGo Backend] Running on http://localhost:${PORT}`);
    console.log(`[NearGo Backend] Ready with ${questions.length} initial questions & fair price engine.`);
  });
}

export default app;
