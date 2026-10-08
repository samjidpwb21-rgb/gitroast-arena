import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  GITHUB_TOKEN: z.string().min(1, "GITHUB_TOKEN is required for GitHub API access"),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional().default("gemini-1.5-flash"),
  CACHE_TTL_SECONDS: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return 600;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) return 600;
      return Math.min(900, Math.max(300, parsed));
    }),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function validateEnv(): ServerEnv {
  // Allow build-time static page collection and test runner to proceed
  const isBuildOrTest =
    process.env.NODE_ENV === "test" ||
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.npm_lifecycle_event === "build";

  const rawEnv = {
    ...process.env,
    GITHUB_TOKEN:
      process.env.GITHUB_TOKEN ||
      (isBuildOrTest ? "ghp_build_time_placeholder_token" : undefined),
  };

  const parsed = serverEnvSchema.safeParse(rawEnv);
  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${formatted}`);
  }
  return parsed.data;
}

export const env = validateEnv();
