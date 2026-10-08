import "server-only";
import { Octokit } from "octokit";
import { env } from "@/lib/env";
import { ENGINE_VERSION } from "@/config/scoring";
import { memoryCache } from "@/lib/cache/memory";
import { singleFlight } from "@/lib/cache/flight";
import { GITHUB_PORTFOLIO_QUERY } from "./queries";
import { normalizeGitHubResponse, type RawGraphQLResponse } from "./normalize";
import { createGitHubError } from "./errors";
import type { GitHubSnapshot } from "@/types";

const GRAPHQL_TIMEOUT_MS = 8000; // 8 seconds timeout per spec

export interface FetchSnapshotOptions {
  username: string;
  refresh?: boolean;
  clock?: Date;
}

export interface FetchSnapshotResult {
  snapshot: GitHubSnapshot;
  fromCache: boolean;
}

/**
 * Executes the GitHub GraphQL portfolio query with timeout, error translation,
 * single-flight deduplication, and memory caching.
 */
export async function fetchGitHubSnapshot(
  options: FetchSnapshotOptions
): Promise<FetchSnapshotResult> {
  const { username, refresh = false, clock = new Date() } = options;
  const normalizedUser = username.toLowerCase();
  const cacheKey = `snapshot:${normalizedUser}`;
  const flightKey = `fetch:${normalizedUser}:${ENGINE_VERSION}`;

  // 1. Cache Check (unless explicit refresh requested)
  if (!refresh) {
    const cached = memoryCache.get<GitHubSnapshot>(cacheKey);
    if (cached) {
      return { snapshot: cached, fromCache: true };
    }
  }

  // 2. Single-Flight Deduplication for identical in-flight requests
  const snapshot = await singleFlight.do(flightKey, async () => {
    return await executeUpstreamQuery(normalizedUser, clock);
  });

  // 3. Populate memory cache
  const ttl = env.CACHE_TTL_SECONDS ?? 600;
  memoryCache.set(cacheKey, snapshot, ttl);

  return { snapshot, fromCache: false };
}

/**
 * Handles the actual network call to GitHub GraphQL endpoint with timeout and rate limit checks.
 */
async function executeUpstreamQuery(username: string, clock: Date): Promise<GitHubSnapshot> {
  const octokit = new Octokit({
    auth: env.GITHUB_TOKEN,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, GRAPHQL_TIMEOUT_MS);

  let rawResponse: RawGraphQLResponse;

  try {
    rawResponse = await octokit.graphql<RawGraphQLResponse>(GITHUB_PORTFOLIO_QUERY, {
      login: username,
      request: {
        signal: controller.signal,
      },
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    // Abort / Timeout check
    if (controller.signal.aborted || (err instanceof Error && err.name === "AbortError")) {
      throw createGitHubError({
        code: "GITHUB_TIMEOUT",
        message: `GitHub GraphQL query timed out after ${GRAPHQL_TIMEOUT_MS}ms.`,
        userFacingMessage: "GitHub took too long to respond. Please try again in a few moments.",
      });
    }

    // Inspect error response details
    const errorObj = err as {
      status?: number;
      name?: string;
      message?: string;
      errors?: Array<{ type?: string; message?: string }>;
      headers?: Record<string, string>;
    };

    const status = errorObj.status;

    // Rate Limit Check (403, 429, or GraphQL RATE_LIMITED error)
    const isRateLimited =
      status === 403 ||
      status === 429 ||
      Boolean(errorObj.errors?.some((e) => e.type === "RATE_LIMITED" || /rate limit/i.test(e.message ?? "")));

    if (isRateLimited) {
      let resetDate: Date | undefined;
      const resetHeader = errorObj.headers?.["x-ratelimit-reset"];
      if (resetHeader) {
        const timestamp = parseInt(resetHeader, 10);
        if (!isNaN(timestamp)) {
          resetDate = new Date(timestamp * 1000);
        }
      }

      throw createGitHubError({
        code: "RATE_LIMITED",
        message: "GitHub API rate limit encountered.",
        userFacingMessage: resetDate
          ? `GitHub API rate limit reached. Resets at ${resetDate.toLocaleTimeString()}.`
          : "GitHub API rate limit reached. Please wait before retrying.",
        rateLimitReset: resetDate,
        status: status ?? 429,
      });
    }

    // User Not Found Check (GraphQL NOT_FOUND)
    const isNotFound =
      status === 404 ||
      Boolean(
        errorObj.errors?.some(
          (e) => e.type === "NOT_FOUND" || /could not resolve to a User/i.test(e.message ?? "")
        )
      );

    if (isNotFound) {
      throw createGitHubError({
        code: "USER_NOT_FOUND",
        message: `User '${username}' not found on GitHub.`,
        userFacingMessage: `GitHub user '${username}' not found. Please double-check the spelling.`,
        status: 404,
      });
    }

    // Upstream server errors (500, 502, 503, 504)
    if (status && status >= 500) {
      throw createGitHubError({
        code: "GITHUB_UNAVAILABLE",
        message: `GitHub returned server error: ${status}`,
        userFacingMessage: "GitHub appears temporarily unavailable. Please retry in a minute.",
        status,
      });
    }

    // Fallback error
    throw createGitHubError({
      code: "GITHUB_UNAVAILABLE",
      message: errorObj.message || "Unknown error during GitHub GraphQL query.",
      userFacingMessage: "Failed to communicate with GitHub. Please check the username or try later.",
      status,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  // Normalize raw response into strict GitHubSnapshot
  try {
    return normalizeGitHubResponse(rawResponse, clock);
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      throw err;
    }
    throw createGitHubError({
      code: "SCHEMA_MISMATCH",
      message: err instanceof Error ? err.message : "Failed to normalize GitHub response.",
      userFacingMessage: "Unexpected data format returned from GitHub.",
    });
  }
}
