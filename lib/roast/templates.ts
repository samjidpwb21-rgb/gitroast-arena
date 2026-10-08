import type { RoastLevel, Severity } from "@/types";

export interface TemplateVariant {
  title: string;
  template: string;
  severity: Severity;
}

export type CategoryTemplates = Record<RoastLevel, TemplateVariant[]>;

/**
 * THE LOCAL TEMPLATE BANK
 * 15 categories x 4 roast levels x >=3 variants per tier.
 * Placeholders are injected from CalculatedFacts and Evidence at runtime.
 */
export const ROAST_TEMPLATE_BANK: Record<string, CategoryTemplates> = {
  // 1. Inactive Repositories
  inactiveRepositories: {
    easy: [
      {
        title: "Digital Dust Bunnies",
        template: "You have {inactiveCount} repositories collecting digital dust without a single commit in over a year.",
        severity: "mild",
      },
      {
        title: "Time Capsule Repos",
        template: "{inactiveCount} of your {origCount} original repos are acting as peaceful historical archives from {daysAgo} days ago.",
        severity: "mild",
      },
      {
        title: "Hibernating Code",
        template: "Looks like {inactiveCount} projects went to sleep during previous seasons and never woke back up.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "The Abandoned Ward",
        template: "{inactiveCount} out of {origCount} repos have been completely abandoned for over a year. Even Wikipedia updates more frequently.",
        severity: "medium",
      },
      {
        title: "Archaeological Dig",
        template: "Reviewing your GitHub feels like carbon-dating ancient software—{inactiveCount} repos haven't seen a push in {daysAgo} days.",
        severity: "medium",
      },
      {
        title: "Code Retirement Village",
        template: "More than {inactivePercent}% of your original projects are currently retired with full pensions.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "Ghost Town Architect",
        template: "{inactiveCount} repos left to rot in production limbo while your profile pretends they are active portfolio flagships.",
        severity: "sharp",
      },
      {
        title: "Digital Graveyard Keeper",
        template: "You don't have a developer portfolio; you manage a cemetery for {inactiveCount} deceased side projects.",
        severity: "sharp",
      },
      {
        title: "Forgotten Promises",
        template: "{inactiveCount} repos untouched since before the last framework cycle. Either maintain them or hit the archive button.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "Monument to Unfinished Ambition",
        template: "{inactiveCount} fossilized repositories where good intentions went to die of neglect.",
        severity: "savage",
      },
      {
        title: "Codebase Necromancy",
        template: "Attempting to build {sampleRepo} today would require an archaeologist and three deprecated package managers.",
        severity: "savage",
      },
      {
        title: "The Great Repository Wasteland",
        template: "{inactiveCount} abandoned repos taking up namespace real estate without delivering a single running byte of value.",
        severity: "savage",
      },
    ],
  },

  // 2. Weak Flagship Documentation
  weakDocumentation: {
    easy: [
      {
        title: "Shy Readmes",
        template: "{weakDocCount} of your flagship repositories are quite modest with their documentation.",
        severity: "mild",
      },
      {
        title: "Minimalist Readme Style",
        template: "Your flagship projects leave a lot to the imagination with under 80 words in their READMEs.",
        severity: "mild",
      },
      {
        title: "Cryptic Setup",
        template: "Visitors might need a decoder ring to figure out how to install {sampleRepo}.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "Telepathic Documentation",
        template: "You're expecting recruiters to read your mind because {weakDocCount} flagship READMEs don't explain how to run the code.",
        severity: "medium",
      },
      {
        title: "One-Line Wonder",
        template: "A title and an install command is not a README—{sampleRepo} deserves actual architecture notes.",
        severity: "medium",
      },
      {
        title: "Secret Society Code",
        template: "{weakDocCount} flagship projects guarded by READMEs so sparse they qualify as classified material.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Documentation Void",
        template: "Writing {weakDocCount} flagship projects without explaining installation or usage is how you guarantee nobody ever tests your work.",
        severity: "sharp",
      },
      {
        title: "README Desert",
        template: "Your flagship repository {sampleRepo} has fewer words than an average coffee shop receipt.",
        severity: "sharp",
      },
      {
        title: "Recruiter Repellent",
        template: "No setup instructions, no usage guide, no architecture diagram. Reviewers will close the tab in under 4 seconds.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "Schrödinger's Project",
        template: "Because {sampleRepo} lacks a real README, nobody can prove whether it actually runs or is just a folder of hope.",
        severity: "savage",
      },
      {
        title: "Total Documentation Bankruptcy",
        template: "{weakDocCount} flagship repos where the README is essentially 'Trust me bro, it works locally'.",
        severity: "savage",
      },
      {
        title: "The Zero-Context Void",
        template: "If software isn't documented, it doesn't exist. Your flagship code is currently invisible to human evaluation.",
        severity: "savage",
      },
    ],
  },

  // 3. Missing Live Previews / Demos
  missingDemos: {
    easy: [
      {
        title: "Hidden Behind Localhost",
        template: "{missingDemoCount} of your flagship projects are shy and staying locked on localhost.",
        severity: "mild",
      },
      {
        title: "Missing Demo Link",
        template: "Adding a live Vercel or cloud preview would make {sampleRepo} much easier to explore.",
        severity: "mild",
      },
      {
        title: "Localhost Explorer",
        template: "Your web apps work great on 127.0.0.1, but visitors can't click to see them in action.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "Stealth Mode Deployment",
        template: "{missingDemoCount} flagship web apps with zero deployed previews. Nobody is going to git clone just to see your UI.",
        severity: "medium",
      },
      {
        title: "Proof of Life Missing",
        template: "You claim {sampleRepo} is a full-stack platform, yet there isn't a single working URL to prove it.",
        severity: "medium",
      },
      {
        title: "The Vercel-Phobia",
        template: "Free cloud deployment exists everywhere, yet {missingDemoCount} of your flagship repos remain unhosted.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Localhost Prison",
        template: "Trapping your best work on port 3000 ensures that exactly zero hiring managers will ever see what you built.",
        severity: "sharp",
      },
      {
        title: "All Code, No Show",
        template: "{missingDemoCount} flagship projects without live URLs. Reviewers want to click buttons, not troubleshoot your package manager.",
        severity: "sharp",
      },
      {
        title: "The Phantom Service",
        template: "{sampleRepo} sounds impressive in the description, but without a demo link, it's indistinguishable from vaporware.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "The Vaporware Hall of Fame",
        template: "Deploying takes 60 seconds on any modern platform. Refusing to host {sampleRepo} screams incomplete prototype.",
        severity: "savage",
      },
      {
        title: "Localhost Hoarder",
        template: "Your portfolio is asking visitors to do local DevOps work just to inspect a basic frontend application.",
        severity: "savage",
      },
      {
        title: "Zero Tangible Evidence",
        template: "{missingDemoCount} repos with no previews. Code without execution is just text files sitting on Microsoft servers.",
        severity: "savage",
      },
    ],
  },

  // 4. Fork-Heavy Profile
  forkHeavy: {
    easy: [
      {
        title: "Enthusiastic Forker",
        template: "You've gathered {forkCount} forks across the open-source landscape.",
        severity: "mild",
      },
      {
        title: "Bookmark Enthusiast",
        template: "Using GitHub forks as bookmarks is common, but {forkRatio}% of your repos are forks.",
        severity: "mild",
      },
      {
        title: "Curator in Training",
        template: "Your profile has more forks than a fine dining restaurant ({forkCount} forks).",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "Open Source Tourist",
        template: "{forkRatio}% of your repositories are forks where you clicked a button and never pushed a commit.",
        severity: "medium",
      },
      {
        title: "The Imposter Portfolio",
        template: "Forking popular repos doesn't make their star count yours—build more original projects.",
        severity: "medium",
      },
      {
        title: "Fork Buffet",
        template: "You have {forkCount} forks cluttering your profile overview, burying your {origCount} original repos.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Human Mirror",
        template: "{forkRatio}% of your account is simply mirroring other developers' hard work with zero upstream contributions.",
        severity: "sharp",
      },
      {
        title: "Stolen Sunlight",
        template: "Your GitHub profile looks like a mirror CDN rather than an engineer's workshop.",
        severity: "sharp",
      },
      {
        title: "The Upstream Shadow",
        template: "Clicking 'Fork' is not an architectural achievement. Delete the dead forks and showcase original code.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "Zero Originality Quotient",
        template: "{forkCount} forked repositories where you contributed nothing and learned even less.",
        severity: "savage",
      },
      {
        title: "The Fake Credibility Illusion",
        template: "Padding a portfolio with major open-source forks fools absolutely no one in a technical screening.",
        severity: "savage",
      },
      {
        title: "Parasitic Namespace",
        template: "Over {forkRatio}% of your public profile is composed of someone else's intellectual property.",
        severity: "savage",
      },
    ],
  },

  // 5. Portfolio Noise
  portfolioNoise: {
    easy: [
      {
        title: "Spring Cleaning Due",
        template: "About {noisePercent}% of your repos could use a quick archive or cleanup pass.",
        severity: "mild",
      },
      {
        title: "Full Attic",
        template: "Your profile is holding onto old tutorial files alongside your serious projects.",
        severity: "mild",
      },
      {
        title: "Cluttered Workspace",
        template: "A quick cleanup would help your best projects shine brighter.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "The Junk Drawer",
        template: "{noisePercent}% of your repositories are abandoned scraps, test folders, and unfinished experiments.",
        severity: "medium",
      },
      {
        title: "Needle in a Haystack",
        template: "Good luck to any reviewer trying to find your best work among all the leftover scratch repos.",
        severity: "medium",
      },
      {
        title: "The Hoarder's Overview",
        template: "You treat public GitHub like a personal temp folder with zero curation.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "Digital Landfill",
        template: "Over {noisePercent}% of your account is digital clutter that actively damages your first impression.",
        severity: "sharp",
      },
      {
        title: "The Quality Dilution Trap",
        template: "Every abandoned 'test1' and 'hello-world' repo on your profile lowers the perceived value of your real work.",
        severity: "sharp",
      },
      {
        title: "Zero Editorial Standards",
        template: "Great engineers curate their showcase. You just let public garbage pile up across the screen.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "Catastrophic Signal-to-Noise",
        template: "Your profile is {noisePercent}% noise. Finding real skill here requires hazard gear and industrial filtering.",
        severity: "savage",
      },
      {
        title: "The Uncurated Slum",
        template: "Publicly broadcasting half-baked tutorials signals a complete lack of pride in your developer showcase.",
        severity: "savage",
      },
      {
        title: "Portfolio Sabotage",
        template: "You are actively destroying your own job prospects by leaving {noisePercent}% abandoned junk in plain view.",
        severity: "savage",
      },
    ],
  },

  // 6. Weak Descriptions
  weakDescriptions: {
    easy: [
      {
        title: "Mystery Repos",
        template: "{noDescCount} of your repos don't have a one-line description yet.",
        severity: "mild",
      },
      {
        title: "Blank Summaries",
        template: "Adding a quick description to {sampleRepo} will help people understand what it does.",
        severity: "mild",
      },
      {
        title: "Silent Projects",
        template: "{noDescCount} repositories are missing their header description tag.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "Nameless Boxes",
        template: "{noDescCount} repositories with completely empty description fields. Is it a compiler or a calculator?",
        severity: "medium",
      },
      {
        title: "The Guessing Game",
        template: "Nobody has time to click into {sampleRepo} just to figure out what it's supposed to be.",
        severity: "medium",
      },
      {
        title: "Zero Pitch Effort",
        template: "If you can't describe your project in 10 words, why should anyone bother reading the code?",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Nameless Void",
        template: "Leaving descriptions blank on {noDescCount} projects is the definition of low-effort presentation.",
        severity: "sharp",
      },
      {
        title: "Zero Context Delivery",
        template: "Your repository list looks like an unindexed database dump with zero metadata.",
        severity: "sharp",
      },
      {
        title: "Metadata Neglect",
        template: "You couldn't spare 5 seconds to write a single sentence explaining {sampleRepo}.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "Total Communication Failure",
        template: "{noDescCount} blank descriptions. If you can't communicate your work, your technical ability doesn't matter.",
        severity: "savage",
      },
      {
        title: "The Indifferent Dump",
        template: "Publishing code without a description is broadcasting to the world that you don't care about what you build.",
        severity: "savage",
      },
      {
        title: "Ghost Metadata",
        template: "Reviewing your account is like walking through a grocery store where every can has the label peeled off.",
        severity: "savage",
      },
    ],
  },

  // 7. No Profile README
  noProfileReadme: {
    easy: [
      {
        title: "Unclaimed Billboard",
        template: "You haven't created your special username/username profile README yet.",
        severity: "mild",
      },
      {
        title: "Blank Welcome Mat",
        template: "A profile README is a great spot to highlight your primary skills and best projects.",
        severity: "mild",
      },
      {
        title: "Untapped Real Estate",
        template: "The top of your GitHub profile is empty canvas waiting for your developer story.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "Missing Front Door",
        template: "No profile README means your GitHub overview looks like a generic default account from 2015.",
        severity: "medium",
      },
      {
        title: "The Silent Profile",
        template: "You left the most prominent piece of GitHub real estate completely blank.",
        severity: "medium",
      },
      {
        title: "Default Mode",
        template: "A custom profile README takes 5 minutes to set up, yet you're rocking the standard layout.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Empty Marquee",
        template: "Skipping a profile README is passing up the single easiest way to control your first impression.",
        severity: "sharp",
      },
      {
        title: "Zero Personal Branding",
        template: "Your profile has zero introduction, zero highlighted achievements, and zero personality.",
        severity: "sharp",
      },
      {
        title: "The Anonymous Coder",
        template: "Without a profile overview, you look like a throwaway bot account rather than a serious engineer.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "The Ghost Developer",
        template: "Leaving your profile header empty tells recruiters you treat your career with complete apathy.",
        severity: "savage",
      },
      {
        title: "Zero Effort Showcase",
        template: "You expect hiring teams to dig through raw commit history because you couldn't write a 3-paragraph intro.",
        severity: "savage",
      },
      {
        title: "The Blank Façade",
        template: "Your profile is as welcoming and memorable as an unpainted concrete wall.",
        severity: "savage",
      },
    ],
  },

  // 8. Missing Topics
  noTopics: {
    easy: [
      {
        title: "Missing Tags",
        template: "{noTopicCount} flagship projects are missing topic tags for easy searching.",
        severity: "mild",
      },
      {
        title: "Untagged Projects",
        template: "Adding tech tags (like #react, #typescript) to {sampleRepo} helps categorize your stack.",
        severity: "mild",
      },
      {
        title: "Discoverability Opportunity",
        template: "Topics help your projects show up in GitHub topic exploration pages.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "Invisible to Search",
        template: "{noTopicCount} flagship repos have zero topic tags. GitHub's discovery algorithms have no clue you exist.",
        severity: "medium",
      },
      {
        title: "Tech Stack In Cognito",
        template: "Why hide your tech stack? Tagging {sampleRepo} takes 3 clicks.",
        severity: "medium",
      },
      {
        title: "Untagged Anonymity",
        template: "Without topic tags, your repositories get zero organic open-source traffic.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "SEO Sabotage",
        template: "{noTopicCount} flagships with zero tags. You are actively optimizing for obscurity.",
        severity: "sharp",
      },
      {
        title: "The Untagged Wilderness",
        template: "If recruiters filter by language and topic, your profile is completely omitted from the results.",
        severity: "sharp",
      },
      {
        title: "Metadata Incompetence",
        template: "Refusing to tag your flagship projects signals a fundamental misunderstanding of GitHub discoverability.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "The Black Hole of Search",
        template: "Zero topics across {noTopicCount} flagships. Your projects are buried where light cannot escape.",
        severity: "savage",
      },
      {
        title: "Total Open-Source Invisibility",
        template: "You built code in secret, published it in secret, and tagged nothing so it stays secret forever.",
        severity: "savage",
      },
      {
        title: "The Unfindable Artifact",
        template: "Your projects will never be starred, cloned, or cited because you refuse to label what they are.",
        severity: "savage",
      },
    ],
  },

  // 9. Single Language Monoculture
  singleLanguage: {
    easy: [
      {
        title: "Loyal to One Stack",
        template: "{topLang} represents {sharePct}% of your codebase. You certainly have a favorite tool.",
        severity: "mild",
      },
      {
        title: "Specialist in the Making",
        template: "Your profile is heavily focused on {topLang} ({sharePct}% of all bytes).",
        severity: "mild",
      },
      {
        title: "Single Stack Focus",
        template: "Branching into a secondary language could round out your engineering versatility.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "The One-Trick Specialist",
        template: "{sharePct}% of everything you write is in {topLang}. Do you know other compilers exist?",
        severity: "medium",
      },
      {
        title: "Language Monoculture",
        template: "When all you have is {topLang}, every problem starts looking like a {topLang} nail.",
        severity: "medium",
      },
      {
        title: "Narrow Horizons",
        template: "High concentration ({sharePct}%) in {topLang} makes your profile look like a single-framework sandbox.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Golden Handcuffs",
        template: "{sharePct}% locked into {topLang}. If that ecosystem declines, your entire engineering identity goes with it.",
        severity: "sharp",
      },
      {
        title: "Ecosystem Tunnel Vision",
        template: "You aren't a full-stack engineer; you are a single-syntax operator with zero breadth.",
        severity: "sharp",
      },
      {
        title: "The Monolith Trap",
        template: "Total reliance on {topLang} suggests an unwillingness to learn modern cross-discipline paradigms.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "Single-Dimension Developer",
        template: "{sharePct}% in {topLang}. In a multi-paradigm industry, you are operating with one eye closed.",
        severity: "savage",
      },
      {
        title: "The Framework Prisoner",
        template: "Your profile demonstrates zero polyglot versatility. You don't solve problems; you only write {topLang}.",
        severity: "savage",
      },
      {
        title: "The Monoculture Risk",
        template: "Betting your entire developer portfolio on a single language is architectural malpractice.",
        severity: "savage",
      },
    ],
  },

  // 10. Star Drought
  starDrought: {
    easy: [
      {
        title: "Under the Radar",
        template: "Your {origCount} repositories are quietly waiting for their first community stargazers.",
        severity: "mild",
      },
      {
        title: "Hidden Gems",
        template: "Zero stars across your public projects so far—sharing them in dev communities will help.",
        severity: "mild",
      },
      {
        title: "Quiet Corner of GitHub",
        template: "Your code is out there, but community validation hasn't caught on yet.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "The Crickets Symphony",
        template: "{origCount} repositories and literally zero stars. Even your friends haven't hit the star button.",
        severity: "medium",
      },
      {
        title: "The Echo Chamber",
        template: "You're writing code in total isolation with zero external validation or feedback.",
        severity: "medium",
      },
      {
        title: "Zero Star Club",
        template: "Not even your mother gave {sampleRepo} a courtesy star.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Zero Impact Black Hole",
        template: "{origCount} repositories with 0 stars indicates your projects solve problems that only exist in your head.",
        severity: "sharp",
      },
      {
        title: "Unvalidated Experiments",
        template: "Zero stars means zero users, zero contributors, and zero community trust.",
        severity: "sharp",
      },
      {
        title: "The Phantom Portfolio",
        template: "If code is pushed to GitHub and nobody stars or forks it, did it actually provide value?",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "The Absolute Zero",
        template: "Zero stars across {origCount} original repos. Your portfolio has generated exactly zero community interest.",
        severity: "savage",
      },
      {
        title: "Total Irrelevance",
        template: "You have published dozens of commits into the void without a single human finding them useful.",
        severity: "savage",
      },
      {
        title: "The Unwanted Repository",
        template: "Your code sits in total public abandonment, untouched by external developers.",
        severity: "savage",
      },
    ],
  },

  // 11. Missing Open Source Licenses
  noLicense: {
    easy: [
      {
        title: "Unlicensed Code",
        template: "{noLicenseCount} of your flagship projects haven't declared a license yet.",
        severity: "mild",
      },
      {
        title: "Legal Question Mark",
        template: "Adding an MIT or Apache-2.0 license to {sampleRepo} lets others use your work legally.",
        severity: "mild",
      },
      {
        title: "Missing SPDX",
        template: "Open source works best when license permissions are clearly stated.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "All Rights Reserved By Accident",
        template: "Without a license on {sampleRepo}, nobody can legally clone or run your code in any company.",
        severity: "medium",
      },
      {
        title: "The Legal Minefield",
        template: "{noLicenseCount} flagship projects without an open-source license. Recruiters and CTOs will stay far away.",
        severity: "medium",
      },
      {
        title: "Look But Don't Touch",
        template: "You put code on GitHub but omitted a license, making it technically illegal for anyone to adopt.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Compliance Nightmare",
        template: "Missing licenses on {noLicenseCount} flagships shows you don't understand how enterprise software works.",
        severity: "sharp",
      },
      {
        title: "Unusable by Definition",
        template: "{sampleRepo} has no license. No company can hire you based on code they are legally forbidden to run.",
        severity: "sharp",
      },
      {
        title: "Open Source Illiteracy",
        template: "Publishing code without a license is the mark of an amateur who skipped the fundamentals.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "The Radioactive Codebase",
        template: "Your flagship code is legally radioactive. Zero enterprise developers will touch {sampleRepo}.",
        severity: "savage",
      },
      {
        title: "Total Legal Incompetence",
        template: "{noLicenseCount} repos with no declared SPDX ID. You built software that is legally dead on arrival.",
        severity: "savage",
      },
      {
        title: "The Forbidden Repository",
        template: "You wasted hours building {sampleRepo} only to make it completely untouchable due to missing licensing.",
        severity: "savage",
      },
    ],
  },

  // 12. No Screenshots / Media in README
  noScreenshots: {
    easy: [
      {
        title: "Text-Heavy Presentation",
        template: "{noScreenshotCount} flagship READMEs could really use UI screenshots or diagrams.",
        severity: "mild",
      },
      {
        title: "Visual Polish Needed",
        template: "Adding a quick GIF preview to {sampleRepo} will showcase your UI immediately.",
        severity: "mild",
      },
      {
        title: "Wall of Text",
        template: "Visual screenshots make technical documentation 10x more engaging.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "The 1995 Wall of Text",
        template: "No screenshots on {sampleRepo}? Visitors aren't going to read your 400-line markdown essay.",
        severity: "medium",
      },
      {
        title: "Sight Unseen",
        template: "{noScreenshotCount} flagship web apps with zero preview images. Show, don't just tell.",
        severity: "medium",
      },
      {
        title: "Visual Amnesia",
        template: "In the era of Loom and GIFs, your READMEs are strictly ASCII text.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Invisible Interface",
        template: "Claiming to build modern UI without a single screenshot is the ultimate test of faith.",
        severity: "sharp",
      },
      {
        title: "Zero Visual Proof",
        template: "{noScreenshotCount} flagships with no visual assets. Nobody believes your frontend looks good without seeing it.",
        severity: "sharp",
      },
      {
        title: "The Boring Monologue",
        template: "Your READMEs read like dry legal terms. Add a diagram or prepare to be ignored.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "The Uninviting Text Graveyard",
        template: "Refusing to include screenshots on {sampleRepo} strongly implies your UI is broken or outdated.",
        severity: "savage",
      },
      {
        title: "Visual Zero",
        template: "In 2026, text-only documentation for a web project is pure laziness.",
        severity: "savage",
      },
      {
        title: "The Blind Screen",
        template: "Your portfolio asks reviewers to trust your design taste completely sight unseen.",
        severity: "savage",
      },
    ],
  },

  // 13. Stale Push Velocity
  staleFlagship: {
    easy: [
      {
        title: "Taking a Breather",
        template: "No pushes recorded in the last 90 days. Taking a well-deserved break?",
        severity: "mild",
      },
      {
        title: "Quiet Velocity",
        template: "Your commit streak cooled off {daysAgo} days ago.",
        severity: "mild",
      },
      {
        title: "Intermission",
        template: "Time to push a new commit and kickstart your GitHub activity graph.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "Flatlining Activity Graph",
        template: "0 commits in the last 90 days. Your contribution grid is looking like a frozen lake.",
        severity: "medium",
      },
      {
        title: "The Disappearing Act",
        template: "Last push was {daysAgo} days ago. Are you still actively coding or did you switch careers?",
        severity: "medium",
      },
      {
        title: "Zero Momentum",
        template: "Three months without pushing code makes your account look dormant to technical recruiters.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Cold Flatline",
        template: "0 pushes in 90 days. An engineer who doesn't ship code is just someone with a GitHub account.",
        severity: "sharp",
      },
      {
        title: "Total Momentum Collapse",
        template: "Your contribution graph went completely dark {daysAgo} days ago. The ship has halted.",
        severity: "sharp",
      },
      {
        title: "The Stale Profile",
        template: "Recruiters looking at your last 90 days will assume you haven't touched an IDE in months.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "The Dead Pulse",
        template: "Zero commits in a quarter. Your development velocity has ground to a complete, dead halt.",
        severity: "savage",
      },
      {
        title: "The Comatose Portfolio",
        template: "Last active {daysAgo} days ago. Your profile is essentially in a medically induced coma.",
        severity: "savage",
      },
      {
        title: "Zero Velocity, Zero Output",
        template: "You are competing against developers shipping weekly while your account gathers digital cobwebs.",
        severity: "savage",
      },
    ],
  },

  // 14. POSITIVE: Strong Activity (Credit where earned)
  strongActivity: {
    easy: [
      {
        title: "Active Builder",
        template: "Nice steady push rhythm with {recentCount} repositories updated within the last 90 days.",
        severity: "mild",
      },
      {
        title: "Consistent Shipper",
        template: "You've been regularly pushing code across multiple projects recently.",
        severity: "mild",
      },
      {
        title: "Green Streak",
        template: "Your contribution velocity shows regular engineering discipline.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "Relentless Output",
        template: "{recentCount} active repositories in 90 days. At least someone around here knows how to commit code regularly.",
        severity: "medium",
      },
      {
        title: "The Shipping Machine",
        template: "Your recent velocity across {recentCount} repos proves you actually build things instead of just talking about them.",
        severity: "medium",
      },
      {
        title: "Non-Stop Velocity",
        template: "High commit frequency across multiple projects—your terminal clearly gets regular use.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "The Freight Train",
        template: "Pushing to {recentCount} distinct repositories in 90 days. You ship code faster than most teams review PRs.",
        severity: "sharp",
      },
      {
        title: "Actual Engineering Muscle",
        template: "Your consistent shipping habits are the one thing keeping this portfolio from drowning in technical debt.",
        severity: "sharp",
      },
      {
        title: "Unstoppable Velocity",
        template: "{recentCount} active repositories recently. Your keyboard must need replacement keycaps by now.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "The Terminal Workhorse",
        template: "You've touched {recentCount} repos in 90 days. You might be ignoring other portfolio areas, but nobody can accuse you of being lazy.",
        severity: "savage",
      },
      {
        title: "The Relentless Committer",
        template: "Shipping continuously across {recentCount} codebases. If only your documentation matched this insane velocity.",
        severity: "savage",
      },
      {
        title: "High Octane Output",
        template: "You ship relentlessly. Now channel that energy into polishing your top 3 flagship projects.",
        severity: "savage",
      },
    ],
  },

  // 15. POSITIVE: Solid Documentation (Credit where earned)
  solidDocumentation: {
    easy: [
      {
        title: "Clear Communicator",
        template: "All {flagshipCount} flagship projects feature well-structured READMEs with setup and usage instructions.",
        severity: "mild",
      },
      {
        title: "Documentation Discipline",
        template: "Your flagship repositories provide clean, readable guides for newcomers.",
        severity: "mild",
      },
      {
        title: "Great First Impression",
        template: "Your documentation structure makes it easy for reviewers to evaluate your flagship code.",
        severity: "mild",
      },
    ],
    spicy: [
      {
        title: "The Rare Scribe",
        template: "All {flagshipCount} flagship projects actually have comprehensive documentation. Did you hire a technical writer?",
        severity: "medium",
      },
      {
        title: "ReadMe Masterclass",
        template: "Clean install commands, usage examples, and architecture structure across every flagship. Genuinely impressive.",
        severity: "medium",
      },
      {
        title: "No Decoder Ring Needed",
        template: "Your READMEs actually explain what the software does on the first try. A rare sight on GitHub.",
        severity: "medium",
      },
    ],
    savage: [
      {
        title: "Documentation Overachiever",
        template: "You wrote rich, detailed guides for all {flagshipCount} flagship repos. You're putting 90% of open-source maintainers to shame.",
        severity: "sharp",
      },
      {
        title: "The Professional Polish",
        template: "Flawless documentation structure across your best work. Reviewers can actually test your code in under 60 seconds.",
        severity: "sharp",
      },
      {
        title: "Crystal Clear Architecture",
        template: "Every flagship repo explains its purpose with complete clarity. Truly exceptional technical communication.",
        severity: "sharp",
      },
    ],
    brutal: [
      {
        title: "The Documentation Master",
        template: "Your documentation across {flagshipCount} flagship repos is unassailable. We had to look elsewhere to find things to roast.",
        severity: "savage",
      },
      {
        title: "Textbook Excellence",
        template: "Impeccable guides, diagrams, and examples across your flagship projects. Credit where credit is undeniably due.",
        severity: "savage",
      },
      {
        title: "Gold Standard READMEs",
        template: "Your technical writing is so thorough that even the strictest tech lead couldn't complain.",
        severity: "savage",
      },
    ],
  },
};
