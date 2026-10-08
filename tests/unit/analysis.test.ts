import { describe, it, expect } from "vitest";
import { normalizeGitHubResponse, type RawGraphQLResponse } from "@/lib/github/normalize";
import {
  extractCalculatedFacts,
  calculateCategoryScores,
  generateEvidence,
} from "@/lib/analysis";
import { CalculatedFactsSchema, CategoryScoresSchema, EvidenceSchema, type GitHubSnapshot } from "@/types";

// Import fixtures
import perfectFixture from "../fixtures/fixture-perfect.json";
import averageFixture from "../fixtures/fixture-average.json";
import inactiveFixture from "../fixtures/fixture-inactive.json";
import noReadmeFixture from "../fixtures/fixture-no-readme.json";
import manyForksFixture from "../fixtures/fixture-many-forks.json";
import emptyFixture from "../fixtures/fixture-empty.json";

describe("Milestone 3 — Analysis Engine: Facts Extractor", () => {
  const clock = new Date("2026-10-08T12:00:00Z");

  it("extracts valid facts from fixture-perfect", () => {
    const snapshot = normalizeGitHubResponse(perfectFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);

    expect(() => CalculatedFactsSchema.parse(facts)).not.toThrow();
    expect(facts.totalRepositories).toBe(6);
    expect(facts.originalRepositories).toBe(6);
    expect(facts.forkedRepositories).toBe(0);
    expect(facts.forkRatio).toBe(0);
    expect(facts.hasProfileReadme).toBe(true);
    expect(facts.hasBio).toBe(true);
    expect(facts.hasWebsiteOrLink).toBe(true);
    expect(facts.pinnedCount).toBe(3);
    expect(facts.insufficientData).toBe(false);
  });

  it("correctly identifies high inactive ratio in fixture-inactive", () => {
    const snapshot = normalizeGitHubResponse(inactiveFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);

    expect(facts.inactiveRatio).toBe(1.0);
    expect(facts.recentPushCount90d).toBe(0);
    expect(facts.insufficientData).toBe(false);
  });

  it("identifies high fork ratio in fixture-many-forks", () => {
    const snapshot = normalizeGitHubResponse(manyForksFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);

    expect(facts.forkRatio).toBeGreaterThan(0.7);
  });

  it("identifies insufficient data in fixture-empty", () => {
    const snapshot = normalizeGitHubResponse(emptyFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);

    expect(facts.insufficientData).toBe(true);
    expect(facts.originalRepositories).toBe(1);
  });
});

describe("Milestone 3 — Analysis Engine: Scoring Authority", () => {
  const clock = new Date("2026-10-08T12:00:00Z");

  it("computes high score for fixture-perfect across all vectors", () => {
    const snapshot = normalizeGitHubResponse(perfectFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);
    const scores = calculateCategoryScores(facts, snapshot);

    expect(() => CategoryScoresSchema.parse(scores)).not.toThrow();
    expect(scores.projectQuality).toBeGreaterThanOrEqual(70);
    expect(scores.documentation).toBeGreaterThanOrEqual(75);
    expect(scores.activity).toBeGreaterThanOrEqual(75);
    expect(scores.profile).toBeGreaterThanOrEqual(80);
    expect(scores.portfolioReadiness).toBeGreaterThanOrEqual(75);
  });

  it("penalizes documentation score for fixture-no-readme", () => {
    const snapshot = normalizeGitHubResponse(noReadmeFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);
    const scores = calculateCategoryScores(facts, snapshot);

    expect(scores.documentation).toBe(0);
    expect(scores.portfolioReadiness).toBeLessThan(70);
  });

  it("penalizes activity score for fixture-inactive", () => {
    const snapshot = normalizeGitHubResponse(inactiveFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);
    const scores = calculateCategoryScores(facts, snapshot);

    expect(scores.activity).toBe(0);
  });

  it("penalizes curation for fixture-many-forks", () => {
    const snapshot = normalizeGitHubResponse(manyForksFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);
    const scores = calculateCategoryScores(facts, snapshot);

    expect(scores.portfolioCuration).toBeLessThan(50);
  });

  it("handles fixture-empty safely with neutral baseline", () => {
    const snapshot = normalizeGitHubResponse(emptyFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);
    const scores = calculateCategoryScores(facts, snapshot);

    expect(scores.portfolioReadiness).toBe(20);
  });
});

