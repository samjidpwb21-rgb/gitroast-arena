"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MascotPose } from "@/lib/state/machine";

interface MascotProps {
  pose: MascotPose;
  speech?: string;
  size?: "sm" | "md" | "lg" | number;
  className?: string;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

export function Mascot({
  pose,
  speech,
  size = "md",
  className = "",
  onAnimationStart,
  onAnimationComplete,
}: MascotProps) {
  const shouldReduceMotion = useReducedMotion();

  const dimensions =
    typeof size === "number"
      ? { width: size, height: size }
      : {
          sm: { width: 130, height: 130 },
          md: { width: 190, height: 190 },
          lg: { width: 260, height: 260 },
        }[size];

  // Head and body animation variants per pose
  const headVariants = {
    IDLE: {
      y: [0, -3, 0],
      rotate: [0, 1, 0],
      transition: shouldReduceMotion
        ? undefined
        : { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
    },
    SEARCHING: {
      rotate: [-4, 6, -4],
      y: [0, 2, 0],
      transition: shouldReduceMotion
        ? undefined
        : { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
    },
    SURPRISED: {
      scale: [1, 1.08, 1],
      y: -6,
      transition: shouldReduceMotion
        ? undefined
        : { duration: 0.35, ease: "easeOut" as const },
    },
    LAUGH: {
      y: [0, -6, 0, -4, 0],
      rotate: [0, -2, 2, -1, 0],
      transition: shouldReduceMotion
        ? undefined
        : { duration: 1.1, repeat: Infinity, ease: "easeInOut" as const },
    },
    SHRUG: {
      rotate: 3,
      y: 2,
      transition: { duration: 0.3 },
    },
    SMIRK: {
      rotate: [0, 3, 2],
      y: [0, -2, 0],
      transition: shouldReduceMotion ? undefined : { duration: 0.6, ease: "easeOut" as const },
    },
    LAUGH_SARCASTIC: {
      rotate: [-2, 3, -2, 3, 0],
      y: [0, -4, 0, -3, 0],
      transition: shouldReduceMotion
        ? undefined
        : { duration: 0.8, repeat: 2, ease: "easeInOut" as const },
    },
    LAUGH_HARD: {
      rotate: [0, -6, 6, -4, 4, 0],
      y: [0, -10, 2, -8, 0],
      scale: [1, 1.05, 0.98, 1.03, 1],
      transition: shouldReduceMotion
        ? undefined
        : { duration: 1.0, repeat: 2, ease: "easeInOut" as const },
    },
    TALKING: {
      y: [0, -2, 0, -2, 0],
      transition: shouldReduceMotion
        ? undefined
        : { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const },
    },
    SMUG_POSE: {
      rotate: 2,
      y: -1,
      transition: { duration: 0.4 },
    },
  };

  const isSurprised = pose === "SURPRISED";
  const isLaughing =
    pose === "LAUGH" || pose === "LAUGH_SARCASTIC" || pose === "LAUGH_HARD";
  const isLaughHard = pose === "LAUGH_HARD";
  const isShrugging = pose === "SHRUG";
  const isSearching = pose === "SEARCHING";
  const isSmirk = pose === "SMIRK";
  const isSmug = pose === "SMUG_POSE";
  const isTalking = pose === "TALKING";

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {speech && (
        <div
          role="status"
          aria-live="polite"
          className="relative max-w-sm px-4 py-2.5 mb-2 text-xs sm:text-sm font-semibold leading-snug rounded-2xl bg-card/95 border-2 border-orange-500/50 text-foreground shadow-2xl backdrop-blur-md text-center"
        >
          <p>{speech}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-orange-500/60" />
        </div>
      )}

      {/* Cyber Fox Mascot Layered SVG */}
      <motion.svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`GitRoast Cyber Fox Mascot in ${pose} pose`}
        className="overflow-visible filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
        onAnimationStart={onAnimationStart}
        onAnimationComplete={onAnimationComplete}
      >
        <defs>
          <linearGradient id="foxOrangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="60%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>

          <linearGradient id="techJacket" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#27272A" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>

          <radialGradient id="foxAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow */}
        <circle id="mascot-aura" cx="100" cy="100" r="90" fill="url(#foxAura)" />

        {/* ======================================================== */}
        {/* BODY & TECHWEAR JACKET */}
        {/* ======================================================== */}
        <g id="mascot-body">
          <g id="mascot-jacket">
            {/* Jacket Shoulders */}
            <path
              d="M35 195 C35 150, 65 140, 100 140 C135 140, 165 150, 165 195 Z"
              fill="url(#techJacket)"
              stroke="#18181B"
              strokeWidth="3.5"
            />
            {/* Neon Orange Jacket Trim */}
            <path d="M72 144 L88 185" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
            <path d="M128 144 L112 185" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 180 L62 175" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M150 180 L138 175" stroke="#FB923C" strokeWidth="2.5" strokeLinecap="round" />

            {/* Glowing Fox Crest Pendant */}
            <polygon points="100,162 106,170 100,178 94,170" fill="#F97316" />
            <line x1="100" y1="140" x2="100" y2="162" stroke="#F97316" strokeWidth="1.5" />
          </g>

          {/* White Fluffy Chest Fur */}
          <path
            d="M82 140 C85 155, 100 160, 100 160 C100 160, 115 155, 118 140 C110 148, 90 148, 82 140 Z"
            fill="#F8FAFC"
          />

          {/* Arms Layer (Crossed for SMUG_POSE or Out for SHRUG) */}
          <g id="mascot-arms">
            {isSmug && (
              <g>
                <path
                  d="M50 162 C70 178, 130 178, 150 162 C140 182, 60 182, 50 162 Z"
                  fill="#18181B"
                  stroke="#F97316"
                  strokeWidth="2.5"
                />
                <circle cx="75" cy="170" r="5" fill="#27272A" stroke="#F97316" strokeWidth="1" />
                <circle cx="125" cy="170" r="5" fill="#27272A" stroke="#F97316" strokeWidth="1" />
              </g>
            )}

            {isShrugging && (
              <g>
                <path
                  d="M25 160 C15 145, 38 135, 48 150 Z"
                  fill="#18181B"
                  stroke="#F97316"
                  strokeWidth="2"
                />
                <path
                  d="M175 160 C185 145, 162 135, 152 150 Z"
                  fill="#18181B"
                  stroke="#F97316"
                  strokeWidth="2"
                />
              </g>
            )}
          </g>
        </g>

        {/* ======================================================== */}
        {/* ANIMATED HEAD GROUP */}
        {/* ======================================================== */}
        <motion.g
          id="mascot-head"
          animate={pose}
          variants={headVariants}
          style={{ originX: "100px", originY: "115px" }}
        >
          {/* EARS */}
          <g id="mascot-ears">
            {/* Left Ear */}
            <g id="mascot-left-ear">
              <path
                d="M32 90 C20 45, 36 10, 68 24 C78 28, 76 65, 68 90 Z"
                fill="url(#foxOrangeGrad)"
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
            <g id="mascot-right-ear">
              <path
                d="M168 90 C180 45, 164 10, 132 24 C122 28, 124 65, 132 90 Z"
                fill="url(#foxOrangeGrad)"
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
          </g>

          {/* Spiky Anime Hair Tufts */}
          <g id="mascot-hair">
            <path
              d="M68 45 L82 18 L96 35 L108 12 L120 32 L132 20 L135 48 Z"
              fill="url(#foxOrangeGrad)"
              stroke="#09090B"
              strokeWidth="3.5"
            />
            <path d="M86 28 L98 16 L106 28 L114 18 L122 34" stroke="#FDBA74" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Head Base Silhouette */}
          <path
            d="M48 85 C42 55, 158 55, 152 85 C162 108, 148 135, 100 142 C52 135, 38 108, 48 85 Z"
            fill="url(#foxOrangeGrad)"
            stroke="#09090B"
            strokeWidth="4"
          />

          {/* Fluffy White Cheeks */}
          <g id="mascot-cheeks">
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
          </g>

          {/* Snout Base / Muzzle */}
          <g id="mascot-muzzle">
            <path
              d="M74 102 C74 92, 126 92, 126 102 C126 128, 100 138, 100 138 C100 138, 74 128, 74 102 Z"
              fill="#F8FAFC"
              stroke="#09090B"
              strokeWidth="3"
            />
            <path
              d="M92 102 C94 98, 106 98, 108 102 C110 108, 104 112, 100 113 C96 112, 90 108, 92 102 Z"
              fill="#09090B"
            />
            <ellipse cx="97" cy="103" rx="2" ry="1" fill="#FFFFFF" opacity="0.7" />
          </g>

          {/* EYES */}
          <g id="mascot-eyes">
            {/* Left Eye */}
            <g id="mascot-left-eye">
              {isLaughing ? (
                <path
                  d="M66 84 Q78 72 90 84"
                  stroke="#09090B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : isSurprised ? (
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
                  <ellipse
                    cx={isSearching ? "75" : isSmug || isSmirk ? "80" : "78"}
                    cy="81"
                    rx={isSmug ? "5.5" : "6.5"}
                    ry={isSmug ? "5" : "7"}
                    fill="#F97316"
                  />
                  <ellipse
                    cx={isSearching ? "75" : isSmug || isSmirk ? "80" : "79"}
                    cy="81"
                    rx="3.5"
                    ry="5.5"
                    fill="#09090B"
                  />
                  <circle cx={isSearching ? "73" : "77"} cy="78" r="2" fill="#FFFFFF" />
                </g>
              )}
            </g>

            {/* Right Eye */}
            <g id="mascot-right-eye">
              {isLaughing ? (
                <path
                  d="M110 84 Q122 72 134 84"
                  stroke="#09090B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : isSurprised ? (
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
                  <ellipse
                    cx={isSearching ? "125" : isSmug || isSmirk ? "120" : "122"}
                    cy="81"
                    rx={isSmug ? "5.5" : "6.5"}
                    ry={isSmug ? "5" : "7"}
                    fill="#F97316"
                  />
                  <ellipse
                    cx={isSearching ? "125" : isSmug || isSmirk ? "120" : "121"}
                    cy="81"
                    rx="3.5"
                    ry="5.5"
                    fill="#09090B"
                  />
                  <circle cx={isSearching ? "127" : "123"} cy="78" r="2" fill="#FFFFFF" />
                </g>
              )}
            </g>
          </g>

          {/* EYEBROWS */}
          <g id="mascot-eyebrows">
            {/* Left Eyebrow (Raised high for SMIRK) */}
            <path
              d={
                isSmirk
                  ? "M62 60 Q76 50 90 62"
                  : isSurprised
                  ? "M62 66 Q74 54 88 66"
                  : isLaughing
                  ? "M62 70 Q76 60 90 70"
                  : "M62 68 Q78 62 90 72"
              }
              stroke="#09090B"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right Eyebrow */}
            <path
              d={
                isSurprised
                  ? "M138 66 Q126 54 112 66"
                  : isLaughing
                  ? "M138 70 Q124 60 110 70"
                  : isSmirk
                  ? "M138 69 Q122 65 110 73"
                  : "M138 68 Q122 62 110 72"
              }
              stroke="#09090B"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* MOUTH */}
          <g id="mascot-mouth">
            {isTalking ? (
              // Talking Animated Mouth Loop
              <motion.path
                d="M88 118 Q100 134 112 118 Z"
                fill="#991B1B"
                stroke="#09090B"
                strokeWidth="3"
                animate={{ scaleY: [0.6, 1.2, 0.6] }}
                transition={{ duration: 0.25, repeat: Infinity }}
                style={{ originX: "100px", originY: "118px" }}
              />
            ) : isLaughHard ? (
              // Wide open laughing mouth with fangs
              <g>
                <path
                  d="M80 116 Q100 144 120 116 Z"
                  fill="#991B1B"
                  stroke="#09090B"
                  strokeWidth="3.5"
                />
                <polygon points="86,116 90,125 94,116" fill="#FFFFFF" />
                <polygon points="106,116 110,125 114,116" fill="#FFFFFF" />
              </g>
            ) : isLaughing ? (
              <g>
                <path
                  d="M84 118 Q100 138 116 118 Z"
                  fill="#991B1B"
                  stroke="#09090B"
                  strokeWidth="3"
                />
                <polygon points="88,118 92,125 96,118" fill="#FFFFFF" />
                <polygon points="104,118 108,125 112,118" fill="#FFFFFF" />
              </g>
            ) : isSurprised ? (
              <ellipse cx="100" cy="122" rx="6" ry="7" fill="#09090B" />
            ) : isShrugging ? (
              <path
                d="M86 120 Q95 116 102 122 T116 118"
                stroke="#09090B"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Default / Smirk / Smug Mouth
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
          </g>

          {/* TEAR DROP (For LAUGH_HARD) */}
          {isLaughHard && (
            <motion.path
              id="mascot-tear"
              d="M136 84 C140 84, 144 88, 142 92 C140 96, 136 98, 136 98 C136 98, 132 96, 130 92 C128 88, 132 84, 136 84 Z"
              fill="#38BDF8"
              stroke="#0284C7"
              strokeWidth="1.5"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          )}

          {/* Cyber Magnifier (When SEARCHING) */}
          {isSearching && (
            <g id="mascot-burst" transform="translate(122, 65) rotate(12)">
              <circle cx="15" cy="15" r="15" fill="#F97316" fillOpacity="0.25" stroke="#F97316" strokeWidth="3" />
              <circle cx="15" cy="15" r="10" stroke="#FDBA74" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="26" y1="26" x2="40" y2="40" stroke="#09090B" strokeWidth="5" strokeLinecap="round" />
            </g>
          )}
        </motion.g>
      </motion.svg>
    </div>
  );
}
