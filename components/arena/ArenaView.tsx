"use client";

import React, { useReducer, useState, useCallback } from "react";
import type { AnalysisResult, RoastCard, RoastLevel } from "@/types";
import {
  analysisReducer,
  INITIAL_STATE,
} from "@/lib/state/machine";
import { saveSnapshot, getPreviousSnapshot, computeScoreDelta } from "@/lib/state/storage";
import { LandingHero } from "./LandingHero";
import { ProgressStream } from "./ProgressStream";
import { ScoreDashboard } from "./ScoreDashboard";
import { RoastDeck } from "./RoastDeck";
import { RescuePlanView } from "./RescuePlanView";
import { RecruiterView } from "./RecruiterView";
import { EvidenceDrawer } from "./EvidenceDrawer";
import { Mascot } from "./Mascot";
import {
  BarChart2,
  Flame,
  LifeBuoy,
  Briefcase,
  RotateCcw,
  Share2,
  Check,
  Sparkles,
} from "lucide-react";

type ActiveTab = "overview" | "roasts" | "rescue" | "recruiter";

export const ArenaView: React.FC = () => {
  const [state, dispatch] = useReducer(analysisReducer, INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [selectedRoast, setSelectedRoast] = useState<RoastCard | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Compute delta vs previous run
  const previousSnapshot = React.useMemo(() => {
    if (!state.result) return null;
    return getPreviousSnapshot(state.result.metadata.username, state.result.id);
  }, [state.result]);

  const scoreDelta = React.useMemo(() => {
    if (!state.result) return null;
    return computeScoreDelta(state.result.scores.portfolioReadiness, previousSnapshot);
  }, [state.result, previousSnapshot]);

  const handleStartAnalysis = useCallback(
    async (username: string, roastLevel: RoastLevel, targetRole: string) => {
      dispatch({ type: "START_ANALYSIS", username, roastLevel, targetRole });

      // Progressive stage updates for UI feedback
      const timer1 = setTimeout(() => {
        dispatch({
          type: "SET_STAGE",
          stage: "fetching",
          message: "Querying GitHub GraphQL API for repositories and commits...",
        });
      }, 500);

      const timer2 = setTimeout(() => {
        dispatch({
          type: "SET_STAGE",
          stage: "analyzing",
          message: "Inspecting flagship repos and computing facts...",
        });
      }, 1500);

      const timer3 = setTimeout(() => {
        dispatch({
          type: "SET_STAGE",
          stage: "scoring",
          message: "Running 7 sub-score math engines and rescue simulator...",
        });
      }, 2500);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, roastLevel, targetRole }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Analysis failed (${response.status})`);
        }

        const result: AnalysisResult = data.result ?? data;
        saveSnapshot(result);
        dispatch({ type: "ANALYSIS_SUCCESS", result });
        setActiveTab("overview");
      } catch (err: unknown) {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        const errMsg =
          err instanceof Error ? err.message : "Network error. Please try again.";
        dispatch({ type: "ANALYSIS_ERROR", error: errMsg });
      }
    },
    []
  );

  const handleRetry = () => {
    if (state.username) {
      handleStartAnalysis(state.username, state.roastLevel, state.targetRole);
    } else {
      dispatch({ type: "RESET" });
    }
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
    setActiveTab("overview");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOpenEvidence = (roast: RoastCard) => {
    setSelectedRoast(roast);
  };

  const handleCloseEvidence = () => {
    setSelectedRoast(null);
  };

  // Page-level cursor glow
  const cursorX = React.useRef(0);
  const cursorY = React.useRef(0);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  const handlePageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    cursorX.current = e.clientX;
    cursorY.current = e.clientY;
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseMove={handlePageMouseMove}
      className="min-h-screen bg-background text-foreground flex flex-col items-center relative overflow-x-hidden"
    >
      {/* Dynamic Cursor-following Ambient Glow */}
      <div
        className="fixed pointer-events-none -z-10 w-[500px] h-[500px] rounded-full bg-orange-500/8 blur-[120px] transition-all duration-300 ease-out"
        style={{
          left: `${cursorPos.x - 250}px`,
          top: `${cursorPos.y - 250}px`,
        }}
      />

      {/* Main static backdrop */}
      <div className="fixed inset-0 pointer-events-none -z-20 flex items-center justify-center">
        <div className="w-[700px] h-[700px] bg-primary/5 rounded-full blur-[160px]" />
      </div>

      {/* Main App Header */}
      <header className="w-full border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2.5 font-black text-lg sm:text-xl tracking-tight hover:opacity-80 transition-opacity"
          >
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Flame className="w-5 h-5" />
            </span>
            <span>
              Git<span className="text-orange-500">Roast</span> Arena
            </span>
          </button>

          {state.result && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-secondary transition-colors"
                aria-label="Share Analysis Result"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied Link</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Analysis</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stage 1: Landing Form */}
        {state.stage === "idle" && (
          <div className="py-8">
            <LandingHero onSubmit={handleStartAnalysis} isLoading={false} />
          </div>
        )}

        {/* Stage 2: Progress Screen */}
        {(state.stage === "validating" ||
          state.stage === "fetching" ||
          state.stage === "analyzing" ||
          state.stage === "scoring" ||
          state.stage === "error") && (
          <div className="py-12">
            <ProgressStream
              stage={state.stage}
              stageMessage={state.stageMessage}
              mascotPose={state.mascotPose}
              mascotSpeech={state.mascotSpeech}
              username={state.username}
              error={state.error}
              onRetry={handleRetry}
            />
          </div>
        )}

        {/* Stage 3: Ready / Results Dashboard */}
        {state.stage === "ready" && state.result && (
          <div className="flex flex-col gap-8 pb-16">
            {/* Results Header with Mascot & Profile Meta */}
            <div className="bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="flex items-center gap-5">
                <Mascot pose={state.mascotPose} speech={state.mascotSpeech} size="sm" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                      @{state.result.metadata.username}
                    </h1>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 font-bold uppercase">
                      {state.result.metadata.roastLevel} roast
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Analyzed {state.result.facts.totalRepositories} repos •{" "}
                    {state.result.facts.flagshipCount} flagships inspected •{" "}
                    {state.result.facts.totalStars} total stars
                  </p>
                </div>
              </div>

              {/* Quick Re-roast button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleStartAnalysis(
                      state.result!.metadata.username,
                      state.result!.metadata.roastLevel === "spicy"
                        ? "savage"
                        : state.result!.metadata.roastLevel === "savage"
                        ? "brutal"
                        : "spicy",
                      state.targetRole
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase bg-secondary hover:bg-secondary/80 border border-border transition-colors text-foreground"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  Change Heat Level
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav
              className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto"
              aria-label="Analysis Sections"
            >
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  activeTab === "overview"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                Score Overview
              </button>

              <button
                onClick={() => setActiveTab("roasts")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  activeTab === "roasts"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Flame className="w-4 h-4" />
                Roast Deck
                <span className="font-mono text-xs px-1.5 py-0.5 rounded-full bg-background/20">
                  {state.result.roasts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("rescue")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  activeTab === "rescue"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <LifeBuoy className="w-4 h-4" />
                Rescue Plan
                <span className="font-mono text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  +{state.result.rescue.potentialScore - state.result.scores.portfolioReadiness} pts
                </span>
              </button>

              <button
                onClick={() => setActiveTab("recruiter")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                  activeTab === "recruiter"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Recruiter Screening
              </button>
            </nav>

            {/* Tab Views */}
            {activeTab === "overview" && (
              <ScoreDashboard
                score={state.result.scores.portfolioReadiness}
                subScores={state.result.scores}
                verdict={state.result.recruiter.verdict}
                delta={scoreDelta}
                targetRole={state.targetRole}
              />
            )}

            {activeTab === "roasts" && (
              <RoastDeck
                roasts={state.result.roasts}
                evidenceList={state.result.evidence}
                onOpenEvidence={handleOpenEvidence}
              />
            )}

            {activeTab === "rescue" && (
              <RescuePlanView
                rescue={state.result.rescue}
                currentScore={state.result.scores.portfolioReadiness}
              />
            )}

            {activeTab === "recruiter" && (
              <RecruiterView
                recruiter={state.result.recruiter}
                targetRole={state.targetRole}
              />
            )}
          </div>
        )}
      </main>

      {/* Focus-trapped Evidence Drawer */}
      <EvidenceDrawer
        isOpen={selectedRoast !== null}
        onClose={handleCloseEvidence}
        roast={selectedRoast}
        evidenceList={state.result?.evidence ?? []}
      />
    </div>
  );
};
