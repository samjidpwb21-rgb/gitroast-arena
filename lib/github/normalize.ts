import {
  GitHubSnapshotSchema,
  type GitHubSnapshot,
  type RepoSnapshot,
  type LanguageByte,
} from "@/types";
import { parseReadme } from "./sanitize";
import { rankFlagshipRepositories } from "./rank";
import { createGitHubError } from "./errors";

export interface RawGraphQLRepositoryNode {
  name: string;
  nameWithOwner: string;
  description: string | null;
  isFork: boolean;
  isArchived: boolean;
  stargazerCount: number;
  forkCount: number;
  pushedAt: string | null;
  updatedAt: string;
  createdAt: string;
  homepageUrl: string | null;
  licenseInfo: { spdxId: string | null } | null;
  repositoryTopics: { nodes: Array<{ topic: { name: string } }> } | null;
  primaryLanguage: { name: string } | null;
  languages: { edges: Array<{ size: number; node: { name: string } }> } | null;
  readmeUpper: { text?: string } | null;
  readmeLower: { text?: string } | null;
}

export interface RawGraphQLUserPayload {
  __typename: "User" | "Organization" | "Bot" | string;
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  company: string | null;
  location: string | null;
  websiteUrl: string | null;
  createdAt: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  pinnedItems: { nodes: Array<{ name: string } | null> } | null;
  profileReadme: { object: { text?: string } | null } | null;
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number;
    } | null;
  } | null;
  repositories: {
    totalCount: number;
    nodes: Array<RawGraphQLRepositoryNode | null>;
  };
}

export interface RawGraphQLResponse {
  user: RawGraphQLUserPayload | null;
}

function safeUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Normalizes raw GitHub GraphQL response into a strictly-validated GitHubSnapshot.
 */
export function normalizeGitHubResponse(
  raw: RawGraphQLResponse,
  fetchedAt: Date = new Date()
): GitHubSnapshot {
  if (!raw.user) {
    throw createGitHubError({
      code: "USER_NOT_FOUND",
      message: "GitHub user not found in response.",
      userFacingMessage: "GitHub user not found. Please double-check the username.",
    });
  }

  const { user } = raw;

  // Account type checks
  if (user.__typename === "Organization") {
    throw createGitHubError({
      code: "UNSUPPORTED_ACCOUNT_TYPE",
      message: "Target account is an Organization.",
      userFacingMessage:
        "Organizations cannot be roasted directly. Please provide an individual developer username.",
    });
  }

  if (user.__typename === "Bot") {
    throw createGitHubError({
      code: "BOT_ACCOUNT",
      message: "Target account is a Bot.",
      userFacingMessage: "Bot accounts cannot be analyzed. Please provide a human developer account.",
    });
  }

  const accountType: "User" | "Organization" | "Bot" =
    user.__typename === "User" ? "User" : user.__typename === "Bot" ? "Bot" : "Organization";

  // Pinned repos
  const pinnedRepoNames = (user.pinnedItems?.nodes ?? [])
    .filter((node): node is { name: string } => Boolean(node && node.name))
    .map((node) => node.name);

  // Profile README existence
  const profileReadmeText = user.profileReadme?.object?.text;
  const hasProfileReadme = Boolean(profileReadmeText && profileReadmeText.trim().length > 0);

  const rawRepos = (user.repositories.nodes ?? []).filter(
    (repo): repo is RawGraphQLRepositoryNode => Boolean(repo)
  );

  // Map to candidate structures for flagship ranking
  const candidateList = rawRepos.map((repo) => {
    const readmeRaw = repo.readmeUpper?.text ?? repo.readmeLower?.text ?? null;
    const topics = (repo.repositoryTopics?.nodes ?? [])
      .map((t) => t.topic.name)
      .filter(Boolean);

    return {
      repo,
      name: repo.name,
      isFork: Boolean(repo.isFork),
      isArchived: Boolean(repo.isArchived),
      description: repo.description,
      stargazerCount: repo.stargazerCount ?? 0,
      forkCount: repo.forkCount ?? 0,
      pushedAt: repo.pushedAt,
      homepageUrl: repo.homepageUrl,
      topics,
      readmeRaw,
      readmeExists: Boolean(readmeRaw && readmeRaw.trim().length > 0),
    };
  });

  // Rank flagships using local math weights
  const ranked = rankFlagshipRepositories(candidateList, fetchedAt);

  // Transform into strict RepoSnapshot objects
  const repositories: RepoSnapshot[] = ranked.map(({ repo, score, isFlagship }) => {
    const rawRepo = repo.repo;
    const languages: LanguageByte[] = (rawRepo.languages?.edges ?? [])
      .map((e) => ({
        name: e.node.name,
        bytes: e.size,
      }))
      .filter((l) => l.bytes > 0);

    const parsedReadme = parseReadme(repo.readmeRaw);

    return {
      name: rawRepo.name,
      nameWithOwner: rawRepo.nameWithOwner,
      description: rawRepo.description ?? null,
      isFork: Boolean(rawRepo.isFork),
      isArchived: Boolean(rawRepo.isArchived),
      stargazerCount: rawRepo.stargazerCount ?? 0,
      forkCount: rawRepo.forkCount ?? 0,
      pushedAt: rawRepo.pushedAt ? new Date(rawRepo.pushedAt).toISOString() : null,
      updatedAt: new Date(rawRepo.updatedAt).toISOString(),
      createdAt: new Date(rawRepo.createdAt).toISOString(),
      homepageUrl: safeUrl(rawRepo.homepageUrl),
      licenseSpdx: rawRepo.licenseInfo?.spdxId ?? null,
      topics: repo.topics,
      primaryLanguage: rawRepo.primaryLanguage?.name ?? null,
      languages,
      readme: parsedReadme,
      isFlagship,
      flagshipScore: score,
    };
  });

  const totalRepositoryCount = user.repositories.totalCount;
  const isTruncated = totalRepositoryCount > 100;
  const contributionsLastYear =
    user.contributionsCollection?.contributionCalendar?.totalContributions ?? null;

  const snapshotData = {
    fetchedAt: fetchedAt.toISOString(),
    profile: {
      login: user.login,
      accountType,
      name: user.name ?? null,
      bio: user.bio ?? null,
      avatarUrl: user.avatarUrl,
      company: user.company ?? null,
      location: user.location ?? null,
      websiteUrl: safeUrl(user.websiteUrl),
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      createdAt: new Date(user.createdAt).toISOString(),
      hasProfileReadme,
      pinnedRepoNames,
    },
    totalRepositoryCount,
    repositories,
    contributionsLastYear,
    truncated: isTruncated,
  };

  // Validate strictly with Zod schema
  return GitHubSnapshotSchema.parse(snapshotData);
}
