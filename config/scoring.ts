import type { CalculatedFacts, GitHubSnapshot, Severity, EvidenceSource } from "@/types";

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
  documentation: 0.2,
  activity: 0.15,
  technicalBreadth: 0.1,
  profile: 0.1,
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
  highForkRatio: 0.5, // >50% repos are forks
  highInactiveRatio: 0.4, // >40% original repos are inactive (>365d)
  highNoiseRatio: 0.5, // >50% repos are noise (abandoned or unmaintained)
  singleLanguageDominance: 0.85, // >85% bytes in one language
  lowFlagshipReadmeRate: 0.4, // >40% flagship repos have weak/missing README
  zeroStarsThreshold: 0,
  staleFlagshipDays: 180,
} as const;

// Rule Interface for the Rule Engine
export interface ScoringRule {
  id: string;
  what: string;
  why: string;
  source: EvidenceSource;
  category: string;
  severity: Severity;
  isPositive?: boolean;
  trigger: (facts: CalculatedFacts) => boolean;
  evidenceBuilder: (
    facts: CalculatedFacts,
    snapshot: GitHubSnapshot
  ) => {
    label: string;
    observed: string;
    threshold: string | null;
    repoNames: string[];
  };
}

/**
 * THE RULE TABLE — Single registry of all business rules triggering Evidence and Roasts
 */
