import { z } from "zod";

// ==========================================
// Step 4.1 — Primitives
// ==========================================
export const RoastLevelSchema = z.enum(["easy", "spicy", "savage", "brutal"]);
export type RoastLevel = z.infer<typeof RoastLevelSchema>;

export const SeveritySchema = z.enum(["mild", "medium", "sharp", "savage"]);
export type Severity = z.infer<typeof SeveritySchema>;

export const ScoreIntSchema = z.number().int().min(0).max(100);
export type ScoreInt = z.infer<typeof ScoreIntSchema>;

export const IsoDateSchema = z.string().datetime();
export type IsoDate = z.infer<typeof IsoDateSchema>;

// ==========================================
// Step 4.2 — GitHubSnapshot
// ==========================================
export const LanguageByteSchema = z
  .object({
    name: z.string(),
    bytes: z.number().int().nonnegative(),
  })
  .strict();
export type LanguageByte = z.infer<typeof LanguageByteSchema>;

export const ReadmeSummarySchema = z
  .object({
    exists: z.boolean(),
    wordCount: z.number().int().nonnegative(),
    hasHeadings: z.boolean(),
    hasImages: z.boolean(),
    hasInstallSection: z.boolean(),
    hasUsageSection: z.boolean(),
    excerptSanitized: z.string().max(1200),
  })
  .strict();
export type ReadmeSummary = z.infer<typeof ReadmeSummarySchema>;

export const RepoSnapshotSchema = z
  .object({
    name: z.string(),
    nameWithOwner: z.string(),
    description: z.string().nullable(),
    isFork: z.boolean(),
    isArchived: z.boolean(),
    stargazerCount: z.number().int().nonnegative(),
    forkCount: z.number().int().nonnegative(),
    pushedAt: IsoDateSchema.nullable(),
    updatedAt: IsoDateSchema,
    createdAt: IsoDateSchema,
    homepageUrl: z.string().url().nullable(),
    licenseSpdx: z.string().nullable(),
    topics: z.array(z.string()),
    primaryLanguage: z.string().nullable(),
    languages: z.array(LanguageByteSchema),
    readme: ReadmeSummarySchema,
    isFlagship: z.boolean(),
    flagshipScore: z.number().nullable(),
  })
  .strict();
export type RepoSnapshot = z.infer<typeof RepoSnapshotSchema>;

export const ProfileSnapshotSchema = z
  .object({
    login: z.string(),
    accountType: z.enum(["User", "Organization", "Bot"]),
    name: z.string().nullable(),
    bio: z.string().nullable(),
    avatarUrl: z.string().url(),
    company: z.string().nullable(),
    location: z.string().nullable(),
    websiteUrl: z.string().nullable(),
    followers: z.number().int().nonnegative(),
    following: z.number().int().nonnegative(),
    createdAt: IsoDateSchema,
    hasProfileReadme: z.boolean(),
    pinnedRepoNames: z.array(z.string()),
  })
  .strict();
export type ProfileSnapshot = z.infer<typeof ProfileSnapshotSchema>;

export const GitHubSnapshotSchema = z
  .object({
    fetchedAt: IsoDateSchema,
    profile: ProfileSnapshotSchema,
    totalRepositoryCount: z.number().int().nonnegative(),
    repositories: z.array(RepoSnapshotSchema),
    contributionsLastYear: z.number().int().nonnegative().nullable(),
    truncated: z.boolean(),
  })
  .strict();
export type GitHubSnapshot = z.infer<typeof GitHubSnapshotSchema>;

// ==========================================
// Step 4.3 — CalculatedFacts
// ==========================================
export const CalculatedFactsSchema = z
  .object({
    totalRepositories: z.number().int(),
    originalRepositories: z.number().int(),
    forkedRepositories: z.number().int(),
    forkRatio: z.number().min(0).max(1),
    archivedRepositories: z.number().int(),
    inactiveRepositories: z.number().int(),
    inactiveRatio: z.number().min(0).max(1),
    reposWithoutDescription: z.number().int(),
    reposWithoutReadme: z.number().int(),
    flagshipCount: z.number().int(),
    flagshipWeakReadmes: z.number().int(),
    flagshipMissingDemo: z.number().int(),
    flagshipMissingLicense: z.number().int(),
    flagshipMissingTopics: z.number().int(),
    flagshipMissingScreenshots: z.number().int(),
    languagesUsed: z.number().int(),
    topLanguageShare: z.number().min(0).max(1),
    totalStars: z.number().int(),
    totalForksReceived: z.number().int(),
    recentPushCount90d: z.number().int(),
    lastPushDaysAgo: z.number().int().nullable(),
    hasProfileReadme: z.boolean(),
    hasBio: z.boolean(),
    hasWebsiteOrLink: z.boolean(),
    pinnedCount: z.number().int(),
    portfolioNoiseRatio: z.number().min(0).max(1),
    insufficientData: z.boolean(),
  })
  .strict();
export type CalculatedFacts = z.infer<typeof CalculatedFactsSchema>;

