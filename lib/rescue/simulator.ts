import type {
  GitHubSnapshot,
  CalculatedFacts,
  CategoryScores,
  Evidence,
  RescuePlan,
  RescueAction,
} from "@/types";
import { RescuePlanSchema } from "@/types";
import { CANDIDATE_FIXES } from "./actions";
import { extractCalculatedFacts } from "@/lib/analysis/facts";
import { calculateCategoryScores } from "@/lib/analysis/scoring";

export interface SimulateRescueOptions {
  facts: CalculatedFacts;
  snapshot: GitHubSnapshot;
  scores: CategoryScores;
  evidence: Evidence[];
  clock?: Date;
}

const RESCUE_DISCLAIMER = "Internal estimate based on simulated score changes." as const;

/**
 * Calculates real score impacts by re-running the mathematical scoring engine on hypothetical snapshots.
 */
export function generateRescuePlan(options: SimulateRescueOptions): RescuePlan {
  const { facts, snapshot, scores, evidence, clock = new Date() } = options;

  if (facts.insufficientData || evidence.length === 0) {
    return {
      top: [],
      potentialScore: scores.portfolioReadiness,
      disclaimer: RESCUE_DISCLAIMER,
    };
  }

  // Create evidence lookup by category
  const evidenceCategoryMap = new Map<string, Evidence[]>();
  for (const ev of evidence) {
    const list = evidenceCategoryMap.get(ev.factKey) ?? [];
    list.push(ev);
    evidenceCategoryMap.set(ev.factKey, list);
  }

  const simulatedActions: RescueAction[] = [];

  for (const fixDef of CANDIDATE_FIXES) {
    // Only evaluate fixes for issues that actually triggered evidence
    const matchingEvidence = evidenceCategoryMap.get(fixDef.triggerCategory);
    if (!matchingEvidence || matchingEvidence.length === 0) {
      continue;
    }

    // 1. Synthesize hypothetical snapshot
    const hypoSnapshot = fixDef.applyFix(snapshot, facts);

    // 2. Re-extract facts
    const hypoFacts = extractCalculatedFacts(hypoSnapshot, clock);

    // 3. Re-run identical scoring engine
    const hypoScores = calculateCategoryScores(hypoFacts, hypoSnapshot);

    const simulatedScore = hypoScores.portfolioReadiness;
    const currentScore = scores.portfolioReadiness;
    const computedImpact = simulatedScore - currentScore;

    // Only include actions that improve or sustain score
    if (computedImpact >= 0) {
      simulatedActions.push({
        id: fixDef.id,
        title: fixDef.title,
        why: fixDef.why,
        steps: fixDef.steps,
        affectsCategory: fixDef.affectsCategory,
        currentScore,
        simulatedScore,
        impact: computedImpact, // Guaranteed: impact === simulatedScore - currentScore
        evidenceIds: matchingEvidence.map((e) => e.id),
      });
    }
  }

  // Sort descending by impact (ties broken alphabetically by id)
  simulatedActions.sort((a, b) => {
    if (b.impact !== a.impact) return b.impact - a.impact;
    return a.id.localeCompare(b.id);
  });

  // Keep top 3 actions only
  const topActions = simulatedActions.slice(0, 3);

  // Compute joint potential score by applying all top 3 fixes together
  let combinedSnapshot = snapshot;
  for (const action of topActions) {
    const fixDef = CANDIDATE_FIXES.find((f) => f.id === action.id);
    if (fixDef) {
      combinedSnapshot = fixDef.applyFix(combinedSnapshot, facts);
    }
  }

  const combinedFacts = extractCalculatedFacts(combinedSnapshot, clock);
  const combinedScores = calculateCategoryScores(combinedFacts, combinedSnapshot);
  const potentialScore = Math.max(scores.portfolioReadiness, Math.min(100, combinedScores.portfolioReadiness));

  const plan: RescuePlan = {
    top: topActions,
    potentialScore,
    disclaimer: RESCUE_DISCLAIMER,
  };

  return RescuePlanSchema.parse(plan);
}
