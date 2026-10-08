"use client";

import React, { useState, useEffect, useReducer, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { RescuePlan, RescueAction } from "@/types";
import {
  ArrowUpRight,
  CheckSquare,
  Square,
  Zap,
  Target,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Mascot } from "./Mascot";
import { audioManager } from "@/lib/audio/audioManager";
import { getSupportiveGuidance } from "@/lib/audio/reactions";

interface RescuePlanViewProps {
  rescue: RescuePlan;
  currentScore: number;
}

type GuideState = "IDLE" | "SPEAKING" | "PAUSED" | "DONE";

interface WalkthroughState {
  isPlaying: boolean;
  isPaused: boolean;
  currentIndex: number;
  status: GuideState;
}

type WalkthroughAction =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "STOP" }
  | { type: "NEXT_STEP"; total: number }
  | { type: "SET_STATUS"; status: GuideState }
  | { type: "PLAY_SINGLE"; index: number };

const INITIAL_WALKTHROUGH: WalkthroughState = {
  isPlaying: false,
  isPaused: false,
  currentIndex: 0,
  status: "IDLE",
};

function walkthroughReducer(state: WalkthroughState, action: WalkthroughAction): WalkthroughState {
  switch (action.type) {
    case "START":
      return {
        isPlaying: true,
        isPaused: false,
        currentIndex: 0,
        status: "SPEAKING",
      };
    case "PAUSE":
      return {
        ...state,
        isPaused: true,
        status: "PAUSED",
      };
    case "RESUME":
      return {
        ...state,
        isPaused: false,
        status: "SPEAKING",
      };
    case "STOP":
      return {
        isPlaying: false,
        isPaused: false,
        currentIndex: 0,
        status: "IDLE",
      };
    case "NEXT_STEP": {
      const nextIdx = state.currentIndex + 1;
      if (nextIdx >= action.total) {
        return {
          isPlaying: false,
          isPaused: false,
          currentIndex: 0,
          status: "DONE",
        };
      }
      return {
        ...state,
        currentIndex: nextIdx,
        status: "SPEAKING",
      };
    }
    case "SET_STATUS":
      return {
        ...state,
        status: action.status,
      };
    case "PLAY_SINGLE":
      return {
        isPlaying: true,
        isPaused: false,
        currentIndex: action.index,
        status: "SPEAKING",
      };
    default:
      return state;
  }
}

