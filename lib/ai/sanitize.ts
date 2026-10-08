/**
 * GitRoast Arena — AI Input & Output Sanitization
 *
 * Security & Honesty Policy:
 * 1. AI is a wording layer ONLY. It cannot alter facts, scores, or thresholds.
 * 2. Raw README content is NEVER placed into prompts.
 * 3. Strips prompt injection phrases and control characters.
 * 4. Verifies output against disallowed terms and size constraints.
 */

import { DISALLOWED_SAFETY_TERMS } from "@/config/roasts";

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions?/gi,
  /system\s+prompt/gi,
  /you\s+are\s+now\s+a/gi,
  /dan\s+mode/gi,
  /disregard\s+rules/gi,
  /bypass\s+filter/gi,
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript:/gi,
];

/**
 * Sanitize untrusted text before it reaches prompt construction.
 */
export function sanitizePromptInput(input: string): string {
  if (!input) return "";

  let cleaned = input.normalize("NFKC");

  // Strip control characters (except common whitespace)
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Strip known injection vectors
  for (const pattern of INJECTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[redacted]");
  }

  return cleaned.trim();
}

/**
 * Validates generated AI text against safety rules and length limits.
 */
export function validateAIOutput(
  text: string,
  maxLength: number = 300
): { valid: boolean; reason?: string } {
  if (!text || text.trim().length === 0) {
    return { valid: false, reason: "Empty output from AI model" };
  }

  if (text.length > maxLength) {
    return { valid: false, reason: `Output exceeded maxLength of ${maxLength}` };
  }

  const lower = text.toLowerCase();
  for (const term of DISALLOWED_SAFETY_TERMS) {
    if (lower.includes(term.toLowerCase())) {
      return { valid: false, reason: `Disallowed safety term detected: "${term}"` };
    }
  }

  return { valid: true };
}
