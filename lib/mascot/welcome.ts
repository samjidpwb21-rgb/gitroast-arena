import { ScoreTier } from "@/config/scoring";

export interface WelcomeRoastLine {
  id: string;
  tier: ScoreTier;
  text: string;
  requiredPlaceholders?: Array<"username" | "score" | "repoCount" | "inactiveCount" | "flagshipCount" | "totalStars">;
}

export interface DeltaWelcomeLine {
  id: string;
  type: "improved" | "dropped" | "same";
  text: string;
}

export interface ClosingLine {
  id: string;
  text: string;
}

// ============================================================================
// 1. WELCOME ROAST LINES (At least 14 per scored tier, 6 for insufficientData)
// ============================================================================
export const WELCOME_ROAST_BANK: WelcomeRoastLine[] = [
  // --- CRITICAL (0 - 24) ---
  {
    id: "crit_01",
    tier: "critical",
    text: "Oof, @{username}... a {score}? That is not a portfolio, that is a crime scene, mate.",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "crit_02",
    tier: "critical",
    text: "Yikes, mate. Your GitHub looks like an abandoned digital wasteland.",
  },
  {
    id: "crit_03",
    tier: "critical",
    text: "A score of {score}? Even git reflog cannot save this profile right now, mate.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "crit_04",
    tier: "critical",
    text: "Bruh, {inactiveCount} of your repos have cobwebs growing on them.",
    requiredPlaceholders: ["inactiveCount"],
  },
  {
    id: "crit_05",
    tier: "critical",
    text: "Houston, we have a problem. Your profile readiness is in critical condition.",
  },
  {
    id: "crit_06",
    tier: "critical",
    text: "Ngl @{username}, a {score} is rough. Did you forget your GitHub password?",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "crit_07",
    tier: "critical",
    text: "I ran the math twice hoping for a glitch, but nope, it really is a {score}.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "crit_08",
    tier: "critical",
    text: "Look, mate, on the bright side, there is literally nowhere to go but up.",
  },
  {
    id: "crit_09",
    tier: "critical",
    text: "You have {repoCount} repositories and almost zero vital signs across all of them.",
    requiredPlaceholders: ["repoCount"],
  },
  {
    id: "crit_10",
    tier: "critical",
    text: "Hold onto your seat, mate. This score needs immediate emergency rescue.",
  },
  {
    id: "crit_11",
    tier: "critical",
    text: "Bruh, recruiters are gonna need safety goggles before looking at this.",
  },
  {
    id: "crit_12",
    tier: "critical",
    text: "A {score} out of 100? That is bold, mate. Horrifying, but bold.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "crit_13",
    tier: "critical",
    text: "Did you push code directly from a burning building, @{username}?",
    requiredPlaceholders: ["username"],
  },
  {
    id: "crit_14",
    tier: "critical",
    text: "No cap, this portfolio is currently running on pure hope and zero commits.",
  },

  // --- ROUGH (25 - 44) ---
  {
    id: "rough_01",
    tier: "rough",
    text: "Well, @{username}, you scored a {score}. It has a pulse, but only barely, mate.",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "rough_02",
    tier: "rough",
    text: "Okay, you have {repoCount} repos, but half of them are just digital clutter, mate.",
    requiredPlaceholders: ["repoCount"],
  },
  {
    id: "rough_03",
    tier: "rough",
    text: "A score of {score}. Not the absolute bottom, but you can smell the basement.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "rough_04",
    tier: "rough",
    text: "Bruh, {inactiveCount} inactive repos? Are you hoarding abandonware?",
    requiredPlaceholders: ["inactiveCount"],
  },
  {
    id: "rough_05",
    tier: "rough",
    text: "It is giving tutorial hell energy, mate. We gotta clean this up.",
  },
  {
    id: "rough_06",
    tier: "rough",
    text: "Ngl @{username}, your flagship projects are running on fumes right now.",
    requiredPlaceholders: ["username"],
  },
  {
    id: "rough_07",
    tier: "rough",
    text: "Sitting at a {score}. With a few quick fixes, we might save this yet.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "rough_08",
    tier: "rough",
    text: "You built {flagshipCount} main projects, but forgot to tell the world what they do, mate.",
    requiredPlaceholders: ["flagshipCount"],
  },
  {
    id: "rough_09",
    tier: "rough",
    text: "Yikes. Your GitHub looks like my desktop folder named new-folder-final-2.",
  },
  {
    id: "rough_10",
    tier: "rough",
    text: "A {score} readiness rating. Let us just say recruiters will have questions, mate.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "rough_11",
    tier: "rough",
    text: "Look, @{username}, the potential is there, but right now it is buried under dust.",
    requiredPlaceholders: ["username"],
  },
  {
    id: "rough_12",
    tier: "rough",
    text: "Only {totalStars} community stars so far? We need to get some eyes on your work, mate.",
    requiredPlaceholders: ["totalStars"],
  },
  {
    id: "rough_13",
    tier: "rough",
    text: "Not gonna sugarcoat it, mate, this repo lineup needs a serious makeover.",
  },
  {
    id: "rough_14",
    tier: "rough",
    text: "You scored a {score}. Time to stop starting new repos and finish the old ones, lol.",
    requiredPlaceholders: ["score"],
  },

  // --- NEEDS WORK (45 - 59) ---
  {
    id: "need_01",
    tier: "needsWork",
    text: "A {score}, @{username}! Halfway there, mate, but the other half is on fire.",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "need_02",
    tier: "needsWork",
    text: "Not terrible, mate, but definitely in the danger zone for screening.",
  },
  {
    id: "need_03",
    tier: "needsWork",
    text: "You have got {flagshipCount} solid flagships, but your READMEs are ghost towns.",
    requiredPlaceholders: ["flagshipCount"],
  },
  {
    id: "need_04",
    tier: "needsWork",
    text: "A score of {score}. You are so close to decent, mate, do not stop now.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "need_05",
    tier: "needsWork",
    text: "Bruh, you wrote the code, but you forgot to write the documentation, lol.",
  },
  {
    id: "need_06",
    tier: "needsWork",
    text: "Sitting at a {score}, @{username}. A couple of README polish passes will skyrocket this.",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "need_07",
    tier: "needsWork",
    text: "Look, mate, you are doing honest work, but your repo hygiene needs attention.",
  },
  {
    id: "need_08",
    tier: "needsWork",
    text: "{repoCount} repositories on your profile, but only a few stand out right now.",
    requiredPlaceholders: ["repoCount"],
  },
  {
    id: "need_09",
    tier: "needsWork",
    text: "Ngl, you are one good demo link away from escaping the recruiter filter, mate.",
  },
  {
    id: "need_10",
    tier: "needsWork",
    text: "A {score}? It is like turning in a project with all the code but no title page.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "need_11",
    tier: "needsWork",
    text: "You have got {totalStars} stars, @{username}, but your structure is holding you back.",
    requiredPlaceholders: ["totalStars", "username"],
  },
  {
    id: "need_12",
    tier: "needsWork",
    text: "Okay, not bad, mate, but we need to turn those abandoned projects into polished gems.",
  },
  {
    id: "need_13",
    tier: "needsWork",
    text: "Score is {score}. You are right on the edge of greatness, let us push it over.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "need_14",
    tier: "needsWork",
    text: "Decent effort, @{username}, but you are losing easy points on basic tags and links.",
    requiredPlaceholders: ["username"],
  },

  // --- DECENT (60 - 74) ---
  {
    id: "dec_01",
    tier: "decent",
    text: "Hey, a {score}, @{username}! Pretty respectable, mate, but do not get cocky yet.",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "dec_02",
    tier: "decent",
    text: "Solid ground, mate. Your profile actually looks like a real working developer.",
  },
  {
    id: "dec_03",
    tier: "decent",
    text: "You have got {flagshipCount} solid flagships carrying the squad right now, mate.",
    requiredPlaceholders: ["flagshipCount"],
  },
  {
    id: "dec_04",
    tier: "decent",
    text: "A score of {score}. You would pass first-round screening, but let us aim higher.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "dec_05",
    tier: "decent",
    text: "Not gonna lie, mate, I expected worse. You actually know how to git push.",
  },
  {
    id: "dec_06",
    tier: "decent",
    text: "Score is {score}, @{username}. A quick rescue plan run and you are in the top tier.",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "dec_07",
    tier: "decent",
    text: "{totalStars} stars and counting, mate. Your open source traction is shaping up.",
    requiredPlaceholders: ["totalStars"],
  },
  {
    id: "dec_08",
    tier: "decent",
    text: "Clean work across your {repoCount} repos, mate. Just need some final polish.",
    requiredPlaceholders: ["repoCount"],
  },
  {
    id: "dec_09",
    tier: "decent",
    text: "Respectable score of {score}. You are definitely beating the copy-paste crowd.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "dec_10",
    tier: "decent",
    text: "Look at you, @{username}, writing actual documentation like a professional!",
    requiredPlaceholders: ["username"],
  },
  {
    id: "dec_11",
    tier: "decent",
    text: "Good cadence, solid repos. We just have a few easy points left on the table, mate.",
  },
  {
    id: "dec_12",
    tier: "decent",
    text: "A {score} is nothing to sneeze at, mate. Ready to turn it into an 80+?",
    requiredPlaceholders: ["score"],
  },
  {
    id: "dec_13",
    tier: "decent",
    text: "You are firmly in the safe zone, @{username}. Now let us make it truly shine.",
    requiredPlaceholders: ["username"],
  },
  {
    id: "dec_14",
    tier: "decent",
    text: "No major fires burning, mate. Just good old fashioned engineering hygiene.",
  },

  // --- STRONG (75 - 89) ---
  {
    id: "str_01",
    tier: "strong",
    text: "Okay, show-off, a {score}? @{username} is out here putting in real work, mate!",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "str_02",
    tier: "strong",
    text: "Damn, mate, {totalStars} stars? Your GitHub actually commands respect.",
    requiredPlaceholders: ["totalStars"],
  },
  {
    id: "str_03",
    tier: "strong",
    text: "A {score} readiness rating. Recruiters are probably sliding into your DMs already.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "str_04",
    tier: "strong",
    text: "All {flagshipCount} of your flagship repos look genuinely sharp and ship-ready, mate.",
    requiredPlaceholders: ["flagshipCount"],
  },
  {
    id: "str_05",
    tier: "strong",
    text: "I tried to find something terrible to roast, but you actually know what you are doing.",
  },
  {
    id: "str_06",
    tier: "strong",
    text: "Score is {score}, @{username}. You are in the top tier of developer profiles, mate.",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "str_07",
    tier: "strong",
    text: "Look at Mr. Clean Code over here with {repoCount} well-kept repositories!",
    requiredPlaceholders: ["repoCount"],
  },
  {
    id: "str_08",
    tier: "strong",
    text: "Impressive consistency, mate. You are making the rest of us look bad.",
  },
  {
    id: "str_09",
    tier: "strong",
    text: "A {score}? That is solid, mate. Just a couple of tiny tweaks to hit legendary status.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "str_10",
    tier: "strong",
    text: "Ngl @{username}, this is a genuinely strong engineering portfolio.",
    requiredPlaceholders: ["username"],
  },
  {
    id: "str_11",
    tier: "strong",
    text: "You actually write tests and READMEs? Who taught you such black magic, mate?",
  },
  {
    id: "str_12",
    tier: "strong",
    text: "Standing tall at a {score}. You are definitely getting the interview callback, mate.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "str_13",
    tier: "strong",
    text: "High velocity, great docs, good structure. Hard to find real faults here, mate.",
  },
  {
    id: "str_14",
    tier: "strong",
    text: "Very polished work, @{username}. You are making this roast job genuinely difficult, lol.",
    requiredPlaceholders: ["username"],
  },

  // --- ELITE (90 - 100) ---
  {
    id: "elite_01",
    tier: "elite",
    text: "A {score}?! Alright, calm down Linus Torvalds, you won GitHub today, mate.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "elite_02",
    tier: "elite",
    text: "Holy smokes, @{username}! A score of {score}? This profile is pure gold.",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "elite_03",
    tier: "elite",
    text: "With {totalStars} stars and flawless repos, you should be the one roasting me, mate.",
    requiredPlaceholders: ["totalStars"],
  },
  {
    id: "elite_04",
    tier: "elite",
    text: "Flawless flagship documentation across all {flagshipCount} main projects. Sensational.",
    requiredPlaceholders: ["flagshipCount"],
  },
  {
    id: "elite_05",
    tier: "elite",
    text: "I take my hat off to you, mate. This is textbook portfolio excellence.",
  },
  {
    id: "elite_06",
    tier: "elite",
    text: "A {score}, @{username}? Are you trying to get hired by NASA or what?",
    requiredPlaceholders: ["username", "score"],
  },
  {
    id: "elite_07",
    tier: "elite",
    text: "Masterclass in software engineering presence, mate. Absolutely zero notes.",
  },
  {
    id: "elite_08",
    tier: "elite",
    text: "Every single one of your {repoCount} repos is clean, active, and ship-ready.",
    requiredPlaceholders: ["repoCount"],
  },
  {
    id: "elite_09",
    tier: "elite",
    text: "An elite {score}. You are in the top 1 percent of all analyzed profiles, mate.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "elite_10",
    tier: "elite",
    text: "Okay, @{username}, we get it, you are cracked at coding. Stop flexing, lol.",
    requiredPlaceholders: ["username"],
  },
  {
    id: "elite_11",
    tier: "elite",
    text: "Perfectionist alert! Your git graph looks like an art museum exhibit, mate.",
  },
  {
    id: "elite_12",
    tier: "elite",
    text: "A {score} score. You do not need a rescue plan, you need to write a book, mate.",
    requiredPlaceholders: ["score"],
  },
  {
    id: "elite_13",
    tier: "elite",
    text: "Stellar docs, active commits, great impact. Peak developer aesthetic, mate.",
  },
  {
    id: "elite_14",
    tier: "elite",
    text: "Standing ovation from the mascot, @{username}. You nailed this analysis.",
    requiredPlaceholders: ["username"],
  },

  // --- INSUFFICIENT DATA (Special Tier) ---
  {
    id: "insuf_01",
    tier: "insufficientData",
    text: "Not enough repos to judge you yet, @{username}, mate. Go ship some code!",
    requiredPlaceholders: ["username"],
  },
  {
    id: "insuf_02",
    tier: "insufficientData",
    text: "Your profile is a clean slate, mate. Push a few original repos and come back.",
  },
  {
    id: "insuf_03",
    tier: "insufficientData",
    text: "Only {repoCount} repo found! I need more ammunition before I can roast you properly, mate.",
    requiredPlaceholders: ["repoCount"],
  },
  {
    id: "insuf_04",
    tier: "insufficientData",
    text: "Ghost town alert, @{username}! Build something cool and let us test it then.",
    requiredPlaceholders: ["username"],
  },
  {
    id: "insuf_05",
    tier: "insufficientData",
    text: "Not enough public activity to calculate fair math, mate. Go create some magic!",
  },
  {
    id: "insuf_06",
    tier: "insufficientData",
    text: "You have barely started, mate. Fill up that git graph and let us run it again soon.",
  },
];

