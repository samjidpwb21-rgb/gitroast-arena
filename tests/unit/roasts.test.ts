import { describe, it, expect } from "vitest";
import { ROAST_TEMPLATE_BANK } from "@/lib/roast/templates";
import { DISALLOWED_SAFETY_TERMS } from "@/config/roasts";
import { selectRoastCards } from "@/lib/roast/select";
import { normalizeGitHubResponse, type RawGraphQLResponse } from "@/lib/github/normalize";
import { extractCalculatedFacts } from "@/lib/analysis/facts";
import { generateEvidence } from "@/lib/analysis/evidence";
import { RoastCardSchema, type RoastLevel } from "@/types";

import averageFixture from "../fixtures/fixture-average.json";
import perfectFixture from "../fixtures/fixture-perfect.json";

describe("Content Safety Lint Test (Strict Zero Personal Attacks)", () => {
  it("verifies every template in ROAST_TEMPLATE_BANK complies with content safety", () => {
    const allTemplates: string[] = [];

    for (const [category, levels] of Object.entries(ROAST_TEMPLATE_BANK)) {
      for (const [level, variants] of Object.entries(levels)) {
        for (const variant of variants) {
          allTemplates.push(`${category}:${level} - ${variant.title} - ${variant.template}`);

          // Check against disallowed terms
          const lowerText = `${variant.title} ${variant.template}`.toLowerCase();
          for (const disallowed of DISALLOWED_SAFETY_TERMS) {
            const regex = new RegExp(`\\b${disallowed}\\b`, "i");
            expect(
              regex.test(lowerText),
              `Template in ${category}:${level} contains disallowed term: '${disallowed}'`
            ).toBe(false);
          }
        }
      }
    }

    // Ensure we have a substantial bank of templates (> 100 variants)
    expect(allTemplates.length).toBeGreaterThanOrEqual(100);
  });
});

describe("Roast Selection Engine", () => {
  const clock = new Date("2026-10-08T12:00:00Z");
  const snapshot = normalizeGitHubResponse(averageFixture as unknown as RawGraphQLResponse, clock);
  const facts = extractCalculatedFacts(snapshot, clock);
  const evidence = generateEvidence(facts, snapshot);

  const levels: RoastLevel[] = ["easy", "spicy", "savage", "brutal"];

  for (const level of levels) {
    it(`generates valid roast cards for roastLevel: ${level}`, () => {
      const cards = selectRoastCards({
        facts,
        snapshot,
        evidence,
        roastLevel: level,
      });

      expect(cards.length).toBeGreaterThanOrEqual(1);
      expect(cards.length).toBeLessThanOrEqual(6);

      const categorySet = new Set<string>();
      for (const card of cards) {
        expect(() => RoastCardSchema.parse(card)).not.toThrow();
        expect(card.evidenceIds.length).toBeGreaterThan(0);
        expect(card.text).not.toContain("{"); // All placeholders injected
        expect(card.text).not.toContain("}");

        // No duplicate categories
        expect(categorySet.has(card.category)).toBe(false);
        categorySet.add(card.category);
      }
    });
  }

  it("includes a positive card when positive evidence exists", () => {
    const perfectSnap = normalizeGitHubResponse(perfectFixture as unknown as RawGraphQLResponse, clock);
    const perfectFacts = extractCalculatedFacts(perfectSnap, clock);
    const perfectEvidence = generateEvidence(perfectFacts, perfectSnap);

    const cards = selectRoastCards({
      facts: perfectFacts,
      snapshot: perfectSnap,
      evidence: perfectEvidence,
      roastLevel: "spicy",
    });

    const hasPositive = cards.some(
      (c) => c.category === "strongActivity" || c.category === "solidDocumentation"
    );
    expect(hasPositive).toBe(true);
  });

  it("produces deterministic cards across repeated runs", () => {
    const cards1 = selectRoastCards({ facts, snapshot, evidence, roastLevel: "savage" });
    const cards2 = selectRoastCards({ facts, snapshot, evidence, roastLevel: "savage" });

    expect(cards1).toEqual(cards2);
  });
});
