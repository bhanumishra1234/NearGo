// scripts/sync-seed-data.js
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncSeedData() {
  const { data, error } = await supabase
    .from('questions')
    .select('*, answers(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch questions:', error);
    process.exit(1);
  }

  const mapped = data.map((q) => {
    return {
      id: q.id,
      community: q.community,
      communityName: q.community ? q.community.replace(/^c\//, '') + ' Community' : 'Local Community',
      title: q.title,
      body: q.body,
      author: {
        name: q.author_name || 'Traveler',
        badge: q.author_badge || 'Curious Traveler',
        badgeColor: q.author_badge_color || 'amber',
        isVerified: Boolean(q.author_verified),
        reputation: q.author_reputation || 20,
      },
      city: q.city,
      locationName: q.location_name,
      lat: q.lat,
      lng: q.lng,
      category: q.category,
      vibeCategory: q.vibe_category,
      tags: q.tags || [],
      createdAt: 'Recently',
      upvotes: q.upvotes || 0,
      userUpvoted: false,
      photos: q.photos || [],
      fareCheck: q.fare_check,
      answers: (q.answers || []).map((a) => ({
        id: a.id,
        author: {
          name: a.author_name || 'Local Guide',
          badge: a.author_badge || 'Verified Local Guide',
          badgeColor: a.author_badge_color || 'emerald',
          isVerified: Boolean(a.author_verified),
          reputation: 350,
        },
        body: a.body,
        pin: a.pin_lat ? {
          lat: a.pin_lat,
          lng: a.pin_lng,
          name: a.pin_name || 'Verified Spot',
          neighborhood: a.pin_neighborhood || q.city,
          type: a.pin_type || 'gem',
        } : null,
        insiderTip: a.insider_tip,
        upvotes: a.upvotes || 0,
        userUpvoted: false,
        createdAt: 'Recently',
      })),
    };
  });

  const content = `// Seed Data for NearGo - Real-World Hyper-Local City Guide
// Synchronized with live Supabase Database across Delhi NCR, Mumbai, and Bengaluru

export const INITIAL_QUESTIONS = ${JSON.stringify(mapped, null, 2)};
`;

  fs.writeFileSync('src/data/seedData.js', content, 'utf8');
  console.log(`✓ Synchronized ${mapped.length} real discussions into src/data/seedData.js`);
}

syncSeedData();
