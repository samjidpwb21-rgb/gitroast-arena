import type { Metadata } from "next";
import Link from "next/link";
import { Flame, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

interface ResultPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: ResultPageProps): Promise<Metadata> {
  const resolvedQuery = await searchParams;

  const username = typeof resolvedQuery.u === "string" ? resolvedQuery.u : "developer";
  const score = typeof resolvedQuery.s === "string" ? resolvedQuery.s : "70";
  const verdict = typeof resolvedQuery.v === "string" ? resolvedQuery.v : "SOLID";

  const ogUrl = `/api/og?username=${encodeURIComponent(username)}&score=${encodeURIComponent(
    score
  )}&verdict=${encodeURIComponent(verdict)}`;

  return {
    title: `@${username}'s GitHub Portfolio Roast | GitRoast Arena`,
    description: `Readiness Score: ${score}/100. Check out the roast breakdown, evidence, and simulated rescue plan on GitRoast Arena.`,
    openGraph: {
      title: `@${username}'s GitHub Portfolio Roast`,
      description: `Readiness Score: ${score}/100. Can your GitHub portfolio beat this?`,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: `@${username} GitRoast Arena score`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `@${username}'s GitHub Portfolio Roast (${score}/100)`,
      description: `Check out the evidence-grounded review and see if you can score higher.`,
      images: [ogUrl],
    },
  };
}

export default async function ResultChallengePage({ searchParams }: ResultPageProps) {
  const resolvedQuery = await searchParams;

  const username = typeof resolvedQuery.u === "string" ? resolvedQuery.u : "developer";
  const score = parseInt(typeof resolvedQuery.s === "string" ? resolvedQuery.s : "70", 10);
  const verdict = typeof resolvedQuery.v === "string" ? resolvedQuery.v : "EVALUATED";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-xl w-full mx-auto flex flex-col items-center text-center gap-8 bg-card/80 backdrop-blur-md border border-border/80 rounded-3xl p-8 sm:p-12 shadow-2xl">
        {/* Logo Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-mono font-bold uppercase">
          <Flame className="w-4 h-4" />
          GitRoast Arena Challenge
        </div>

        {/* Profile and Score Highlight */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            @{username} scored <span className="text-orange-500 font-mono">{score}/100</span>
          </h1>
          <div className="inline-block px-3 py-1 rounded-lg bg-secondary text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Verdict: {verdict}
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Evaluated by GitRoast Arena&apos;s 7-dimensional math engine based on real GitHub GraphQL
            evidence.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            Roast My Portfolio
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 border-t border-border/40 w-full flex items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            100% Real Evidence
          </span>
          <span>•</span>
          <span>Zero Hallucinated Facts</span>
        </div>
      </div>
    </div>
  );
}
