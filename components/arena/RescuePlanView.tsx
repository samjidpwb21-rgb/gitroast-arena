"use client";

import React from "react";
import type { RescuePlan, RescueAction } from "@/types";
import { LifeBuoy, ArrowUpRight, CheckSquare, Zap, Target } from "lucide-react";

interface RescuePlanViewProps {
  rescue: RescuePlan;
  currentScore: number;
}

export const RescuePlanView: React.FC<RescuePlanViewProps> = ({ rescue, currentScore }) => {
  const netGain = rescue.potentialScore - currentScore;

  return (
    <div className="w-full flex flex-col gap-6" role="region" aria-label="Rescue Plan">
      {/* Potential Score Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-card/70 to-card/70 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shrink-0">
            <LifeBuoy className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Actionable Roadmap
              </span>
              <span className="text-xs font-mono text-muted-foreground">Top 3 Highest Leverage Fixes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              Portfolio Rescue Simulator
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-xl">
              Mathematically simulated score improvement by systematically eliminating the most punishing triggers found in your portfolio.
            </p>
          </div>
        </div>

        {/* Potential Score Card */}
        <div className="flex items-center gap-4 bg-background/60 border border-border/80 rounded-xl px-5 py-3.5 shrink-0">
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Current
            </span>
            <span className="font-mono text-2xl font-bold text-foreground">{currentScore}</span>
          </div>

          <ArrowUpRight className="w-5 h-5 text-emerald-500" />

          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 block font-semibold">
              Potential
            </span>
            <span className="font-mono text-2xl font-bold text-emerald-500">{rescue.potentialScore}</span>
          </div>

          <div className="border-l border-border pl-3 text-left">
            <span className="inline-flex items-center gap-0.5 text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              +{netGain} pts
            </span>
            <span className="block text-[10px] font-mono text-muted-foreground mt-0.5">Projected</span>
          </div>
        </div>
      </div>

      {/* Top 3 Actions List */}
      <div className="grid grid-cols-1 gap-4">
        {rescue.top.map((action: RescueAction, idx: number) => {
          return (
            <div
              key={action.id}
              className="bg-card/70 backdrop-blur-sm border border-border/70 rounded-xl p-5 sm:p-6 flex flex-col gap-4 shadow-sm hover:border-border transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-foreground flex items-center gap-2">
                      {action.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                        <Target className="w-3 h-3" />
                        Target: {action.affectsCategory}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        Score: {action.currentScore} → {action.simulatedScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Projected Impact Pill */}
                <div className="shrink-0 self-start sm:self-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-mono text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
                    <Zap className="w-3.5 h-3.5" />
                    +{action.impact} pts impact
                  </span>
                </div>
              </div>

              {/* Why statement */}
              <p className="text-sm text-foreground/80 leading-relaxed pl-10">
                {action.why}
              </p>

              {/* Implementation Steps */}
              {action.steps && action.steps.length > 0 && (
                <div className="pl-10 mt-1">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Action Checklist:
                  </span>
                  <ul className="space-y-1.5">
                    {action.steps.map((step: string, sIdx: number) => (
                      <li
                        key={sIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground"
                      >
                        <CheckSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Math Disclaimer Footer */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 text-center">
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          {rescue.disclaimer}
        </p>
      </div>
    </div>
  );
};
