import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "@/app/api/analyze/route";
import { NextRequest } from "next/server";
import { ipRateLimiter, refreshRateLimiter } from "@/lib/cache/ratelimit";

describe("/api/analyze Route", () => {
  beforeEach(() => {
    ipRateLimiter.clear();
    refreshRateLimiter.clear();
  });

  function createRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
    return new NextRequest("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }

  it("rejects invalid usernames with 400", async () => {
    const req = createRequest({ username: "octo--cat" });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("consecutive hyphens");
  });

  it("rejects invalid roastLevel with 400", async () => {
    const req = createRequest({ username: "octocat", roastLevel: "super-extreme" });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.field).toBe("roastLevel");
  });

  it("returns normalized snapshot when test fixture is requested", async () => {
    const req = createRequest(
      { username: "alexdev", roastLevel: "savage", targetRole: "Backend Dev" },
      { "x-test-fixture": "perfect" }
    );
    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.snapshot.profile.login).toBe("alexdev");
    expect(json.summary.flagshipCount).toBeGreaterThanOrEqual(3);
    expect(json.summary.roastLevel).toBe("savage");
    expect(json.summary.targetRole).toBe("Backend Dev");
  });

  it("enforces IP rate limiting when requests exceed capacity", async () => {
    // Consume all 30 tokens for client IP 192.168.1.100
    for (let i = 0; i < 30; i++) {
      ipRateLimiter.check("192.168.1.100", 1);
    }

    const req = createRequest(
      { username: "alexdev" },
      { "x-forwarded-for": "192.168.1.100", "x-test-fixture": "perfect" }
    );

    const res = await POST(req);
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.code).toBe("RATE_LIMITED");
  });
});
