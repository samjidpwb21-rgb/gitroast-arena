import crypto from "crypto";
import type {
  AnalysisResult,
  RoastLevel,
} from "@/types";
import {
  AnalysisResultSchema,
  validateAnalysisResultInvariants,
} from "@/types";
import { fetchGitHubSnapshot } from "@/lib/github/client";
import { extractCalculatedFacts } from "./facts";
import { calculateCategoryScores } from "./scoring";
import { generateEvidence } from "./evidence";
import { generateRecruiterSummary } from "./recruiter";
import { selectRoastCards } from "@/lib/roast/select";
import { generateRescuePlan } from "@/lib/rescue/simulator";
import { enhanceAnalysisWithAI } from "@/lib/ai/enhancer";
import { ENGINE_VERSION } from "@/config/scoring";

export interface AnalyzePortfolioOptions {
  username: string;
  roastLevel?: RoastLevel;
  targetRole?: string | null;
  refresh?: boolean;
  clock?: Date;
}

export interface AnalyzePortfolioResult {
  result: AnalysisResult;
  fromCache: boolean;
}

/**
 * Generates an unguessable >=128-bit random base64url ID for the analysis result.
 */
export function generateAnalysisId(): string {
  const randomBytes = crypto.randomBytes(16);
  return `ar_${randomBytes.toString("base64url")}`;
}

/**
 * Executes the complete deterministic GitRoast Arena analysis pipeline.
 */
export async function analyzePortfolio(
  options: AnalyzePortfolioOptions
): Promise<AnalyzePortfolioResult> {
  const {
    username,
    roastLevel = "spicy",
    targetRole = null,
    refresh = false,
    clock = new Date(),
  } = options;

  // 1. Fetch normalized GitHub snapshot (with cache and single-flight)
  const { snapshot, fromCache } = await fetchGitHubSnapshot({
    username,
    refresh,
    clock,
  });

  // 2. Extract deterministic facts
  const facts = extractCalculatedFacts(snapshot, clock);

  // 3. Compute 7 sub-scores and Portfolio Readiness
  const scores = calculateCategoryScores(facts, snapshot);

  // 4. Generate structured evidence
  const evidence = generateEvidence(facts, snapshot);

  // 5. Select deterministic roast cards
  const roasts = selectRoastCards({
    facts,
    snapshot,
    evidence,
    roastLevel,
  });

  // 6. Generate rescue plan with re-simulated score impact
  const rescue = generateRescuePlan({
    facts,
    snapshot,
    scores,
    evidence,
    clock,
  });

  // 7. Generate recruiter evaluation summary
  const recruiter = generateRecruiterSummary({
    facts,
    scores,
    evidence,
    targetRole,
  });

  // 8. Optional non-blocking AI enhancement layer (2.5s timeout, structured evidence only)
  let finalRoasts = roasts;
  let finalRecruiter = recruiter;
  let aiEnhanced = false;

  try {
    const enhanced = await enhanceAnalysisWithAI({
      username: snapshot.profile.login,
      roastLevel,
      targetRole,
      facts,
      score: scores.portfolioReadiness,
      roasts,
      evidence,
      recruiter,
    });
    finalRoasts = enhanced.roasts;
    finalRecruiter = enhanced.recruiter;
    aiEnhanced = enhanced.aiEnhanced;
  } catch {
    // Graceful fallback to deterministic output
  }

  // 9. Assemble AnalysisResult
  const analysisResult: AnalysisResult = {
    id: generateAnalysisId(),
    metadata: {
      username: snapshot.profile.login,
      roastLevel,
      targetRole,
      generatedAt: clock.toISOString(),
      snapshotFetchedAt: snapshot.fetchedAt,
      fromCache,
      aiEnhanced,
      engineVersion: ENGINE_VERSION,
      insufficientData: facts.insufficientData,
    },
    facts,
    scores,
    evidence,
    roasts: finalRoasts,
    recruiter: finalRecruiter,
    rescue,
  };

  // 9. Enforce integrity invariants
  const invariantCheck = validateAnalysisResultInvariants(analysisResult);
  if (!invariantCheck.valid) {
    throw new Error(
      `AnalysisResult invariant validation failed:\n${invariantCheck.errors.join("\n")}`
    );
  }

  // 10. Validate strictly against schema
  const parsed = AnalysisResultSchema.parse(analysisResult);

  return {
    result: parsed,
    fromCache,
  };
}
