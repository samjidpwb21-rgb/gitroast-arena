import { describe, it, expect } from "vitest";
import {
  WELCOME_ROAST_BANK,
  DELTA_WELCOME_LINES,
  CLOSING_LINES,
} from "@/lib/mascot/welcome";
import { selectWelcomeRoast, saveLastShownLineId } from "@/lib/mascot/selectWelcome";
import { getScoreTier } from "@/config/scoring";
import { DISALLOWED_SAFETY_TERMS } from "@/config/roasts";
import type { AnalysisResult } from "@/types";

describe("Welcome Roast Bank Quantity & Structure", () => {
  it("has at least 60 total unique welcome roast lines", () => {
    expect(WELCOME_ROAST_BANK.length).toBeGreaterThanOrEqual(60);
    const uniqueIds = new Set(WELCOME_ROAST_BANK.map((l) => l.id));
    expect(uniqueIds.size).toBe(WELCOME_ROAST_BANK.length);
  });

  it("has at least 12 lines for each scored tier", () => {
    const tiers = ["critical", "rough", "needsWork", "decent", "strong", "elite"] as const;
    for (const tier of tiers) {
      const count = WELCOME_ROAST_BANK.filter((l) => l.tier === tier).length;
      expect(count, `Expected >= 12 lines for tier ${tier}, got ${count}`).toBeGreaterThanOrEqual(12);
    }
  });

  it("has at least 5 lines for insufficientData tier", () => {
    const count = WELCOME_ROAST_BANK.filter((l) => l.tier === "insufficientData").length;
    expect(count).toBeGreaterThanOrEqual(5);
  });

  it("has at least 15 closing lines", () => {
    expect(CLOSING_LINES.length).toBeGreaterThanOrEqual(15);
    const uniqueIds = new Set(CLOSING_LINES.map((l) => l.id));
    expect(uniqueIds.size).toBe(CLOSING_LINES.length);
  });

  it("has at least 8 delta lines", () => {
    expect(DELTA_WELCOME_LINES.length).toBeGreaterThanOrEqual(8);
  });

  it("ensures at least 40% of welcome roast lines use placeholders", () => {
    const withPlaceholders = WELCOME_ROAST_BANK.filter((l) => /\{[a-zA-Z]+\}/.test(l.text));
    const ratio = withPlaceholders.length / WELCOME_ROAST_BANK.length;
    expect(ratio).toBeGreaterThanOrEqual(0.4);
  });
});

describe("Welcome Roast Length, Placeholders & Safety", () => {
  const allowedPlaceholders = new Set([
    "username",
    "score",
    "repoCount",
    "inactiveCount",
    "flagshipCount",
    "totalStars",
    "delta",
  ]);

  it("verifies all welcome lines are concise (<= 115 chars) and contain no emoji", () => {
    for (const line of WELCOME_ROAST_BANK) {
      expect(line.text.length, `Line '${line.id}' exceeded length limit (${line.text.length} chars)`).toBeLessThanOrEqual(115);
      // No emoji
      const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(emojiRegex.test(line.text), `Line '${line.id}' contains forbidden emoji: ${line.text}`).toBe(false);
    }
  });

  it("verifies all placeholders used across all lines are strictly in the allowed set", () => {
    const allTexts = [
      ...WELCOME_ROAST_BANK.map((l) => l.text),
      ...DELTA_WELCOME_LINES.map((l) => l.text),
      ...CLOSING_LINES.map((l) => l.text),
    ];

    for (const text of allTexts) {
      const matches = text.match(/\{([a-zA-Z]+)\}/g);
      if (matches) {
        for (const match of matches) {
          const varName = match.replace(/[{}]/g, "");
          expect(allowedPlaceholders.has(varName), `Forbidden placeholder '{${varName}}' in text: '${text}'`).toBe(true);
        }
      }
    }
  });

  it("ensures every welcome roast line complies with content safety", () => {
    const allTexts = [
      ...WELCOME_ROAST_BANK.map((l) => l.text),
      ...DELTA_WELCOME_LINES.map((l) => l.text),
      ...CLOSING_LINES.map((l) => l.text),
    ];

    for (const text of allTexts) {
      const lower = text.toLowerCase();
      for (const disallowed of DISALLOWED_SAFETY_TERMS) {
        const regex = new RegExp(`\\b${disallowed}\\b`, "i");
        expect(
          regex.test(lower),
          `Welcome line '${text}' contains disallowed safety term '${disallowed}'`
        ).toBe(false);
      }
    }
  });
});

