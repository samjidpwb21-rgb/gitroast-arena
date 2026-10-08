"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { RoastCard, Severity } from "@/types";
import { ROAST_CATEGORIES } from "@/config/roasts";
import { Flame, Sparkles, AlertTriangle, ShieldAlert, ExternalLink, RotateCcw } from "lucide-react";
import { Mascot } from "./Mascot";
import { getReactionForRoast } from "@/lib/audio/reactions";
import type { MascotPose } from "@/lib/state/machine";

export type PanelState = "IDLE" | "ENTER" | "SPEAKING" | "REACTING" | "DONE";

interface ComicRoastPanelProps {
  card: RoastCard;
  index: number;
  isActive: boolean;
  panelState: PanelState;
  onOpenEvidence: (roast: RoastCard) => void;
  onReplaySingle?: (card: RoastCard) => void;
  onStateTransition?: (nextState: PanelState) => void;
}

const SEVERITY_STYLES: Record<
  Severity,
  { label: string; badge: string; border: string; icon: React.ElementType; glow: string }
> = {
  mild: {
    label: "Mild Roast",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
    border: "border-emerald-500/40 hover:border-emerald-500/60",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    icon: Sparkles,
  },
  medium: {
    label: "Medium Heat",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/40",
    border: "border-amber-500/40 hover:border-amber-500/60",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    icon: Flame,
  },
  sharp: {
    label: "Sharp Burn",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/40",
    border: "border-orange-500/40 hover:border-orange-500/60",
    glow: "shadow-[0_0_25px_rgba(249,115,22,0.3)]",
    icon: AlertTriangle,
  },
  savage: {
    label: "Savage Roast",
    badge: "bg-rose-500/15 text-rose-400 border-rose-500/40",
    border: "border-rose-500/40 hover:border-rose-500/60",
    glow: "shadow-[0_0_30px_rgba(244,63,94,0.35)]",
    icon: ShieldAlert,
  },
};

