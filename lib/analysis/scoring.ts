import type { CalculatedFacts, GitHubSnapshot, CategoryScores } from "@/types";
import { CategoryScoresSchema } from "@/types";
import { CATEGORY_WEIGHTS, WEAK_README_WORDS } from "@/config/scoring";

/**
 * GitRoast Arena — Deterministic Mathematical Scoring Engine
 *
 * Enforces strict zero-double-counting policy.
 * Each sub-score is an isolated 0-100 integer calculation.
 */

export function calculateProjectQuality(facts: CalculatedFacts): number {
  if (facts.originalRepositories === 0) return 0;

  let score = 100;

  // 1. Missing description penalty (up to -35 pts)
  const missingDescRatio = facts.reposWithoutDescription / facts.originalRepositories;
  score -= Math.round(missingDescRatio * 35);

  // 2. Missing topics on flagships (up to -35 pts)
  if (facts.flagshipCount > 0) {
    const missingTopicsRatio = facts.flagshipMissingTopics / facts.flagshipCount;
    score -= Math.round(missingTopicsRatio * 35);
  }

  // 3. Missing license on flagships (up to -30 pts)
  if (facts.flagshipCount > 0) {
    const missingLicenseRatio = facts.flagshipMissingLicense / facts.flagshipCount;
    score -= Math.round(missingLicenseRatio * 30);
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function calculateDocumentation(snapshot: GitHubSnapshot): number {
  const flagships = snapshot.repositories.filter((r) => r.isFlagship);
  if (flagships.length === 0) return 0;

  let totalFlagshipDocScore = 0;

  for (const repo of flagships) {
    let repoScore = 0;

    if (repo.readme.exists) {
      repoScore += 30; // Base presence

      // Word count completeness (up to 30 pts)
      const wordScore = Math.min(30, Math.round((repo.readme.wordCount / (WEAK_README_WORDS * 2)) * 30));
      repoScore += wordScore;

      // Installation section (+15 pts)
      if (repo.readme.hasInstallSection) {
        repoScore += 15;
      }

      // Usage section (+15 pts)
      if (repo.readme.hasUsageSection) {
        repoScore += 15;
      }

      // Screenshots/Diagrams (+10 pts)
      if (repo.readme.hasImages) {
        repoScore += 10;
      }
    }

    totalFlagshipDocScore += Math.min(100, repoScore);
  }

  const averageDocScore = totalFlagshipDocScore / flagships.length;
  return Math.min(100, Math.max(0, Math.round(averageDocScore)));
}

export function calculateActivity(facts: CalculatedFacts): number {
  let score = 0;

  // 1. Velocity: 90-day push frequency (max 50 pts)
  if (facts.recentPushCount90d >= 5) {
    score += 50;
  } else if (facts.recentPushCount90d >= 3) {
    score += 40;
  } else if (facts.recentPushCount90d >= 1) {
    score += 25;
  }

  // 2. Recency of last push (max 50 pts)
  if (facts.lastPushDaysAgo !== null) {
    if (facts.lastPushDaysAgo <= 7) {
      score += 50;
    } else if (facts.lastPushDaysAgo <= 30) {
      score += 40;
    } else if (facts.lastPushDaysAgo <= 60) {
      score += 30;
    } else if (facts.lastPushDaysAgo <= 90) {
      score += 20;
    } else if (facts.lastPushDaysAgo <= 180) {
      score += 10;
    }
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function calculateTechnicalBreadth(facts: CalculatedFacts): number {
  if (facts.originalRepositories === 0) return 0;

  let score = 0;

  // 1. Distinct languages count (max 50 pts)
  if (facts.languagesUsed >= 4) {
    score += 50;
  } else if (facts.languagesUsed === 3) {
    score += 40;
  } else if (facts.languagesUsed === 2) {
    score += 28;
  } else if (facts.languagesUsed === 1) {
    score += 15;
  }

  // 2. Anti-monoculture balance (max 50 pts)
  if (facts.topLanguageShare <= 0.5) {
    score += 50;
  } else if (facts.topLanguageShare <= 0.7) {
    score += 40;
  } else if (facts.topLanguageShare <= 0.85) {
    score += 25;
  } else {
    score += 10;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function calculateProfile(facts: CalculatedFacts): number {
  let score = 0;

  // Bio presence (+25 pts)
  if (facts.hasBio) {
    score += 25;
  }

  // Profile README presence (+35 pts)
  if (facts.hasProfileReadme) {
    score += 35;
  }

  // Website / Portfolio Link (+20 pts)
  if (facts.hasWebsiteOrLink) {
    score += 20;
  }

  // Pinned repositories (+20 pts)
  if (facts.pinnedCount >= 3) {
    score += 20;
  } else if (facts.pinnedCount >= 1) {
    score += 12;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function calculatePortfolioCuration(facts: CalculatedFacts): number {
  if (facts.totalRepositories === 0) return 0;

  // 1. Fork ratio (max 40 pts)
  const forkScore = (1 - facts.forkRatio) * 40;

  // 2. Inactive original repos ratio (max 35 pts)
  const inactiveScore = (1 - facts.inactiveRatio) * 35;

  // 3. Low-value noise ratio (max 25 pts)
  const noiseScore = (1 - facts.portfolioNoiseRatio) * 25;

  const total = forkScore + inactiveScore + noiseScore;
  return Math.min(100, Math.max(0, Math.round(total)));
}

export function calculateProjectImpact(facts: CalculatedFacts): number {
  let score = 0;

  // 1. Logarithmic stars traction (max 45 pts)
  const starScore = Math.min(45, Math.round(Math.log10(facts.totalStars + 1) * 18));
  score += starScore;

  // 2. Logarithmic forks received (max 25 pts)
  const forkScore = Math.min(25, Math.round(Math.log10(facts.totalForksReceived + 1) * 15));
  score += forkScore;

  // 3. Live demo links on flagships (max 30 pts)
  if (facts.flagshipCount > 0) {
    const flagshipsWithDemo = facts.flagshipCount - facts.flagshipMissingDemo;
    const demoScore = (flagshipsWithDemo / facts.flagshipCount) * 30;
    score += Math.round(demoScore);
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Composes all 7 sub-scores and computes weighted Portfolio Readiness.
 */
export function calculateCategoryScores(
  facts: CalculatedFacts,
  snapshot: GitHubSnapshot
): CategoryScores {
  // If data is insufficient (<3 original repos), output neutral base scores
  if (facts.insufficientData) {
    const insufficientResult: CategoryScores = {
      projectQuality: 20,
      documentation: 20,
      activity: 20,
      technicalBreadth: 20,
      profile: 20,
      portfolioCuration: 20,
      projectImpact: 20,
      portfolioReadiness: 20,
    };
    return CategoryScoresSchema.parse(insufficientResult);
  }

  const projectQuality = calculateProjectQuality(facts);
  const documentation = calculateDocumentation(snapshot);
  const activity = calculateActivity(facts);
  const technicalBreadth = calculateTechnicalBreadth(facts);
  const profile = calculateProfile(facts);
  const portfolioCuration = calculatePortfolioCuration(facts);
  const projectImpact = calculateProjectImpact(facts);

  // Calculate weighted readiness using weights from config
  const weightedSum =
    projectQuality * CATEGORY_WEIGHTS.projectQuality +
    documentation * CATEGORY_WEIGHTS.documentation +
    activity * CATEGORY_WEIGHTS.activity +
    technicalBreadth * CATEGORY_WEIGHTS.technicalBreadth +
    profile * CATEGORY_WEIGHTS.profile +
    portfolioCuration * CATEGORY_WEIGHTS.portfolioCuration +
    projectImpact * CATEGORY_WEIGHTS.projectImpact;

  const portfolioReadiness = Math.min(100, Math.max(0, Math.round(weightedSum)));

  const scores: CategoryScores = {
    projectQuality,
    documentation,
    activity,
    technicalBreadth,
    profile,
    portfolioCuration,
    projectImpact,
    portfolioReadiness,
  };

  return CategoryScoresSchema.parse(scores);
}
