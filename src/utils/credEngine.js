// NearGo Local Cred & Trust Economy Engine
// Replaces generic forum "Karma" with an authentic, hyper-local urban reputation system:
// 1. City Scout (0-49 Cred)
// 2. Neighborhood Local (50-199 Cred) -> Unlocks spatial map pinpointing
// 3. Verified Local Guide (200-499 Cred) -> Unlocks verified answer endorsements
// 4. Urban Transit Elder (500+ Cred) -> Community moderator flair & official tariff auditor

export const CRED_TIERS = [
  {
    level: 1,
    id: 'scout',
    name: 'City Scout',
    badge: '🧭 City Scout',
    badgeColor: 'text-stone-700 bg-stone-100 border-stone-200 dark:text-stone-300 dark:bg-stone-900 dark:border-stone-800',
    minCred: 0,
    maxCred: 49,
    description: 'New to the city or explorer. Can ask questions, upvote local answers, and calculate metered fares.',
    unlockedPermissions: ['ask_questions', 'upvote_answers', 'calculate_fares'],
  },
  {
    level: 2,
    id: 'local',
    name: 'Neighborhood Local',
    badge: '📍 Neighborhood Local',
    badgeColor: 'text-amber-800 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-800/60',
    minCred: 50,
    maxCred: 199,
    description: 'Trusted city resident. Unlocks custom interactive pin placement on the spatial map.',
    unlockedPermissions: ['ask_questions', 'upvote_answers', 'calculate_fares', 'custom_map_pinning'],
  },
  {
    level: 3,
    id: 'verified_guide',
    name: 'Verified Local Guide',
    badge: '🛡️ Verified Guide',
    badgeColor: 'text-emerald-800 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800/60',
    minCred: 200,
    maxCred: 499,
    description: 'Proven neighborhood authority. Eligible to endorse solutions and submit verified hidden gems.',
    unlockedPermissions: ['ask_questions', 'upvote_answers', 'calculate_fares', 'custom_map_pinning', 'endorse_solutions', 'submit_hidden_gems'],
  },
  {
    level: 4,
    id: 'transit_elder',
    name: 'Urban Transit Elder',
    badge: '👑 Transit Elder',
    badgeColor: 'text-orange-800 bg-orange-50 border-orange-200 dark:text-orange-300 dark:bg-orange-950/40 dark:border-orange-800/60',
    minCred: 500,
    maxCred: Infinity,
    description: 'Veteran city commuter & tariff auditor with trusted community moderation flair.',
    unlockedPermissions: ['all_features', 'moderator_flair', 'official_tariff_auditor'],
  },
];

export const CRED_ACTION_POINTS = {
  POST_QUESTION: 5,
  POST_ANSWER: 10,
  ACCEPT_SOLUTION: 15,
  RECEIVE_UPVOTE: 2,
  REPORT_METER_FARE: 8,
  FLAGGED_SPAM: -15,
};

/**
 * Calculate user's current Local Cred tier and next progression milestone
 */
export function getUserCredTier(credScore = 0) {
  const score = Math.max(0, Number(credScore) || 0);

  let currentTier = CRED_TIERS[0];
  let nextTier = CRED_TIERS[1];

  for (let i = 0; i < CRED_TIERS.length; i++) {
    if (score >= CRED_TIERS[i].minCred) {
      currentTier = CRED_TIERS[i];
      nextTier = CRED_TIERS[i + 1] || null;
    }
  }

  const range = nextTier ? nextTier.minCred - currentTier.minCred : 100;
  const progressInTier = nextTier ? score - currentTier.minCred : range;
  const progressPercent = Math.min(100, Math.max(5, Math.round((progressInTier / range) * 100)));

  return {
    score,
    tier: currentTier,
    nextTier,
    progressPercent,
    pointsToNextTier: nextTier ? Math.max(0, nextTier.minCred - score) : 0,
    canDropCustomPin: score >= 50,
    canEndorseSolution: score >= 200,
  };
}
