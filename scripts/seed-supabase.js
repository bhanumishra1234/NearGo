// scripts/seed-supabase.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_QUESTIONS } from '../src/data/seedData.js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function seed() {
  console.log(`Starting migration of ${INITIAL_QUESTIONS.length} initial questions to Supabase...`);

  for (const q of INITIAL_QUESTIONS) {
    const { data: qData, error: qError } = await supabase
      .from('questions')
      .upsert({
        id: q.id,
        community: q.community || 'c/DelhiLocal',
        title: q.title,
        body: q.body,
        city: q.city || 'Delhi NCR',
        location_name: q.locationName,
        lat: q.lat,
        lng: q.lng,
        category: q.category || 'general',
        vibe_category: q.vibeCategory || 'student_budget',
        tags: q.tags || [],
        author_name: q.author?.name || 'Anonymous Traveler',
        author_badge: q.author?.badge || 'Curious Traveler',
        author_badge_color: q.author?.badgeColor || 'amber',
        author_verified: q.author?.isVerified || false,
        author_reputation: q.author?.reputation || 10,
        upvotes: q.upvotes || 1,
        photos: q.photos || [],
        fare_check: q.fareCheck || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (qError) {
      console.error(`Failed to insert question ${q.id}:`, qError.message);
      continue;
    }

    console.log(`✓ Inserted Question: ${q.title.slice(0, 40)}...`);

    if (q.answers && q.answers.length > 0) {
      for (const a of q.answers) {
        const { error: aError } = await supabase
          .from('answers')
          .upsert({
            id: a.id,
            question_id: q.id,
            body: a.body,
            insider_tip: a.insiderTip || null,
            photos: a.photos || [],
            upvotes: a.upvotes || 1,
            pin_lat: a.pin?.lat || null,
            pin_lng: a.pin?.lng || null,
            pin_name: a.pin?.name || null,
            pin_neighborhood: a.pin?.neighborhood || null,
            pin_type: a.pin?.type || 'gem',
            author_name: a.author?.name || 'Verified Local',
            author_badge: a.author?.badge || 'Verified Local',
            author_badge_color: a.author?.badgeColor || 'emerald',
            author_verified: a.author?.isVerified ?? true,
            author_reputation: a.author?.reputation || 150,
            created_at: new Date().toISOString()
          });

        if (aError) {
          console.error(`  - Failed to insert answer ${a.id}:`, aError.message);
        } else {
          console.log(`  - Inserted Answer by: ${a.author?.name}`);
        }
      }
    }
  }

  console.log('Seeding completed successfully!');
}

seed().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
