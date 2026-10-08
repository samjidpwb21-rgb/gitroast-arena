"use client";

import React from "react";
import { Mascot } from "./Mascot";
import { type AnalysisStage, type MascotPose } from "@/lib/state/machine";
import { CheckCircle2, CircleDashed, Terminal, Search, Cpu, BarChart3, AlertCircle } from "lucide-react";

interface ProgressStreamProps {
  stage: AnalysisStage;
  stageMessage: string;
  mascotPose: MascotPose;
  mascotSpeech: string;
  username: string;
  error?: string | null;
  onRetry?: () => void;
}

interface StageStep {
  key: AnalysisStage;
  label: string;
  desc: string;
  icon: React.ElementType;
}

const STAGES: StageStep[] = [
  {
    key: "validating",
    label: "Input Verification",
    desc: "Validating GitHub handle format and rate-limits",
    icon: Search,
  },
  {
    key: "fetching",
    label: "GraphQL Ingestion",
    desc: "Fetching repositories, stars, commits & READMEs",
    icon: Terminal,
  },
  {
    key: "analyzing",
    label: "Evidence Extraction",
    desc: "Deep inspection of top flagship repositories",
    icon: Cpu,
  },
  {
    key: "scoring",
    label: "Math Engine Scoring",
    desc: "Computing 7 sub-scores & running rescue simulator",
    icon: BarChart3,
  },
];

const STAGE_PERCENT: Record<AnalysisStage, number> = {
  idle: 0,
  validating: 15,
  fetching: 45,
  analyzing: 75,
  scoring: 90,
  ready: 100,
  error: 100,
};

export const ProgressStream: React.FC<ProgressStreamProps> = ({
  stage,
  stageMessage,
  mascotPose,
  mascotSpeech,
  username,
  error,
  onRetry,
}) => {
  const percent = STAGE_PERCENT[stage] ?? 0;
  const currentStageIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <div
      className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8 py-8 px-4"
      role="region"
      aria-label="Analysis Progress"
    >
      {/* Mascot & Speech */}
      <div className="w-full flex justify-center">
        <Mascot pose={mascotPose} speech={mascotSpeech} size={150} />
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {stage !== "error" && stage !== "ready" && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  stage === "error" ? "bg-destructive" : "bg-emerald-500"
                }`}
              />
            </span>
            {stage === "error" ? "Execution Halted" : `Analyzing @${username}`}
          </span>
          <span className="font-mono text-sm font-semibold text-primary">{percent}%</span>
        </div>

        {/* Progress Track */}
        <div
          className="w-full h-2.5 bg-secondary/80 rounded-full overflow-hidden mb-6"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Analysis Progress Percentage"
        >
          <div
            className={`h-full transition-all duration-500 ease-out rounded-full ${
              stage === "error"
                ? "bg-destructive"
                : "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Dynamic status message (announced for screen readers) */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="text-center font-mono text-sm text-foreground/90 font-medium mb-6 min-h-[1.5rem]"
        >
          {error ? (
            <span className="text-destructive flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </span>
          ) : (
            stageMessage || "Preparing analysis environment..."
          )}
        </div>

        {/* Step list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {STAGES.map((s, idx) => {
            const isCompleted = currentStageIndex > idx || stage === "ready";
            const isCurrent = stage === s.key;
            const Icon = s.icon;

            return (
              <div
                key={s.key}
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-colors ${
                  isCurrent
                    ? "bg-primary/5 border-primary/40 shadow-sm"
                    : isCompleted
                    ? "bg-secondary/40 border-border/50 text-muted-foreground"
                    : "bg-card/20 border-border/20 opacity-50"
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <CircleDashed className="w-5 h-5 text-primary animate-spin shrink-0" />
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground/60 shrink-0" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider font-mono ${
                        isCurrent ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {s.label}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Retry Button */}
        {stage === "error" && onRetry && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onRetry}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
