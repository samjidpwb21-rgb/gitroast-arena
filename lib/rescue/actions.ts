import type { GitHubSnapshot, CalculatedFacts } from "@/types";

export interface CandidateFixDefinition {
  id: string;
  title: string;
  why: string;
  steps: string[];
  affectsCategory: string;
  triggerCategory: string;
  applyFix: (snapshot: GitHubSnapshot, facts: CalculatedFacts) => GitHubSnapshot;
}

/**
 * Candidate portfolio fixes with deterministic hypothetical mutation transforms.
 */
export const CANDIDATE_FIXES: CandidateFixDefinition[] = [
  // 1. Rewrite Flagship READMEs
  {
    id: "fix_rewrite_readmes",
    title: "Document all flagship repositories",
    why: "Flagship repositories without structured guides fail initial recruiter screening.",
    steps: [
      "Add a clear 2-sentence value proposition at the top of each flagship README.",
      "Add step-by-step local Installation and Setup commands.",
      "Provide a realistic Usage example or code snippet.",
      "Embed an architecture diagram or UI screenshot.",
    ],
    affectsCategory: "documentation",
    triggerCategory: "weakDocumentation",
    applyFix: (snapshot) => ({
      ...snapshot,
      repositories: snapshot.repositories.map((repo) => {
        if (repo.isFlagship) {
          return {
            ...repo,
            readme: {
              exists: true,
              wordCount: Math.max(repo.readme.wordCount, 350),
              hasHeadings: true,
              hasImages: true,
              hasInstallSection: true,
              hasUsageSection: true,
              excerptSanitized: repo.readme.excerptSanitized || "Comprehensive documentation",
            },
          };
        }
        return repo;
      }),
    }),
  },

  // 2. Add Live Demos to Flagships
  {
    id: "fix_add_live_demos",
    title: "Deploy live previews for flagship web apps",
    why: "Recruiters and hiring managers rarely clone and build code locally; they click live links.",
    steps: [
      "Deploy your flagship web applications to Vercel, Netlify, or GitHub Pages.",
      "Set the repository 'Homepage' URL in GitHub repo settings.",
      "Link the live preview prominently in the README header.",
    ],
    affectsCategory: "projectImpact",
    triggerCategory: "missingDemos",
    applyFix: (snapshot) => ({
      ...snapshot,
      repositories: snapshot.repositories.map((repo) => {
        if (repo.isFlagship && !repo.homepageUrl) {
          return {
            ...repo,
            homepageUrl: `https://${repo.name}.example.com`,
          };
        }
        return repo;
      }),
    }),
  },

  // 3. Archive or Curate Inactive Repositories
  {
    id: "fix_archive_inactive",
    title: "Archive stale and abandoned repositories",
    why: "Leaving outdated experiments active dilutes your portfolio quality and inflates noise.",
    steps: [
      "Navigate to repository Settings > Danger Zone for projects untouched in 12+ months.",
      "Click 'Archive this repository' to preserve the code as read-only.",
      "Keep only active, flagship, and maintained projects unarchived.",
    ],
    affectsCategory: "portfolioCuration",
    triggerCategory: "inactiveRepositories",
    applyFix: (snapshot) => {
      const nowMs = Date.now();
      return {
        ...snapshot,
        repositories: snapshot.repositories.map((repo) => {
          if (!repo.isFork && repo.pushedAt) {
            const diffDays = (nowMs - new Date(repo.pushedAt).getTime()) / (1000 * 3600 * 24);
            if (diffDays > 365) {
              return { ...repo, isArchived: true };
            }
          }
          return repo;
        }),
      };
    },
  },

  // 4. Add Open-Source Licenses
  {
    id: "fix_add_licenses",
    title: "Add open-source licenses to flagship projects",
    why: "Enterprise reviewers and contributors cannot legally adopt or run unlicensed code.",
    steps: [
      "Add a LICENSE file (MIT or Apache-2.0) to the root of each flagship repository.",
      "Verify that GitHub automatically detects and displays the license badge.",
    ],
    affectsCategory: "projectQuality",
    triggerCategory: "noLicense",
    applyFix: (snapshot) => ({
      ...snapshot,
      repositories: snapshot.repositories.map((repo) => {
        if (repo.isFlagship && !repo.licenseSpdx) {
          return { ...repo, licenseSpdx: "MIT" };
        }
        return repo;
      }),
    }),
  },

  // 5. Add Topics and Descriptions
  {
    id: "fix_add_topics",
    title: "Tag flagship projects with tech stack topics",
    why: "GitHub topics improve search indexing and signal your core technologies at a glance.",
    steps: [
      "Click the gear icon next to 'About' on each flagship repository.",
      "Add 3-5 tech stack tags (e.g. #typescript, #react, #nextjs, #tailwind).",
      "Ensure a concise 1-sentence description is populated.",
    ],
    affectsCategory: "projectQuality",
    triggerCategory: "noTopics",
    applyFix: (snapshot) => ({
      ...snapshot,
      repositories: snapshot.repositories.map((repo) => {
        if (repo.isFlagship) {
          return {
            ...repo,
            description: repo.description || "Production-grade open-source project",
            topics: repo.topics.length > 0 ? repo.topics : ["typescript", "fullstack", "web"],
          };
        }
        return repo;
      }),
    }),
  },

  // 6. Create Profile README
  {
    id: "fix_create_profile_readme",
    title: "Create a customized GitHub profile README",
    why: "A profile README is your personal landing page, summarizing your background and top achievements.",
    steps: [
      "Create a new public repository named after your GitHub username.",
      "Add a README.md introducing your specialty, stack, and active projects.",
      "Pin your top 3-4 flagship repositories to the overview page.",
    ],
    affectsCategory: "profile",
    triggerCategory: "noProfileReadme",
    applyFix: (snapshot) => ({
      ...snapshot,
      profile: {
        ...snapshot.profile,
        hasProfileReadme: true,
        pinnedRepoNames: snapshot.repositories
          .filter((r) => r.isFlagship)
          .map((r) => r.name)
          .slice(0, 4),
      },
    }),
  },

  // 7. Add Screenshots & Media to READMEs
  {
    id: "fix_add_screenshots",
    title: "Include visual previews & architecture diagrams",
    why: "Visual screenshots increase portfolio engagement by over 300% compared to text-only pages.",
    steps: [
      "Take high-resolution screenshots or record short GIFs of your running application.",
      "Include a simple system architecture diagram explaining data flow.",
      "Embed the images in the README under a 'Preview' or 'Architecture' section.",
    ],
    affectsCategory: "documentation",
    triggerCategory: "noScreenshots",
    applyFix: (snapshot) => ({
      ...snapshot,
      repositories: snapshot.repositories.map((repo) => {
        if (repo.isFlagship) {
          return {
            ...repo,
            readme: {
              ...repo.readme,
              hasImages: true,
            },
          };
        }
        return repo;
      }),
    }),
  },
];
