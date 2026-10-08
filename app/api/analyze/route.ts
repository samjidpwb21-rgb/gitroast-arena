import { NextRequest, NextResponse } from "next/server";
import { validateAnalyzeInput } from "@/lib/validation/username";
import { analyzePortfolio, generateAnalysisId } from "@/lib/analysis/pipeline";
import { GitHubApiError } from "@/lib/github/errors";
import { ipRateLimiter, refreshRateLimiter } from "@/lib/cache/ratelimit";
import { normalizeGitHubResponse, type RawGraphQLResponse } from "@/lib/github/normalize";
import { extractCalculatedFacts } from "@/lib/analysis/facts";
import { calculateCategoryScores } from "@/lib/analysis/scoring";
import { generateEvidence } from "@/lib/analysis/evidence";
import { selectRoastCards } from "@/lib/roast/select";
import { generateRescuePlan } from "@/lib/rescue/simulator";
import { generateRecruiterSummary } from "@/lib/analysis/recruiter";
import { validateAnalysisResultInvariants, AnalysisResultSchema, type AnalysisResult } from "@/types";
import { ENGINE_VERSION } from "@/config/scoring";

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
        const clock = new Date();
        const snapshot = normalizeGitHubResponse(rawFixture, clock);
        const facts = extractCalculatedFacts(snapshot, clock);
        const scores = calculateCategoryScores(facts, snapshot);
        const evidence = generateEvidence(facts, snapshot);
        const roasts = selectRoastCards({ facts, snapshot, evidence, roastLevel });
        const rescue = generateRescuePlan({ facts, snapshot, scores, evidence, clock });
        const recruiter = generateRecruiterSummary({ facts, scores, evidence, targetRole });

        const result: AnalysisResult = {
          id: generateAnalysisId(),
          metadata: {
            username: snapshot.profile.login,
            roastLevel,
            targetRole,
            generatedAt: clock.toISOString(),
            snapshotFetchedAt: snapshot.fetchedAt,
            fromCache: false,
            aiEnhanced: false,
            engineVersion: ENGINE_VERSION,
            insufficientData: facts.insufficientData,
          },
          facts,
          scores,
          evidence,
          roasts,
          recruiter,
          rescue,
        };

        const invariantCheck = validateAnalysisResultInvariants(result);
        if (!invariantCheck.valid) {
          return NextResponse.json(
            { success: false, error: "Invariant check failed in test fixture", details: invariantCheck.errors },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          result: AnalysisResultSchema.parse(result),
          fromCache: false,
        });
      }
    }
  }

  // 5. Execute Full Analysis Pipeline (Live GitHub API)
  try {
    const { result, fromCache } = await analyzePortfolio({
      username,
      roastLevel,
      targetRole,
      refresh,
    });

    return NextResponse.json({
      success: true,
      result,
      fromCache,
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

    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