describe("Tier Boundary Mapping", () => {
  it("maps score thresholds accurately to tiers", () => {
    expect(getScoreTier(0)).toBe("critical");
    expect(getScoreTier(24)).toBe("critical");
    expect(getScoreTier(25)).toBe("rough");
    expect(getScoreTier(44)).toBe("rough");
    expect(getScoreTier(45)).toBe("needsWork");
    expect(getScoreTier(59)).toBe("needsWork");
    expect(getScoreTier(60)).toBe("decent");
    expect(getScoreTier(74)).toBe("decent");
    expect(getScoreTier(75)).toBe("strong");
    expect(getScoreTier(89)).toBe("strong");
    expect(getScoreTier(90)).toBe("elite");
    expect(getScoreTier(100)).toBe("elite");
    expect(getScoreTier(50, true)).toBe("insufficientData");
  });
});

describe("Deterministic Welcome Roast Selection Engine", () => {
  const mockResult: AnalysisResult = {
    id: "result-welcome-test-1",
    metadata: {
      username: "testdev",
      roastLevel: "spicy",
      targetRole: "Frontend",
      insufficientData: false,
      generatedAt: "2026-10-08T12:00:00Z",
      snapshotFetchedAt: "2026-10-08T12:00:00Z",
      fromCache: false,
      aiEnhanced: false,
      engineVersion: "1.0.0",
    },
    scores: {
      portfolioReadiness: 46,
      projectQuality: 40,
      documentation: 35,
      activity: 50,
      technicalBreadth: 60,
      profile: 70,
      portfolioCuration: 45,
      projectImpact: 40,
    },
    facts: {
      totalRepositories: 8,
      originalRepositories: 6,
      forkedRepositories: 2,
      forkRatio: 0.25,
      archivedRepositories: 0,
      inactiveRepositories: 3,
      inactiveRatio: 0.375,
      reposWithoutDescription: 1,
      reposWithoutReadme: 1,
      flagshipCount: 5,
      flagshipWeakReadmes: 2,
      flagshipMissingDemo: 1,
      flagshipMissingLicense: 1,
      flagshipMissingTopics: 1,
      flagshipMissingScreenshots: 2,
      languagesUsed: 4,
      topLanguageShare: 0.6,
      totalStars: 12,
      totalForksReceived: 3,
      recentPushCount90d: 4,
      lastPushDaysAgo: 5,
      hasProfileReadme: true,
      hasBio: true,
      hasWebsiteOrLink: true,
      pinnedCount: 3,
      portfolioNoiseRatio: 0.1,
      insufficientData: false,
    },
    roasts: [],
    evidence: [],
    rescue: {
      top: [],
      potentialScore: 74,
      disclaimer: "Internal estimate based on simulated score changes.",
    },
    recruiter: {
      source: "template",
      headline: "Test headline",
      strengths: [],
      concerns: [],
      verdict: "needs-work",
    },
  };

  it("selects welcome roast deterministically for identical result ID", () => {
    const sel1 = selectWelcomeRoast(mockResult);
    const sel2 = selectWelcomeRoast(mockResult);

    expect(sel1.roastLine).toEqual(sel2.roastLine);
    expect(sel1.closingLine).toEqual(sel2.closingLine);
    expect(sel1.tier).toBe("needsWork");
    expect(sel1.roastLine.length).toBeGreaterThan(10);
  });

  it("does not repeat the last shown line when alternative candidates exist", () => {
    const first = selectWelcomeRoast(mockResult);
    saveLastShownLineId("testdev", first.lineId);

    // Call again with a different result id to avoid seed lock
    const secondResult = { ...mockResult, id: "result-welcome-test-2" };
    const second = selectWelcomeRoast(secondResult);

    expect(second.lineId).not.toBe(first.lineId);
  });

  it("selects delta welcome line when previous snapshot scoreDelta is provided", () => {
    const deltaSelection = selectWelcomeRoast(mockResult, { delta: 12, text: "+12 pts" });
    expect(deltaSelection.isDelta).toBe(true);
    expect(deltaSelection.roastLine).toContain("12");
  });
});