export const ComicRoastPanel: React.FC<ComicRoastPanelProps> = ({
  card,
  index,
  isActive,
  panelState,
  onOpenEvidence,
  onReplaySingle,
  onStateTransition,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const sev = SEVERITY_STYLES[card.severity] ?? SEVERITY_STYLES.medium;
  const SevIcon = sev.icon;
  const catMeta = ROAST_CATEGORIES[card.category];
  const categoryTitle = catMeta?.name ?? card.category.replace(/_/g, " ");

  const reaction = getReactionForRoast(card.id, card.severity);

  // Determine current mascot pose based on state machine
  let currentPose: MascotPose = "SMUG_POSE";
  if (isActive) {
    if (panelState === "SPEAKING") {
      currentPose = "TALKING";
    } else if (panelState === "REACTING" || panelState === "DONE") {
      currentPose = reaction.mascotPose;
    } else if (panelState === "ENTER") {
      currentPose = "SURPRISED";
    }
  } else {
    currentPose = reaction.mascotPose;
  }

  // Typewriter effect state for active speaking mode
  const [displayedChars, setDisplayedChars] = useState(card.text.length);

  useEffect(() => {
    if (isActive && panelState === "SPEAKING" && !shouldReduceMotion) {
      setDisplayedChars(0);
      const totalLen = card.text.length;
      const intervalTime = Math.max(15, Math.min(35, 2000 / totalLen));
      let count = 0;
      const timer = setInterval(() => {
        count += 2;
        if (count >= totalLen) {
          setDisplayedChars(totalLen);
          clearInterval(timer);
        } else {
          setDisplayedChars(count);
        }
      }, intervalTime);
      return () => clearInterval(timer);
    } else {
      setDisplayedChars(card.text.length);
    }
  }, [isActive, panelState, card.text, shouldReduceMotion]);

  // Tilt alternating calculation: -0.75 deg on even, +0.75 deg on odd
  const tiltDeg = shouldReduceMotion ? 0 : index % 2 === 0 ? -0.8 : 0.8;

  // Screen shake animation if savage
  const shakeVariants = {
    shake: {
      x: [0, -6, 6, -4, 4, 0],
      y: [0, 4, -4, 2, -2, 0],
      transition: { duration: 0.4 },
    },
    idle: { x: 0, y: 0 },
  };

  return (
    <motion.div
      id={`comic-panel-${card.id}`}
      style={{
        rotate: `${tiltDeg}deg`,
      }}
      variants={shakeVariants}
      animate={isActive && panelState === "REACTING" && reaction.screenShake && !shouldReduceMotion ? "shake" : "idle"}
      className={`relative group bg-zinc-950/90 border-[3px] border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[6px_6px_0px_0px_rgba(249,115,22,0.25)] ${
        isActive ? `ring-2 ring-primary ${sev.glow}` : "hover:border-zinc-700"
      }`}
    >
      {/* Halftone Comic Dot Pattern Overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.07] bg-[radial-gradient(#f97316_1.5px,transparent_1.5px)] [background-size:12px_12px]"
        aria-hidden="true"
      />

      {/* Comic Panel Header / Caption Box */}
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Panel Category Badge */}
          <div className="px-2.5 py-1 bg-zinc-900 border-2 border-zinc-700 rounded-md font-mono text-xs font-black uppercase tracking-wider text-orange-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            PANEL #{index + 1} &bull; {categoryTitle}
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${sev.badge}`}
          >
            <SevIcon className="w-3 h-3" />
            {sev.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onReplaySingle && (
            <button
              onClick={() => onReplaySingle(card)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-zinc-800 transition-colors"
              title="Replay this roast"
              aria-label={`Replay roast ${index + 1}`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          {card.source === "ai" && (
            <span className="text-[10px] font-mono text-orange-400 bg-orange-950/60 border border-orange-500/30 px-1.5 py-0.5 rounded uppercase font-semibold">
              AI Roast
            </span>
          )}
        </div>
      </div>

      {/* Comic Speech Bubble with Pointing Tail */}
      <div className="relative z-10 my-1">
        <h3 className="font-bold text-sm text-foreground/90 mb-2 flex items-center gap-1.5">
          <span className="text-orange-500 font-mono">❯</span> {card.title}
        </h3>

        {/* The Speech Bubble */}
        <div className="relative bg-zinc-900/95 border-2 border-zinc-700 rounded-2xl p-4 sm:p-4.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.9)] text-foreground">
          {/* Accessible Static Text for Screen Readers */}
          <p className="sr-only">{card.text}</p>

          {/* Animated Visual Text */}
          <p
            className="text-base sm:text-lg font-semibold leading-relaxed tracking-tight italic font-sans"
            aria-hidden="true"
          >
            &ldquo;
            {shouldReduceMotion || !isActive || panelState !== "SPEAKING"
              ? card.text
              : card.text.slice(0, displayedChars)}
            &rdquo;
            {isActive && panelState === "SPEAKING" && displayedChars < card.text.length && (
              <span className="inline-block w-2 h-4 ml-1 bg-orange-500 animate-pulse" />
            )}
          </p>

          {/* Comic Tail directed towards mascot at bottom-right */}
          <div
            className="absolute -bottom-3 right-16 w-0 h-0 border-t-[12px] border-t-zinc-700 border-r-[12px] border-r-transparent border-l-[4px] border-l-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-2.5 right-16 w-0 h-0 border-t-[10px] border-t-zinc-900 border-r-[10px] border-r-transparent border-l-[3px] border-l-transparent"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Panel Bottom Stage: Mascot + Onomatopoeia Burst + Actions */}
      <div className="relative z-10 pt-2 border-t border-zinc-800/80 flex items-end justify-between gap-2">
        {/* Left Side: Rule + Evidence Trigger */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-mono text-muted-foreground">
            Vector Rule: <span className="text-zinc-300 font-semibold">{card.category}</span>
          </span>

          <button
            onClick={() => onOpenEvidence(card)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors py-1 px-2.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 w-fit"
            aria-label={`Why am I roasted? View verifiable evidence for ${categoryTitle}`}
          >
            Why am I roasted?
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Right Side: Comic Fox Mascot & Onomatopoeia Sticker */}
        <div className="relative flex items-end justify-end -mb-2 -mr-1">
          {/* Onomatopoeia Burst Sticker */}
          {reaction.onomatopoeia && (card.severity === "sharp" || card.severity === "savage") && (
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: index % 2 === 0 ? -12 : 14 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute -top-6 -left-8 z-20"
              aria-hidden="true"
            >
              <div className="relative px-2.5 py-1 bg-amber-400 text-zinc-950 border-2 border-zinc-950 font-black text-xs sm:text-sm tracking-wider uppercase rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {reaction.onomatopoeia}
              </div>
            </motion.div>
          )}

          {/* Embedded Mascot inside comic panel */}
          <Mascot
            pose={currentPose}
            size={90}
            className="transition-transform duration-300"
            onAnimationComplete={() => {
              if (isActive && panelState === "ENTER") {
                onStateTransition?.("SPEAKING");
              } else if (isActive && panelState === "REACTING") {
                onStateTransition?.("DONE");
              }
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};