describe("Milestone 3 — Determinism & Strict No Double-Counting", () => {
  const clock = new Date("2026-10-08T12:00:00Z");
  const baseSnapshot = normalizeGitHubResponse(averageFixture as unknown as RawGraphQLResponse, clock);

  it("produces identical output across 100 repeated runs (Deterministic Guarantee)", () => {
    const baseFacts = extractCalculatedFacts(baseSnapshot, clock);
    const baseScores = calculateCategoryScores(baseFacts, baseSnapshot);
    const baseEvidence = generateEvidence(baseFacts, baseSnapshot);

    for (let i = 0; i < 100; i++) {
      const iterFacts = extractCalculatedFacts(baseSnapshot, clock);
      const iterScores = calculateCategoryScores(iterFacts, baseSnapshot);
      const iterEvidence = generateEvidence(iterFacts, baseSnapshot);

      expect(iterFacts).toEqual(baseFacts);
      expect(iterScores).toEqual(baseScores);
      expect(iterEvidence).toEqual(baseEvidence);
    }
  });

  it("changing README words changes ONLY documentation score", () => {
    const baseFacts = extractCalculatedFacts(baseSnapshot, clock);
    const baseScores = calculateCategoryScores(baseFacts, baseSnapshot);

    // Create modified snapshot with full READMEs on all flagships
    const modifiedSnapshot: GitHubSnapshot = {
      ...baseSnapshot,
      repositories: baseSnapshot.repositories.map((repo) => ({
        ...repo,
        readme: {
          exists: true,
          wordCount: 500,
          hasHeadings: true,
          hasImages: true,
          hasInstallSection: true,
          hasUsageSection: true,
          excerptSanitized: "Full documentation",
        },
      })),
    };

    const modFacts = extractCalculatedFacts(modifiedSnapshot, clock);
    const modScores = calculateCategoryScores(modFacts, modifiedSnapshot);

    // Documentation sub-score MUST change
    expect(modScores.documentation).not.toEqual(baseScores.documentation);

    // All other 6 sub-scores MUST remain completely identical
    expect(modScores.projectQuality).toEqual(baseScores.projectQuality);
    expect(modScores.activity).toEqual(baseScores.activity);
    expect(modScores.technicalBreadth).toEqual(baseScores.technicalBreadth);
    expect(modScores.profile).toEqual(baseScores.profile);
    expect(modScores.portfolioCuration).toEqual(baseScores.portfolioCuration);
    expect(modScores.projectImpact).toEqual(baseScores.projectImpact);
  });

  it("changing stars changes ONLY projectImpact score", () => {
    const baseFacts = extractCalculatedFacts(baseSnapshot, clock);
    const baseScores = calculateCategoryScores(baseFacts, baseSnapshot);

    const modifiedSnapshot: GitHubSnapshot = {
      ...baseSnapshot,
      repositories: baseSnapshot.repositories.map((repo) => ({
        ...repo,
        stargazerCount: repo.stargazerCount + 500,
      })),
    };

    const modFacts = extractCalculatedFacts(modifiedSnapshot, clock);
    const modScores = calculateCategoryScores(modFacts, modifiedSnapshot);

    // Impact sub-score MUST change
    expect(modScores.projectImpact).not.toEqual(baseScores.projectImpact);

    // All other 6 sub-scores MUST remain identical
    expect(modScores.projectQuality).toEqual(baseScores.projectQuality);
    expect(modScores.documentation).toEqual(baseScores.documentation);
    expect(modScores.activity).toEqual(baseScores.activity);
    expect(modScores.technicalBreadth).toEqual(baseScores.technicalBreadth);
    expect(modScores.profile).toEqual(baseScores.profile);
    expect(modScores.portfolioCuration).toEqual(baseScores.portfolioCuration);
  });

  it("changing push activity velocity changes ONLY activity score", () => {
    const baseFacts = extractCalculatedFacts(baseSnapshot, clock);
    const baseScores = calculateCategoryScores(baseFacts, baseSnapshot);

    // Modify push date of the most recent repo from September to yesterday (both <90d)
    const modifiedSnapshot: GitHubSnapshot = {
      ...baseSnapshot,
      repositories: baseSnapshot.repositories.map((repo, idx) => {
        if (idx === 0) {
          return {
            ...repo,
            pushedAt: "2026-10-07T10:00:00Z", // 1 day ago
          };
        }
        return repo;
      }),
    };

    const modFacts = extractCalculatedFacts(modifiedSnapshot, clock);
    const modScores = calculateCategoryScores(modFacts, modifiedSnapshot);

    // Activity sub-score MUST change
    expect(modScores.activity).not.toEqual(baseScores.activity);

    // All other 6 sub-scores MUST remain completely identical
    expect(modScores.projectQuality).toEqual(baseScores.projectQuality);
    expect(modScores.documentation).toEqual(baseScores.documentation);
    expect(modScores.technicalBreadth).toEqual(baseScores.technicalBreadth);
    expect(modScores.profile).toEqual(baseScores.profile);
    expect(modScores.portfolioCuration).toEqual(baseScores.portfolioCuration);
    expect(modScores.projectImpact).toEqual(baseScores.projectImpact);
  });
});

describe("Milestone 3 — Evidence Generator", () => {
  const clock = new Date("2026-10-08T12:00:00Z");

  it("generates structured evidence items with stable IDs and valid schemas", () => {
    const snapshot = normalizeGitHubResponse(averageFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);
    const evidence = generateEvidence(facts, snapshot);

    expect(evidence.length).toBeGreaterThan(0);
    for (const item of evidence) {
      expect(() => EvidenceSchema.parse(item)).not.toThrow();
      expect(item.id.startsWith("ev_")).toBe(true);
      expect(item.observed.length).toBeGreaterThan(0);
    }
  });

  it("returns insufficient data evidence for empty accounts", () => {
    const snapshot = normalizeGitHubResponse(emptyFixture as unknown as RawGraphQLResponse, clock);
    const facts = extractCalculatedFacts(snapshot, clock);
    const evidence = generateEvidence(facts, snapshot);

    expect(evidence).toHaveLength(1);
    expect(evidence[0]?.id).toBe("ev_insufficient_data");
    expect(evidence[0]?.factKey).toBe("insufficientData");
  });
});
