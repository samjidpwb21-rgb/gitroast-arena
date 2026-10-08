import { describe, it, expect } from "vitest";
import { generateRescuePlan } from "@/lib/rescue/simulator";
import { normalizeGitHubResponse, type RawGraphQLResponse } from "@/lib/github/normalize";
import { extractCalculatedFacts } from "@/lib/analysis/facts";
import { calculateCategoryScores } from "@/lib/analysis/scoring";
import { generateEvidence } from "@/lib/analysis/evidence";
import { RescuePlanSchema } from "@/types";

import averageFixture from "../fixtures/fixture-average.json";
import noReadmeFixture from "../fixtures/fixture-no-readme.json";

describe("Milestone 4 — Rescue Simulation Engine", () => {
  const clock = new Date("2026-10-08T12:00:00Z");

  it("computes mathematically valid rescue plan on averageFixture", () => {
    const snapshot = normalizeGitHubResponse(averageFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);
    const scores = calculateCategoryScores(facts, snapshot);
    const evidence = generateEvidence(facts, snapshot);

    const rescuePlan = generateRescuePlan({
      facts,
      snapshot,
      scores,
      evidence,
      clock,
    });

    expect(() => RescuePlanSchema.parse(rescuePlan)).not.toThrow();
    expect(rescuePlan.top.length).toBeLessThanOrEqual(3);
    expect(rescuePlan.potentialScore).toBeGreaterThanOrEqual(scores.portfolioReadiness);
    expect(rescuePlan.potentialScore).toBeLessThanOrEqual(100);
    expect(rescuePlan.disclaimer).toBe("Internal estimate based on simulated score changes.");

    // Enforce impact invariants
    for (const action of rescuePlan.top) {
      expect(action.impact).toBe(action.simulatedScore - action.currentScore);
      expect(action.evidenceIds.length).toBeGreaterThan(0);
      expect(action.steps.length).toBeGreaterThanOrEqual(1);
      expect(action.steps.length).toBeLessThanOrEqual(5);
    }
  });

  it("ranks highest impact fix first (e.g. writing documentation for no-readme profile)", () => {
    const snapshot = normalizeGitHubResponse(noReadmeFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);
    const scores = calculateCategoryScores(facts, snapshot);
    const evidence = generateEvidence(facts, snapshot);

    const rescuePlan = generateRescuePlan({
      facts,
      snapshot,
      scores,
      evidence,
      clock,
    });

    expect(rescuePlan.top.length).toBeGreaterThanOrEqual(1);

    // Sorted descending by impact
    for (let i = 0; i < rescuePlan.top.length - 1; i++) {
      expect(rescuePlan.top[i]!.impact).toBeGreaterThanOrEqual(rescuePlan.top[i + 1]!.impact);
    }

    // Top action should be README documentation rewrite
    expect(rescuePlan.top[0]?.id).toBe("fix_rewrite_readmes");
    expect(rescuePlan.top[0]?.impact).toBeGreaterThan(5);
  });
});
