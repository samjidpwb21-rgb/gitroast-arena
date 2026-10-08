"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type PeekDirection =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const DIRECTIONS: PeekDirection[] = [
  "top",
  "right",
  "bottom",
  "left",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

const PEEK_SPEECHES = [
  "Ready to get roasted? Enter a username! 👀",
  "Psst... Got clean commits? 🔥",
  "Checking for messy repos...",
  "Type your handle if you dare 😈",
  "Did you push straight to main? 🚨",
  "Looking for flagships... 🔎",
  "Ready to judge your code! 🍿",
];

export const PeekingMascot: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [direction, setDirection] = useState<PeekDirection>("top");
  const [isVisible, setIsVisible] = useState(true);
  const [isSpotted, setIsSpotted] = useState(false);
  const [speech, setSpeech] = useState<string | null>("Ready to get roasted? Enter a username! 👀");

  const switchDirection = useCallback(() => {
    setDirection((prev) => {
      const remaining = DIRECTIONS.filter((d) => d !== prev);
      return remaining[Math.floor(Math.random() * remaining.length)] ?? "top";
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
      // Stay visible for 4 to 6 seconds
      const duration = isSpotted ? 700 : 4500 + Math.random() * 1500;
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, duration);
    } else {
      // Hide behind card for 1.5 to 2.5 seconds, then pop out in another direction
      const waitTime = 1600 + Math.random() * 1000;
      timeoutId = setTimeout(() => {
        switchDirection();
      }, waitTime);
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible, isSpotted, switchDirection]);

  const handleSpot = () => {
    if (!isSpotted) {
      setIsSpotted(true);
      setSpeech("Whoa! Spotted! 💨");
      setTimeout(() => {
        setIsVisible(false);
      }, 550);
    }
  };

  // Precise positioning configs per direction
  const getDirectionConfig = (dir: PeekDirection) => {
    switch (dir) {
      case "top":
        return {
          wrapper: "top-0 left-1/2 -translate-x-1/2 -translate-y-[70%]",
          initial: { y: 100, opacity: 0, scale: 0.9 },
          animate: { y: 0, opacity: 1, scale: 1 },
          exit: { y: 100, opacity: 0, scale: 0.9 },
          rotation: 0,
          speechPos: "-top-8 left-1/2 -translate-x-1/2",
        };
      case "bottom":
        return {
          wrapper: "bottom-0 left-1/2 -translate-x-1/2 translate-y-[70%]",
          initial: { y: -100, opacity: 0, scale: 0.9 },
          animate: { y: 0, opacity: 1, scale: 1 },
          exit: { y: -100, opacity: 0, scale: 0.9 },
          rotation: 180,
          speechPos: "-bottom-10 left-1/2 -translate-x-1/2",
        };
      case "left":
        return {
          wrapper: "top-1/2 left-0 -translate-x-[70%] -translate-y-1/2",
          initial: { x: 100, opacity: 0, scale: 0.9 },
          animate: { x: 0, opacity: 1, scale: 1 },
          exit: { x: 100, opacity: 0, scale: 0.9 },
          rotation: -90,
          speechPos: "bottom-full mb-3 left-0",
        };
      case "right":
        return {
          wrapper: "top-1/2 right-0 translate-x-[70%] -translate-y-1/2",
          initial: { x: -100, opacity: 0, scale: 0.9 },
          animate: { x: 0, opacity: 1, scale: 1 },
          exit: { x: -100, opacity: 0, scale: 0.9 },
          rotation: 90,
          speechPos: "bottom-full mb-3 right-0",
        };
      case "top-left":
        return {
          wrapper: "top-0 left-6 -translate-x-[40%] -translate-y-[60%]",
          initial: { x: 80, y: 80, opacity: 0, scale: 0.9 },
          animate: { x: 0, y: 0, opacity: 1, scale: 1 },
          exit: { x: 80, y: 80, opacity: 0, scale: 0.9 },
          rotation: -25,
          speechPos: "-top-8 left-0",
        };
      case "top-right":
        return {
          wrapper: "top-0 right-6 translate-x-[40%] -translate-y-[60%]",
          initial: { x: -80, y: 80, opacity: 0, scale: 0.9 },
          animate: { x: 0, y: 0, opacity: 1, scale: 1 },
          exit: { x: -80, y: 80, opacity: 0, scale: 0.9 },
          rotation: 25,
          speechPos: "-top-8 right-0",
        };
      case "bottom-left":
        return {
          wrapper: "bottom-0 left-6 -translate-x-[40%] translate-y-[60%]",
          initial: { x: 80, y: -80, opacity: 0, scale: 0.9 },
          animate: { x: 0, y: 0, opacity: 1, scale: 1 },
          exit: { x: 80, y: -80, opacity: 0, scale: 0.9 },
          rotation: -155,
          speechPos: "-bottom-10 left-0",
        };
      case "bottom-right":
        return {
          wrapper: "bottom-0 right-6 translate-x-[40%] translate-y-[60%]",
          initial: { x: -80, y: -80, opacity: 0, scale: 0.9 },
          animate: { x: 0, y: 0, opacity: 1, scale: 1 },
          exit: { x: -80, y: -80, opacity: 0, scale: 0.9 },
          rotation: 155,
          speechPos: "-bottom-10 right-0",
        };
    }
  };

  const cfg = getDirectionConfig(direction);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={direction}
            initial={shouldReduceMotion ? { opacity: 0 } : cfg.initial}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : isSpotted
                ? { ...cfg.animate, scale: 1.12, transition: { duration: 0.15 } }
                : cfg.animate
            }
            exit={shouldReduceMotion ? { opacity: 0 } : cfg.exit}
            transition={
              shouldReduceMotion
                ? { duration: 0.2 }
                : { type: "spring", stiffness: 280, damping: 22 }
            }
            className={`absolute pointer-events-auto cursor-pointer select-none ${cfg.wrapper}`}
            onClick={handleSpot}
            onMouseEnter={handleSpot}
            title="Click or hover to startle the mascot!"
          >
            {/* Speech Bubble (Always upright and readable) */}
            {speech && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`absolute whitespace-nowrap px-3.5 py-1.5 rounded-full bg-card/95 border border-orange-500/50 text-xs font-mono font-bold text-orange-400 shadow-2xl backdrop-blur-md z-40 pointer-events-none ${cfg.speechPos}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                  <span>{speech}</span>
                </div>
              </motion.div>
            )}

            {/* Fox Head Illustration with Directional Rotation */}
            <div
              style={{ transform: `rotate(${cfg.rotation}deg)` }}
              className="relative w-44 sm:w-52 h-32 sm:h-36 flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform"
            >
              <svg
                viewBox="0 0 260 180"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="foxHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="50%" stopColor="#EA580C" />
                    <stop offset="100%" stopColor="#C2410C" />
                  </linearGradient>

                  <radialGradient id="foxHeadGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Back Glowing Aura */}
                <circle cx="130" cy="90" r="70" fill="url(#foxHeadGlow)" />

                {/* EARS */}
                {/* Left Ear */}
                <path
                  d="M50 100 C30 40, 50 0, 95 18 C110 25, 105 70, 95 100 Z"
                  fill="url(#foxHeadGrad)"
                  stroke="#09090B"
                  strokeWidth="4"
                />
                <path d="M62 35 C60 16, 75 4, 95 18 C90 30, 78 35, 62 35 Z" fill="#18181B" />
                <path
                  d="M65 90 C58 60, 70 38, 88 42 C96 48, 94 70, 84 90 Z"
                  fill="#F8FAFC"
                />
                <path d="M70 78 L80 70 L76 84 L88 78" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

                {/* Right Ear */}
                <path
                  d="M210 100 C230 40, 210 0, 165 18 C150 25, 155 70, 165 100 Z"
                  fill="url(#foxHeadGrad)"
                  stroke="#09090B"
                  strokeWidth="4"
                />
                <path d="M198 35 C200 16, 185 4, 165 18 C170 30, 182 35, 198 35 Z" fill="#18181B" />
                <path
                  d="M195 90 C202 60, 190 38, 172 42 C164 48, 166 70, 176 90 Z"
                  fill="#F8FAFC"
                />
                <path d="M190 78 L180 70 L184 84 L172 78" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

                {/* Spiky Anime Hair Crest */}
                <path
                  d="M75 42 L92 8 L108 28 L124 4 L136 26 L148 12 L150 46 Z"
                  fill="url(#foxHeadGrad)"
                  stroke="#09090B"
                  strokeWidth="4"
                />
                <path d="M96 22 L110 10 L120 22 L130 12 L136 28" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />

                {/* Main Head Base */}
                <path
                  d="M60 90 C50 50, 210 50, 200 90 C210 120, 190 155, 130 160 C70 155, 50 120, 60 90 Z"
                  fill="url(#foxHeadGrad)"
                  stroke="#09090B"
                  strokeWidth="4.5"
                />

                {/* Fluffy White Cheeks */}
                <path
                  d="M58 95 C38 100, 22 118, 38 132 C54 144, 82 144, 98 148 C80 132, 65 112, 58 95 Z"
                  fill="#F8FAFC"
                  stroke="#09090B"
                  strokeWidth="3"
                />
                <path
                  d="M202 95 C222 100, 238 118, 222 132 C206 144, 178 144, 162 148 C180 132, 194 112, 202 95 Z"
                  fill="#F8FAFC"
                  stroke="#09090B"
                  strokeWidth="3"
                />

                {/* White Muzzle */}
                <path
                  d="M106 112 C106 98, 154 98, 154 112 C154 142, 130 154, 130 154 C130 154, 106 142, 106 112 Z"
                  fill="#F8FAFC"
                  stroke="#09090B"
                  strokeWidth="3"
                />

                {/* Black Fox Nose */}
                <path
                  d="M122 110 C124 106, 136 106, 138 110 C140 116, 134 120, 130 121 C126 120, 120 116, 122 110 Z"
                  fill="#09090B"
                />
                <ellipse cx="126" cy="111" rx="2" ry="1" fill="#FFFFFF" opacity="0.8" />

                {/* EYES (Sharp, Focused Fox Eyes) */}
                {/* Left Eye */}
                <g>
                  <path d="M88 88 C92 72, 114 76, 118 90 C114 96, 94 96, 88 88 Z" fill="#09090B" />
                  <path d="M91 88 C94 76, 112 78, 115 89 C112 94, 96 94, 91 88 Z" fill="#FFFFFF" />
                  <ellipse cx="104" cy="87" rx="7" ry="7.5" fill="#F97316" />
                  <ellipse cx="105" cy="87" rx="3.5" ry="6" fill="#09090B" />
                  <circle cx="102" cy="84" r="2" fill="#FFFFFF" />
                </g>

                {/* Right Eye */}
                <g>
                  <path d="M172 88 C168 72, 146 76, 142 90 C146 96, 166 96, 172 88 Z" fill="#09090B" />
                  <path d="M169 88 C166 76, 148 78, 145 89 C148 94, 164 94, 169 88 Z" fill="#FFFFFF" />
                  <ellipse cx="156" cy="87" rx="7" ry="7.5" fill="#F97316" />
                  <ellipse cx="155" cy="87" rx="3.5" ry="6" fill="#09090B" />
                  <circle cx="158" cy="84" r="2" fill="#FFFFFF" />
                </g>

                {/* Eyebrows */}
                <path d="M88 72 Q104 66 116 78" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M172 72 Q156 66 144 78" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />

                {/* Smug Smirk with Corner Fang */}
                <path d="M116 132 Q130 140, 145 128" stroke="#09090B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <polygon points="138,130 142,137 146,130" fill="#FFFFFF" stroke="#09090B" strokeWidth="1" />

                {/* Paws Gripping Edge */}
                <rect x="70" y="156" width="30" height="20" rx="8" fill="#18181B" stroke="#F97316" strokeWidth="2.5" />
                <circle cx="80" cy="166" r="2.5" fill="#F97316" />
                <circle cx="90" cy="166" r="2.5" fill="#F97316" />

                <rect x="160" y="156" width="30" height="20" rx="8" fill="#18181B" stroke="#F97316" strokeWidth="2.5" />
                <circle cx="170" cy="166" r="2.5" fill="#F97316" />
                <circle cx="180" cy="166" r="2.5" fill="#F97316" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
