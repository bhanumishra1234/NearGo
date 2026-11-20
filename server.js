// NearGo REST API Server (Node.js + Express + Supabase)
// Powers live question persistence, map pin GeoJSON queries, and fair price benchmarking

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

import {
  POPULAR_LANDMARKS,
  calculateDistance,
  calculateRouteFare,
  evaluateDriverQuote
} from './src/data/tariffs.js';
import { VIBE_CATEGORIES, INDIC_SLANG_DICTIONARY, VIBE_CURATED_SPOTS } from './src/data/vibeData.js';
import { NCR_METRO_STATIONS, METRO_LINES } from './src/data/metroData.js';
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

// ── Supabase Client ──────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Helper: map DB row → frontend shape
function mapQuestion(q) {
  return {
    id: q.id,
    community: q.community,
    title: q.title,
    body: q.body,
    city: q.city,
    locationName: q.location_name,
    lat: q.lat,
    lng: q.lng,
    category: q.category,
    vibeCategory: q.vibe_category,
    tags: q.tags || [],
    author: {
      name: q.author_name,
      badge: q.author_badge,
      badgeColor: q.author_badge_color,
      isVerified: q.author_verified,
      reputation: q.author_reputation,
    },
    upvotes: q.upvotes,
    photos: q.photos || [],
    fareCheck: q.fare_check || null,
    createdAt: q.created_at,
    answers: (q.answers || []).map(mapAnswer),
  };
}

function mapAnswer(a) {
  return {
    id: a.id,
    body: a.body,
    insiderTip: a.insider_tip,
    photos: a.photos || [],
    upvotes: a.upvotes,
    pin: (a.pin_lat && a.pin_lng)
      ? { lat: a.pin_lat, lng: a.pin_lng, name: a.pin_name, neighborhood: a.pin_neighborhood, type: a.pin_type }
      : null,
    author: {
      name: a.author_name,
      badge: a.author_badge,
      badgeColor: a.author_badge_color,
      isVerified: a.author_verified,
      reputation: a.author_reputation,
    },
    createdAt: a.created_at,
  };
}

// ── 1. Health ────────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true });
  res.json({
    status: 'online',
    app: 'NearGo',
    edition: 'Community City Edition (Supabase)',
    activeQuestionsCount: count || 0,
  });
});

// ── 2. Landmarks ─────────────────────────────────────────────────────────────
app.get('/api/landmarks', (req, res) => {
  res.json({ landmarks: POPULAR_LANDMARKS });
});

// ── 2b. Metro Stations ───────────────────────────────────────────────────────
app.get('/api/metro-stations', (req, res) => {
  const { line, search, network } = req.query;
  let stations = [...NCR_METRO_STATIONS];
  if (line && line !== 'all') stations = stations.filter(s => s.line === line || s.interchangeLines?.includes(line));
  if (network && network !== 'all') stations = stations.filter(s => s.network.toLowerCase() === network.toLowerCase());
  if (search) { const q = search.toLowerCase(); stations = stations.filter(s => s.name.toLowerCase().includes(q) || s.zone.toLowerCase().includes(q)); }
  res.json({ count: stations.length, networks: ['DMRC', 'NMRC (Aqua Line)', 'Rapid Metro Gurugram'], stations });
});

app.get('/api/metro-lines', (req, res) => res.json({ lines: METRO_LINES }));

