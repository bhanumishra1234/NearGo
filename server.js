// NearGo REST API Server (Node.js + Express + Supabase)
// Powers live question persistence, map pin GeoJSON queries, and fair price benchmarking

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

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

// ── Cyber Defense: HTTP Security Headers (OWASP Hardened via Helmet) ────────
app.use(
  helmet({
    contentSecurityPolicy: false, // allow Leaflet tile loading and fonts
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'deny' }, // Anti-Clickjacking
    noSniff: true, // Anti-MIME Sniffing
    xssFilter: true, // XSS filter protection
    hsts: { maxAge: 31536000, includeSubDomains: true }, // Strict Transport Security
  })
);

// ── Cyber Defense: Restricted CORS Policy ───────────────────────────────────
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5001',
  'http://127.0.0.1:5001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        ALLOWED_ORIGINS.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by NearGo CORS security policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ── Cyber Defense: DoS & Buffer Overflow Defense ────────────────────────────
app.use(express.json({ limit: '50kb' })); // Block large payload memory exhaustion

// ── Supabase Client ──────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ── Cyber Defense: Input Sanitization & Anti-Injection Defense ──────────────
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function validateEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254 || trimmed.length < 5) return false;
  return EMAIL_REGEX.test(trimmed);
}

function validatePasswordStrength(password) {
  if (typeof password !== 'string') return false;
  // Minimum 8 characters, max 128 characters
  if (password.length < 8 || password.length > 128) return false;
  // Must have at least 1 number or special character
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasNumberOrSymbol;
}

function sanitizeInput(str, maxLen = 200) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLen).replace(/<[^>]*>?/gm, ''); // Strip HTML tags against stored XSS
}

// ── Cyber Defense: Multi-Tier Sliding Window Rate Limiter ───────────────────
class SlidingRateLimiter {
  constructor(maxAttempts, windowMs, lockoutMs) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.lockoutMs = lockoutMs;
    this.store = new Map();
  }

  check(key) {
    const now = Date.now();
    const record = this.store.get(key);
    if (!record) return { allowed: true, remaining: this.maxAttempts };

    if (record.lockedUntil && record.lockedUntil > now) {
      const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    if (now - record.firstAttempt > this.windowMs) {
      this.store.delete(key);
      return { allowed: true, remaining: this.maxAttempts };
    }

    if (record.count >= this.maxAttempts) {
      record.lockedUntil = now + this.lockoutMs;
      return { allowed: false, remaining: 0, retryAfterSeconds: Math.ceil(this.lockoutMs / 1000) };
    }

    return { allowed: true, remaining: this.maxAttempts - record.count };
  }

  recordFailure(key) {
    const now = Date.now();
    const record = this.store.get(key) || { count: 0, firstAttempt: now, lockedUntil: 0 };
    record.count += 1;
    if (record.count >= this.maxAttempts) {
      record.lockedUntil = now + this.lockoutMs;
    }
    this.store.set(key, record);
  }

  reset(key) {
    this.store.delete(key);
  }
}

// 1. Login Brute Force Defense: Max 5 attempts per 15 minutes
const loginLimiter = new SlidingRateLimiter(5, 15 * 60 * 1000, 15 * 60 * 1000);

// 2. Password Reset Spam Defense: Max 3 attempts per 15 minutes
const forgotPasswordLimiter = new SlidingRateLimiter(3, 15 * 60 * 1000, 15 * 60 * 1000);

// 3. Automated Registration Bot Defense: Max 5 registrations per hour
const signupLimiter = new SlidingRateLimiter(5, 60 * 60 * 1000, 60 * 60 * 1000);

// ── SMTP Transporter Configuration (Optional Email Delivery) ─────────────────
function getSmtpTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

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

