"use client";

import React from "react";
import type { RecruiterSummary, RecruiterVerdict } from "@/types";
import { Briefcase, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface RecruiterViewProps {
  recruiter: RecruiterSummary;
  targetRole?: string;
}

const VERDICT_CONFIG: Record<
  RecruiterVerdict,
  { label: string; bg: string; border: string; text: string }
> = {
  strong: {
    label: "STRONG HIRE / TOP CANDIDATE",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-500",
  },
  promising: {
    label: "PROMISING CANDIDATE",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-500",
  },
  "needs-work": {
    label: "NEEDS PORTFOLIO WORK",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-500",
  },
  "insufficient-data": {
    label: "INSUFFICIENT PUBLIC DATA",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-500",
  },
};

export const RecruiterView: React.FC<RecruiterViewProps> = ({ recruiter, targetRole }) => {
  const verdictCfg = VERDICT_CONFIG[recruiter.verdict] ?? VERDICT_CONFIG["needs-work"];

  return (
    <div className="w-full flex flex-col gap-6" role="region" aria-label="Recruiter Summary">
      {/* Executive Summary Card */}
      <div className="bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Recruiter Screening Summary
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Objective evaluation from a technical hiring manager & talent scout perspective.
              </p>
            </div>
          </div>

          <span
            className={`self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${verdictCfg.bg} ${verdictCfg.border} ${verdictCfg.text}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {verdictCfg.label}
          </span>
        </div>

        {/* Headline & Target Role */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Executive Summary:
          </span>
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-sans font-medium">
            {recruiter.headline}
          </p>
          {targetRole && (
            <div className="p-3 rounded-lg bg-secondary/40 border border-border/40 text-xs font-mono text-muted-foreground">
              Candidate target role context: <span className="text-primary font-semibold">{targetRole}</span>
            </div>
          )}
        </div>
      </div>

      {/* Strengths and Concerns 2-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Strengths */}
        <div className="bg-card/60 border border-emerald-500/20 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-500 font-semibold text-base border-b border-border/40 pb-3">
            <CheckCircle2 className="w-5 h-5" />
            <h3>Key Strengths</h3>
            <span className="ml-auto font-mono text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">
              {recruiter.strengths.length}
            </span>
          </div>

          <ul className="space-y-3">
            {recruiter.strengths.map((str: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs sm:text-sm text-foreground/90"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Concerns */}
        <div className="bg-card/60 border border-amber-500/20 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-base border-b border-border/40 pb-3">
            <AlertCircle className="w-5 h-5" />
            <h3>Portfolio Flags & Concerns</h3>
            <span className="ml-auto font-mono text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">
              {recruiter.concerns.length}
            </span>
          </div>

          <ul className="space-y-3">
            {recruiter.concerns.map((con: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs sm:text-sm text-foreground/90"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
