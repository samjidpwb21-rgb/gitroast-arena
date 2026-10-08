"use client";

import React, { useEffect, useReducer, useRef } from "react";
import type { RoastCard, Evidence } from "@/types";
import { Flame, Sparkles } from "lucide-react";
import { ComicRoastPanel, PanelState } from "./ComicRoastPanel";
import { RoastShowController } from "./RoastShowController";
import { audioManager } from "@/lib/audio/audioManager";
import { getReactionForRoast } from "@/lib/audio/reactions";

interface RoastDeckProps {
  roasts: RoastCard[];
  evidenceList: Evidence[];
  onOpenEvidence: (roast: RoastCard) => void;
}

interface ShowState {
  isPlaying: boolean;
  isPaused: boolean;
  currentIndex: number;
  panelState: PanelState;
}

type ShowAction =
  | { type: "START_SHOW" }
  | { type: "PAUSE_SHOW" }
  | { type: "RESUME_SHOW" }
  | { type: "STOP_SHOW" }
  | { type: "SET_PANEL_STATE"; state: PanelState }
  | { type: "NEXT_PANEL"; totalPanels: number }
  | { type: "PLAY_SINGLE_PANEL"; index: number };

const INITIAL_SHOW_STATE: ShowState = {
  isPlaying: false,
  isPaused: false,
  currentIndex: 0,
  panelState: "IDLE",
};

function showReducer(state: ShowState, action: ShowAction): ShowState {
  switch (action.type) {
    case "START_SHOW":
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        currentIndex: 0,
        panelState: "ENTER",
      };

    case "PAUSE_SHOW":
      return {
        ...state,
        isPaused: true,
      };

    case "RESUME_SHOW":
      return {
        ...state,
        isPaused: false,
      };

    case "STOP_SHOW":
      return {
        ...state,
        isPlaying: false,
        isPaused: false,
        panelState: "IDLE",
      };

    case "SET_PANEL_STATE":
      return {
        ...state,
        panelState: action.state,
      };

    case "NEXT_PANEL": {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= action.totalPanels) {
        return {
          ...state,
          isPlaying: false,
          panelState: "DONE",
        };
      }
      return {
        ...state,
        currentIndex: nextIndex,
        panelState: "ENTER",
      };
    }

    case "PLAY_SINGLE_PANEL":
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        currentIndex: action.index,
        panelState: "ENTER",
      };

    default:
      return state;
  }
}

export const RoastDeck: React.FC<RoastDeckProps> = ({ roasts, onOpenEvidence }) => {
  const [showState, dispatch] = useReducer(showReducer, INITIAL_SHOW_STATE);
  const deckRef = useRef<HTMLDivElement>(null);

  // Stop speech/audio on unmount or tab change
  useEffect(() => {
    return () => {
      audioManager.stopAll();
    };
  }, []);

  // Handle panel sequencing when state changes
  useEffect(() => {
    if (!showState.isPlaying || showState.isPaused || !roasts || roasts.length === 0) {
      return;
    }

    const currentRoast = roasts[showState.currentIndex];
    if (!currentRoast) {
      dispatch({ type: "STOP_SHOW" });
      return;
    }

    const reaction = getReactionForRoast(currentRoast.id, currentRoast.severity);

    if (showState.panelState === "ENTER") {
      // Whoosh in sound
      audioManager.playSFX("whoosh");

      // Scroll into view smoothly
      const element = document.getElementById(`comic-panel-${currentRoast.id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Transition to SPEAKING after enter
      const enterTimer = setTimeout(() => {
        dispatch({ type: "SET_PANEL_STATE", state: "SPEAKING" });
      }, 400);

      return () => clearTimeout(enterTimer);
    }

    if (showState.panelState === "SPEAKING") {
      // Play bubble pop
      audioManager.playSFX("pop");

      // Speak roast line
      audioManager.speak(currentRoast.text, {
        onEnd: () => {
          dispatch({ type: "SET_PANEL_STATE", state: "REACTING" });
        },
        onError: () => {
          // Fallback advance on error
          dispatch({ type: "SET_PANEL_STATE", state: "REACTING" });
        },
      });
    }

    if (showState.panelState === "REACTING") {
      // Trigger deterministic SFX (rimshot, sizzle, laugh, etc.)
      audioManager.playSFX(reaction.sfx);

      // Advance to next panel after reaction duration
      const reactionTimer = setTimeout(() => {
        dispatch({ type: "NEXT_PANEL", totalPanels: roasts.length });
      }, 1600);

      return () => clearTimeout(reactionTimer);
    }
  }, [showState.isPlaying, showState.isPaused, showState.currentIndex, showState.panelState, roasts]);

  // Keyboard shortcut handlers when deck has focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      if (!showState.isPlaying) {
        audioManager.toggleSound(true);
        dispatch({ type: "START_SHOW" });
      } else if (showState.isPaused) {
        dispatch({ type: "RESUME_SHOW" });
      } else {
        dispatch({ type: "PAUSE_SHOW" });
        audioManager.stopSpeech();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      audioManager.stopAll();
      dispatch({ type: "STOP_SHOW" });
    } else if (e.key === "ArrowRight") {
      if (showState.isPlaying) {
        e.preventDefault();
        audioManager.stopSpeech();
        dispatch({ type: "NEXT_PANEL", totalPanels: roasts.length });
      }
    }
  };

  if (!roasts || roasts.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-2xl p-8">
        <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold text-lg text-foreground">Clean Bill of Health</h3>
        <p className="text-sm text-muted-foreground mt-1">
          No critical roasts triggered for this profile snapshot. Your repo hygiene is spotless!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={deckRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full flex flex-col gap-6 focus:outline-none"
      role="region"
      aria-label="Comic Roast Show Deck"
    >
      {/* Header section with Roast Deck Title and Show Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              Comic Roast Show
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Brutally honest code reviews delivered panel-by-panel with verifiable facts.
            </p>
          </div>
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-orange-400">
            {roasts.length} {roasts.length === 1 ? "panel" : "panels"}
          </span>
        </div>

        {/* Comic Roast Show Controller Bar */}
        <RoastShowController
          isPlaying={showState.isPlaying}
          isPaused={showState.isPaused}
          currentIndex={showState.currentIndex}
          totalPanels={roasts.length}
          onPlay={() => dispatch({ type: "START_SHOW" })}
          onPause={() => {
            dispatch({ type: "PAUSE_SHOW" });
            audioManager.stopSpeech();
          }}
          onResume={() => dispatch({ type: "RESUME_SHOW" })}
          onStop={() => {
            audioManager.stopAll();
            dispatch({ type: "STOP_SHOW" });
          }}
          onSkip={() => {
            audioManager.stopSpeech();
            dispatch({ type: "NEXT_PANEL", totalPanels: roasts.length });
          }}
        />
      </div>

      {/* Comic Panels Grid: 2 columns on desktop, 1 column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {roasts.map((card, idx) => {
          const isActive = showState.isPlaying && showState.currentIndex === idx;
          return (
            <ComicRoastPanel
              key={card.id}
              card={card}
              index={idx}
              isActive={isActive}
              panelState={isActive ? showState.panelState : "IDLE"}
              onOpenEvidence={onOpenEvidence}
              onReplaySingle={() => {
                audioManager.toggleSound(true);
                dispatch({ type: "PLAY_SINGLE_PANEL", index: idx });
              }}
              onStateTransition={(nextState) => {
                dispatch({ type: "SET_PANEL_STATE", state: nextState });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
