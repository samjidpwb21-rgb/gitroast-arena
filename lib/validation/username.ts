import { RoastLevelSchema, type RoastLevel } from "@/types";

/**
 * GitHub Username Validation Rules:
 * - 1 to 39 characters
 * - Alphanumeric characters or single hyphens
 * - Cannot begin or end with a hyphen
 * - Cannot have consecutive hyphens
 */
const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

export interface ValidationSuccess {
  success: true;
  username: string;
  roastLevel: RoastLevel;
  targetRole: string | null;
}

export interface ValidationError {
  success: false;
  error: string;
  field?: "username" | "roastLevel" | "targetRole";
}

export type ValidationResult = ValidationSuccess | ValidationError;

export function validateUsername(rawUsername: unknown): { valid: boolean; normalized: string; error?: string } {
  if (typeof rawUsername !== "string") {
    return { valid: false, normalized: "", error: "Username must be a string." };
  }

  const trimmed = rawUsername.trim();
  if (!trimmed) {
    return { valid: false, normalized: "", error: "Username cannot be empty." };
  }

  if (trimmed.length > 39) {
    return { valid: false, normalized: trimmed, error: "GitHub usernames cannot exceed 39 characters." };
  }

  if (!GITHUB_USERNAME_REGEX.test(trimmed)) {
    if (trimmed.startsWith("-") || trimmed.endsWith("-")) {
      return { valid: false, normalized: trimmed, error: "GitHub usernames cannot begin or end with a hyphen." };
    }
    if (trimmed.includes("--")) {
      return { valid: false, normalized: trimmed, error: "GitHub usernames cannot contain consecutive hyphens." };
    }
    return {
      valid: false,
      normalized: trimmed,
      error: "Username may only contain alphanumeric characters or single hyphens.",
    };
  }

  return { valid: true, normalized: trimmed.toLowerCase() };
}

export function sanitizeTargetRole(rawRole: unknown): string | null {
  if (typeof rawRole !== "string") return null;
  // Strip control characters and trim
  const cleaned = rawRole.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, 60);
}

export function validateAnalyzeInput(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { success: false, error: "Invalid request payload." };
  }

  const raw = input as Record<string, unknown>;

  const userCheck = validateUsername(raw["username"]);
  if (!userCheck.valid) {
    return { success: false, error: userCheck.error ?? "Invalid username.", field: "username" };
  }

  const roastLevelParsed = RoastLevelSchema.safeParse(raw["roastLevel"] ?? "spicy");
  if (!roastLevelParsed.success) {
    return {
      success: false,
      error: "Invalid roast level. Allowed values: easy, spicy, savage, brutal.",
      field: "roastLevel",
    };
  }

  const role = sanitizeTargetRole(raw["targetRole"]);

  return {
    success: true,
    username: userCheck.normalized,
    roastLevel: roastLevelParsed.data,
    targetRole: role,
  };
}
