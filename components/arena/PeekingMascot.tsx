"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type PeekPosition =
  | "top"
  | "top-left"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left";

const POSITIONS: PeekPosition[] = [
  "top",
  "top-left",
  "top-right",
  "right" as PeekPosition,
  "bottom-right" as PeekPosition,
  "bottom" as PeekPosition,
  "bottom-left" as PeekPosition,
  "left" as PeekPosition,
];

interface PositionConfig {
  style: React.CSSProperties;
  initial: { x: number; y: number; rotate: number; opacity: number; scale: number };
  animate: { x: number; y: number; rotate: number; opacity: number; scale: number };
  exit: { x: number; y: number; rotate: number; opacity: number; scale: number };
}

const POSITION_CONFIGS: Record<PeekPosition, PositionConfig> = {
  top: {
    style: { top: 0, left: "50%", transform: "translate(-50%, -100%)" },
    initial: { x: 0, y: 55, rotate: 0, opacity: 0, scale: 0.8 },
    animate: { x: 0, y: 12, rotate: 0, opacity: 1, scale: 1 },
    exit: { x: 0, y: 55, rotate: 0, opacity: 0, scale: 0.8 },
  },
  "top-left": {
    style: { top: 0, left: "12%", transform: "translate(-50%, -100%)" },
    initial: { x: 20, y: 45, rotate: -25, opacity: 0, scale: 0.8 },
    animate: { x: 0, y: 15, rotate: -15, opacity: 1, scale: 1 },
    exit: { x: 20, y: 45, rotate: -25, opacity: 0, scale: 0.8 },
  },
  "top-right": {
    style: { top: 0, right: "12%", transform: "translate(50%, -100%)" },
    initial: { x: -20, y: 45, rotate: 25, opacity: 0, scale: 0.8 },
    animate: { x: 0, y: 15, rotate: 15, opacity: 1, scale: 1 },
    exit: { x: -20, y: 45, rotate: 25, opacity: 0, scale: 0.8 },
  },
  right: {
    style: { top: "50%", right: 0, transform: "translate(100%, -50%)" },
    initial: { x: -50, y: 0, rotate: 75, opacity: 0, scale: 0.8 },
    animate: { x: -10, y: 0, rotate: 70, opacity: 1, scale: 1 },
    exit: { x: -50, y: 0, rotate: 75, opacity: 0, scale: 0.8 },
  },
  "bottom-right": {
    style: { bottom: 0, right: "15%", transform: "translate(50%, 100%)" },
    initial: { x: -20, y: -45, rotate: 150, opacity: 0, scale: 0.8 },
    animate: { x: 0, y: -15, rotate: 160, opacity: 1, scale: 1 },
    exit: { x: -20, y: -45, rotate: 150, opacity: 0, scale: 0.8 },
  },
  bottom: {
    style: { bottom: 0, left: "50%", transform: "translate(-50%, 100%)" },
    initial: { x: 0, y: -50, rotate: 180, opacity: 0, scale: 0.8 },
    animate: { x: 0, y: -15, rotate: 180, opacity: 1, scale: 1 },
    exit: { x: 0, y: -50, rotate: 180, opacity: 0, scale: 0.8 },
  },
  "bottom-left": {
    style: { bottom: 0, left: "15%", transform: "translate(-50%, 100%)" },
    initial: { x: 20, y: -45, rotate: -150, opacity: 0, scale: 0.8 },
    animate: { x: 0, y: -15, rotate: -160, opacity: 1, scale: 1 },
    exit: { x: 20, y: -45, rotate: -150, opacity: 0, scale: 0.8 },
  },
  left: {
    style: { top: "50%", left: 0, transform: "translate(-100%, -50%)" },
    initial: { x: 50, y: 0, rotate: -75, opacity: 0, scale: 0.8 },
    animate: { x: 10, y: 0, rotate: -70, opacity: 1, scale: 1 },
    exit: { x: 50, y: 0, rotate: -75, opacity: 0, scale: 0.8 },
  },
};

const PEEK_SPEECHES = [
  "Psst... I see uncommitted code!",
  "Who's getting roasted today? 👀",
  "Checking your commit hygiene...",
  "Nice keyboard! Now type a handle.",
  "Did you push to main again?",
  "Looking for flagships...",
];