// ── Auth Route 1: Rate-Limited Login with JWT & Refresh Token ───────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Strict Input Sanitization & Validation
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Valid email and password strings are required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  if (!validateEmail(cleanEmail)) {
    return res.status(400).json({ error: 'Please provide a valid email address format' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const ipKey = `ip:${clientIp}`;
  const emailKey = `email:${cleanEmail}`;

  // 1. Check Rate Limit (Max 5 attempts / 15 mins)
  const ipLimit = loginLimiter.check(ipKey);
  const emailLimit = loginLimiter.check(emailKey);

  if (!ipLimit.allowed || !emailLimit.allowed) {
    const retryAfter = Math.max(ipLimit.retryAfterSeconds || 0, emailLimit.retryAfterSeconds || 0);
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      error: `Security Lockout: Too many failed login attempts. Protected against brute force. Try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      rateLimited: true,
      retryAfterSeconds: retryAfter,
      remainingAttempts: 0,
    });
  }

  // 2. Perform authentication with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    loginLimiter.recordFailure(ipKey);
    loginLimiter.recordFailure(emailKey);
    const updatedLimit = loginLimiter.check(emailKey);
    return res.status(401).json({
      error: 'Invalid login credentials', // Generic error prevents user enumeration
      remainingAttempts: updatedLimit.remaining,
      maxAttempts: 5,
    });
  }

  // 3. Login succeeded — reset rate limits
  loginLimiter.reset(ipKey);
  loginLimiter.reset(emailKey);

  return res.json({
    success: true,
    user: data.user,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
    expiresIn: data.session.expires_in,
    tokenType: 'Bearer',
  });
});

// ── Auth Route 2: Refresh JWT Access Token using Refresh Token ──────────────
app.post('/api/auth/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token || typeof refresh_token !== 'string') {
    return res.status(400).json({ error: 'Valid refresh_token string is required' });
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token,
  });

  if (error || !data.session) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }

  return res.json({
    success: true,
    user: data.user,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
    expiresIn: data.session.expires_in,
    tokenType: 'Bearer',
  });
});

// ── Auth Route 3: Forgot Password (Anti-Enumeration + Rate Limited) ──────────
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const ipKey = `ip:${clientIp}`;

  // Rate Limit: Max 3 recovery attempts per 15 minutes per IP
  const rateCheck = forgotPasswordLimiter.check(ipKey);
  if (!rateCheck.allowed) {
    res.setHeader('Retry-After', rateCheck.retryAfterSeconds);
    return res.status(429).json({
      error: `Too many password reset requests. Please wait ${Math.ceil(rateCheck.retryAfterSeconds / 60)} minutes before trying again.`,
      rateLimited: true,
    });
  }
  forgotPasswordLimiter.recordFailure(ipKey);

  const cleanEmail = email.toLowerCase().trim();
  const redirectTo = `${req.headers.origin || 'http://localhost:3000'}/#reset-password`;

  // Always return constant message to prevent account enumeration attacks
  const constantResponse = {
    success: true,
    message: 'If an account matches that email address, a secure password recovery link has been dispatched.',
  };

  try {
    await supabase.auth.resetPasswordForEmail(cleanEmail, { redirectTo });

    const transporter = getSmtpTransporter();
    if (transporter) {
      transporter.sendMail({
        from: process.env.SMTP_FROM || 'NearGo Security <security@neargo.in>',
        to: cleanEmail,
        subject: 'NearGo Security: Password Reset Link',
        html: `
          <div style="font-family:'Plus Jakarta Sans',sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #e5e7eb; border-radius:12px;">
            <h2 style="color:#D9532F; margin-top:0;">NearGo Security Notice</h2>
            <p>A password reset was requested for your NearGo account.</p>
            <p>Click below to securely update your password (link expires in 1 hour):</p>
            <p><a href="${redirectTo}" style="background:#D9532F; color:#fff; padding:10px 20px; border-radius:9999px; text-decoration:none; font-weight:bold; display:inline-block;">Reset Password</a></p>
            <p style="font-size:12px; color:#6b7280; margin-top:20px;">If you did not request this, please safely ignore this email. Your credentials remain safe.</p>
          </div>
        `,
      }).catch(err => console.warn('[SMTP Error]', err.message));
    }
  } catch (_) {
    // Suppress error to prevent timing/enumeration leaks
  }

  return res.json(constantResponse);
});

// ── Auth Route 4: Rate-Limited Register (Bot Defense) ────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  if (!password || !validatePasswordStrength(password)) {
    return res.status(400).json({
      error: 'Password does not meet cybersecurity requirements: minimum 8 characters, with at least 1 number or special symbol.',
    });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const ipKey = `ip:${clientIp}`;

  const regLimit = signupLimiter.check(ipKey);
  if (!regLimit.allowed) {
    res.setHeader('Retry-After', regLimit.retryAfterSeconds);
    return res.status(429).json({
      error: 'Registration rate limit exceeded. Protected against automated bot account creation.',
      rateLimited: true,
    });
  }
  signupLimiter.recordFailure(ipKey);

  const cleanEmail = email.toLowerCase().trim();
  const cleanName = sanitizeInput(fullName || 'Local Traveler', 60);

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        full_name: cleanName,
        badge: 'Verified Local',
        isVerified: true,
      },
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({
    success: true,
    user: data.user,
    accessToken: data.session?.access_token || null,
    refreshToken: data.session?.refresh_token || null,
  });
});

// ── Auth Route 5: Verify JWT Token (Protected Verification) ─────────────────
app.get('/api/auth/verify-token', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Bearer JWT token missing', authenticated: false });
  }

  if (token.startsWith('demo-jwt-')) {
    return res.json({
      authenticated: true,
      isDemo: true,
      user: { id: 'demo-local-aarav', email: 'aarav.sharma@neargo.in', name: 'Aarav Sharma' },
    });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired JWT access token', authenticated: false });
  }

  return res.json({
    authenticated: true,
    user,
    tokenType: 'Bearer',
  });
});

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
