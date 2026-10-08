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
  "top-right",
  "right",
  "bottom-right",
  "bottom",
  "bottom-left",
  "left",
  "top-left",
];

const PEEK_SPEECHES = [
  "Psst... Got clean commits? 👀",
  "Who's getting roasted today? 🔥",
  "Let's see that git log...",
  "Type your handle if you dare 😈",
  "Did you push straight to main? 🚨",
  "Looking for flagships... 🔎",
  "Ready to judge your repos! 🍿",
];

export const PeekingMascot: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [currentPos, setCurrentPos] = useState<PeekPosition>("top");
  const [isVisible, setIsVisible] = useState(true);
  const [isSpotted, setIsSpotted] = useState(false);
  const [speech, setSpeech] = useState<string | null>("Psst... Enter a GitHub handle! 🔥");

  const triggerNextPeek = useCallback(() => {
    setCurrentPos((prev) => {
      const available = POSITIONS.filter((p) => p !== prev);
      return available[Math.floor(Math.random() * available.length)] ?? "top";
    });

    const randomSpeech =
      Math.random() > 0.35
        ? PEEK_SPEECHES[Math.floor(Math.random() * PEEK_SPEECHES.length)] ?? null
        : null;

    setSpeech(randomSpeech);
    setIsSpotted(false);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isVisible) {
      // Stay visible for 3.5 to 5.5 seconds, then duck behind card
      const duration = isSpotted ? 700 : 3800 + Math.random() * 1500;
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, duration);
    } else {
      // Stay hidden behind card for 1.5 to 2.5 seconds, then pop out in a new spot
      const waitTime = 1600 + Math.random() * 1400;
      timeoutId = setTimeout(() => {
        triggerNextPeek();
      }, waitTime);
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible, isSpotted, triggerNextPeek]);

  // Startle reaction when clicked or hovered
  const handleSpot = () => {
    if (!isSpotted) {
      setIsSpotted(true);
      setSpeech("Whoa! Spotted! 💨");
      setTimeout(() => {
        setIsVisible(false);
      }, 550);
    }
  };

  // Coordinates strictly placing mascot BEHIND the card edges
  const getPositionClasses = (pos: PeekPosition) => {
    switch (pos) {
      case "top":
        return {
          container: "top-0 left-1/2 -translate-x-1/2 -translate-y-[68%]",
          initial: { y: 120, opacity: 0, scale: 0.85 },
          animate: { y: 0, opacity: 1, scale: 1 },
          exit: { y: 120, opacity: 0, scale: 0.85 },
          speechPos: "bottom-full mb-3 left-1/2 -translate-x-1/2",
        };
      case "top-left":
        return {
          container: "top-0 left-6 -translate-x-[20%] -translate-y-[65%] -rotate-12",
          initial: { y: 120, x: 60, opacity: 0, scale: 0.85 },
          animate: { y: 0, x: 0, opacity: 1, scale: 1 },
          exit: { y: 120, x: 60, opacity: 0, scale: 0.85 },
          speechPos: "bottom-full mb-3 left-0",
        };
      case "top-right":
        return {
          container: "top-0 right-6 translate-x-[20%] -translate-y-[65%] rotate-12",
          initial: { y: 120, x: -60, opacity: 0, scale: 0.85 },
          animate: { y: 0, x: 0, opacity: 1, scale: 1 },
          exit: { y: 120, x: -60, opacity: 0, scale: 0.85 },
          speechPos: "bottom-full mb-3 right-0",
        };
      case "right":
        return {
          container: "top-1/2 right-0 translate-x-[62%] -translate-y-1/2 rotate-[80deg]",
          initial: { x: -120, opacity: 0, scale: 0.85 },
          animate: { x: 0, opacity: 1, scale: 1 },
          exit: { x: -120, opacity: 0, scale: 0.85 },
          speechPos: "right-full mr-6 top-1/2 -translate-y-1/2 -rotate-[80deg]",
        };
      case "bottom-right":
        return {
          container: "bottom-0 right-6 translate-x-[20%] translate-y-[65%] rotate-[155deg]",
          initial: { y: -120, x: -60, opacity: 0, scale: 0.85 },
          animate: { y: 0, x: 0, opacity: 1, scale: 1 },
          exit: { y: -120, x: -60, opacity: 0, scale: 0.85 },
          speechPos: "top-full mt-3 right-0 -rotate-[155deg]",
        };
      case "bottom":
        return {
          container: "bottom-0 left-1/2 -translate-x-1/2 translate-y-[68%] rotate-180",
          initial: { y: -120, opacity: 0, scale: 0.85 },
          animate: { y: 0, opacity: 1, scale: 1 },
          exit: { y: -120, opacity: 0, scale: 0.85 },
          speechPos: "top-full mt-3 left-1/2 -translate-x-1/2 -rotate-180",
        };
      case "bottom-left":
        return {
          container: "bottom-0 left-6 -translate-x-[20%] translate-y-[65%] -rotate-[155deg]",
          initial: { y: -120, x: 60, opacity: 0, scale: 0.85 },
          animate: { y: 0, x: 0, opacity: 1, scale: 1 },
          exit: { y: -120, x: 60, opacity: 0, scale: 0.85 },
          speechPos: "top-full mt-3 left-0 rotate-[155deg]",
        };
      case "left":
        return {
          container: "top-1/2 left-0 -translate-x-[62%] -translate-y-1/2 -rotate-[80deg]",
          initial: { x: 120, opacity: 0, scale: 0.85 },
          animate: { x: 0, opacity: 1, scale: 1 },
          exit: { x: 120, opacity: 0, scale: 0.85 },
          speechPos: "left-full ml-6 top-1/2 -translate-y-1/2 rotate-[80deg]",
        };
    }
  };

  const posConfig = getPositionClasses(currentPos);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={currentPos}
            initial={shouldReduceMotion ? { opacity: 0 } : posConfig.initial}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : isSpotted
                ? { ...posConfig.animate, scale: 1.12, transition: { duration: 0.15 } }
                : posConfig.animate
            }
            exit={shouldReduceMotion ? { opacity: 0 } : posConfig.exit}
            transition={
              shouldReduceMotion
                ? { duration: 0.2 }
                : { type: "spring", stiffness: 300, damping: 24 }
            }
            className={`absolute pointer-events-auto cursor-pointer select-none ${posConfig.container}`}
            onClick={handleSpot}
            onMouseEnter={handleSpot}
            title="Click or hover to startle the mascot!"
          >
            {/* Speech Bubble floating in free space */}
            {speech && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                className={`absolute whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-card/95 border-2 border-orange-500/80 text-xs font-mono font-bold text-foreground shadow-2xl backdrop-blur-md z-50 pointer-events-none ${posConfig.speechPos}`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <span>{speech}</span>
                </div>
              </motion.div>
            )}

            {/* Sharp & Badass Peeking Arena Hyena Mascot (Bigger Size: 200x180) */}
            <div className="relative w-48 h-44 flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 200 180"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Fire Gradient */}
                  <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="50%" stopColor="#EA580C" />
                    <stop offset="100%" stopColor="#C2410C" />
                  </linearGradient>

                  {/* Fur Base Gradient */}
                  <linearGradient id="furGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>

                  {/* Dark Mane Gradient */}
                  <linearGradient id="maneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#78350F" />
                    <stop offset="100%" stopColor="#451A03" />
                  </linearGradient>

                  {/* Eye Glow Filter */}
                  <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Back Glowing Aura */}
                <ellipse cx="100" cy="90" rx="65" ry="55" fill="#F97316" opacity="0.25" filter="url(#eyeGlow)" />

                {/* Left Ear - Sharp & Angular */}
                <path
                  d="M35 85 C20 50, 30 15, 60 25 C75 30, 75 60, 65 85 Z"
                  fill="url(#maneGrad)"
                  stroke="#291205"
                  strokeWidth="4"
                />
                <path
                  d="M40 75 C30 50, 38 28, 58 35 C68 40, 68 60, 60 75 Z"
                  fill="#FDE68A"
                />

                {/* Right Ear - Sharp & Angular */}
                <path
                  d="M165 85 C180 50, 170 15, 140 25 C125 30, 125 60, 135 85 Z"
                  fill="url(#maneGrad)"
                  stroke="#291205"
                  strokeWidth="4"
                />
                <path
                  d="M160 75 C170 50, 162 28, 142 35 C132 40, 132 60, 140 75 Z"
                  fill="#FDE68A"
                />

                {/* Spiky Mohawk & Mane Crest */}
                <path
                  d="M70 38 L85 8 L100 28 L115 5 L130 35 L120 48 Z"
                  fill="url(#fireGrad)"
                  stroke="#7C2D12"
                  strokeWidth="3.5"
                />
                <path
                  d="M80 32 L95 16 L105 30 L115 14 L120 36 Z"
                  fill="#FDE047"
                  opacity="0.8"
                />

                {/* Head Base - Sleek Aggressive Jawline */}
                <path
                  d="M45 80 C40 45, 160 45, 155 80 C162 120, 145 150, 100 155 C55 150, 38 120, 45 80 Z"
                  fill="url(#furGrad)"
                  stroke="#291205"
                  strokeWidth="4.5"
                />

                {/* Cheek Fur Spikes */}
                <path d="M40 85 L18 95 L36 105 L22 115 L44 120 Z" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
                <path d="M160 85 L182 95 L164 105 L178 115 L156 120 Z" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />

                {/* Snout Area */}
                <ellipse cx="100" cy="118" rx="28" ry="20" fill="#FEF08A" stroke="#291205" strokeWidth="3.5" />

                {/* Sharp Black Nose */}
                <path
                  d="M88 108 C92 104, 108 104, 112 108 C116 114, 107 122, 100 123 C93 122, 84 114, 88 108 Z"
                  fill="#18181B"
                  stroke="#09090B"
                  strokeWidth="2"
                />
                <ellipse cx="95" cy="110" rx="3" ry="1.5" fill="#FFFFFF" opacity="0.6" />

                {/* Sly Smirk / Grin with Fangs */}
                {isSpotted ? (
                  /* Surprised / Wide Open Mouth */
                  <g>
                    <ellipse cx="100" cy="130" rx="12" ry="9" fill="#7F1D1D" stroke="#291205" strokeWidth="3" />
                    <path d="M92 122 L95 127 L98 122 Z" fill="#FFFFFF" />
                    <path d="M102 122 L105 127 L108 122 Z" fill="#FFFFFF" />
                  </g>
                ) : (
                  /* Badass Smirk with Little Sharp Fang */
                  <g>
                    <path
                      d="M84 126 Q100 138 116 126"
                      stroke="#291205"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Tiny sharp fang on corner */}
                    <path d="M110 127 L114 134 L117 127 Z" fill="#FFFFFF" stroke="#291205" strokeWidth="1.5" />
                  </g>
                )}

                {/* Eyes - Sharp, Intense & Slanted (Badass Expression) */}
                <g>
                  {/* Left Eye Socket */}
                  <path
                    d="M62 82 C65 68, 85 70, 88 84 C85 92, 66 92, 62 82 Z"
                    fill="#18181B"
                    stroke="#291205"
                    strokeWidth="3"
                  />
                  {/* Glowing Iris */}
                  <ellipse
                    cx={isSpotted ? "75" : "78"}
                    cy="81"
                    rx={isSpotted ? "9" : "7.5"}
                    ry={isSpotted ? "9" : "8"}
                    fill="#F97316"
                  />
                  {/* Pupil */}
                  <ellipse
                    cx={isSpotted ? "75" : "80"}
                    cy="81"
                    rx={isSpotted ? "5" : "4"}
                    ry={isSpotted ? "5" : "6"}
                    fill="#09090B"
                  />
                  <circle cx={isSpotted ? "73" : "78"} cy="78" r="2.5" fill="#FFFFFF" />

                  {/* Right Eye Socket */}
                  <path
                    d="M138 82 C135 68, 115 70, 112 84 C115 92, 134 92, 138 82 Z"
                    fill="#18181B"
                    stroke="#291205"
                    strokeWidth="3"
                  />
                  {/* Glowing Iris */}
                  <ellipse
                    cx={isSpotted ? "125" : "122"}
                    cy="81"
                    rx={isSpotted ? "9" : "7.5"}
                    ry={isSpotted ? "9" : "8"}
                    fill="#F97316"
                  />
                  {/* Pupil */}
                  <ellipse
                    cx={isSpotted ? "125" : "120"}
                    cy="81"
                    rx={isSpotted ? "5" : "4"}
                    ry={isSpotted ? "5" : "6"}
                    fill="#09090B"
                  />
                  <circle cx={isSpotted ? "127" : "124"} cy="78" r="2.5" fill="#FFFFFF" />
                </g>

                {/* Eyebrows - Slanted & Confident */}
                {isSpotted ? (
                  <>
                    <path d="M58 64 Q74 52 88 66" stroke="#291205" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M142 64 Q126 52 112 66" stroke="#291205" strokeWidth="4.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <path d="M60 68 Q76 62 90 74" stroke="#291205" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M140 68 Q124 62 110 74" stroke="#291205" strokeWidth="4.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
