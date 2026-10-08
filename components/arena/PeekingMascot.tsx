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

            {/* Cyberpunk Developer Fox Peeking Illustration */}
            <div className="relative w-48 h-44 flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 200 180"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Fox Orange Gradient */}
                  <linearGradient id="peekFoxOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="60%" stopColor="#EA580C" />
                    <stop offset="100%" stopColor="#C2410C" />
                  </linearGradient>

                  {/* Ambient Glow */}
                  <radialGradient id="peekFoxAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Glowing Back Aura */}
                <circle cx="100" cy="90" r="75" fill="url(#peekFoxAura)" />

                {/* ======================================================== */}
                {/* EARS */}
                {/* ======================================================== */}
                {/* Left Ear */}
                <g id="peek-left-ear">
                  <path
                    d="M32 90 C20 45, 36 10, 68 24 C78 28, 76 65, 68 90 Z"
                    fill="url(#peekFoxOrange)"
                    stroke="#09090B"
                    strokeWidth="3.5"
                  />
                  <path d="M42 35 C40 22, 50 12, 68 24 C64 32, 54 36, 42 35 Z" fill="#18181B" />
                  <path
                    d="M42 80 C36 55, 46 38, 62 42 C68 46, 66 65, 58 80 Z"
                    fill="#F8FAFC"
                  />
                  <path d="M46 70 L55 64 L50 76 L62 70" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Right Ear */}
                <g id="peek-right-ear">
                  <path
                    d="M168 90 C180 45, 164 10, 132 24 C122 28, 124 65, 132 90 Z"
                    fill="url(#peekFoxOrange)"
                    stroke="#09090B"
                    strokeWidth="3.5"
                  />
                  <path d="M158 35 C160 22, 150 12, 132 24 C136 32, 146 36, 158 35 Z" fill="#18181B" />
                  <path
                    d="M158 80 C164 55, 154 38, 138 42 C132 46, 134 65, 142 80 Z"
                    fill="#F8FAFC"
                  />
                  <path d="M154 70 L145 64 L150 76 L138 70" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* Spiky Anime Hair Tufts */}
                <path
                  d="M68 45 L82 18 L96 35 L108 12 L120 32 L132 20 L135 48 Z"
                  fill="url(#peekFoxOrange)"
                  stroke="#09090B"
                  strokeWidth="3.5"
                />
                <path d="M86 28 L98 16 L106 28 L114 18 L122 34" stroke="#FDBA74" strokeWidth="2.5" strokeLinecap="round" />

                {/* Head Base */}
                <path
                  d="M48 85 C42 55, 158 55, 152 85 C162 108, 148 135, 100 142 C52 135, 38 108, 48 85 Z"
                  fill="url(#peekFoxOrange)"
                  stroke="#09090B"
                  strokeWidth="4"
                />

                {/* Fluffy White Cheeks */}
                <path
                  d="M45 88 C30 92, 18 105, 30 115 C42 125, 65 125, 78 130 C65 118, 52 102, 45 88 Z"
                  fill="#F8FAFC"
                  stroke="#09090B"
                  strokeWidth="2.5"
                />
                <path
                  d="M155 88 C170 92, 182 105, 170 115 C158 125, 135 125, 122 130 C135 118, 148 102, 155 88 Z"
                  fill="#F8FAFC"
                  stroke="#09090B"
                  strokeWidth="2.5"
                />

                {/* White Snout Base */}
                <path
                  d="M74 102 C74 92, 126 92, 126 102 C126 128, 100 138, 100 138 C100 138, 74 128, 74 102 Z"
                  fill="#F8FAFC"
                  stroke="#09090B"
                  strokeWidth="3"
                />

                {/* Sleek Black Fox Nose */}
                <path
                  d="M92 102 C94 98, 106 98, 108 102 C110 108, 104 112, 100 113 C96 112, 90 108, 92 102 Z"
                  fill="#09090B"
                />
                <ellipse cx="97" cy="103" rx="2" ry="1" fill="#FFFFFF" opacity="0.7" />

                {/* Eyes - Sharp, Confident, Analytical Fox Eyes */}
                {/* Left Eye */}
                <g>
                  {isSpotted ? (
                    <g>
                      <ellipse cx="78" cy="80" rx="11" ry="13" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
                      <circle cx="78" cy="80" r="7" fill="#F97316" />
                      <circle cx="78" cy="80" r="4.5" fill="#09090B" />
                      <circle cx="75" cy="77" r="2.5" fill="#FFFFFF" />
                    </g>
                  ) : (
                    <g>
                      <path d="M62 82 C65 68, 88 72, 92 84 C88 90, 68 90, 62 82 Z" fill="#09090B" />
                      <path d="M65 82 C68 72, 86 74, 89 83 C86 88, 70 88, 65 82 Z" fill="#FFFFFF" />
                      <ellipse cx="78" cy="81" rx="6.5" ry="7" fill="#F97316" />
                      <ellipse cx="79" cy="81" rx="3.5" ry="5.5" fill="#09090B" />
                      <circle cx="77" cy="78" r="2" fill="#FFFFFF" />
                    </g>
                  )}
                </g>

                {/* Right Eye */}
                <g>
                  {isSpotted ? (
                    <g>
                      <ellipse cx="122" cy="80" rx="11" ry="13" fill="#FFFFFF" stroke="#09090B" strokeWidth="3" />
                      <circle cx="122" cy="80" r="7" fill="#F97316" />
                      <circle cx="122" cy="80" r="4.5" fill="#09090B" />
                      <circle cx="125" cy="77" r="2.5" fill="#FFFFFF" />
                    </g>
                  ) : (
                    <g>
                      <path d="M138 82 C135 68, 112 72, 108 84 C112 90, 132 90, 138 82 Z" fill="#09090B" />
                      <path d="M135 82 C132 72, 114 74, 111 83 C114 88, 130 88, 135 82 Z" fill="#FFFFFF" />
                      <ellipse cx="122" cy="81" rx="6.5" ry="7" fill="#F97316" />
                      <ellipse cx="121" cy="81" rx="3.5" ry="5.5" fill="#09090B" />
                      <circle cx="123" cy="78" r="2" fill="#FFFFFF" />
                    </g>
                  )}
                </g>

                {/* Eyebrows */}
                {isSpotted ? (
                  <>
                    <path d="M62 66 Q74 54 88 66" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M138 66 Q126 54 112 66" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </>
                ) : (
                  <>
                    <path d="M62 68 Q78 62 90 72" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M138 68 Q122 62 110 72" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </>
                )}

                {/* Mouth (Smug Smirk with Fang) */}
                {isSpotted ? (
                  <ellipse cx="100" cy="122" rx="6" ry="7" fill="#09090B" />
                ) : (
                  <g>
                    <path
                      d="M86 118 Q100 126 115 116"
                      stroke="#09090B"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <polygon points="108,117 112,123 115,116" fill="#FFFFFF" stroke="#09090B" strokeWidth="1" />
                  </g>
                )}
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
