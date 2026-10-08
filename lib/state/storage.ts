import { z } from "zod";
import type { AnalysisResult } from "@/types";

const SavedSnapshotSchema = z.object({
  id: z.string(),
  username: z.string(),
  timestamp: z.string(),
  readinessScore: z.number().int().min(0).max(100),
  subScores: z.object({
    projectQuality: z.number().int().min(0).max(100),
    documentation: z.number().int().min(0).max(100),
    activity: z.number().int().min(0).max(100),
    technicalBreadth: z.number().int().min(0).max(100),
    profile: z.number().int().min(0).max(100),
    portfolioCuration: z.number().int().min(0).max(100),
    projectImpact: z.number().int().min(0).max(100),
  }),
  potentialScore: z.number().int().min(0).max(100),
  verdict: z.string(),
});

export type SavedSnapshot = z.infer<typeof SavedSnapshotSchema>;

const STORAGE_KEY = "gitroast_portfolio_snapshots";

export function saveSnapshot(result: AnalysisResult): void {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    let existing: unknown[] = [];
    if (raw) {
      try {
        existing = JSON.parse(raw);
      } catch {
        existing = [];
      }
    }

    const newSnapshot: SavedSnapshot = {
      id: result.id,
      username: result.metadata.username.toLowerCase(),
      timestamp: result.metadata.generatedAt,
      readinessScore: result.scores.portfolioReadiness,
      subScores: {
        projectQuality: result.scores.projectQuality,
        documentation: result.scores.documentation,
        activity: result.scores.activity,
        technicalBreadth: result.scores.technicalBreadth,
        profile: result.scores.profile,
        portfolioCuration: result.scores.portfolioCuration,
        projectImpact: result.scores.projectImpact,
      },
      potentialScore: result.rescue.potentialScore,
      verdict: result.recruiter.verdict,
    };

    // Filter out invalid items safely using Zod
    const validExisting: SavedSnapshot[] = [];
    for (const item of existing) {
      const parsed = SavedSnapshotSchema.safeParse(item);
      if (parsed.success) {
        validExisting.push(parsed.data);
      }
    }

    // Prepend new snapshot, limit to last 20 snapshots
    const updated = [newSnapshot, ...validExisting.filter((s) => s.id !== result.id)].slice(0, 20);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to persist snapshot to localStorage:", err);
  }
}

export function getSnapshots(username?: string): SavedSnapshot[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const valid: SavedSnapshot[] = [];
    for (const item of parsed) {
      const res = SavedSnapshotSchema.safeParse(item);
      if (res.success) {
        if (!username || res.data.username === username.toLowerCase()) {
          valid.push(res.data);
        }
      }
    }
    return valid;
  } catch {
    return [];
  }
}

export function getPreviousSnapshot(username: string, currentId?: string): SavedSnapshot | null {
  const snapshots = getSnapshots(username);
  const previous = snapshots.find((s) => s.id !== currentId);
  return previous ?? null;
}

export function computeScoreDelta(
  currentScore: number,
  previous?: SavedSnapshot | null
): { delta: number; text: string } | null {
  if (!previous) return null;
  const delta = currentScore - previous.readinessScore;
  const dateFormatted = new Date(previous.timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  if (delta > 0) {
    return { delta, text: `+${delta} pts since ${dateFormatted}` };
  } else if (delta < 0) {
    return { delta, text: `${delta} pts since ${dateFormatted}` };
  } else {
    return { delta: 0, text: `Unchanged since ${dateFormatted}` };
  }
}
