import { describe, it, expect } from "vitest";
import { VoiceSettingsSchema, DEFAULT_VOICE_SETTINGS } from "@/lib/audio/types";
import { getReactionForRoast } from "@/lib/audio/reactions";
import { DISALLOWED_SAFETY_TERMS } from "@/config/roasts";

describe("Voice Settings Schema Validation", () => {
  it("validates default voice settings successfully", () => {
    const parsed = VoiceSettingsSchema.safeParse(DEFAULT_VOICE_SETTINGS);
    expect(parsed.success).toBe(true);
  });

  it("validates speed within allowable bounds (0.8x - 1.3x)", () => {
    expect(VoiceSettingsSchema.safeParse({ ...DEFAULT_VOICE_SETTINGS, rate: 0.8 }).success).toBe(true);
    expect(VoiceSettingsSchema.safeParse({ ...DEFAULT_VOICE_SETTINGS, rate: 1.3 }).success).toBe(true);
    expect(VoiceSettingsSchema.safeParse({ ...DEFAULT_VOICE_SETTINGS, rate: 0.5 }).success).toBe(false);
    expect(VoiceSettingsSchema.safeParse({ ...DEFAULT_VOICE_SETTINGS, rate: 2.0 }).success).toBe(false);
  });

  it("rejects unknown extra properties (strict)", () => {
    const invalid = { ...DEFAULT_VOICE_SETTINGS, hack: "malicious" };
    expect(VoiceSettingsSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("Deterministic Reaction Mapping", () => {
  const roastId = "roast-test-vector-12345";

  it("produces deterministic mascot pose and SFX for mild severity", () => {
    const r1 = getReactionForRoast(roastId, "mild");
    const r2 = getReactionForRoast(roastId, "mild");

    expect(r1.mascotPose).toBe("SMIRK");
    expect(r1.sfx).toBe("smirk");
    expect(r1.screenShake).toBe(false);
    expect(r1).toEqual(r2);
  });

  it("produces deterministic mascot pose and SFX for medium severity", () => {
    const r1 = getReactionForRoast(roastId, "medium");
    const r2 = getReactionForRoast(roastId, "medium");

    expect(r1.mascotPose).toBe("SMIRK");
    expect(r1.sfx).toBe("rimshot");
    expect(r1.screenShake).toBe(false);
    expect(r1).toEqual(r2);
  });

  it("produces deterministic onomatopoeia and pose for sharp severity", () => {
    const r1 = getReactionForRoast(roastId, "sharp");
    const r2 = getReactionForRoast(roastId, "sharp");

    expect(r1.mascotPose).toBe("LAUGH_SARCASTIC");
    expect(r1.onomatopoeia).toBeDefined();
    expect(r1).toEqual(r2);
  });

  it("produces deterministic onomatopoeia, pose, and screenShake for savage severity", () => {
    const r1 = getReactionForRoast(roastId, "savage");
    const r2 = getReactionForRoast(roastId, "savage");

    expect(r1.mascotPose).toBe("LAUGH_HARD");
    expect(r1.screenShake).toBe(true);
    expect(r1.onomatopoeia).toBeDefined();
    expect(r1).toEqual(r2);
  });
});

describe("Content Safety for Comic Show Visual Text", () => {
  const comicWords = [
    "BURN!",
    "OOF!",
    "HA!",
    "OUCH!",
    "SNAP!",
    "SIZZLE!",
    "Play Roast Show",
    "Comic Roast Show",
    "Why am I roasted?",
    "Why am I roasted? View verifiable evidence",
  ];

  it("ensures all onomatopoeia bursts and UI button text pass strict content safety", () => {
    for (const word of comicWords) {
      const lower = word.toLowerCase();
      for (const disallowed of DISALLOWED_SAFETY_TERMS) {
        const regex = new RegExp(`\\b${disallowed}\\b`, "i");
        expect(
          regex.test(lower),
          `Word '${word}' violates content safety by containing '${disallowed}'`
        ).toBe(false);
      }
    }
  });
});
