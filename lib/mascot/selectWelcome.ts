import { z } from "zod";
import type { AnalysisResult } from "@/types";
import { getScoreTier, ScoreTier } from "@/config/scoring";
import { hashString, SeededRNG } from "@/lib/roast/rng";
import {
  WELCOME_ROAST_BANK,
  DELTA_WELCOME_LINES,
  CLOSING_LINES,
  WelcomeRoastLine,
  ClosingLine,
} from "./welcome";

const STORAGE_KEY = "gitroast_last_welcome_v1";

const WelcomeHistorySchema = z.record(z.string(), z.string());

function getLastShownLineId(username: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const valid = WelcomeHistorySchema.safeParse(parsed);
    if (valid.success) {
      return valid.data[username.toLowerCase()] || null;
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

export function saveLastShownLineId(username: string, lineId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    const valid = WelcomeHistorySchema.safeParse(existing);
    const data = valid.success ? valid.data : {};
    data[username.toLowerCase()] = lineId;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore
  }
}

export interface SelectedWelcomeResult {
  tier: ScoreTier;
  lineId: string;
  roastLine: string;
  closingLineId: string;
  closingLine: string;
  isDelta: boolean;
}

export function selectWelcomeRoast(
  result: AnalysisResult,
  scoreDelta?: { delta: number; text?: string } | null
): SelectedWelcomeResult {
  const username = result.metadata.username;
  const score = result.scores.portfolioReadiness;
  const isInsufficient = Boolean(result.metadata.insufficientData);
  const tier = getScoreTier(score, isInsufficient);

  const seed = hashString(`${result.id}:${tier}`);
  const rng = new SeededRNG(seed);

  const values: Record<string, string | number> = {
    username,
    score,
    repoCount: result.facts.totalRepositories,
    inactiveCount: result.facts.inactiveRepositories,
    flagshipCount: result.facts.flagshipCount,
    totalStars: result.facts.totalStars,
  };

  const lastShownId = getLastShownLineId(username);

  // If a previous snapshot exists and scoreDelta is present, check delta candidates
  if (scoreDelta && typeof scoreDelta.delta === "number") {
    const deltaType: "improved" | "dropped" | "same" =
      scoreDelta.delta > 0 ? "improved" : scoreDelta.delta < 0 ? "dropped" : "same";
    const deltaCandidates = DELTA_WELCOME_LINES.filter((d) => d.type === deltaType);

    if (deltaCandidates.length > 0) {
      // Pick delta line deterministically
      const chosenDelta = rng.pick(deltaCandidates);
      const absDelta = Math.abs(scoreDelta.delta);
      const formattedText = chosenDelta.text
        .replace(/\{username\}/g, username)
        .replace(/\{score\}/g, String(score))
        .replace(/\{delta\}/g, String(absDelta));

      const chosenClosing = rng.pick(CLOSING_LINES);

      return {
        tier,
        lineId: chosenDelta.id,
        roastLine: formattedText,
        closingLineId: chosenClosing.id,
        closingLine: chosenClosing.text,
        isDelta: true,
      };
    }
  }

  // Filter bank by tier
  let candidates = WELCOME_ROAST_BANK.filter((item) => item.tier === tier);

  // Filter out candidates requiring placeholders that are 0 or missing
  candidates = candidates.filter((item) => {
    if (!item.requiredPlaceholders || item.requiredPlaceholders.length === 0) {
      return true;
    }
    return item.requiredPlaceholders.every((key) => {
      const val = values[key];
      if (val === undefined || val === null) return false;
      // If inactiveCount or totalStars is 0, don't pick lines that talk about having them
      if ((key === "inactiveCount" || key === "totalStars" || key === "flagshipCount") && val === 0) {
        return false;
      }
      return true;
    });
  });

  // Exclude last shown line if there are alternative candidates
  if (lastShownId && candidates.length > 1) {
    const withoutLast = candidates.filter((c) => c.id !== lastShownId);
    if (withoutLast.length > 0) {
      candidates = withoutLast;
    }
  }

  // Fallback candidate if everything was filtered
  const chosenLine: WelcomeRoastLine =
    candidates.length > 0
      ? rng.pick(candidates)
      : {
          id: "fallback_01",
          tier,
          text: `Welcome, @${username}. Your portfolio scored a ${score} readiness rating.`,
        };

  // Substitute placeholders
  let formattedRoast = chosenLine.text;
  for (const [key, val] of Object.entries(values)) {
    formattedRoast = formattedRoast.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
  }

  // Pick closing line independently
  const closingRng = new SeededRNG(hashString(`${result.id}:closing:${tier}`));
  const chosenClosing: ClosingLine = closingRng.pick(CLOSING_LINES);

  // Remember this line for this user
  saveLastShownLineId(username, chosenLine.id);

  return {
    tier,
    lineId: chosenLine.id,
    roastLine: formattedRoast,
    closingLineId: chosenClosing.id,
    closingLine: chosenClosing.text,
    isDelta: false,
  };
}
