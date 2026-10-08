import type {
  CalculatedFacts,
  CategoryScores,
  Evidence,
  RecruiterSummary,
  RecruiterVerdict,
} from "@/types";
import { RecruiterSummarySchema } from "@/types";

export interface RecruiterSummaryOptions {
  facts: CalculatedFacts;
  scores: CategoryScores;
  evidence: Evidence[];
  targetRole?: string | null;
}

/**
 * Generates a deterministic, objective Recruiter evaluation summary based on facts and scores.
 */
export function generateRecruiterSummary(options: RecruiterSummaryOptions): RecruiterSummary {
  const { facts, scores, targetRole } = options;

  if (facts.insufficientData) {
    return {
      headline: "Insufficient public repositories to conduct a comprehensive technical evaluation.",
      strengths: [],
      concerns: ["Fewer than 3 original repositories found on public profile"],
      verdict: "insufficient-data",
      source: "template",
    };
  }

  // 1. Determine Verdict from Portfolio Readiness score
  let verdict: RecruiterVerdict = "needs-work";
  if (scores.portfolioReadiness >= 75) {
    verdict = "strong";
  } else if (scores.portfolioReadiness >= 55) {
    verdict = "promising";
  }

  // 2. Derive Strengths (top scoring vectors)
  const candidateStrengths: string[] = [];
  if (scores.activity >= 70) {
    candidateStrengths.push(
      `Active recent shipping cadence (${facts.recentPushCount90d} repositories pushed in last 90 days)`
    );
  }
  if (scores.documentation >= 70) {
    candidateStrengths.push("Well-structured documentation with clear setup and usage instructions");
  }
  if (scores.projectImpact >= 60) {
    candidateStrengths.push(
      `Demonstrated community traction (${facts.totalStars} stargazers across public projects)`
    );
  }
  if (scores.technicalBreadth >= 65) {
    candidateStrengths.push(
      `Polyglot versatility across ${facts.languagesUsed} distinct programming languages`
    );
  }
  if (scores.profile >= 70) {
    candidateStrengths.push("Curated profile landing page with verified links and overview");
  }
  if (scores.projectQuality >= 70) {
    candidateStrengths.push("High codebase hygiene with complete descriptions and license coverage");
  }
  if (candidateStrengths.length === 0) {
    candidateStrengths.push(`Published ${facts.originalRepositories} original repositories`);
  }

  // 3. Derive Concerns (lowest scoring vectors or key evidence)
  const candidateConcerns: string[] = [];
  if (facts.flagshipWeakReadmes > 0) {
    candidateConcerns.push(
      `${facts.flagshipWeakReadmes} flagship projects lack comprehensive setup or usage documentation`
    );
  }
  if (facts.flagshipMissingDemo > 0) {
    candidateConcerns.push(
      `${facts.flagshipMissingDemo} flagship web projects lack live demo links for quick review`
    );
  }
  if (facts.inactiveRatio >= 0.4) {
    candidateConcerns.push(
      `${Math.round(facts.inactiveRatio * 100)}% of original repositories have been inactive for over 12 months`
    );
  }
  if (facts.forkRatio >= 0.5) {
    candidateConcerns.push("High proportion of forks dilutes visibility of original work");
  }
  if (facts.reposWithoutDescription >= 2) {
    candidateConcerns.push(
      `${facts.reposWithoutDescription} repositories are missing high-level project descriptions`
    );
  }
  if (candidateConcerns.length === 0 && scores.portfolioReadiness < 90) {
    candidateConcerns.push("Could benefit from adding UI screenshots and architecture diagrams");
  }

  // 4. Headline generation with role context if provided
  const roleContext = targetRole ? ` for ${targetRole}` : "";
  let headline = "";

  if (verdict === "strong") {
    headline = `Solid portfolio readiness${roleContext} with consistent shipping velocity and strong technical foundations.`;
  } else if (verdict === "promising") {
    headline = `Promising engineering capability${roleContext} with actionable improvements in documentation and project curation.`;
  } else {
    headline = `Early-stage developer showcase${roleContext} requiring focused documentation and curation to pass recruiter screens.`;
  }

  // Clamp headline to 140 chars
  if (headline.length > 140) {
    headline = headline.slice(0, 137) + "...";
  }

  const summary: RecruiterSummary = {
    headline,
    strengths: candidateStrengths.slice(0, 3),
    concerns: candidateConcerns.slice(0, 3),
    verdict,
    source: "template",
  };

  return RecruiterSummarySchema.parse(summary);
}