// ── 3. Get Questions ─────────────────────────────────────────────────────────
app.get('/api/questions', async (req, res) => {
  const { city, vibe, category, search, hasFare } = req.query;

  let query = supabase
    .from('questions')
    .select('*, answers(*)')
    .order('created_at', { ascending: false });

  if (city)                query = query.ilike('city', `%${city}%`);
  if (vibe && vibe !== 'all') query = query.eq('vibe_category', vibe);
  if (category && category !== 'all') query = query.eq('category', category);
  if (hasFare === 'true') query = query.not('fare_check', 'is', null);
  if (search) {
    query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%,location_name.ilike.%${search}%`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  res.json({ count: data.length, questions: data.map(mapQuestion) });
});

// ── 4. Create Question ───────────────────────────────────────────────────────
app.post('/api/questions', async (req, res) => {
  const {
    title, body, locationName, city = 'Delhi NCR',
    lat, lng, category = 'general', vibeCategory = 'student_budget',
    tags = [], authorName = 'Anonymous Traveler', community = 'c/DelhiLocal',
    requestFareCheck = false, fareOrigin, fareDestination, photos = [],
  } = req.body;

  if (!title || !body) return res.status(400).json({ error: 'Title and body are required' });

  let fareCheck = null;
  if (requestFareCheck && fareOrigin && fareDestination) {
    const origL = POPULAR_LANDMARKS.find(l => l.name.toLowerCase().includes(fareOrigin.toLowerCase()));
    const destL = POPULAR_LANDMARKS.find(l => l.name.toLowerCase().includes(fareDestination.toLowerCase()));
    const oLat = origL?.lat || lat || 28.5459, oLng = origL?.lng || lng || 77.2732;
    const dLat = destL?.lat || 28.6562, dLng = destL?.lng || 77.2309;
    const distance = calculateDistance(oLat, oLng, dLat, dLng);
    const fare = calculateRouteFare({ cityKey: 'delhi', distanceKm: distance });
    fareCheck = {
      origin: fareOrigin, destination: fareDestination, distanceKm: distance,
      officialAutoMeter: `₹${fare.auto.min} - ₹${fare.auto.max}`,
      cabEstimate: `₹${fare.cabs.mini.min} - ₹${fare.cabs.mini.max}`,
      metroFare: `₹${fare.metro.tokenFare} Token`,
      scamWarning: `Official meter: ₹${fare.auto.exactMeter}. Avoid unmetered tourist surge.`,
    };
  }

  const { data, error } = await supabase.from('questions').insert({
    title, body, community,
    city, location_name: locationName || city,
    lat: lat || 28.5459, lng: lng || 77.2732,
    category, vibe_category: vibeCategory,
    tags: tags.length ? tags : ['#TravelHelp'],
    author_name: authorName,
    photos, fare_check: fareCheck,
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, question: mapQuestion({ ...data, answers: [] }) });
});

// ── 5. Post Answer ───────────────────────────────────────────────────────────
app.post('/api/questions/:id/answers', async (req, res) => {
  const { id } = req.params;
  const { body, authorName = 'Delhi Local Guide', badge = 'Verified Local',
    pinLat, pinLng, pinName, neighborhood, pinType = 'gem', insiderTip, photos = [] } = req.body;

  if (!body) return res.status(400).json({ error: 'Answer body required' });

  const { data, error } = await supabase.from('answers').insert({
    question_id: id,
    body, insider_tip: insiderTip || null, photos,
    pin_lat: pinLat || null, pin_lng: pinLng || null,
    pin_name: pinName || null, pin_neighborhood: neighborhood || null, pin_type: pinType,
    author_name: authorName, author_badge: badge,
  }).select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, answer: mapAnswer(data) });
});

// ── 6. Upvote Question ───────────────────────────────────────────────────────
app.post('/api/questions/:id/upvote', async (req, res) => {
  const { id } = req.params;
  const { data: q } = await supabase.from('questions').select('upvotes').eq('id', id).single();
  if (!q) return res.status(404).json({ error: 'Not found' });
  const { data } = await supabase.from('questions').update({ upvotes: q.upvotes + 1 }).eq('id', id).select().single();
  res.json({ success: true, upvotes: data.upvotes });
});

// ── 7. Upvote Answer ─────────────────────────────────────────────────────────
app.post('/api/questions/:qId/answers/:ansId/upvote', async (req, res) => {
  const { ansId } = req.params;
  const { data: a } = await supabase.from('answers').select('upvotes').eq('id', ansId).single();
  if (!a) return res.status(404).json({ error: 'Not found' });
  const { data } = await supabase.from('answers').update({ upvotes: a.upvotes + 1 }).eq('id', ansId).select().single();
  res.json({ success: true, upvotes: data.upvotes });
});

// ── 8. Fair Price Calculate ──────────────────────────────────────────────────
app.post('/api/fares/calculate', (req, res) => {
  const { cityKey = 'delhi', origin, destination, originCoords, destCoords, isNight = false, luggageCount = 0 } = req.body;
  let distanceKm = 10;
  if (originCoords && destCoords) distanceKm = calculateDistance(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);
  else if (origin && destination) {
    const oL = POPULAR_LANDMARKS.find(l => l.name.toLowerCase().includes(origin.toLowerCase()));
    const dL = POPULAR_LANDMARKS.find(l => l.name.toLowerCase().includes(destination.toLowerCase()));
    if (oL && dL) distanceKm = calculateDistance(oL.lat, oL.lng, dL.lat, dL.lng);
  }
  const result = calculateRouteFare({ cityKey, distanceKm, isNight, luggageCount });
  res.json({ success: true, result, origin, destination });
});

// ── 9. Scam Check ────────────────────────────────────────────────────────────
app.post('/api/fares/scam-check', (req, res) => {
  const { quotedPrice, distanceKm, cityKey = 'delhi', isNight = false } = req.body;
  if (!quotedPrice || !distanceKm) return res.status(400).json({ error: 'quotedPrice and distanceKm required' });
  const fairEstimate = calculateRouteFare({ cityKey, distanceKm: parseFloat(distanceKm), isNight });
  const evaluation = evaluateDriverQuote(parseFloat(quotedPrice), fairEstimate);
  res.json({ success: true, evaluation, fairEstimate });
});

// ── 10. Vibe Engine ──────────────────────────────────────────────────────────
app.get('/api/vibe/curated', (req, res) => {
  res.json({ categories: VIBE_CATEGORIES, dictionary: INDIC_SLANG_DICTIONARY, curatedSpots: VIBE_CURATED_SPOTS });
});

// ── 11. Cron ─────────────────────────────────────────────────────────────────
app.all('/api/cron/sync-fares', async (req, res) => {
  try {
    const report = await runScheduledFareSync();
    res.json({ success: true, report });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── Serve built frontend ──────────────────────────────────────────────────────
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  res.json({ app: 'NearGo REST API (Supabase Edition)', status: 'online' });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`[NearGo] Running on http://localhost:${PORT}`);
    console.log(`[NearGo] Supabase: ${process.env.SUPABASE_URL ? '✓ Connected' : '✗ SUPABASE_URL missing'}`);
  });
}

export default app;