// ============================================================================
// 2. DELTA WELCOME LINES (When a previous snapshot exists)
// ============================================================================
export const DELTA_WELCOME_LINES: DeltaWelcomeLine[] = [
  // Improved (Score went up)
  {
    id: "delta_up_01",
    type: "improved",
    text: "Look who leveled up! You gained plus {delta} points since your last scan, mate.",
  },
  {
    id: "delta_up_02",
    type: "improved",
    text: "Progress detected! Up by {delta} points to a {score}. The rescue plan is working, mate!",
  },
  {
    id: "delta_up_03",
    type: "improved",
    text: "Nice work, @{username}! That is a plus {delta} boost. Keep shipping code!",
  },

  // Dropped (Score went down)
  {
    id: "delta_down_01",
    type: "dropped",
    text: "Uh oh, mate... you slipped down {delta} points since last time. Time to clean house!",
  },
  {
    id: "delta_down_02",
    type: "dropped",
    text: "Score dropped by {delta} points, @{username}. Did you abandon a few flagships, mate?",
  },
  {
    id: "delta_down_03",
    type: "dropped",
    text: "Yikes, down {delta} points. Let us check the scoreboard and see what broke, mate.",
  },

  // Same (Score unchanged)
  {
    id: "delta_same_01",
    type: "same",
    text: "Still sitting at a {score}, @{username}. No changes yet, mate, let us start shipping!",
  },
  {
    id: "delta_same_02",
    type: "same",
    text: "Identical score of {score}. Consistent, but the scoreboard is waiting for an upgrade, mate.",
  },
];

