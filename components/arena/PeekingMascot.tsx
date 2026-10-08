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
  "Psst... I see uncommitted code! 👀",
  "Who's getting roasted today? 🔥",
  "Checking your commit hygiene...",
  "Nice keyboard! Now type a handle.",
  "Did you push to main again? 🚨",
  "Looking for flagships... 🔎",
  "Ready to judge your repos! 🍿",
];

export const PeekingMascot: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [currentPos, setCurrentPos] = useState<PeekPosition>("top");
  const [isVisible, setIsVisible] = useState(true); // Start visible immediately!
  const [isSpotted, setIsSpotted] = useState(false);
  const [speech, setSpeech] = useState<string | null>("Psst... Enter a GitHub handle! 👀");

  const triggerNextPeek = useCallback(() => {
    setCurrentPos((prev) => {
      const available = POSITIONS.filter((p) => p !== prev);
      return available[Math.floor(Math.random() * available.length)] ?? "top";
    });

    const randomSpeech =
      Math.random() > 0.3
        ? PEEK_SPEECHES[Math.floor(Math.random() * PEEK_SPEECHES.length)] ?? null
        : null;

    setSpeech(randomSpeech);
    setIsSpotted(false);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isVisible) {
      // Stay visible for 3.5 to 5.5 seconds, then duck
      const duration = isSpotted ? 800 : 3800 + Math.random() * 1500;
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, duration);
    } else {
      // Stay hidden for 1.5 to 2.5 seconds, then pop out in a new spot
      const waitTime = 1500 + Math.random() * 1200;
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
      setSpeech("Eep! Spotted! 💨");
      setTimeout(() => {
        setIsVisible(false);
      }, 600);
    }
  };

  // Position-specific coordinate and rotation mappings
  const getPositionClasses = (pos: PeekPosition) => {
    switch (pos) {
      case "top":
        return {
          container: "top-0 left-1/2 -translate-x-1/2 -translate-y-[85%]",
          initial: { y: 60, opacity: 0, scale: 0.8 },
          animate: { y: 0, opacity: 1, scale: 1 },
          exit: { y: 60, opacity: 0, scale: 0.8 },
          speechPos: "bottom-full mb-2 left-1/2 -translate-x-1/2",
        };
      case "top-left":
        return {
          container: "top-0 left-8 -translate-y-[85%] -rotate-12",
          initial: { y: 60, x: 20, opacity: 0, scale: 0.8 },
          animate: { y: 0, x: 0, opacity: 1, scale: 1 },
          exit: { y: 60, x: 20, opacity: 0, scale: 0.8 },
          speechPos: "bottom-full mb-2 left-0",
        };
      case "top-right":
        return {
          container: "top-0 right-8 -translate-y-[85%] rotate-12",
          initial: { y: 60, x: -20, opacity: 0, scale: 0.8 },
          animate: { y: 0, x: 0, opacity: 1, scale: 1 },
          exit: { y: 60, x: -20, opacity: 0, scale: 0.8 },
          speechPos: "bottom-full mb-2 right-0",
        };
      case "right":
        return {
          container: "top-1/2 right-0 translate-x-[75%] -translate-y-1/2 rotate-90",
          initial: { x: -60, opacity: 0, scale: 0.8 },
          animate: { x: 0, opacity: 1, scale: 1 },
          exit: { x: -60, opacity: 0, scale: 0.8 },
          speechPos: "right-full mr-4 top-0 -rotate-90",
        };
      case "bottom-right":
        return {
          container: "bottom-0 right-8 translate-y-[85%] rotate-[165deg]",
          initial: { y: -60, opacity: 0, scale: 0.8 },
          animate: { y: 0, opacity: 1, scale: 1 },
          exit: { y: -60, opacity: 0, scale: 0.8 },
          speechPos: "top-full mt-2 right-0 -rotate-[165deg]",
        };
      case "bottom":
        return {
          container: "bottom-0 left-1/2 -translate-x-1/2 translate-y-[85%] rotate-180",
          initial: { y: -60, opacity: 0, scale: 0.8 },
          animate: { y: 0, opacity: 1, scale: 1 },
          exit: { y: -60, opacity: 0, scale: 0.8 },
          speechPos: "top-full mt-2 left-1/2 -translate-x-1/2 -rotate-180",
        };
      case "bottom-left":
        return {
          container: "bottom-0 left-8 translate-y-[85%] -rotate-[165deg]",
          initial: { y: -60, opacity: 0, scale: 0.8 },
          animate: { y: 0, opacity: 1, scale: 1 },
          exit: { y: -60, opacity: 0, scale: 0.8 },
          speechPos: "top-full mt-2 left-0 rotate-[165deg]",
        };
      case "left":
        return {
          container: "top-1/2 left-0 -translate-x-[75%] -translate-y-1/2 -rotate-90",
          initial: { x: 60, opacity: 0, scale: 0.8 },
          animate: { x: 0, opacity: 1, scale: 1 },
          exit: { x: 60, opacity: 0, scale: 0.8 },
          speechPos: "left-full ml-4 top-0 rotate-90",
        };
    }
  };

  const posConfig = getPositionClasses(currentPos);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={currentPos}
            initial={shouldReduceMotion ? { opacity: 0 } : posConfig.initial}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : isSpotted
                ? { ...posConfig.animate, scale: 1.18, transition: { duration: 0.15 } }
                : posConfig.animate
            }
            exit={shouldReduceMotion ? { opacity: 0 } : posConfig.exit}
            transition={
              shouldReduceMotion
                ? { duration: 0.2 }
                : { type: "spring", stiffness: 320, damping: 22 }
            }
            className={`absolute pointer-events-auto cursor-pointer select-none ${posConfig.container}`}
            onClick={handleSpot}
            onMouseEnter={handleSpot}
            title="Click or hover to startle the mascot!"
          >
            {/* Speech Bubble */}
            {speech && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                className={`absolute whitespace-nowrap px-3 py-1.5 rounded-xl bg-card border-2 border-orange-500/60 text-xs font-mono font-bold text-foreground shadow-2xl backdrop-blur-md z-40 ${posConfig.speechPos}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <span>{speech}</span>
                </div>
              </motion.div>
            )}

            {/* Peeking Mascot Illustration */}
            <div className="relative w-32 h-28 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 160 140"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ears */}
                <circle
                  cx="38"
                  cy="42"
                  r="24"
                  fill="#B45309"
                  stroke="#78350F"
                  strokeWidth="4"
                />
                <circle cx="38" cy="42" r="14" fill="#FDE68A" />

                <circle
                  cx="122"
                  cy="42"
                  r="24"
                  fill="#B45309"
                  stroke="#78350F"
                  strokeWidth="4"
                />
                <circle cx="122" cy="42" r="14" fill="#FDE68A" />

                {/* Mohawk hair spikes */}
                <path
                  d="M62 28 L78 6 L96 28 L112 12 L118 36 Z"
                  fill="#78350F"
                />

                {/* Head Body */}
                <path
                  d="M38 68 C38 36, 122 36, 122 68 C128 98, 118 114, 80 118 C42 114, 32 98, 38 68 Z"
                  fill="#F59E0B"
                  stroke="#78350F"
                  strokeWidth="4"
                />

                {/* Cheek Tuft Details */}
                <path d="M32 72 L18 80 L32 86 Z" fill="#D97706" />
                <path d="M128 72 L142 80 L128 86 Z" fill="#D97706" />

                {/* Eyes - Wide expressive eyes */}
                <g>
                  {/* Left Eye */}
                  <ellipse cx="60" cy="68" rx="13" ry="15" fill="#FFFFFF" stroke="#78350F" strokeWidth="3" />
                  <ellipse
                    cx={isSpotted ? "60" : "64"}
                    cy={isSpotted ? "66" : "68"}
                    rx={isSpotted ? "8" : "6.5"}
                    ry={isSpotted ? "8" : "7.5"}
                    fill="#1E293B"
                  />
                  <circle cx={isSpotted ? "58" : "66"} cy={isSpotted ? "64" : "66"} r="2.5" fill="#FFFFFF" />

                  {/* Right Eye */}
                  <ellipse cx="100" cy="68" rx="13" ry="15" fill="#FFFFFF" stroke="#78350F" strokeWidth="3" />
                  <ellipse
                    cx={isSpotted ? "100" : "104"}
                    cy={isSpotted ? "66" : "68"}
                    rx={isSpotted ? "8" : "6.5"}
                    ry={isSpotted ? "8" : "7.5"}
                    fill="#1E293B"
                  />
                  <circle cx={isSpotted ? "98" : "106"} cy={isSpotted ? "64" : "66"} r="2.5" fill="#FFFFFF" />
                </g>

                {/* Eyebrows */}
                {isSpotted ? (
                  <>
                    <path d="M48 46 Q60 38 72 48" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M112 46 Q100 38 88 48" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <path d="M50 50 Q62 44 72 52" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                    <path d="M110 50 Q98 44 88 52" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                  </>
                )}

                {/* Snout & Nose */}
                <ellipse cx="80" cy="92" rx="19" ry="13" fill="#FDE68A" stroke="#78350F" strokeWidth="3" />
                <path
                  d="M71 85 C73 83, 87 83, 89 85 C91 89, 86 94, 80 95 C74 94, 69 89, 71 85 Z"
                  fill="#1E293B"
                />

                {/* Mouth / Smile */}
                {isSpotted ? (
                  <ellipse cx="80" cy="101" rx="6" ry="4" fill="#78350F" />
                ) : (
                  <path
                    d="M68 96 Q80 106 92 96"
                    stroke="#78350F"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}

                {/* Cute Paws gripping the card edge */}
                <g>
                  {/* Left Paw */}
                  <rect
                    x="34"
                    y="114"
                    width="28"
                    height="20"
                    rx="9"
                    fill="#F59E0B"
                    stroke="#78350F"
                    strokeWidth="3.5"
                  />
                  <line x1="43" y1="122" x2="43" y2="132" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="53" y1="122" x2="53" y2="132" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Right Paw */}
                  <rect
                    x="98"
                    y="114"
                    width="28"
                    height="20"
                    rx="9"
                    fill="#F59E0B"
                    stroke="#78350F"
                    strokeWidth="3.5"
                  />
                  <line x1="107" y1="122" x2="107" y2="132" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="117" y1="122" x2="117" y2="132" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
