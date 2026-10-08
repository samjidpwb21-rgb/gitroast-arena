import { describe, it, expect } from "vitest";
import { DIALOGUE_BANK, DialogueTrigger, getDialogueLine } from "@/lib/mascot/dialogue";
import { DISALLOWED_SAFETY_TERMS } from "@/config/roasts";

describe("Mascot Dialogue System", () => {
  const triggers = Object.keys(DIALOGUE_BANK) as DialogueTrigger[];

  it("ensures every trigger has at least 8 variants", () => {
    expect(triggers.length).toBeGreaterThanOrEqual(18);

    for (const trigger of triggers) {
      const variants = DIALOGUE_BANK[trigger];
      expect(
        variants.length,
        `Trigger '${trigger}' has fewer than 8 variants (${variants.length})`
      ).toBeGreaterThanOrEqual(8);
    }
  });

  it("ensures every dialogue line is under 60 characters", () => {
    for (const trigger of triggers) {
      const variants = DIALOGUE_BANK[trigger];
      for (const line of variants) {
        expect(
          line.length,
          `Line in '${trigger}' exceeds 60 chars (${line.length}): "${line}"`
        ).toBeLessThanOrEqual(60);
      }
    }
  });

  it("ensures all dialogue lines pass strict content safety (zero personal attacks)", () => {
    for (const trigger of triggers) {
      const variants = DIALOGUE_BANK[trigger];
      for (const line of variants) {
        const lower = line.toLowerCase();
        for (const disallowed of DISALLOWED_SAFETY_TERMS) {
          const regex = new RegExp(`\\b${disallowed}\\b`, "i");
          expect(
            regex.test(lower),
            `Dialogue in '${trigger}' contains disallowed term '${disallowed}': "${line}"`
          ).toBe(false);
        }
      }
    }
  });

  it("produces deterministic dialogue selection for a given trigger and counter", () => {
    const line1 = getDialogueLine("idle", 42);
    const line2 = getDialogueLine("idle", 42);
    expect(line1).toBe(line2);
  });

  it("never repeats the same line twice in a row when previousLine is provided", () => {
    for (const trigger of triggers) {
      const first = getDialogueLine(trigger, 1);
      const second = getDialogueLine(trigger, 1, first);

      expect(second).not.toBe(first);
    }
  });
});
