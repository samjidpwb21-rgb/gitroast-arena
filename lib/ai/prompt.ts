/**
 * GitRoast Arena — Structured Prompt Construction
 *
 * Constitution Rule:
 * Structured evidence only. Raw README markdown and arbitrary untrusted repository
 * descriptions are strictly disallowed from system and user prompts.
 */

import type { CalculatedFacts, Evidence, RoastCard, RoastLevel } from "@/types";
import { sanitizePromptInput } from "./sanitize";

export interface RoastRewritePromptInput {
  username: string;
  roastLevel: RoastLevel;
  targetRole?: string | null;
  roast: RoastCard;
  evidence: Evidence[];
}

export function buildRoastRewritePrompt(input: RoastRewritePromptInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const sanitizedUsername = sanitizePromptInput(input.username);
  const sanitizedRole = input.targetRole ? sanitizePromptInput(input.targetRole) : null;

  const linkedEvidenceSummary = input.evidence
    .filter((e) => input.roast.evidenceIds.includes(e.id))
    .map((e) => `- [${e.source}] ${e.label}: Observed "${e.observed}" (Benchmark: ${e.threshold ?? "N/A"})`)
    .join("\n");

  const systemPrompt = [
    "You are the roasting voice of GitRoast Arena.",
    "Your role is to write witty, punchy, evidence-grounded portfolio roasts.",
    "RULES:",
    "1. Roast the code/portfolio artifacts, NEVER the person's identity or character.",
    "2. Stick strictly to the provided facts and evidence. Do not invent numbers or claim things not in the evidence.",
    "3. Keep your output to 1-2 punchy sentences (maximum 280 characters).",
    "4. Return ONLY the rewritten roast text with no quotes, commentary, or pleasantries.",
    `5. Tone: ${input.roastLevel.toUpperCase()} (easy = mild humor, spicy = sharp constructive tech roast, savage = ruthless industry burn, brutal = zero-filter engineering critique).`,
  ].join("\n");

  const userPrompt = [
    `Developer: @${sanitizedUsername}`,
    sanitizedRole ? `Target Role: ${sanitizedRole}` : null,
    `Category: ${input.roast.category}`,
    `Roast Title: ${input.roast.title}`,
    `Base Roast: "${input.roast.text}"`,
    "Evidence Grounding:",
    linkedEvidenceSummary || "- Portfolio analysis fact metrics",
    "Rewrite the roast text to be more creative and punchy while strictly honoring the above evidence.",
  ]
    .filter(Boolean)
    .join("\n");

  return { systemPrompt, userPrompt };
}

export interface RecruiterPromptInput {
  username: string;
  targetRole?: string | null;
  score: number;
  facts: CalculatedFacts;
  strengths: string[];
  concerns: string[];
}

export function buildRecruiterSummaryPrompt(input: RecruiterPromptInput): {
  systemPrompt: string;
  userPrompt: string;
} {
  const sanitizedUsername = sanitizePromptInput(input.username);
  const sanitizedRole = input.targetRole ? sanitizePromptInput(input.targetRole) : "Software Engineer";

  const systemPrompt = [
    "You are a Senior Technical Hiring Manager and Executive Talent Scout.",
    "Write a sharp 2-sentence screening summary evaluating a developer's GitHub portfolio readiness.",
    "RULES:",
    "1. Be objective, realistic, and constructive.",
    "2. Ground your assessment solely on the verified portfolio facts provided.",
    "3. Maximum 200 characters.",
    "4. Return ONLY the summary text.",
  ].join("\n");

  const userPrompt = [
    `Candidate: @${sanitizedUsername}`,
    `Target Role: ${sanitizedRole}`,
    `Readiness Score: ${input.score}/100`,
    `Repositories: ${input.facts.totalRepositories} total (${input.facts.originalRepositories} original, ${input.facts.flagshipCount} flagships)`,
    `Stars: ${input.facts.totalStars}`,
    `Key Strengths: ${input.strengths.join("; ")}`,
    `Key Concerns: ${input.concerns.join("; ")}`,
  ].join("\n");

  return { systemPrompt, userPrompt };
}
