import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const username = searchParams.get("username")?.slice(0, 39) || "developer";
    const score = parseInt(searchParams.get("score") || "72", 10);
    const clampedScore = isNaN(score) ? 72 : Math.max(0, Math.min(100, score));
    const verdict = searchParams.get("verdict")?.slice(0, 40) || "PORTFOLIO EVALUATION";
    const roast =
      searchParams.get("roast")?.slice(0, 140) ||
      "Brutally honest code reviews backed by verifiable evidence.";

    // Score tone colors
    let scoreColor = "#10b981"; // green
    if (clampedScore < 50) scoreColor = "#f43f5e"; // red
    else if (clampedScore < 70) scoreColor = "#f59e0b"; // amber
    else if (clampedScore < 85) scoreColor = "#3b82f6"; // blue

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#09090b",
            color: "#fafafa",
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            padding: "60px",
            position: "relative",
          }}
        >
          {/* Background Ambient Glow */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "450px",
              height: "450px",
              borderRadius: "50%",
              backgroundColor: scoreColor,
              opacity: 0.15,
              filter: "blur(100px)",
            }}
          />

          {/* Top Bar: Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(249, 115, 22, 0.15)",
                  border: "1px solid rgba(249, 115, 22, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                🔥
              </div>
              <span style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px" }}>
                Git<span style={{ color: "#f97316" }}>Roast</span> Arena
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 18px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                fontSize: "16px",
                fontFamily: "monospace",
                color: "#a1a1aa",
              }}
            >
              gitroast.arena
            </div>
          </div>

          {/* Center Card: Score & Profile */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "rgba(24, 24, 27, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "24px",
              padding: "40px",
              gap: "40px",
            }}
          >
            {/* Left Info */}
            <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "36px", fontWeight: "800", color: "#fafafa" }}>
                  @{username}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  backgroundColor: `${scoreColor}20`,
                  border: `1px solid ${scoreColor}40`,
                  color: scoreColor,
                  fontSize: "14px",
                  fontWeight: "700",
                  fontFamily: "monospace",
                  alignSelf: "flex-start",
                }}
              >
                {verdict.toUpperCase()}
              </div>

              <p
                style={{
                  fontSize: "20px",
                  color: "#d4d4d8",
                  fontStyle: "italic",
                  marginTop: "8px",
                  lineHeight: "1.4",
                }}
              >
                &ldquo;{roast}&rdquo;
              </p>
            </div>

            {/* Right Score Badge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                backgroundColor: "rgba(9, 9, 11, 0.9)",
                border: `4px solid ${scoreColor}`,
                boxShadow: `0 0 30px ${scoreColor}30`,
              }}
            >
              <span
                style={{
                  fontSize: "64px",
                  fontWeight: "900",
                  fontFamily: "monospace",
                  color: "#fafafa",
                  lineHeight: 1,
                }}
              >
                {clampedScore}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "monospace",
                  color: "#a1a1aa",
                  letterSpacing: "2px",
                  marginTop: "4px",
                }}
              >
                READINESS
              </span>
            </div>
          </div>

          {/* Bottom Footer Callout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "15px",
              color: "#71717a",
            }}
          >
            <span>Math-backed portfolio scoring • No hallucinated facts</span>
            <span style={{ color: "#f97316", fontWeight: "600" }}>
              Can you beat this score? Roast your GitHub portfolio →
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to render card";
    return new Response(`Failed to generate OG image: ${msg}`, { status: 500 });
  }
}
