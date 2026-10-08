"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { MascotPose } from "@/lib/state/machine";

interface MascotProps {
  pose: MascotPose;
  speech?: string;
  size?: "sm" | "md" | "lg" | number;
  className?: string;
}

export function Mascot({
  pose,
  speech,
  size = "md",
  className = "",
}: MascotProps) {
  const shouldReduceMotion = useReducedMotion();

  const dimensions = typeof size === "number"
    ? { width: size, height: size }
    : {
        sm: { width: 140, height: 140 },
        md: { width: 200, height: 200 },
        lg: { width: 280, height: 280 },
      }[size];

  // Head animation variants per pose
  const headVariants = {
    IDLE: {
      y: [0, -4, 0],
      rotate: [0, 1, 0],
      transition: shouldReduceMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const },
    },
    SEARCHING: {
      rotate: [-5, 8, -5],
      y: [0, 2, 0],
      transition: shouldReduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
    },
    SURPRISED: {
      scale: [1, 1.08, 1],
      y: -8,
      transition: shouldReduceMotion ? undefined : { duration: 0.4, ease: "easeOut" as const },
    },
    LAUGH: {
      y: [0, -8, 0, -6, 0],
      rotate: [0, -3, 3, -2, 0],
      transition: shouldReduceMotion ? undefined : { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const },
    },
    SHRUG: {
      rotate: 4,
      y: 2,
      transition: { duration: 0.3 },
    },
  };

  // Eyebrow and eye angles based on pose
  const isSurprised = pose === "SURPRISED";
  const isLaughing = pose === "LAUGH";
  const isShrugging = pose === "SHRUG";
  const isSearching = pose === "SEARCHING";

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {speech && (
        <div
          role="status"
          aria-live="polite"
          className="relative max-w-sm px-4 py-2.5 mb-3 text-sm font-medium leading-snug rounded-2xl bg-secondary/90 border border-primary/30 text-foreground shadow-lg backdrop-blur-sm text-center"
        >
          <p>{speech}</p>
          {/* Bubble Pointer Tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-secondary/90" />
        </div>
      )}

      {/* SVG Hyena Mascot */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`GitRoast Hyena Mascot in ${pose} pose`}
        className="overflow-visible filter drop-shadow-md"
      >
        {/* Glow Ring Behind Mascot */}
        <circle cx="100" cy="100" r="85" className="fill-primary/5" />

        {/* Mascot Body & Shoulders */}
        <path
          d="M50 185 C50 145, 150 145, 150 185 Z"
          fill="#D97706"
          stroke="#78350F"
          strokeWidth="4"
        />
        {/* Chest Fur */}
        <path
          d="M80 155 C90 170, 110 170, 120 155 C110 180, 90 180, 80 155 Z"
          fill="#FEF3C7"
        />

        {/* Shrugging Paws (Rendered if SHRUG) */}
        {isShrugging && (
          <g>
            <path
              d="M35 155 C25 140, 45 130, 55 145 Z"
              fill="#D97706"
              stroke="#78350F"
              strokeWidth="3"
            />
            <path
              d="M165 155 C175 140, 155 130, 145 145 Z"
              fill="#D97706"
              stroke="#78350F"
              strokeWidth="3"
            />
          </g>
        )}

        {/* Animated Head Group */}
        <motion.g
          animate={pose}
          variants={headVariants}
          style={{ originX: "100px", originY: "110px" }}
        >
          {/* Big Rounded Hyena Ears */}
          {/* Left Ear */}
          <circle cx="55" cy="55" r="28" fill="#B45309" stroke="#78350F" strokeWidth="4" />
          <circle cx="55" cy="55" r="16" fill="#FDE68A" />

          {/* Right Ear */}
          <circle cx="145" cy="55" r="28" fill="#B45309" stroke="#78350F" strokeWidth="4" />
          <circle cx="145" cy="55" r="16" fill="#FDE68A" />

          {/* Mane (Spiky Back Fur) */}
          <path
            d="M85 35 L100 15 L115 35 L130 20 L135 45 Z"
            fill="#78350F"
          />

          {/* Head Base */}
          <path
            d="M60 85 C60 55, 140 55, 140 85 C145 115, 135 135, 100 140 C65 135, 55 115, 60 85 Z"
            fill="#F59E0B"
            stroke="#78350F"
            strokeWidth="4"
          />

          {/* Hyena Spots */}
          <circle cx="75" cy="72" r="4" fill="#92400E" />
          <circle cx="70" cy="84" r="3" fill="#92400E" />
          <circle cx="125" cy="72" r="4" fill="#92400E" />
          <circle cx="130" cy="84" r="3" fill="#92400E" />

          {/* Muzzle (Snout) */}
          <path
            d="M75 100 C75 90, 125 90, 125 100 C125 125, 75 125, 75 100 Z"
            fill="#FEF3C7"
            stroke="#78350F"
            strokeWidth="3"
          />

          {/* Nose */}
          <path
            d="M92 98 C92 94, 108 94, 108 98 C108 106, 92 106, 92 98 Z"
            fill="#1E293B"
          />

          {/* Eyes & Eyebrows */}
          {/* Left Eye */}
          {isLaughing ? (
            // Laughing squint eyes ^^
            <path
              d="M72 82 Q80 74 88 82"
              stroke="#78350F"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          ) : isSurprised ? (
            // Big wide open surprised eyes O
            <circle cx="80" cy="80" r="9" fill="#FFFFFF" stroke="#78350F" strokeWidth="3">
              <circle cx="80" cy="80" r="4" fill="#1E293B" />
            </circle>
          ) : (
            // Standard observant eyes
            <ellipse cx="80" cy="80" rx="7" ry="8" fill="#FFFFFF" stroke="#78350F" strokeWidth="3">
              <circle cx={isSearching ? "78" : "80"} cy="80" r="3.5" fill="#1E293B" />
            </ellipse>
          )}

          {/* Right Eye */}
          {isLaughing ? (
            <path
              d="M112 82 Q120 74 128 82"
              stroke="#78350F"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          ) : isSurprised ? (
            <circle cx="120" cy="80" r="9" fill="#FFFFFF" stroke="#78350F" strokeWidth="3">
              <circle cx="120" cy="80" r="4" fill="#1E293B" />
            </circle>
          ) : (
            <ellipse cx="120" cy="80" rx="7" ry="8" fill="#FFFFFF" stroke="#78350F" strokeWidth="3">
              <circle cx={isSearching ? "122" : "120"} cy="80" r="3.5" fill="#1E293B" />
            </ellipse>
          )}

          {/* Eyebrows */}
          <path
            d={
              isSurprised
                ? "M72 68 Q80 62 88 68"
                : isLaughing
                ? "M72 72 Q80 66 88 72"
                : "M72 70 Q80 72 88 70"
            }
            stroke="#78350F"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={
              isSurprised
                ? "M112 68 Q120 62 128 68"
                : isLaughing
                ? "M112 72 Q120 66 128 72"
                : "M112 70 Q120 72 128 70"
            }
            stroke="#78350F"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Mouth */}
          {isLaughing ? (
            // Big open grinning hyena laugh with visible fangs
            <g>
              <path
                d="M80 112 Q100 135 120 112 Z"
                fill="#991B1B"
                stroke="#78350F"
                strokeWidth="3"
              />
              {/* Little fangs */}
              <polygon points="86,112 90,119 94,112" fill="#FFFFFF" />
              <polygon points="106,112 110,119 114,112" fill="#FFFFFF" />
            </g>
          ) : isSurprised ? (
            // Small open 'o' mouth
            <ellipse cx="100" cy="116" rx="6" ry="8" fill="#78350F" />
          ) : isShrugging ? (
            // Wavy smirk mouth
            <path
              d="M86 114 Q95 110 102 115 T116 112"
              stroke="#78350F"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            // Confident smirk
            <path
              d="M86 112 Q100 120 114 112"
              stroke="#78350F"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Searching Magnifying Glass Accessory (When SEARCHING) */}
          {isSearching && (
            <g transform="translate(115, 70) rotate(15)">
              <circle cx="15" cy="15" r="14" fill="#38BDF8" fillOpacity="0.3" stroke="#0284C7" strokeWidth="3" />
              <line x1="25" y1="25" x2="38" y2="38" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
            </g>
          )}
        </motion.g>
      </svg>
    </div>
  );
}