export const RescuePlanView: React.FC<RescuePlanViewProps> = ({ rescue, currentScore }) => {
  const shouldReduceMotion = useReducedMotion();
  const netGain = rescue.potentialScore - currentScore;

  const [walkthrough, dispatch] = useReducer(walkthroughReducer, INITIAL_WALKTHROUGH);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [soundEnabled, setSoundEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSoundEnabled(audioManager.getSettings().soundEnabled);
    const unsubscribe = audioManager.subscribe((s) => setSoundEnabled(s.soundEnabled));
    return () => {
      unsubscribe();
      audioManager.stopAll();
    };
  }, []);

  // Handle walkthrough step execution
  useEffect(() => {
    if (!walkthrough.isPlaying || walkthrough.isPaused || !rescue.top || rescue.top.length === 0) {
      return;
    }

    const currentAction = rescue.top[walkthrough.currentIndex];
    if (!currentAction) {
      dispatch({ type: "STOP" });
      return;
    }

    if (walkthrough.status === "SPEAKING") {
      // Play uplifting chime
      audioManager.playSFX("chime");

      // Scroll smoothly to active action card
      const el = document.getElementById(`rescue-step-${walkthrough.currentIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Generate warm, encouraging supportive guidance speech
      const speechScript = getSupportiveGuidance(
        currentAction,
        walkthrough.currentIndex,
        rescue.top.length
      );

      audioManager.speak(speechScript, {
        onEnd: () => {
          // Play confirmation chime
          audioManager.playSFX("checkmark");

          // Advance to next step after brief breath pause
          const nextTimer = setTimeout(() => {
            dispatch({ type: "NEXT_STEP", total: rescue.top.length });
          }, 1500);
          return () => clearTimeout(nextTimer);
        },
        onError: () => {
          dispatch({ type: "NEXT_STEP", total: rescue.top.length });
        },
      });
    }
  }, [walkthrough.isPlaying, walkthrough.isPaused, walkthrough.currentIndex, walkthrough.status, rescue.top]);

  const toggleChecklist = (key: string) => {
    setCompletedItems((prev) => {
      const next = !prev[key];
      if (next) {
        audioManager.playSFX("checkmark");
      }
      return { ...prev, [key]: next };
    });
  };

  const handleToggleSound = () => {
    audioManager.toggleSound();
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col gap-6" role="region" aria-label="Rescue Plan">
      {/* Polite Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {walkthrough.isPlaying
          ? `Mentor Guide: Step ${walkthrough.currentIndex + 1} of ${rescue.top.length} - ${
              rescue.top[walkthrough.currentIndex]?.title
            }`
          : "Mentor Guide is idle"}
      </div>

      {/* Potential Score Banner with Teacher Fox Mentor */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950/50 via-zinc-900/90 to-card/80 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-md">
        {/* Subtle background circuit/grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:16px_16px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Teacher Fox Mascot Avatar */}
          <div className="shrink-0 flex flex-col items-center">
            <Mascot
              variant="teacher"
              pose={walkthrough.isPlaying ? "TALKING" : "SMUG_POSE"}
              size={120}
              className="drop-shadow-[0_0_20px_rgba(16,185,129,0.35)]"
            />
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <GraduationCap className="w-3 h-3" />
              Teacher Fox
            </span>
          </div>

          <div className="text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-3 py-1 rounded-md border border-emerald-500/30 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Portfolio Rescue Roadmap
              </span>
              <span className="text-xs font-mono text-zinc-400">Step-by-Step Score Elevation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-2 tracking-tight">
              Actionable Fixes & Recovery Guide
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
              Step-by-step guidance designed to systematically resolve critical bottlenecks and elevate your portfolio readiness score.
            </p>
          </div>
        </div>

        {/* Potential Score Badge Card */}
        <div className="relative z-10 flex items-center gap-4 bg-zinc-950/80 border-2 border-emerald-500/30 rounded-2xl px-5 py-4 shrink-0 shadow-lg">
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-bold">
              Current
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-black text-foreground">{currentScore}</span>
          </div>

          <ArrowUpRight className="w-6 h-6 text-emerald-400 animate-pulse" />

          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block font-bold">
              Target
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-400">{rescue.potentialScore}</span>
          </div>

          <div className="border-l-2 border-zinc-800 pl-4 text-left">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-black text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/40 shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-current" />
              +{netGain} pts
            </span>
            <span className="block text-[10px] font-mono text-muted-foreground mt-1">Projected Gain</span>
          </div>
        </div>
      </div>

      {/* Mentor Walkthrough Controller Bar */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-zinc-950/90 border-2 border-zinc-800 rounded-2xl shadow-md backdrop-blur-md">
        <div className="flex items-center flex-wrap gap-2.5">
          {!walkthrough.isPlaying ? (
            <button
              onClick={() => {
                audioManager.toggleSound(true);
                dispatch({ type: "START" });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              aria-label="Guide Me Through The Plan"
            >
              <Play className="w-4 h-4 fill-current" />
              Guide Me Through The Plan
            </button>
          ) : walkthrough.isPaused ? (
            <button
              onClick={() => dispatch({ type: "RESUME" })}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-emerald-600 transition-all"
              aria-label="Resume Walkthrough"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Resume Guide
            </button>
          ) : (
            <button
              onClick={() => {
                audioManager.stopSpeech();
                dispatch({ type: "PAUSE" });
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-amber-600 transition-all"
              aria-label="Pause Walkthrough"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              Pause Guide
            </button>
          )}

          {walkthrough.isPlaying && (
            <>
              <button
                onClick={() => {
                  audioManager.stopSpeech();
                  dispatch({ type: "NEXT_STEP", total: rescue.top.length });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 text-foreground font-semibold text-xs rounded-lg transition-colors"
                aria-label="Skip to Next Action Step"
              >
                <SkipForward className="w-3.5 h-3.5" />
                Next Step
              </button>

              <button
                onClick={() => {
                  audioManager.stopAll();
                  dispatch({ type: "STOP" });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-rose-500/50 hover:text-rose-400 text-muted-foreground font-semibold text-xs rounded-lg transition-colors"
                aria-label="Stop Walkthrough"
              >
                <Square className="w-3.5 h-3.5" />
                Stop
              </button>

              <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-zinc-900 text-emerald-400 border border-zinc-800 rounded-md">
                Guiding Step {walkthrough.currentIndex + 1} of {rescue.top.length}
              </span>
            </>
          )}
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleToggleSound}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              soundEnabled
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                : "bg-zinc-900 border-zinc-800 text-muted-foreground hover:text-foreground"
            }`}
            aria-label={soundEnabled ? "Mute audio" : "Enable voice narration"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? "Voice ON" : "Voice OFF"}</span>
          </button>
        </div>
      </div>

      {/* Top 3 High Leverage Action Cards */}
      <div className="grid grid-cols-1 gap-5">
        {rescue.top.map((action: RescueAction, idx: number) => {
          const isActive = walkthrough.isPlaying && walkthrough.currentIndex === idx;

          return (
            <motion.div
              id={`rescue-step-${idx}`}
              key={action.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              className={`relative bg-zinc-950/85 backdrop-blur-md border-[2.5px] rounded-2xl p-5 sm:p-7 flex flex-col gap-4 shadow-lg transition-all duration-300 ${
                isActive
                  ? "border-emerald-500 ring-2 ring-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                  : "border-zinc-800/90 hover:border-zinc-700"
              }`}
            >
              {/* Halftone Pattern Accent */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.05] bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:12px_12px]"
                aria-hidden="true"
              />

              {/* Card Header */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-xl font-mono text-sm font-black flex items-center justify-center shrink-0 mt-0.5 border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      isActive
                        ? "bg-emerald-500 text-zinc-950 border-emerald-400"
                        : "bg-zinc-900 border-zinc-700 text-emerald-400"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-base sm:text-xl text-foreground flex items-center gap-2">
                      {action.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-md font-semibold">
                        <Target className="w-3.5 h-3.5" />
                        Target: {action.affectsCategory}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-md">
                        Score: {action.currentScore} ➔ {action.simulatedScore}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Projected Impact & Individual Guide Button */}
                <div className="relative z-10 flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <button
                    onClick={() => {
                      audioManager.toggleSound(true);
                      dispatch({ type: "PLAY_SINGLE", index: idx });
                    }}
                    className="p-1.5 px-2.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-emerald-500/40 text-xs font-mono text-emerald-400 flex items-center gap-1.5 transition-colors"
                    title="Play Mentor Guide for this step"
                    aria-label={`Guide me on ${action.title}`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Guide Me</span>
                  </button>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg font-mono text-xs font-black bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-sm">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    +{action.impact} pts impact
                  </span>
                </div>
              </div>

              {/* Supportive Why statement */}
              <div className="relative z-10 pl-0 sm:pl-11">
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium bg-zinc-900/60 border border-zinc-800/80 p-3.5 rounded-xl">
                  {action.why}
                </p>
              </div>

              {/* Implementation Steps Checklist */}
              {action.steps && action.steps.length > 0 && (
                <div className="relative z-10 pl-0 sm:pl-11 mt-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Action Checklist:
                  </span>
                  <ul className="space-y-2">
                    {action.steps.map((step: string, sIdx: number) => {
                      const itemKey = `${action.id}-step-${sIdx}`;
                      const isChecked = Boolean(completedItems[itemKey]);

                      return (
                        <li key={sIdx}>
                          <button
                            type="button"
                            onClick={() => toggleChecklist(itemKey)}
                            className={`w-full flex items-start gap-3 text-left text-xs sm:text-sm p-2.5 rounded-xl border transition-all cursor-pointer ${
                              isChecked
                                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300 line-through opacity-80"
                                : "bg-zinc-900/40 border-zinc-800/70 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/80"
                            }`}
                            aria-label={`Toggle checklist item: ${step}`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                            )}
                            <span className="leading-snug">{step}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Math Disclaimer Footer */}
      <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-center">
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          {rescue.disclaimer}
        </p>
      </div>
    </div>
  );
};
