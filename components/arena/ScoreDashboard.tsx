"use client";

import React from "react";
import { motion } from "framer-motion";
import type { CategoryScores } from "@/types";
import { CATEGORY_WEIGHTS } from "@/config/scoring";
import {
  Code2,
  BookOpen,
  Activity,
  Layers,
  UserCheck,
  FolderGit2,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface ScoreDashboardProps {
  score: number;
  subScores: CategoryScores;
  verdict: string;
  delta?: { delta: number; text: string } | null;
  targetRole?: string;
}

interface SubScoreConfig {
  key: keyof CategoryScores;
  title: string;
  weight: number;
  icon: React.ElementType;
  description: string;
  colorClass: string;
  barColor: string;
}

const SUB_SCORE_MAP: SubScoreConfig[] = [
  {
    key: "projectQuality",
    title: "Project Quality",
    weight: Math.round(CATEGORY_WEIGHTS.projectQuality * 100),
    icon: Code2,
    description: "Architecture, automated tests, CI workflows & commit hygiene",
    colorClass: "text-blue-500",
    barColor: "bg-blue-500",
  },
  {
    key: "documentation",
    title: "Documentation",
    weight: Math.round(CATEGORY_WEIGHTS.documentation * 100),
    icon: BookOpen,
    description: "README quality, live demo links, setup guides & badges",
    colorClass: "text-emerald-500",
    barColor: "bg-emerald-500",
  },
  {
    key: "activity",
    title: "Activity & Cadence",
    weight: Math.round(CATEGORY_WEIGHTS.activity * 100),
    icon: Activity,
    description: "Commit distribution, streak consistency & recent pushes",
    colorClass: "text-amber-500",
    barColor: "bg-amber-500",
  },
  {
    key: "technicalBreadth",
    title: "Technical Breadth",
    weight: Math.round(CATEGORY_WEIGHTS.technicalBreadth * 100),
    icon: Layers,
    description: "Language ecosystem diversity & modern tech stack usage",
    colorClass: "text-purple-500",
    barColor: "bg-purple-500",
  },
  {
    key: "profile",
    title: "Profile Curation",
    weight: Math.round(CATEGORY_WEIGHTS.profile * 100),
    icon: UserCheck,
    description: "Bio, social links, profile README & pinned showcase repos",
    colorClass: "text-pink-500",
    barColor: "bg-pink-500",
  },
  {
    key: "portfolioCuration",
    title: "Portfolio Hygiene",
    weight: Math.round(CATEGORY_WEIGHTS.portfolioCuration * 100),
    icon: FolderGit2,
    description: "Flagship clarity, fork clutter filtering & naming structure",
    colorClass: "text-indigo-500",
    barColor: "bg-indigo-500",
  },
  {
    key: "projectImpact",
    title: "Project Impact",
    weight: Math.round(CATEGORY_WEIGHTS.projectImpact * 100),
    icon: Flame,
    description: "Community stars, forks, releases & external adoption signals",
    colorClass: "text-rose-500",
    barColor: "bg-rose-500",
  },
];

function getScoreTone(score: number): {
  badgeText: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  strokeColor: string;
} {
  if (score >= 85) {
    return {
      badgeText: "CHEF'S KISS",
      badgeBg: "bg-emerald-500/10",
      badgeBorder: "border-emerald-500/30",
      textColor: "text-emerald-500",
      strokeColor: "#10b981",
    };
  } else if (score >= 70) {
    return {
      badgeText: "SOLID FOUNDATION",
      badgeBg: "bg-blue-500/10",
      badgeBorder: "border-blue-500/30",
      textColor: "text-blue-500",
      strokeColor: "#3b82f6",
    };
  } else if (score >= 50) {
    return {
      badgeText: "NEEDS REFINEMENT",
      badgeBg: "bg-amber-500/10",
      badgeBorder: "border-amber-500/30",
      textColor: "text-amber-500",
      strokeColor: "#f59e0b",
    };
  } else {
    return {
      badgeText: "NEEDS CPR",
      badgeBg: "bg-rose-500/10",
      badgeBorder: "border-rose-500/30",
      textColor: "text-rose-500",
      strokeColor: "#f43f5e",
    };
  }
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({
  score,
  subScores,
  verdict,
  delta,
  targetRole,
}) => {
  const tone = getScoreTone(score);

  // SVG Gauge Calculations
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="w-full flex flex-col gap-6" role="region" aria-label="Score Overview">
      {/* Main Hero Card */}
      <div className="bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: tone.strokeColor }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Radial Score Gauge */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg height={radius * 2 + 20} width={radius * 2 + 20} className="-rotate-90">
                {/* Background track */}
                <circle
                  stroke="hsl(var(--secondary))"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  r={normalizedRadius}
                  cx={radius + 10}
                  cy={radius + 10}
                />
                {/* Score arc */}
                <motion.circle
                  stroke={tone.strokeColor}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference} ${circumference}`}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  strokeLinecap="round"
                  r={normalizedRadius}
                  cx={radius + 10}
                  cy={radius + 10}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="font-mono text-5xl font-black tracking-tight text-foreground"
                >
                  {score}
                </motion.span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                  out of 100
                </span>
              </div>
            </div>
          </div>

          {/* Verdict & Role Details */}
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${tone.badgeBg} ${tone.badgeBorder} ${tone.textColor}`}
              >
                {tone.badgeText}
              </span>

              {delta && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
                    delta.delta > 0
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                      : delta.delta < 0
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
                      : "bg-secondary border-border text-muted-foreground"
                  }`}
                >
                  {delta.delta > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : delta.delta < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                  {delta.text}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Portfolio Readiness: <span className={tone.textColor}>{verdict}</span>
            </h2>

            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Calculated deterministically by GitRoast Arena math engine across 7 strict portfolio
              dimensions with no LLM hallucination in the scoring layer.
              {targetRole && (
                <span className="block mt-1 font-mono text-xs text-primary">
                  Evaluated with target role perspective: &ldquo;{targetRole}&rdquo;
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 7 Sub-Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUB_SCORE_MAP.map((sub) => {
          const subScore = subScores[sub.key] ?? 0;
          const Icon = sub.icon;

          return (
            <div
              key={sub.key}
              className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl p-5 hover:border-border transition-colors flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg bg-secondary/80 ${sub.colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{sub.title}</h3>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Weight: {sub.weight}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xl font-bold text-foreground">
                      {subScore}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">/100</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {sub.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div
                className="w-full h-2 bg-secondary rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={subScore}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${sub.title} score`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${subScore}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${sub.barColor}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