export const RULE_TABLE: ScoringRule[] = [
  // 1. Inactive Repositories
  {
    id: "rule_inactive_repos",
    what: "High proportion of original repositories have had no activity for over a year.",
    why: "Stale code suggests abandoned experiments rather than maintained software.",
    source: "activity",
    category: "inactiveRepositories",
    severity: "medium",
    trigger: (facts) => facts.originalRepositories >= 3 && facts.inactiveRatio >= ROAST_TRIGGERS.highInactiveRatio,
    evidenceBuilder: (facts, snapshot) => {
      const inactiveNames = snapshot.repositories
        .filter((r) => !r.isFork && (!r.pushedAt || (Date.now() - new Date(r.pushedAt).getTime()) / (1000 * 3600 * 24) > INACTIVITY_DAYS))
        .map((r) => r.name)
        .slice(0, 10);
      return {
        label: "Inactive repositories",
        observed: `${facts.inactiveRepositories} of ${facts.originalRepositories} original repositories inactive for >365 days (${Math.round(facts.inactiveRatio * 100)}%)`,
        threshold: `No pushes in ${INACTIVITY_DAYS} days (limit: ${Math.round(ROAST_TRIGGERS.highInactiveRatio * 100)}%)`,
        repoNames: inactiveNames,
      };
    },
  },

  // 2. Weak Flagship Documentation
  {
    id: "rule_weak_flagship_docs",
    what: "Flagship repositories have missing or superficial README files.",
    why: "Recruiters and hiring managers cannot evaluate projects they cannot quickly understand or run.",
    source: "readme",
    category: "weakDocumentation",
    severity: "sharp",
    trigger: (facts) => facts.flagshipCount > 0 && facts.flagshipWeakReadmes / facts.flagshipCount >= ROAST_TRIGGERS.lowFlagshipReadmeRate,
    evidenceBuilder: (facts, snapshot) => {
      const weakFlagships = snapshot.repositories
        .filter((r) => r.isFlagship && (!r.readme.exists || r.readme.wordCount < WEAK_README_WORDS))
        .map((r) => r.name)
        .slice(0, 10);
      return {
        label: "Weak flagship documentation",
        observed: `${facts.flagshipWeakReadmes} of ${facts.flagshipCount} flagship projects have weak or missing READMEs (<${WEAK_README_WORDS} words)`,
        threshold: `Minimum ${WEAK_README_WORDS} words with install and usage sections`,
        repoNames: weakFlagships,
      };
    },
  },

  // 3. Missing Live Previews / Demos
  {
    id: "rule_missing_demos",
    what: "Flagship projects lack live demo or homepage links.",
    why: "Without a working URL, visitors must clone and build your project to see it working.",
    source: "repository",
    category: "missingDemos",
    severity: "medium",
    trigger: (facts) => facts.flagshipCount >= 2 && facts.flagshipMissingDemo / facts.flagshipCount >= 0.5,
    evidenceBuilder: (facts, snapshot) => {
      const missingDemoNames = snapshot.repositories
        .filter((r) => r.isFlagship && (!r.homepageUrl || r.homepageUrl.trim().length === 0))
        .map((r) => r.name)
        .slice(0, 10);
      return {
        label: "Missing live demos",
        observed: `${facts.flagshipMissingDemo} of ${facts.flagshipCount} flagship repositories lack live demo URLs`,
        threshold: "At least 50% of flagship projects should have working live previews",
        repoNames: missingDemoNames,
      };
    },
  },

  // 4. Fork-Heavy Profile
  {
    id: "rule_high_forks",
    what: "Majority of public repositories are forks rather than original code.",
    why: "Fork-heavy accounts make it difficult to determine author original contribution and skill level.",
    source: "repository",
    category: "forkHeavy",
    severity: "sharp",
    trigger: (facts) => facts.totalRepositories >= 4 && facts.forkRatio >= ROAST_TRIGGERS.highForkRatio,
    evidenceBuilder: (facts, snapshot) => {
      const forkNames = snapshot.repositories.filter((r) => r.isFork).map((r) => r.name).slice(0, 10);
      return {
        label: "Fork-heavy portfolio",
        observed: `${facts.forkedRepositories} of ${facts.totalRepositories} total repositories are forks (${Math.round(facts.forkRatio * 100)}%)`,
        threshold: `Maximum ${Math.round(ROAST_TRIGGERS.highForkRatio * 100)}% fork ratio recommended`,
        repoNames: forkNames,
      };
    },
  },

  // 5. Portfolio Noise (Junk & Abandoned repos)
  {
    id: "rule_portfolio_noise",
    what: "High proportion of uncurated, abandoned, or low-value repositories cluttering the profile.",
    why: "Uncurated profiles bury your best work beneath outdated experiments.",
    source: "repository",
    category: "portfolioNoise",
    severity: "medium",
    trigger: (facts) => facts.totalRepositories >= 5 && facts.portfolioNoiseRatio >= ROAST_TRIGGERS.highNoiseRatio,
    evidenceBuilder: (facts, snapshot) => {
      const noisyNames = snapshot.repositories
        .filter((r) => r.isFork || r.isArchived || (!r.pushedAt || (Date.now() - new Date(r.pushedAt).getTime()) / (1000 * 3600 * 24) > INACTIVITY_DAYS))
        .map((r) => r.name)
        .slice(0, 10);
      return {
        label: "High portfolio noise ratio",
        observed: `${Math.round(facts.portfolioNoiseRatio * 100)}% of repositories are forks, archived, or inactive`,
        threshold: `Keep portfolio noise below ${Math.round(ROAST_TRIGGERS.highNoiseRatio * 100)}%`,
        repoNames: noisyNames,
      };
    },
  },

  // 6. Missing Descriptions
  {
    id: "rule_missing_descriptions",
    what: "Repositories lack short description summaries.",
    why: "Empty repository descriptions leave reviewers guessing what the project does at a glance.",
    source: "repository",
    category: "weakDescriptions",
    severity: "mild",
    trigger: (facts) => facts.originalRepositories >= 3 && facts.reposWithoutDescription / facts.originalRepositories >= 0.4,
    evidenceBuilder: (facts, snapshot) => {
      const noDesc = snapshot.repositories.filter((r) => !r.isFork && (!r.description || r.description.trim().length === 0)).map((r) => r.name).slice(0, 10);
      return {
        label: "Missing repository descriptions",
        observed: `${facts.reposWithoutDescription} of ${facts.originalRepositories} original repositories lack description metadata`,
        threshold: "All public repositories should have clear one-line summaries",
        repoNames: noDesc,
      };
    },
  },

  // 7. No Profile README
  {
    id: "rule_no_profile_readme",
    what: "GitHub user has not created a special username/username profile README.",
    why: "A profile README is the highest leverage introduction to your identity and flagship work.",
    source: "profile",
    category: "noProfileReadme",
    severity: "mild",
    trigger: (facts) => !facts.hasProfileReadme,
    evidenceBuilder: () => ({
      label: "Missing profile README",
      observed: "No custom profile README found on GitHub overview",
      threshold: "Repository matching GitHub username with HEAD:README.md",
      repoNames: [],
    }),
  },

  // 8. Missing Topics / Tags
  {
    id: "rule_missing_topics",
    what: "Flagship projects do not use GitHub topics/tags for discoverability.",
    why: "Topics signal tech stack and domain tags clearly to recruiters.",
    source: "repository",
    category: "noTopics",
    severity: "mild",
    trigger: (facts) => facts.flagshipCount >= 2 && facts.flagshipMissingTopics / facts.flagshipCount >= 0.5,
    evidenceBuilder: (facts, snapshot) => {
      const untagged = snapshot.repositories.filter((r) => r.isFlagship && r.topics.length === 0).map((r) => r.name).slice(0, 10);
      return {
        label: "Missing repository topics",
        observed: `${facts.flagshipMissingTopics} of ${facts.flagshipCount} flagship projects have zero topic tags`,
        threshold: "At least 2-4 tech stack topics per flagship project",
        repoNames: untagged,
      };
    },
  },

  // 9. Single Language Monoculture
  {
    id: "rule_single_language",
    what: "Over 85% of repository code bytes belong to a single programming language.",
    why: "Extremes in a single language may indicate narrow versatility.",
    source: "language",
    category: "singleLanguage",
    severity: "mild",
    trigger: (facts) => facts.languagesUsed > 0 && facts.topLanguageShare >= ROAST_TRIGGERS.singleLanguageDominance && facts.originalRepositories >= 3,
    evidenceBuilder: (facts) => ({
      label: "Dominant single language share",
      observed: `${Math.round(facts.topLanguageShare * 100)}% of all codebase bytes are concentrated in one primary language`,
      threshold: `Broaden language diversity below ${Math.round(ROAST_TRIGGERS.singleLanguageDominance * 100)}% dominance`,
      repoNames: [],
    }),
  },

  // 10. Star Drought / Low Project Impact
  {
    id: "rule_star_drought",
    what: "Zero total stars across public repositories.",
    why: "Demonstrates little community usage, external validation, or published utility.",
    source: "repository",
    category: "starDrought",
    severity: "medium",
    trigger: (facts) => facts.originalRepositories >= 3 && facts.totalStars === 0,
    evidenceBuilder: (facts) => ({
      label: "Zero community stargazers",
      observed: `0 stars accumulated across ${facts.originalRepositories} original repositories`,
      threshold: "At least 1-5 stars from peer feedback or open-source sharing",
      repoNames: [],
    }),
  },

  // 11. Missing Open Source Licenses
  {
    id: "rule_missing_licenses",
    what: "Flagship projects do not specify an open-source software license.",
    why: "Without a license, legally code is 'All Rights Reserved' and cannot be adopted or evaluated by others.",
    source: "repository",
    category: "noLicense",
    severity: "mild",
    trigger: (facts) => facts.flagshipCount >= 2 && facts.flagshipMissingLicense / facts.flagshipCount >= 0.5,
    evidenceBuilder: (facts, snapshot) => {
      const unlicensed = snapshot.repositories.filter((r) => r.isFlagship && !r.licenseSpdx).map((r) => r.name).slice(0, 10);
      return {
        label: "Missing open-source licenses",
        observed: `${facts.flagshipMissingLicense} of ${facts.flagshipCount} flagship projects have no SPDX license declared`,
        threshold: "Standard MIT/Apache-2.0 license on all flagship repos",
        repoNames: unlicensed,
      };
    },
  },

  // 12. No Screenshots / Media in README
  {
    id: "rule_no_screenshots",
    what: "Flagship repositories lack visual screenshots, GIFs, or architecture diagrams.",
    why: "Visual assets communicate product feel and system design 10x faster than raw text.",
    source: "readme",
    category: "noScreenshots",
    severity: "mild",
    trigger: (facts) => facts.flagshipCount >= 2 && facts.flagshipMissingScreenshots / facts.flagshipCount >= 0.6,
    evidenceBuilder: (facts, snapshot) => {
      const noMedia = snapshot.repositories.filter((r) => r.isFlagship && !r.readme.hasImages).map((r) => r.name).slice(0, 10);
      return {
        label: "No screenshots or diagrams",
        observed: `${facts.flagshipMissingScreenshots} of ${facts.flagshipCount} flagship projects contain no images or diagrams`,
        threshold: "Include at least 1 preview image or architecture diagram in each flagship README",
        repoNames: noMedia,
      };
    },
  },

  // 13. Stale Push Velocity
  {
    id: "rule_stale_velocity",
    what: "No public commits or repository pushes within the last 90 days.",
    why: "Recent velocity shows active engineering habits.",
    source: "activity",
    category: "staleFlagship",
    severity: "sharp",
    trigger: (facts) => facts.recentPushCount90d === 0 && facts.originalRepositories >= 2,
    evidenceBuilder: (facts) => ({
      label: "Zero 90-day activity",
      observed: `0 repository pushes in the last ${RECENT_PUSH_DAYS} days (last push was ${facts.lastPushDaysAgo ?? "unknown"} days ago)`,
      threshold: `Active push frequency within ${RECENT_PUSH_DAYS} days`,
      repoNames: [],
    }),
  },

  // 14. POSITIVE: Solid Active Velocity (Credit Where Earned)
  {
    id: "rule_strong_activity",
    what: "Consistent recent push activity across multiple repositories.",
    why: "Demonstrates consistent engineering discipline and active building.",
    source: "activity",
    category: "strongActivity",
    severity: "mild",
    isPositive: true,
    trigger: (facts) => facts.recentPushCount90d >= 3,
    evidenceBuilder: (facts) => ({
      label: "Consistent recent activity",
      observed: `${facts.recentPushCount90d} distinct repositories pushed to within the last ${RECENT_PUSH_DAYS} days`,
      threshold: "Regular ongoing engineering velocity",
      repoNames: [],
    }),
  },

  // 15. POSITIVE: Well-Documented Flagships (Credit Where Earned)
  {
    id: "rule_solid_documentation",
    what: "Flagship projects possess comprehensive, structured README documentation.",
    why: "Signifies clear technical communication and professional polish.",
    source: "readme",
    category: "solidDocumentation",
    severity: "mild",
    isPositive: true,
    trigger: (facts) => facts.flagshipCount >= 2 && facts.flagshipWeakReadmes === 0,
    evidenceBuilder: (facts, snapshot) => {
      const goodFlagships = snapshot.repositories.filter((r) => r.isFlagship && r.readme.exists && r.readme.wordCount >= WEAK_README_WORDS).map((r) => r.name);
      return {
        label: "Comprehensive documentation",
        observed: `All ${facts.flagshipCount} flagship projects feature rich READMEs with setup and usage sections`,
        threshold: "Professional documentation standards met",
        repoNames: goodFlagships,
      };
    },
  },
];