// ============================================================================
// 3. CLOSING LINES (Second beat pointing toward the scoreboard, >= 15 variants)
// ============================================================================
export const CLOSING_LINES: ClosingLine[] = [
  { id: "close_01", text: "Scoreboard is right below, go have a look, mate." },
  { id: "close_02", text: "Scroll down and face the numbers, mate." },
  { id: "close_03", text: "Check out your 7 vector sub-scores down below, mate." },
  { id: "close_04", text: "Below is your overall scoreboard, go and inspect it, mate." },
  { id: "close_05", text: "Take a look at your breakdown right beneath us, mate." },
  { id: "close_06", text: "Your complete readiness scorecard is waiting just below, mate." },
  { id: "close_07", text: "Head downstairs to see the exact mathematical math, mate." },
  { id: "close_08", text: "Peep your sub-score breakdown on the board down below, mate." },
  { id: "close_09", text: "Check out where you scored high and low right below, mate." },
  { id: "close_10", text: "The full scoreboard is directly below, go check the stats, mate." },
  { id: "close_11", text: "Scroll down to see how each portfolio dimension performed, mate." },
  { id: "close_12", text: "Dive into the numbers below to see what recruiter screening caught, mate." },
  { id: "close_13", text: "Everything is tallied on the board below, go check it out, mate." },
  { id: "close_14", text: "Take a scroll down and see your readiness radar, mate." },
  { id: "close_15", text: "Your 7 portfolio vectors are mapped out right below, mate." },
  { id: "close_16", text: "Look right below to see your full score overview, mate." },
];
