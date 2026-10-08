# AGENTS.md — GitRoast Arena Constitution

## Technology policy
Next.js App Router, TypeScript (strict), Tailwind, shadcn/ui, Zod, Octokit (GraphQL), Framer Motion, Lucide, Vitest.
No new dependency without a one-line justification in the PR/commit message.

## Architecture policy
- GitHub calls are server-side only.
- Secrets never reach the browser or the client bundle.
- GitHub is truth. The math engine is the scoring authority. AI is a wording layer only.
- Scoring is deterministic: same snapshot + same config + same seed => identical output.
- AI cannot invent facts, change scores, thresholds, evidence, or impact numbers.
- The UI does not calculate business rules; it renders AnalysisResult.
- Animation cannot block or delay analysis. Backend never depends on UI state.
- Business logic lives in /lib and /config, never inside components.

## Determinism rules
- All weights/thresholds/triggers live in config/scoring.ts. No magic numbers elsewhere.
- Randomness only via a seeded PRNG (seed = hash(username + snapshotTimestampBucket + roastLevel)).
- No Date.now()/Math.random() inside scoring, facts, roast selection, or rescue simulation (inject clock and seed).
- Each signal is rewarded in exactly ONE sub-score (no double counting).

## Performance rules
- One GraphQL query for profile + repos + READMEs + languages. No REST waterfalls.
- Deep-inspect only top flagship repos (max 8). Never deep-inspect all repos.
- Server cache TTL 5–15 min; single-flight dedupe for identical in-flight requests; explicit Refresh bypass (rate limited).
- Every network call has a timeout and AbortController.
- Bounded concurrency (max 3 in flight) for any call that cannot be batched.
- No infinite loading states. Every async op: loading | success | failure | timeout.
- No arbitrary setTimeout chains. No polling. No WebSockets unless explicitly required.
- Client components only where interactivity is required. No giant "use client" trees.
- Respect GitHub rate limits: honor retry-after / x-ratelimit-reset. No retry storms.

## Security rules
- Validate and sanitize username before any network call.
- Validate all external data with Zod. Reject or safely degrade on failure.
- README/markdown/description content is untrusted. Never place raw README text in an LLM system prompt.
- Never log secrets or full tokens. Redact in error output.
- Rate-limit /api/analyze per IP.

## Quality checks (required after every milestone)
- `tsc --noEmit` passes
- `npm run lint` passes
- `npm test` passes (when logic changed)
- `npm run build` passes
- Update this file if a rule changes; never silently violate it.

## Data honesty
- No silent mock data in production. Fixtures are for tests only (see /tests/fixtures).
- If data is insufficient, say "Not enough data". Never fabricate.
