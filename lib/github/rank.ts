import { FLAGSHIP_MAX, FLAGSHIP_RANKING_WEIGHTS } from "@/config/scoring";

export interface CandidateRepoInput {
  name: string;
  isFork: boolean;
  isArchived: boolean;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  pushedAt: string | null;
  homepageUrl: string | null;
  topics: string[];
  readmeExists: boolean;
  now?: Date;
}

/**
 * Calculates a flagship suitability score for a repository.
 * Stars are treated strictly as a visibility signal and log-scaled up to a cap.
 */
export function calculateFlagshipScore(repo: CandidateRepoInput, clock: Date = new Date()): number {
  let score = 0;

  // 1. Original repository preference
  if (!repo.isFork) {
    score += FLAGSHIP_RANKING_WEIGHTS.isOriginal;
  }

  // 2. Useful description presence (>10 characters)
  if (repo.description && repo.description.trim().length > 10) {
    score += FLAGSHIP_RANKING_WEIGHTS.hasDescription;
  }

  // 3. Documentation presence
  if (repo.readmeExists) {
    score += FLAGSHIP_RANKING_WEIGHTS.hasReadme;
  }

  // 4. Live demo / homepage presence
  if (repo.homepageUrl && repo.homepageUrl.trim().length > 0) {
    score += FLAGSHIP_RANKING_WEIGHTS.hasHomepage;
  }

  // 5. Topics / tags curation
  if (repo.topics.length > 0) {
    score += Math.min(FLAGSHIP_RANKING_WEIGHTS.hasTopics, repo.topics.length * 3);
  }

  // 6. Recent activity (within last 180 days)
  if (repo.pushedAt) {
    const pushedDate = new Date(repo.pushedAt);
    const diffDays = (clock.getTime() - pushedDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays <= 180) {
      score += FLAGSHIP_RANKING_WEIGHTS.recentPushBonus;
    }
  }

  // 7. Log-scaled stars & forks
  const starSignal = Math.log10(repo.stargazerCount + 1) * 8;
  const forkSignal = Math.log10(repo.forkCount + 1) * 4;
  const impactSignal = Math.min(FLAGSHIP_RANKING_WEIGHTS.logStarCap, Math.round(starSignal + forkSignal));
  score += impactSignal;

  // Penalize archived repos slightly for flagship status
  if (repo.isArchived) {
    score -= 20;
  }

  return Math.max(0, score);
}

/**
 * Identifies the top flagship repositories (top 5–8, capped by total available repositories)
 * from an array of candidates.
 */
export function rankFlagshipRepositories<T extends CandidateRepoInput>(
  repos: T[],
  clock: Date = new Date()
): { repo: T; score: number; isFlagship: boolean }[] {
  if (repos.length === 0) return [];

  const scored = repos.map((repo) => ({
    repo,
    score: calculateFlagshipScore(repo, clock),
    isFlagship: false,
  }));

  // Sort descending by score; tiebreaker by name
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.repo.name.localeCompare(b.repo.name);
  });

  // Target flagship count: up to FLAGSHIP_MAX (8), capped by available repositories
  const targetCount = Math.min(repos.length, FLAGSHIP_MAX);

  for (let i = 0; i < Math.min(scored.length, targetCount); i++) {
    const item = scored[i];
    if (item) {
      item.isFlagship = true;
    }
  }

  return scored;
}
