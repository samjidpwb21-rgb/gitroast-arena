import { hashString, SeededRNG } from "@/lib/roast/rng";

export type DialogueTrigger =
  | "idle"
  | "idleLong"
  | "focusUsername"
  | "typing"
  | "usernameLooksValid"
  | "usernameInvalid"
  | "focusRole"
  | "roleFilled"
  | "pickEasy"
  | "pickSpicy"
  | "pickSavage"
  | "pickBrutal"
  | "hoverEnter"
  | "submit"
  | "returningUser"
  | "errorUserNotFound"
  | "errorRateLimited"
  | "errorTimeout"
  | "errorUnsupportedAccount";

export const DIALOGUE_BANK: Record<DialogueTrigger, readonly string[]> = {
  idle: [
    "Drop a handle. Let's see what you're hiding.",
    "Ready to inspect your commit history? 🍿",
    "Type a username if you dare to know.",
    "I smell unpushed branches and messy diffs.",
    "Show me your flagship repositories!",
    "Looking for clean code... or chaos? 🔥",
    "Don't be shy, enter your GitHub handle.",
    "I won't judge... okay, maybe a little.",
  ],
  idleLong: [
    "Still thinking? Your repo won't fix itself.",
    "Did your terminal freeze or are you nervous?",
    "I can wait all day. The compiler cannot.",
    "Checking your git log while you hesitate...",
    "Take your time. Bugs love patience.",
    "Afraid of what the math engine will find?",
    "Zero commits while staring at the screen?",
    "Need me to type a username for you?",
  ],
  focusUsername: [
    "Alright, who are we putting on the spot?",
    "Type carefully. Syntax errors haunt forever.",
    "Let's see whose GitHub portfolio this is.",
    "Entering the danger zone... type away!",
    "Target acquired. Spell the handle right.",
    "Who is brave enough for this code review?",
    "Time to audit those repository claims.",
    "Let's see if the code matches the bio.",
  ],
  typing: [
    "Ooh, letters! Looking promising...",
    "Typing fast! Hope the code is as swift.",
    "Keep going, I'm analyzing keystrokes...",
    "Let's see where this handle leads!",
    "Almost there... finish the username.",
    "Searching the global namespace...",
    "Building anticipation for the audit...",
    "Typing with confidence! I like that.",
  ],
  usernameLooksValid: [
    "Clean handle! Let's pull the commit tree.",
    "Looks like a real dev. Ready to roast?",
    "Handle verified. Let's inspect the repos.",
    "Valid syntax! Now let's test repo hygiene.",
    "Good handle. Hope the READMEs exist.",
    "Found the target. Choose your heat level!",
    "Target locked! Prepare for calculations.",
    "Format approved. Ready when you are.",
  ],
  usernameInvalid: [
    "That handle looks broken. Try standard format.",
    "GitHub usernames don't look like that!",
    "Syntax error in handle! Check hyphens.",
    "Invalid characters detected. Fix it up.",
    "That username won't resolve on GitHub.",
    "Check your spelling, that's not valid.",
    "No spaces or illegal symbols in handles!",
    "Try a standard GitHub username format.",
  ],
  focusRole: [
    "Aiming for a title? Let's check alignment.",
    "Targeting Senior? The bar just went up.",
    "Role context helps calibrate the score.",
    "Tell me the job you're pitching for.",
    "Frontend, backend, or fullstack wizard?",
    "Let's see if the portfolio matches the role.",
    "Setting expectations high with this role!",
    "Target role logged. Calibrating review.",
  ],
  roleFilled: [
    "Role noted. We will judge readiness accordingly.",
    "Ambitious target! Let's check the evidence.",
    "Calibrated for that role. High standards ahead.",
    "We'll benchmark your repos against this role.",
    "Target set! Let's see if your code qualifies.",
    "Role locked. The recruiter engine is ready.",
    "Expectations set for this specific stack.",
    "Got it. Let's see how close you are to hired.",
  ],
  pickEasy: [
    "Playing it safe? Gentle constructive vibes.",
    "Easy mode: kid gloves and soft feedback.",
    "Mild heat. No bruised egos today.",
    "Keeping it friendly and encouraging.",
    "Gentle review selected. Soft landing ahead.",
    "Easy heat: pure tips, zero burn.",
    "Safe choice. Warm tea instead of fire.",
    "Soft roast mode engaged. Peace of mind.",
  ],
  pickSpicy: [
    "Spicy! Sharp wit with factual punch.",
    "Balanced burn: witty truth with evidence.",
    "The standard heat: honest and biting.",
    "Good choice. A solid reality check.",
    "Sharp feedback incoming. Prepare yourself.",
    "Spicy level: truthful and entertaining.",
    "Just enough sting to motivate improvement.",
    "Spicy it is! Truth hurts, but fixes code.",
  ],
  pickSavage: [
    "Savage mode! No filter on repository flaws.",
    "Unfiltered roast selected. Brace for impact.",
    "Direct hits only. Evidence in full display.",
    "High heat! No excuses for empty READMEs.",
    "Savage burns ahead. Thick skin required.",
    "Calling out every abandoned repo directly.",
    "Full throttle roast! Get ready for laughs.",
    "Savage selected! The truth will be told.",
  ],
  pickBrutal: [
    "BRUTAL! Maximum roast destruction mode! 🔥",
    "Total annihilation requested. Zero mercy.",
    "Nuclear option engaged. Every flaw roasted!",
    "Maximum burn! Even your git config isn't safe.",
    "Brutal heat: scorched earth code review!",
    "No prisoners taken in brutal roast mode.",
    "Extreme roast active. You asked for this!",
    "Brutal mode! Turning up the flame to max!",
  ],
  hoverEnter: [
    "Ready to step into the roast arena? ⚔️",
    "One click away from your calculated score.",
    "Hit enter and let the math engine cook.",
    "Ready to face the evidence? Click now!",
    "The arena awaits. Step inside!",
    "Let's pull the repos and run the numbers.",
    "Click to unleash the portfolio breakdown.",
    "Final check: are you ready for the verdict?",
  ],
  submit: [
    "Fetching GraphQL data from GitHub API...",
    "Diving into your repositories right now!",
    "Scanning commits and calculating readiness...",
    "Hold tight! Analyzing flagship branches...",
    "Running 7 scoring engines across the repos...",
    "Inspecting pull requests and release tags...",
    "Crunching numbers... roast incoming!",
    "Connecting to the arena... compiling report!",
  ],
  returningUser: [
    "Welcome back! Ready to beat your last score?",
    "Back for another round? Did you fix those repos?",
    "Return of the dev! Let's see the score delta.",
    "Checking if your commits improved since last time.",
    "Back in the arena! Let's measure your progress.",
    "Let's see if that rescue plan paid off!",
    "Welcome back! Time for a fresh audit.",
    "Another inspection? Let's check for upgrades.",
  ],
  errorUserNotFound: [
    "404: User not found! Check the spelling.",
    "That handle doesn't exist on GitHub.",
    "Ghost user! Try an active GitHub account.",
    "GitHub returned 404 for this username.",
    "Nobody home at that URL. Double check handle.",
    "Could not find this profile on GitHub.",
    "Are you sure that username is registered?",
    "User not found. Try searching your exact handle.",
  ],
  errorRateLimited: [
    "GitHub rate limit hit! Cooling down engines...",
    "API traffic high. Giving GitHub a breather...",
    "Rate limited! Try again in a couple minutes.",
    "GitHub asked us to pause. Back shortly!",
    "Too many requests to GitHub. Hold on a sec.",
    "Rate limit active. Please wait a moment.",
    "GitHub API is resting. Retry in a minute.",
    "Traffic spike! Let the rate limit reset.",
  ],
  errorTimeout: [
    "Network timeout! GitHub took too long to answer.",
    "Request timed out. Check your connection.",
    "GitHub query timed out. Let's try again.",
    "Network lag detected. Retry the analysis.",
    "The connection stalled. Give it another shot.",
    "Timeout reached while fetching repositories.",
    "GitHub API took too long. Hit retry!",
    "Network hiccup. Please retry the request.",
  ],
  errorUnsupportedAccount: [
    "Account type unsupported or has zero public data.",
    "Need an active public developer profile to score.",
    "No public repositories found to analyze.",
    "Profile is private or empty. Need public repos!",
    "This account lacks public code activity.",
    "Zero public repos found. Add code first!",
    "Need at least one public repository to score.",
    "Cannot score empty or organization-only hubs.",
  ],
} as const;

export function getDialogueLine(
  trigger: DialogueTrigger,
  sessionCounter: number,
  previousLine?: string
): string {
  const lines = DIALOGUE_BANK[trigger] || DIALOGUE_BANK.idle;
  const seed = hashString(`${trigger}:${sessionCounter}`);
  const rng = new SeededRNG(seed);

  let chosen = rng.pick(lines);
  if (chosen === previousLine && lines.length > 1) {
    const remaining = lines.filter((l) => l !== previousLine);
    chosen = rng.pick(remaining);
  }

  return chosen;
}
