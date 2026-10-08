import { Severity, RoastCard } from "@/types";
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

export function getSpokenDelivery(card: RoastCard): string {
  const seed = hashString(card.id);
  const rng = new SeededRNG(seed);

  const mildIntros = ["Heh.", "Okay, check this out:", "So look at this:"];
  const mildOutros = ["Classic dev move.", "Not terrible, but yeah.", "Gotta love the optimism."];

  const mediumIntros = ["Oh boy.", "Alright, listen to this:", "Wait for it..."];
  const mediumOutros = ["I mean, seriously?", "Gotta love the confidence.", "Legendary."];

  const sharpIntros = ["Bruh...", "Look at this disaster:", "Hold onto your seat:"];
  const sharpOutros = ["Now that's painful.", "Ouch, that stings.", "Unreal."];

  const savageIntros = ["Oof! Call an ambulance!", "Absolute crime scene right here:", "Holy smoke:"];
  const savageOutros = ["Somebody get this repo a medic!", "Total violation!", "Rest in peace."];

  switch (card.severity) {
    case "mild":
      return `${rng.pick(mildIntros)} ... ${card.text} ... ${rng.pick(mildOutros)}`;
    case "medium":
      return `${rng.pick(mediumIntros)} ... ${card.text} ... ${rng.pick(mediumOutros)}`;
    case "sharp":
      return `${rng.pick(sharpIntros)} ... ${card.text} ... ${rng.pick(sharpOutros)}`;
    case "savage":
      return `${rng.pick(savageIntros)} ... ${card.text} ... ${rng.pick(savageOutros)}`;
  }
}
