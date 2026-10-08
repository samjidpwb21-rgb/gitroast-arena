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

// Standup Comedian Mannerisms & Phrase Banks
const MILD_INTROS = [
  "Heh, let's take a peek at this one:",
  "Okay, check this out:",
  "So look at this little gem:",
  "Wait for it...",
  "Let's see what we've got here:",
  "I'll start off gentle, but look:",
  "Heh, get a load of this:",
  "Here's an interesting life choice:",
  "Not gonna lie, look at this:",
  "A quick observation right here:",
] as const;

const MILD_OUTROS = [
  "Classic developer move.",
  "Not terrible, but yeah.",
  "Gotta love the optimism.",
  "We've all been there, honestly.",
  "Clean it up and you're golden.",
  "At least you pushed code.",
  "Hey, it works on your machine right?",
  "Solid attempt, points for participation.",
] as const;

const MEDIUM_INTROS = [
  "Oh boy, here we go...",
  "Alright, listen to this one:",
  "Wait for it... wait for it...",
  "Hold onto your seats for this:",
  "You're not gonna believe this one:",
  "Let's talk about this masterpiece:",
  "Now this is where it gets spicy:",
  "Look, I didn't want to bring this up, but:",
  "Heh heh, take a look at this:",
  "Behold, the commit history of legends:",
] as const;

const MEDIUM_OUTROS = [
  "I mean, seriously?",
  "Gotta love the confidence!",
  "Legendary architectural decision right there.",
  "Even Stack Overflow can't rescue that.",
  "My terminal is crying right now.",
  "That's definitely going on the resume, huh?",
  "Ship it to production on a Friday!",
  "No notes. Just pure chaos.",
  "Truly a work of art.",
] as const;

const SHARP_INTROS = [
  "Bruh... hold onto your keyboard:",
  "Look at this absolute disaster:",
  "Brace yourselves, folks:",
  "I have no words, but I have a roast:",
  "Check your git log, because yikes:",
  "Wait for it... boom:",
  "Someone call the senior engineer right now:",
  "You thought nobody would notice this, huh?",
  "Alert the security team, we found it:",
  "Take a deep breath before hearing this:",
] as const;

const SHARP_OUTROS = [
  "Now that is painful.",
  "Ouch, that's gonna leave a permanent mark.",
  "Unreal. Simply unreal.",
  "Delete the repo and start a farm.",
  "That violated three Geneva Conventions of coding.",
  "My CPU just threw a thermal throttle error from that.",
  "Even git reflog can't save you from this.",
  "That's going straight into the engineering Hall of Shame.",
] as const;

const SAVAGE_INTROS = [
  "Oof! Call an ambulance immediately!",
  "Absolute crime scene right here:",
  "Holy smoke, avert your eyes if you're faint of heart:",
  "Hold onto your soul, this is brutal:",
  "Ladies and gentlemen, the smoking gun:",
  "I hope you have backup copies of your dignity for this:",
  "Nuclear meltdown detected in the repository:",
  "Prepare for maximum emotional damage:",
] as const;

const SAVAGE_OUTROS = [
  "Somebody get this entire repo a medic!",
  "Total violation! Absolutely scorched earth!",
  "Rest in peace to this entire commit history.",
  "I am speechless. The compiler is speechless.",
  "You just got roasted into the next release cycle.",
  "This needs to be sealed in concrete for 10,000 years.",
  "Clean up the ashes and try again in your next lifetime.",
  "Game over. Press F to pay respects.",
] as const;

export function getSpokenDelivery(card: RoastCard): string {
  const seed = hashString(card.id);
  const rng = new SeededRNG(seed);

  switch (card.severity) {
    case "mild":
      return `${rng.pick(MILD_INTROS)} ... ${card.text} ... ${rng.pick(MILD_OUTROS)}`;
    case "medium":
      return `${rng.pick(MEDIUM_INTROS)} ... ${card.text} ... ${rng.pick(MEDIUM_OUTROS)}`;
    case "sharp":
      return `${rng.pick(SHARP_INTROS)} ... ${card.text} ... ${rng.pick(SHARP_OUTROS)}`;
    case "savage":
      return `${rng.pick(SAVAGE_INTROS)} ... ${card.text} ... ${rng.pick(SAVAGE_OUTROS)}`;
  }
}

export function getSupportiveGuidance(
  action: { title: string; why: string; impact: number; simulatedScore: number },
  stepIndex: number,
  totalSteps: number
): string {
  const seed = hashString(`mentor-${action.title}-${stepIndex}`);
  const rng = new SeededRNG(seed);

  const mentorOpeners = [
    `Step ${stepIndex + 1} of ${totalSteps}: Let's work on ${action.title}.`,
    `Here is our next high-leverage fix: ${action.title}.`,
    `For action item number ${stepIndex + 1}, we're focusing on ${action.title}.`,
  ];

  const mentorClosers = [
    `Completing this will boost your score by plus ${action.impact} points, raising your score to ${action.simulatedScore}! Let's check off these action items together.`,
    `This simple adjustment gives an immediate plus ${action.impact} points impact. You've got this!`,
    `By following the checklist below, we will secure plus ${action.impact} points towards your target. Steady progress wins the race!`,
  ];

  return `${rng.pick(mentorOpeners)} ... ${action.why} ... ${rng.pick(mentorClosers)}`;
}