export const PeekingMascot: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [currentPos, setCurrentPos] = useState<PeekPosition>("top");
  const [isVisible, setIsVisible] = useState(false);
  const [isSpotted, setIsSpotted] = useState(false);
  const [speech, setSpeech] = useState<string | null>(null);

  const triggerNextPeek = useCallback(() => {
    // Pick a new random position different from the current
    const available = POSITIONS.filter((p) => p !== currentPos);
    const nextPos = available[Math.floor(Math.random() * available.length)] ?? "top";
    const randomSpeech =
      Math.random() > 0.4
        ? PEEK_SPEECHES[Math.floor(Math.random() * PEEK_SPEECHES.length)] ?? null
        : null;

    setCurrentPos(nextPos);
    setSpeech(randomSpeech);
    setIsSpotted(false);
    setIsVisible(true);
  }, [currentPos]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let timeoutId: NodeJS.Timeout;

    if (isVisible) {
      // Stay visible for 2.5 to 4 seconds, then hide
      const duration = isSpotted ? 800 : 2500 + Math.random() * 1500;
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, duration);
    } else {
      // Stay hidden for 2 to 4 seconds, then peek out again
      const waitTime = 1800 + Math.random() * 2200;
      timeoutId = setTimeout(() => {
        triggerNextPeek();
      }, waitTime);
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible, isSpotted, shouldReduceMotion, triggerNextPeek]);

  // When user hovers near or clicks the peeking mascot
  const handleSpot = () => {
    if (!isSpotted) {
      setIsSpotted(true);
      setSpeech("Eep! Spotted! 💨");
      setTimeout(() => {
        setIsVisible(false);
      }, 700);
    }
  };

  if (shouldReduceMotion) return null;

  const cfg = POSITION_CONFIGS[currentPos];

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={currentPos}
            style={cfg.style}
            initial={cfg.initial}
            animate={
              isSpotted
                ? {
                    ...cfg.animate,
                    scale: 1.15,
                    y: cfg.animate.y - 8,
                    transition: { duration: 0.15 },
                  }
                : cfg.animate
            }
            exit={cfg.exit}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 20,
            }}
            className="absolute pointer-events-auto cursor-pointer select-none group"
            onClick={handleSpot}
            onMouseEnter={handleSpot}
            title="Click or hover to startle the mascot!"
          >
            {/* Small speech bubble if talking */}
            {speech && !isSpotted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className={`absolute whitespace-nowrap px-2.5 py-1 rounded-lg bg-card/95 border border-primary/40 text-[11px] font-mono font-bold text-foreground shadow-lg backdrop-blur-sm z-20 ${
                  currentPos.includes("bottom")
                    ? "top-full mt-1.5 left-1/2 -translate-x-1/2"
                    : currentPos.includes("right")
                    ? "right-full mr-2 top-0"
                    : currentPos.includes("left")
                    ? "left-full ml-2 top-0"
                    : "bottom-full mb-1.5 left-1/2 -translate-x-1/2"
                }`}
              >
                {speech}
              </motion.div>
            )}

            {/* Peeking Hyena Head & Paws */}
            <div className="relative w-28 h-24 flex items-center justify-center filter drop-shadow-md group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 160 140"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ears */}
                <circle
                  cx="40"
                  cy="45"
                  r="24"
                  fill="#B45309"
                  stroke="#78350F"
                  strokeWidth="3.5"
                />
                <circle cx="40" cy="45" r="14" fill="#FDE68A" />

                <circle
                  cx="120"
                  cy="45"
                  r="24"
                  fill="#B45309"
                  stroke="#78350F"
                  strokeWidth="3.5"
                />
                <circle cx="120" cy="45" r="14" fill="#FDE68A" />

                {/* Mohawk hair spikes */}
                <path
                  d="M65 30 L80 10 L95 30 L110 15 L115 38 Z"
                  fill="#78350F"
                />

                {/* Head Body */}
                <path
                  d="M40 70 C40 40, 120 40, 120 70 C125 100, 115 115, 80 120 C45 115, 35 100, 40 70 Z"
                  fill="#F59E0B"
                  stroke="#78350F"
                  strokeWidth="3.5"
                />

                {/* Cheek Tuft Details */}
                <path d="M35 75 L22 82 L34 88 Z" fill="#D97706" />
                <path d="M125 75 L138 82 L126 88 Z" fill="#D97706" />

                {/* Eyes - Wide looking eyes */}
                <g className="animate-pulse">
                  {/* Left Eye */}
                  <ellipse cx="62" cy="70" rx="12" ry="14" fill="#FFFFFF" stroke="#78350F" strokeWidth="2.5" />
                  <ellipse
                    cx={isSpotted ? "62" : "65"}
                    cy={isSpotted ? "68" : "70"}
                    rx="6"
                    ry="7"
                    fill="#1E293B"
                  />
                  <circle cx={isSpotted ? "60" : "67"} cy={isSpotted ? "66" : "68"} r="2.5" fill="#FFFFFF" />

                  {/* Right Eye */}
                  <ellipse cx="98" cy="70" rx="12" ry="14" fill="#FFFFFF" stroke="#78350F" strokeWidth="2.5" />
                  <ellipse
                    cx={isSpotted ? "98" : "101"}
                    cy={isSpotted ? "68" : "70"}
                    rx="6"
                    ry="7"
                    fill="#1E293B"
                  />
                  <circle cx={isSpotted ? "96" : "103"} cy={isSpotted ? "66" : "68"} r="2.5" fill="#FFFFFF" />
                </g>

                {/* Eyebrows (surprised or playful) */}
                {isSpotted ? (
                  <>
                    <path d="M50 50 Q62 44 72 52" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                    <path d="M110 50 Q98 44 88 52" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <path d="M52 54 Q64 48 72 54" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M108 54 Q96 48 88 54" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                )}

                {/* Snout & Nose */}
                <ellipse cx="80" cy="94" rx="18" ry="12" fill="#FDE68A" stroke="#78350F" strokeWidth="2.5" />
                <path
                  d="M72 88 C74 86, 86 86, 88 88 C89 92, 85 96, 80 97 C75 96, 71 92, 72 88 Z"
                  fill="#1E293B"
                />

                {/* Grin / Smirk */}
                {isSpotted ? (
                  <ellipse cx="80" cy="102" rx="6" ry="4" fill="#78350F" />
                ) : (
                  <path
                    d="M70 98 Q80 106 90 98"
                    stroke="#78350F"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}

                {/* Tiny Peeking Paws over edge */}
                <g>
                  {/* Left Paw */}
                  <rect
                    x="36"
                    y="115"
                    width="26"
                    height="18"
                    rx="8"
                    fill="#F59E0B"
                    stroke="#78350F"
                    strokeWidth="3"
                  />
                  <line x1="44" y1="123" x2="44" y2="131" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                  <line x1="52" y1="123" x2="52" y2="131" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

                  {/* Right Paw */}
                  <rect
                    x="98"
                    y="115"
                    width="26"
                    height="18"
                    rx="8"
                    fill="#F59E0B"
                    stroke="#78350F"
                    strokeWidth="3"
                  />
                  <line x1="106" y1="123" x2="106" y2="131" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                  <line x1="114" y1="123" x2="114" y2="131" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
