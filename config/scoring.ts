/**
 * GitRoast Arena — Scoring Configuration & Authority
 *
 * OWNERSHIP MAP (NO DOUBLE COUNTING POLICY):
 * -----------------------------------------------------------------------------
 * 1. Project Quality      -> Repository completeness (descriptions, topics, licenses, non-empty repos)
 * 2. Documentation        -> Flagship README existence, word count, structure, install/usage sections
 * 3. Activity             -> Recent push velocity (90d), recency of last push, commit regularity
 * 4. Technical Breadth    -> Language count, balance of language share (anti-monoculture)
 * 5. Profile              -> Bio, avatar, profile README, location/company/links, pinned repos
 * 6. Portfolio Curation   -> Fork ratio, inactive repo share, noise ratio (archived vs abandoned junk)
 * 7. Project Impact       -> Real world traction: stars, forks received, live demo/homepage URLs
 * -----------------------------------------------------------------------------
 * Every signal is rewarded in exactly ONE sub-score.
 * Portfolio Readiness is the weighted combination of the seven sub-scores.
 */

export const ENGINE_VERSION = "1.0.0";

// Threshold constants
export const INACTIVITY_DAYS = 365; // No push in 12 months = inactive
export const RECENT_PUSH_DAYS = 90; // Active within 90 days = recent velocity
export const WEAK_README_WORDS = 80; // Fewer than 80 words = weak README
export const MIN_ORIGINAL_REPOS = 3; // Fewer than 3 original repos = insufficient data
export const FLAGSHIP_MIN = 5; // Top 5-8 flagship projects per master spec
export const FLAGSHIP_MAX = 8;
export const MAX_REPOS_TO_FETCH = 100;

// Category Weights for Portfolio Readiness (Must sum to exactly 1.0)
export const CATEGORY_WEIGHTS = {
  projectQuality: 0.15,
  documentation: 0.20,
  activity: 0.15,
  technicalBreadth: 0.10,
  profile: 0.10,
  portfolioCuration: 0.15,
  projectImpact: 0.15,
} as const;

export type CategoryWeightKey = keyof typeof CATEGORY_WEIGHTS;

// Module load assertion that weights sum to exactly 1.0 (allowing floating-point epsilon)
const weightSum = Object.values(CATEGORY_WEIGHTS).reduce((acc, w) => acc + w, 0);
if (Math.abs(weightSum - 1.0) > 0.0001) {
  throw new Error(`CRITICAL: CATEGORY_WEIGHTS must sum to 1.0, but got ${weightSum}`);
}

// Flagship Ranking weights (used in lib/github/rank.ts)
// Stars use logarithmic scaling to avoid celebrity distortion
export const FLAGSHIP_RANKING_WEIGHTS = {
  isOriginal: 30,
  hasDescription: 15,
  hasReadme: 20,
  hasHomepage: 15,
  hasTopics: 10,
  recentPushBonus: 10,
  logStarCap: 25, // max bonus from log(stars + 1)
};

// Thresholds for triggering warnings / roasts
export const ROAST_TRIGGERS = {
  highForkRatio: 0.6, // >60% repos are forks
  highInactiveRatio: 0.5, // >50% original repos are inactive (>365d)
  highNoiseRatio: 0.6, // >60% repos are noise (abandoned or unmaintained)
  singleLanguageDominance: 0.85, // >85% bytes in one language
  lowFlagshipReadmeRate: 0.5, // >50% flagship repos have weak/missing README
  zeroStarsThreshold: 0,
  staleFlagshipDays: 180,
} as const;