// ==========================================
// Step 4.4 — CategoryScores
// ==========================================
export const CategoryScoresSchema = z
  .object({
    projectQuality: ScoreIntSchema,
    documentation: ScoreIntSchema,
    activity: ScoreIntSchema,
    technicalBreadth: ScoreIntSchema,
    profile: ScoreIntSchema,
    portfolioCuration: ScoreIntSchema,
    projectImpact: ScoreIntSchema,
    portfolioReadiness: ScoreIntSchema,
  })
  .strict();
export type CategoryScores = z.infer<typeof CategoryScoresSchema>;

// ==========================================
// Step 4.5 — Evidence & RoastCard
// ==========================================
export const EvidenceSourceSchema = z.enum(["profile", "repository", "readme", "activity", "language"]);
export type EvidenceSource = z.infer<typeof EvidenceSourceSchema>;

export const EvidenceSchema = z
  .object({
    id: z.string(),
    factKey: z.string(),
    label: z.string(),
    observed: z.string(),
    threshold: z.string().nullable(),
    source: EvidenceSourceSchema,
    repoNames: z.array(z.string()).max(10),
  })
  .strict();
export type Evidence = z.infer<typeof EvidenceSchema>;

export const RoastCardSchema = z
  .object({
    id: z.string(),
    category: z.string(),
    title: z.string().max(60),
    text: z.string().max(400),
    severity: SeveritySchema,
    evidenceIds: z.array(z.string()).min(1),
    source: z.enum(["template", "ai"]),
  })
  .strict();
export type RoastCard = z.infer<typeof RoastCardSchema>;

// ==========================================
// Step 4.6 — RescuePlan
// ==========================================
export const RescueActionSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    why: z.string(),
    steps: z.array(z.string()).min(1).max(5),
    affectsCategory: z.string(),
    currentScore: ScoreIntSchema,
    simulatedScore: ScoreIntSchema,
    impact: z.number().int(),
    evidenceIds: z.array(z.string()).min(1),
  })
  .strict();
export type RescueAction = z.infer<typeof RescueActionSchema>;

export const RescuePlanSchema = z
  .object({
    top: z.array(RescueActionSchema).max(3),
    potentialScore: ScoreIntSchema,
    disclaimer: z.literal("Internal estimate based on simulated score changes."),
  })
  .strict();
export type RescuePlan = z.infer<typeof RescuePlanSchema>;

// ==========================================
// Step 4.7 — RecruiterSummary & AnalysisResult
// ==========================================
export const RecruiterVerdictSchema = z.enum(["strong", "promising", "needs-work", "insufficient-data"]);
export type RecruiterVerdict = z.infer<typeof RecruiterVerdictSchema>;

export const RecruiterSummarySchema = z
  .object({
    headline: z.string().max(140),
    strengths: z.array(z.string()).max(3),
    concerns: z.array(z.string()).max(3),
    verdict: RecruiterVerdictSchema,
    source: z.enum(["template", "ai"]),
  })
  .strict();
export type RecruiterSummary = z.infer<typeof RecruiterSummarySchema>;

export const AnalysisMetadataSchema = z
  .object({
    username: z.string(),
    roastLevel: RoastLevelSchema,
    targetRole: z.string().max(60).nullable(),
    generatedAt: IsoDateSchema,
    snapshotFetchedAt: IsoDateSchema,
    fromCache: z.boolean(),
    aiEnhanced: z.boolean(),
    engineVersion: z.string(),
    insufficientData: z.boolean(),
  })
  .strict();
export type AnalysisMetadata = z.infer<typeof AnalysisMetadataSchema>;

export const AnalysisResultSchema = z
  .object({
    id: z.string(),
    metadata: AnalysisMetadataSchema,
    facts: CalculatedFactsSchema,
    scores: CategoryScoresSchema,
    evidence: z.array(EvidenceSchema),
    roasts: z.array(RoastCardSchema),
    recruiter: RecruiterSummarySchema,
    rescue: RescuePlanSchema,
  })
  .strict();
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

// ==========================================
// Step 4.8 — Invariant Validator Function
// ==========================================
export function validateAnalysisResultInvariants(result: AnalysisResult): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const evidenceIdSet = new Set(result.evidence.map((e) => e.id));

  // 1. Every RoastCard.evidenceIds[*] exists in AnalysisResult.evidence
  for (const roast of result.roasts) {
    for (const evId of roast.evidenceIds) {
      if (!evidenceIdSet.has(evId)) {
        errors.push(`RoastCard '${roast.id}' references non-existent evidenceId '${evId}'`);
      }
    }
  }

  // 2. Every RescueAction.evidenceIds[*] exists in AnalysisResult.evidence
  for (const action of result.rescue.top) {
    for (const evId of action.evidenceIds) {
      if (!evidenceIdSet.has(evId)) {
        errors.push(`RescueAction '${action.id}' references non-existent evidenceId '${evId}'`);
      }
    }
    // 3. RescueAction.impact === simulatedScore - currentScore
    if (action.impact !== action.simulatedScore - action.currentScore) {
      errors.push(
        `RescueAction '${action.id}' impact (${action.impact}) does not equal simulatedScore (${action.simulatedScore}) - currentScore (${action.currentScore})`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
