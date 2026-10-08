/**
 * GitRoast Arena — Non-Blocking AI Enhancement Layer
 *
 * Constitution Rules:
 * 1. AI is a wording layer only. Scores, facts, and rescue simulations remain 100% deterministic.
 * 2. 2.5s maximum execution time with AbortController.
 * 3. Graceful fallback to deterministic template bank on timeout or failure.
 * 4. Content safety check on all generated strings.
 */

import type { Evidence, RoastCard, RoastLevel, RecruiterSummary, CalculatedFacts } from "@/types";
import { buildRoastRewritePrompt, buildRecruiterSummaryPrompt } from "./prompt";
import { validateAIOutput } from "./sanitize";

const AI_TIMEOUT_MS = 2500;

interface EnhanceOptions {
  username: string;
  roastLevel: RoastLevel;
  targetRole?: string | null;
  facts: CalculatedFacts;
  score: number;
  roasts: RoastCard[];
  evidence: Evidence[];
  recruiter: RecruiterSummary;
}

interface EnhancementResult {
  roasts: RoastCard[];
  recruiter: RecruiterSummary;
  aiEnhanced: boolean;
}

/**
 * Attempts AI enhancement of roasts and recruiter summary with a strict 2.5s timeout.
 * Returns the original deterministic templates if AI is not configured or fails.
 */
export async function enhanceAnalysisWithAI(options: EnhanceOptions): Promise<EnhancementResult> {
  const apiKey =
    process.env.AI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Graceful deterministic mode
    return {
      roasts: options.roasts,
      recruiter: options.recruiter,
      aiEnhanced: false,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    // 1. Enhance the top roasts in parallel (bounded concurrency)
    const roastTasks = options.roasts.slice(0, 4).map(async (roast) => {
      try {
        const { systemPrompt, userPrompt } = buildRoastRewritePrompt({
          username: options.username,
          roastLevel: options.roastLevel,
          targetRole: options.targetRole,
          roast,
          evidence: options.evidence,
        });

        const rewrittenText = await callLLM(apiKey, systemPrompt, userPrompt, controller.signal);
        if (rewrittenText) {
          const validation = validateAIOutput(rewrittenText, 350);
          if (validation.valid) {
            return {
              ...roast,
              text: rewrittenText.trim().replace(/^["']|["']$/g, ""),
              source: "ai" as const,
            };
          }
        }
      } catch {
        // Fallback to template on single item error
      }
      return roast;
    });

    // 2. Enhance recruiter summary
    const recruiterTask = (async () => {
      try {
        const { systemPrompt, userPrompt } = buildRecruiterSummaryPrompt({
          username: options.username,
          targetRole: options.targetRole,
          score: options.score,
          facts: options.facts,
          strengths: options.recruiter.strengths,
          concerns: options.recruiter.concerns,
        });

        const headline = await callLLM(apiKey, systemPrompt, userPrompt, controller.signal);
        if (headline) {
          const validation = validateAIOutput(headline, 180);
          if (validation.valid) {
            return {
              ...options.recruiter,
              headline: headline.trim().replace(/^["']|["']$/g, ""),
              source: "ai" as const,
            };
          }
        }
      } catch {
        // Fallback to template
      }
      return options.recruiter;
    })();

    const [enhancedRoastResults, enhancedRecruiter] = await Promise.all([
      Promise.all(roastTasks),
      recruiterTask,
    ]);

    clearTimeout(timeoutId);

    // Combine enhanced top roasts with any remaining original roasts
    const finalRoasts = [
      ...enhancedRoastResults,
      ...options.roasts.slice(enhancedRoastResults.length),
    ];

    const anyRoastEnhanced = enhancedRoastResults.some((r) => r.source === "ai");
    const recruiterEnhanced = enhancedRecruiter.source === "ai";

    return {
      roasts: finalRoasts,
      recruiter: enhancedRecruiter,
      aiEnhanced: anyRoastEnhanced || recruiterEnhanced,
    };
  } catch {
    clearTimeout(timeoutId);
    return {
      roasts: options.roasts,
      recruiter: options.recruiter,
      aiEnhanced: false,
    };
  }
}

/**
 * Standardized lightweight LLM fetcher supporting OpenAI-compatible endpoints
 */
async function callLLM(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  signal: AbortSignal
): Promise<string | null> {
  const isGemini = apiKey.startsWith("AIza");
  const url = isGemini
    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
    : "https://api.openai.com/v1/chat/completions";

  const body = isGemini
    ? JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        },
      })
    : JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!isGemini) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
    signal,
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  if (isGemini) {
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } else {
    return data.choices?.[0]?.message?.content ?? null;
  }
}
