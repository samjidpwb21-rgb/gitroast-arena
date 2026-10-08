import type { RoastLevel, Severity } from "@/types";

export interface RoastCategoryMeta {
  id: string;
  name: string;
  description: string;
  isPositive?: boolean;
}

export const ROAST_CATEGORIES: Record<string, RoastCategoryMeta> = {
  inactiveRepositories: {
    id: "inactiveRepositories",
    name: "Digital Ghost Town",
    description: "Repositories with no activity for over 12 months.",
  },
  weakDocumentation: {
    id: "weakDocumentation",
    name: "Documentation Drought",
    description: "Flagship projects lacking meaningful README documentation.",
  },
  missingDemos: {
    id: "missingDemos",
    name: "Stealth Mode Projects",
    description: "Flagship repositories without working live previews or URLs.",
  },
  portfolioNoise: {
    id: "portfolioNoise",
    name: "Junk Drawer Syndrome",
    description: "High proportion of abandoned, archived, or low-value repos.",
  },
  forkHeavy: {
    id: "forkHeavy",
    name: "Fork Collector",
    description: "Profile dominated by upstream forks rather than original code.",
  },
  weakDescriptions: {
    id: "weakDescriptions",
    name: "Nameless Experiments",
    description: "Repositories without short descriptions or summaries.",
  },
  noProfileReadme: {
    id: "noProfileReadme",
    name: "Blank Canvas",
    description: "Missing special GitHub profile README overview.",
  },
  noTopics: {
    id: "noTopics",
    name: "Untagged Mystery",
    description: "Flagship projects without tech stack topics or tags.",
  },
  singleLanguage: {
    id: "singleLanguage",
    name: "Language Monoculture",
    description: "Over 85% of codebase concentrated in a single language.",
  },
  starDrought: {
    id: "starDrought",
    name: "Zero Stargazers",
    description: "Zero external community stars across public repositories.",
  },
  noLicense: {
    id: "noLicense",
    name: "Legal Grey Area",
    description: "Flagship projects without an open-source license.",
  },
  noScreenshots: {
    id: "noScreenshots",
    name: "Text-Only Relic",
    description: "README files without UI screenshots or architecture diagrams.",
  },
  staleFlagship: {
    id: "staleFlagship",
    name: "Velocity Freeze",
    description: "No repository pushes or commits in the past 90 days.",
  },
  strongActivity: {
    id: "strongActivity",
    name: "Relentless Shipper",
    description: "Consistent recent push velocity across multiple codebases.",
    isPositive: true,
  },
  solidDocumentation: {
    id: "solidDocumentation",
    name: "Documentation Masterclass",
    description: "Flagship repositories featuring comprehensive guides and structure.",
    isPositive: true,
  },
};

/**
 * Disallowed safety terms for the content-safety lint test.
 * We roast the artifact, never the person.
 */
export const DISALLOWED_SAFETY_TERMS = [
  "ugly",
  "fat",
  "stupid",
  "idiot",
  "moron",
  "loser",
  "dumb",
  "retard",
  "hate",
  "kill",
  "worthless person",
  "garbage human",
];
