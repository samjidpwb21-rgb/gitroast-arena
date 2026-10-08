import { Severity } from "@/types";
import { hashString, SeededRNG } from "@/lib/roast/rng";
import { ReactionConfig, SFXName } from "./types";

const ONOMATOPOEIA_BURSTS = ["BURN!", "OOF!", "HA!", "OUCH!", "SNAP!", "SIZZLE!"] as const;

export function getReactionForRoast(roastId: string, severity: Severity): ReactionConfig {
  const seed = hashString(roastId);
  const rng = new SeededRNG(seed);

  switch (severity) {
    case "mild": {
      return {
        mascotPose: "SMIRK",
        sfx: "smirk" as SFXName,
        screenShake: false,
      };
    }

    case "medium": {
      return {
        mascotPose: "SMIRK",
        sfx: "rimshot" as SFXName,
        screenShake: false,
      };
    }

    case "sharp": {
      const burst = rng.pick(ONOMATOPOEIA_BURSTS);
      const sfx: SFXName = rng.next() > 0.5 ? "sizzle" : "laugh_sarcastic";
      return {
        mascotPose: "LAUGH_SARCASTIC",
        sfx,
        onomatopoeia: burst,
        screenShake: false,
      };
    }

    case "savage": {
      const burst = rng.pick(["BURN!", "OOF!", "SIZZLE!"] as const);
      const sfx: SFXName = rng.next() > 0.5 ? "laugh_hard" : "sizzle";
      return {
        mascotPose: "LAUGH_HARD",
        sfx,
        onomatopoeia: burst,
        screenShake: true,
      };
    }
  }
}
