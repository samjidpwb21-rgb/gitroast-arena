"use client";

import React, { useEffect, useReducer, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { AnalysisResult } from "@/types";
import { Mascot } from "./Mascot";
import { audioManager } from "@/lib/audio/audioManager";
import { selectWelcomeRoast, SelectedWelcomeResult } from "@/lib/mascot/selectWelcome";
import type { MascotPose } from "@/lib/state/machine";
import { RotateCcw, ChevronDown, SkipForward } from "lucide-react";

interface WelcomeRoastProps {
  result: AnalysisResult;
  scoreDelta?: { delta: number; text?: string } | null;
}

type WelcomeStep = "WELCOME" | "REACTION" | "CLOSING" | "DONE";

interface WelcomeState {
  currentResultId: string | null;
  step: WelcomeStep;
  data: SelectedWelcomeResult | null;
  displayedText: string;
}

type WelcomeAction =
  | { type: "INIT"; resultId: string; data: SelectedWelcomeResult }
  | { type: "SET_STEP"; step: WelcomeStep; text: string }
  | { type: "SKIP" }
  | { type: "REPLAY" };

function welcomeReducer(state: WelcomeState, action: WelcomeAction): WelcomeState {
  switch (action.type) {
    case "INIT":
      if (state.currentResultId === action.resultId) {
        return state; // Do not restart if already initialized for this result
      }
      return {
        currentResultId: action.resultId,
        step: "WELCOME",
        data: action.data,
        displayedText: action.data.roastLine,
      };

    case "SET_STEP":
      return {
        ...state,
        step: action.step,
        displayedText: action.text,
      };

    case "SKIP":
      return {
        ...state,
        step: "DONE",
        displayedText: state.data ? state.data.closingLine : state.displayedText,
      };

    case "REPLAY":
      return {
        ...state,
        step: "WELCOME",
        displayedText: state.data ? state.data.roastLine : state.displayedText,
      };

    default:
      return state;
  }
}

export const WelcomeRoast: React.FC<WelcomeRoastProps> = ({ result, scoreDelta }) => {
  const shouldReduceMotion = useReducedMotion();
  const [state, dispatch] = useReducer(welcomeReducer, {
    currentResultId: null,
    step: "WELCOME",
    data: null,
    displayedText: "",
  });

  const hasInitialized = useRef(false);

  // Initialize once per result ID
  useEffect(() => {
    if (!result || state.currentResultId === result.id) return;
    const selected = selectWelcomeRoast(result, scoreDelta);
    dispatch({ type: "INIT", resultId: result.id, data: selected });
    hasInitialized.current = true;
  }, [result, scoreDelta, state.currentResultId]);

  // Clean up audio / speech on unmount
  useEffect(() => {
    return () => {
      audioManager.stopSpeech();
    };
  }, []);

  const isSpeakingRef = useRef(false);

  // Determine current mascot pose based on step and tier
  const tier = state.data?.tier ?? "decent";
  let currentPose: MascotPose = "SMUG_POSE";

  if (state.step === "WELCOME") {
    if (tier === "critical" || tier === "rough") currentPose = "SURPRISED";
    else if (tier === "needsWork") currentPose = "SMIRK";
    else if (tier === "decent") currentPose = "SMUG_POSE";
    else if (tier === "strong") currentPose = "SURPRISED";
    else if (tier === "elite") currentPose = "SMUG_POSE";
    else currentPose = "SHRUG";
  } else if (state.step === "REACTION") {
    if (tier === "critical" || tier === "rough") currentPose = "LAUGH_SARCASTIC";
    else if (tier === "needsWork") currentPose = "SMIRK";
    else if (tier === "decent") currentPose = "SMIRK";
    else if (tier === "strong") currentPose = "SMIRK";
    else if (tier === "elite") currentPose = "SMUG_POSE";
    else currentPose = "SHRUG";
  } else if (state.step === "CLOSING" || state.step === "DONE") {
    currentPose = isSpeakingRef.current ? "TALKING" : "SMUG_POSE";
  }

  // Sequence driver based on step changes
  useEffect(() => {
    if (!state.data) return;

    if (state.step === "WELCOME") {
      isSpeakingRef.current = true;
      audioManager.speak(state.data.roastLine, {
        onEnd: () => {
          isSpeakingRef.current = false;
          dispatch({ type: "SET_STEP", step: "REACTION", text: state.data!.roastLine });
        },
        onError: () => {
          isSpeakingRef.current = false;
          dispatch({ type: "SET_STEP", step: "REACTION", text: state.data!.roastLine });
        },
      });
    } else if (state.step === "REACTION") {
      // Trigger subtle reaction audio
      if (tier === "critical" || tier === "rough") {
        audioManager.playSFX("laugh_sarcastic");
      } else if (tier === "needsWork" || tier === "decent") {
        audioManager.playSFX("smirk");
      } else if (tier === "strong" || tier === "elite") {
        audioManager.playSFX("pop");
      }

      // Transition to CLOSING beat
      const timer = setTimeout(() => {
        dispatch({ type: "SET_STEP", step: "CLOSING", text: state.data!.closingLine });
      }, 1200);

      return () => clearTimeout(timer);
    } else if (state.step === "CLOSING") {
      isSpeakingRef.current = true;
      audioManager.speak(state.data.closingLine, {
        onEnd: () => {
          isSpeakingRef.current = false;
          dispatch({ type: "SET_STEP", step: "DONE", text: state.data!.closingLine });
        },
        onError: () => {
          isSpeakingRef.current = false;
          dispatch({ type: "SET_STEP", step: "DONE", text: state.data!.closingLine });
        },
      });
    }
  }, [state.step, state.data, tier]);

  const handleReplay = () => {
    audioManager.stopSpeech();
    dispatch({ type: "REPLAY" });
  };

  const handleSkip = () => {
    audioManager.stopSpeech();
    dispatch({ type: "SKIP" });
  };

  if (!state.data) return null;

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Accessible speech live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {state.displayedText}
      </div>

      {/* Speech Bubble Container */}
      <div className="relative max-w-sm sm:max-w-md px-4 py-3 mb-2 rounded-2xl bg-zinc-950/95 border-2 border-orange-500/60 text-foreground shadow-2xl backdrop-blur-md text-center">
        {/* Visual Animated Text */}
        <p className="text-xs sm:text-sm font-semibold leading-snug tracking-tight text-foreground/95">
          &ldquo;{state.displayedText}&rdquo;
        </p>

        {/* Bubble Tail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-orange-500/80" />

        {/* Quick Controls: Replay & Skip */}
        <div className="absolute -top-3.5 right-2 flex items-center gap-1 bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded-full shadow-sm text-[10px] font-mono">
          <button
            onClick={handleReplay}
            className="p-1 text-muted-foreground hover:text-orange-400 transition-colors"
            title="Replay Welcome Roast"
            aria-label="Replay Welcome Roast"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          {state.step !== "DONE" && (
            <button
              onClick={handleSkip}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Skip to Scoreboard"
              aria-label="Skip to Scoreboard"
            >
              <SkipForward className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Subtle bouncing indicator pointing down to the scoreboard during closing */}
      {(state.step === "CLOSING" || state.step === "DONE") && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, 4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center -mt-1 mb-1 text-orange-400"
          aria-hidden="true"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      )}

      {/* Embedded Mascot with dynamic pose and pointing gesture */}
      <Mascot
        pose={currentPose}
        size="sm"
        onAnimationComplete={() => {
          if (state.step === "WELCOME" && !audioManager.getSettings().soundEnabled) {
            dispatch({ type: "SET_STEP", step: "REACTION", text: state.data!.roastLine });
          }
        }}
      />
    </div>
  );
};
