import { describe, it, expect } from "vitest";
import {
  ScoreIntSchema,
  RoastLevelSchema,
  AnalysisResultSchema,
  validateAnalysisResultInvariants,
  type AnalysisResult,
} from "@/types";
import { CATEGORY_WEIGHTS } from "@/config/scoring";

describe("Category Weights", () => {
  it("sums to exactly 1.0", () => {
    const sum = Object.values(CATEGORY_WEIGHTS).reduce((acc, w) => acc + w, 0);
    expect(Math.abs(sum - 1.0)).toBeLessThan(0.0001);
  });
});

describe("Primitive Schemas", () => {
  it("validates valid score integers between 0 and 100", () => {
    expect(ScoreIntSchema.parse(0)).toBe(0);
    expect(ScoreIntSchema.parse(100)).toBe(100);
    expect(ScoreIntSchema.parse(55)).toBe(55);
    expect(() => ScoreIntSchema.parse(-1)).toThrow();
    expect(() => ScoreIntSchema.parse(101)).toThrow();
    expect(() => ScoreIntSchema.parse(42.5)).toThrow();
  });

  it("validates roast levels", () => {
    expect(RoastLevelSchema.parse("easy")).toBe("easy");
    expect(RoastLevelSchema.parse("spicy")).toBe("spicy");
    expect(RoastLevelSchema.parse("savage")).toBe("savage");
    expect(RoastLevelSchema.parse("brutal")).toBe("brutal");
    expect(() => RoastLevelSchema.parse("extreme")).toThrow();
  });
});

describe("AnalysisResult Schema & Invariants", () => {
  const mockValidResult: AnalysisResult = {
    id: "ar_test_1234567890abcdef",
    metadata: {
      username: "octocat",
      roastLevel: "spicy",
      targetRole: "Full Stack Engineer",
      generatedAt: new Date().toISOString(),
      snapshotFetchedAt: new Date().toISOString(),
      fromCache: false,
      aiEnhanced: false,
      engineVersion: "1.0.0",
      insufficientData: false,
    },
    facts: {
      totalRepositories: 10,
      originalRepositories: 8,
      forkedRepositories: 2,
      forkRatio: 0.2,
      archivedRepositories: 1,
      inactiveRepositories: 3,
      inactiveRatio: 0.375,
      reposWithoutDescription: 2,
      reposWithoutReadme: 1,
      flagshipCount: 5,
      flagshipWeakReadmes: 1,
      flagshipMissingDemo: 2,
      flagshipMissingLicense: 1,
      flagshipMissingTopics: 2,
      flagshipMissingScreenshots: 3,
      languagesUsed: 4,
      topLanguageShare: 0.65,
      totalStars: 42,
      totalForksReceived: 12,
      recentPushCount90d: 6,
      lastPushDaysAgo: 5,
      hasProfileReadme: true,
      hasBio: true,
      hasWebsiteOrLink: true,
      pinnedCount: 4,
      portfolioNoiseRatio: 0.3,
      insufficientData: false,
    },
    scores: {
      projectQuality: 75,
      documentation: 80,
      activity: 70,
      technicalBreadth: 65,
      profile: 90,
      portfolioCuration: 60,
      projectImpact: 55,
      portfolioReadiness: 71,
    },
    evidence: [
      {
        id: "ev_inactive_repos",
        factKey: "inactiveRepositories",
        label: "Inactive repositories",
        observed: "3 of 8 original repos have had no activity for over a year",
        threshold: "No pushes in 365 days",
        source: "repository",
        repoNames: ["old-project", "abandoned-api"],
      },
      {
        id: "ev_weak_readme",
        factKey: "flagshipWeakReadmes",
        label: "Flagship project lacks documentation",
        observed: "1 flagship repository has under 80 words in README",
        threshold: "Minimum 80 words with install/usage sections",
        source: "readme",
        repoNames: ["cool-app"],
      },
    ],
    roasts: [
      {
        id: "roast_inactive",
        category: "inactiveRepositories",
        title: "Digital Ghost Town",
        text: "Your repositories are older than some junior devs entering the workforce.",
        severity: "medium",
        evidenceIds: ["ev_inactive_repos"],
        source: "template",
      },
    ],
    recruiter: {
      headline: "Solid foundational builder with moderate documentation debt.",
      strengths: ["Regular recent push frequency", "Comprehensive profile overview"],
      concerns: ["Several flagship projects lack clear live previews"],
      verdict: "promising",
      source: "template",
    },
    rescue: {
      top: [
        {
          id: "fix_readme",
          title: "Elevate flagship project documentation",
          why: "Flagship projects with weak READMEs fail initial recruiter screen.",
          steps: ["Add system architecture diagram", "Document local setup commands"],
          affectsCategory: "documentation",
          currentScore: 71,
          simulatedScore: 78,
          impact: 7,
          evidenceIds: ["ev_weak_readme"],
        },
      ],
      potentialScore: 78,
      disclaimer: "Internal estimate based on simulated score changes.",
    },
  };

  it("parses valid AnalysisResult successfully", () => {
    const parsed = AnalysisResultSchema.parse(mockValidResult);
    expect(parsed.id).toBe("ar_test_1234567890abcdef");
    expect(parsed.scores.portfolioReadiness).toBe(71);
  });

  it("passes invariant validation on valid result", () => {
    const invariantCheck = validateAnalysisResultInvariants(mockValidResult);
    expect(invariantCheck.valid).toBe(true);
    expect(invariantCheck.errors).toHaveLength(0);
  });

  it("fails invariant check if RoastCard references non-existent evidenceId", () => {
    const invalidResult: AnalysisResult = {
      ...mockValidResult,
      roasts: [
        {
          id: "roast_bad",
          category: "test",
          title: "Bad Evidence",
          text: "Testing invariant failure",
          severity: "mild",
          evidenceIds: ["ev_non_existent_id"],
          source: "template",
        },
      ],
    };

    const invariantCheck = validateAnalysisResultInvariants(invalidResult);
    expect(invariantCheck.valid).toBe(false);
    expect(invariantCheck.errors[0]).toContain("ev_non_existent_id");
  });

  it("fails invariant check if RescueAction impact does not match simulatedScore - currentScore", () => {
    const invalidResult: AnalysisResult = {
      ...mockValidResult,
      rescue: {
        ...mockValidResult.rescue,
        top: [
          {
            ...mockValidResult.rescue.top[0]!,
            currentScore: 70,
            simulatedScore: 78,
            impact: 99, // Should be 8 (78 - 70)
          },
        ],
      },
    };

    const invariantCheck = validateAnalysisResultInvariants(invalidResult);
    expect(invariantCheck.valid).toBe(false);
    expect(invariantCheck.errors[0]).toContain("impact (99) does not equal simulatedScore (78) - currentScore (70)");
  });
});
