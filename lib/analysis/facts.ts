import type { GitHubSnapshot, CalculatedFacts } from "@/types";
import {
  INACTIVITY_DAYS,
  RECENT_PUSH_DAYS,
  WEAK_README_WORDS,
  MIN_ORIGINAL_REPOS,
} from "@/config/scoring";

/**
 * Pure functions extracting deterministic measurements from GitHubSnapshot.
 * Injected clock guarantees identical facts across repeated runs.
 */

export function extractProfileFacts(snapshot: GitHubSnapshot) {
  const { profile } = snapshot;
  return {
    hasProfileReadme: profile.hasProfileReadme,
    hasBio: Boolean(profile.bio && profile.bio.trim().length > 0),
    hasWebsiteOrLink: Boolean(profile.websiteUrl && profile.websiteUrl.trim().length > 0),
    pinnedCount: profile.pinnedRepoNames.length,
  };
}

export function extractRepositoryFacts(snapshot: GitHubSnapshot) {
  const repos = snapshot.repositories;
  const totalRepositories = repos.length;
  const originalRepos = repos.filter((r) => !r.isFork);
  const forkedRepos = repos.filter((r) => r.isFork);
  const originalRepositories = originalRepos.length;
  const forkedRepositories = forkedRepos.length;

  const forkRatio = totalRepositories > 0 ? forkedRepositories / totalRepositories : 0;
  const archivedRepositories = repos.filter((r) => r.isArchived).length;
  const reposWithoutDescription = originalRepos.filter(
    (r) => !r.description || r.description.trim().length === 0
  ).length;
  const reposWithoutReadme = originalRepos.filter((r) => !r.readme.exists).length;

  return {
    totalRepositories,
    originalRepositories,
    forkedRepositories,
    forkRatio: Math.min(1, Math.max(0, forkRatio)),
    archivedRepositories,
    reposWithoutDescription,
    reposWithoutReadme,
  };
}

export function extractDocumentationFacts(snapshot: GitHubSnapshot) {
  const flagships = snapshot.repositories.filter((r) => r.isFlagship);
  const flagshipCount = flagships.length;

  const flagshipWeakReadmes = flagships.filter(
    (r) => !r.readme.exists || r.readme.wordCount < WEAK_README_WORDS
  ).length;
  const flagshipMissingDemo = flagships.filter(
    (r) => !r.homepageUrl || r.homepageUrl.trim().length === 0
  ).length;
  const flagshipMissingLicense = flagships.filter((r) => !r.licenseSpdx).length;
  const flagshipMissingTopics = flagships.filter((r) => r.topics.length === 0).length;
  const flagshipMissingScreenshots = flagships.filter((r) => !r.readme.hasImages).length;

  return {
    flagshipCount,
    flagshipWeakReadmes,
    flagshipMissingDemo,
    flagshipMissingLicense,
    flagshipMissingTopics,
    flagshipMissingScreenshots,
  };
}

export function extractActivityFacts(snapshot: GitHubSnapshot, clock: Date) {
  const nowMs = clock.getTime();
  const originalRepos = snapshot.repositories.filter((r) => !r.isFork);

  let inactiveRepositories = 0;
  let recentPushCount90d = 0;
  let lastPushDaysAgo: number | null = null;

  for (const repo of originalRepos) {
    if (!repo.pushedAt) {
      inactiveRepositories++;
      continue;
    }

    const pushMs = new Date(repo.pushedAt).getTime();
    const daysAgo = Math.max(0, Math.floor((nowMs - pushMs) / (1000 * 60 * 60 * 24)));

    if (daysAgo <= RECENT_PUSH_DAYS) {
      recentPushCount90d++;
    }

    if (daysAgo > INACTIVITY_DAYS) {
      inactiveRepositories++;
    }

    if (lastPushDaysAgo === null || daysAgo < lastPushDaysAgo) {
      lastPushDaysAgo = daysAgo;
    }
  }

  const origCount = originalRepos.length;
  const inactiveRatio = origCount > 0 ? inactiveRepositories / origCount : 0;

  return {
    inactiveRepositories,
    inactiveRatio: Math.min(1, Math.max(0, inactiveRatio)),
    recentPushCount90d,
    lastPushDaysAgo,
  };
}

export function extractTechnologyFacts(snapshot: GitHubSnapshot) {
  const langByteMap = new Map<string, number>();
  let totalBytes = 0;

  for (const repo of snapshot.repositories) {
    for (const lang of repo.languages) {
      const current = langByteMap.get(lang.name) ?? 0;
      langByteMap.set(lang.name, current + lang.bytes);
      totalBytes += lang.bytes;
    }
  }

  const languagesUsed = langByteMap.size;
  let maxBytesInOneLang = 0;
  for (const bytes of langByteMap.values()) {
    if (bytes > maxBytesInOneLang) {
      maxBytesInOneLang = bytes;
    }
  }

  const topLanguageShare = totalBytes > 0 ? maxBytesInOneLang / totalBytes : 0;

  return {
    languagesUsed,
    topLanguageShare: Math.min(1, Math.max(0, topLanguageShare)),
  };
}

export function extractImpactFacts(snapshot: GitHubSnapshot) {
  let totalStars = 0;
  let totalForksReceived = 0;

  for (const repo of snapshot.repositories) {
    totalStars += repo.stargazerCount;
    totalForksReceived += repo.forkCount;
  }

  return {
    totalStars,
    totalForksReceived,
  };
}

/**
 * Calculates all facts and determines portfolio noise ratio and data sufficiency.
 */
export function extractCalculatedFacts(
  snapshot: GitHubSnapshot,
  clock: Date = new Date()
): CalculatedFacts {
  const profileFacts = extractProfileFacts(snapshot);
  const repoFacts = extractRepositoryFacts(snapshot);
  const docFacts = extractDocumentationFacts(snapshot);
  const activityFacts = extractActivityFacts(snapshot, clock);
  const techFacts = extractTechnologyFacts(snapshot);
  const impactFacts = extractImpactFacts(snapshot);

  // Portfolio Noise Ratio = proportion of repos that are forks, archived, or inactive original repos
  const noisyReposCount = snapshot.repositories.filter((r) => {
    if (r.isFork || r.isArchived) return true;
    if (!r.pushedAt) return true;
    const diffDays =
      (clock.getTime() - new Date(r.pushedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > INACTIVITY_DAYS;
  }).length;

  const portfolioNoiseRatio =
    repoFacts.totalRepositories > 0
      ? Math.min(1, Math.max(0, noisyReposCount / repoFacts.totalRepositories))
      : 0;

  const insufficientData = repoFacts.originalRepositories < MIN_ORIGINAL_REPOS;

  return {
    ...repoFacts,
    ...docFacts,
    ...activityFacts,
    ...techFacts,
    ...impactFacts,
    ...profileFacts,
    portfolioNoiseRatio,
    insufficientData,
  };
}
