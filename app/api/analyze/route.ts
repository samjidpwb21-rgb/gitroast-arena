import { NextRequest, NextResponse } from "next/server";
import { validateAnalyzeInput } from "@/lib/validation/username";
import { fetchGitHubSnapshot } from "@/lib/github/client";
import { GitHubApiError } from "@/lib/github/errors";
import { ipRateLimiter, refreshRateLimiter } from "@/lib/cache/ratelimit";
import { normalizeGitHubResponse, type RawGraphQLResponse } from "@/lib/github/normalize";

// Import test fixtures strictly for test environment
import perfectFixture from "@/tests/fixtures/fixture-perfect.json";
import averageFixture from "@/tests/fixtures/fixture-average.json";
import emptyFixture from "@/tests/fixtures/fixture-empty.json";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "127.0.0.1";
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  // 1. IP Rate Limiting Check
  const rateCheck = ipRateLimiter.check(clientIp, 1);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many requests. Please slow down and try again shortly.",
        code: "RATE_LIMITED",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateCheck.resetMs / 1000).toString(),
        },
      }
    );
  }

  // 2. Parse & Validate Payload
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON request body.",
      },
      { status: 400 }
    );
  }

  const validation = validateAnalyzeInput(body);
  if (!validation.success) {
    return NextResponse.json(
      {
        success: false,
        error: validation.error,
        field: validation.field,
      },
      { status: 400 }
    );
  }

  const { username, roastLevel, targetRole } = validation;
  const rawBody = body as Record<string, unknown>;
  const refresh = Boolean(rawBody["refresh"]);

  // 3. Stricter Rate Limiting for explicit Cache Refresh
  if (refresh) {
    const refreshCheck = refreshRateLimiter.check(clientIp, 1);
    if (!refreshCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Cache refresh rate limit exceeded. Please wait a minute.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(refreshCheck.resetMs / 1000).toString(),
          },
        }
      );
    }
  }

  // 4. Test Environment Fixture Gateway (Gated strictly to NODE_ENV === "test")
  if (process.env.NODE_ENV === "test") {
    const testFixture = req.headers.get("x-test-fixture");
    if (testFixture) {
      let rawFixture: RawGraphQLResponse | null = null;
      if (testFixture === "perfect") rawFixture = perfectFixture as unknown as RawGraphQLResponse;
      else if (testFixture === "average") rawFixture = averageFixture as unknown as RawGraphQLResponse;
      else if (testFixture === "empty") rawFixture = emptyFixture as unknown as RawGraphQLResponse;

      if (rawFixture) {
        const snapshot = normalizeGitHubResponse(rawFixture);
        return NextResponse.json({
          success: true,
          snapshot,
          fromCache: false,
          summary: {
            username: snapshot.profile.login,
            accountType: snapshot.profile.accountType,
            totalRepositories: snapshot.totalRepositoryCount,
            flagshipCount: snapshot.repositories.filter((r) => r.isFlagship).length,
            roastLevel,
            targetRole,
          },
        });
      }
    }
  }

  // 5. Fetch GitHub Snapshot (Live GraphQL call)
  try {
    const { snapshot, fromCache } = await fetchGitHubSnapshot({
      username,
      refresh,
    });

    const flagshipCount = snapshot.repositories.filter((r) => r.isFlagship).length;

    return NextResponse.json({
      success: true,
      snapshot,
      fromCache,
      summary: {
        username: snapshot.profile.login,
        accountType: snapshot.profile.accountType,
        totalRepositories: snapshot.totalRepositoryCount,
        flagshipCount,
        roastLevel,
        targetRole,
      },
    });
  } catch (err: unknown) {
    if (err instanceof GitHubApiError) {
      return NextResponse.json(
        {
          success: false,
          error: err.userFacingMessage,
          code: err.code,
        },
        {
          status: err.status || (err.code === "USER_NOT_FOUND" ? 404 : 400),
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while analyzing the profile.",
      },
      { status: 500 }
    );
  }
}
