"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type PeekStance = "left" | "right" | "top";

const STANCES: PeekStance[] = ["left", "right", "top"];

export const PeekingMascot: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [stance, setStance] = useState<PeekStance>("left");
  const [isVisible, setIsVisible] = useState(true);
  const [isSpotted, setIsSpotted] = useState(false);

  const switchStance = useCallback(() => {
    setStance((prev) => {
      const remaining = STANCES.filter((s) => s !== prev);
      return remaining[Math.floor(Math.random() * remaining.length)] ?? "left";
    });
    setIsSpotted(false);
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isVisible) {
      // Stay visible and active for 6 to 9 seconds
      const duration = isSpotted ? 800 : 7000 + Math.random() * 2000;
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, duration);
    } else {
      // Duck behind card for 1.8 to 3 seconds, then emerge in another stance
      const waitTime = 1800 + Math.random() * 1200;
      timeoutId = setTimeout(() => {
        switchStance();
      }, waitTime);
    }

    return () => clearTimeout(timeoutId);
  }, [isVisible, isSpotted, switchStance]);

  // Click or hover startle reaction
  const handleSpot = () => {
    if (!isSpotted) {
      setIsSpotted(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 600);
    }
  };

  return (
    <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-0 overflow-visible flex items-center justify-center">
      <AnimatePresence mode="wait">
        {isVisible && (
          <div className="relative w-full h-full pointer-events-none">
            {/* ======================================================== */}
            {/* STANCE 1: LEFT PEEK (Matches reference image perfectly!) */}
            {/* ======================================================== */}
            {stance === "left" && (
              <motion.div
                key="stance-left"
                initial={shouldReduceMotion ? { opacity: 0 } : { x: -70, y: 30, opacity: 0, scale: 0.9 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : isSpotted
                    ? { x: -85, scale: 1.05, opacity: 1 }
                    : { x: 0, y: 0, opacity: 1, scale: 1 }
                }
                exit={shouldReduceMotion ? { opacity: 0 } : { x: -70, y: 30, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Fox Body & Head on Left Side */}
                <div
                  onClick={handleSpot}
                  onMouseEnter={handleSpot}
                  className="absolute -left-28 sm:-left-36 -top-24 sm:-top-28 w-64 sm:w-72 h-80 sm:h-96 pointer-events-auto cursor-pointer select-none group"
                  title="Cyber Roaster Fox"
                >
                  {/* Left Callout Annotation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-6 -left-4 sm:-left-10 text-orange-400 font-mono text-xs sm:text-sm font-bold tracking-tight rotate-[-8deg] flex items-center gap-1 drop-shadow-md whitespace-nowrap"
                  >
                    <span>Let&apos;s see what you&apos;ve been shipping...</span>
                    <span className="text-base">🔥</span>
                  </motion.div>

                  {/* SVG Illustration of Left Peeking Cyber Fox */}
                  <svg
                    viewBox="0 0 300 360"
                    className="w-full h-full overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="foxGradL" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" />
                        <stop offset="50%" stopColor="#EA580C" />
                        <stop offset="100%" stopColor="#C2410C" />
                      </linearGradient>
                      <linearGradient id="jacketGradL" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#27272A" />
                        <stop offset="100%" stopColor="#09090B" />
                      </linearGradient>
                    </defs>

                    {/* Left Shoulder & Tech Jacket */}
                    <path
                      d="M90 230 C70 200, 110 180, 160 190 L210 210 L220 340 L110 340 Z"
                      fill="url(#jacketGradL)"
                      stroke="#18181B"
                      strokeWidth="4"
                    />
                    {/* Orange Cyber Stripes on Sleeve */}
                    <path d="M120 220 L150 210" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                    <path d="M115 235 L145 225" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
                    {/* Cyber Fox Logo on Jacket */}
                    <polygon points="175,230 183,242 175,250 167,242" fill="#F97316" />

                    {/* Fluffy White Neck / Chest Fur */}
                    <path
                      d="M145 185 C140 165, 175 160, 185 180 C195 195, 160 210, 145 185 Z"
                      fill="#F8FAFC"
                      stroke="#09090B"
                      strokeWidth="3"
                    />

                    {/* Fox Head Group */}
                    <g transform="translate(10, 0)">
                      {/* Left Ear - Black Tip & White Fluff */}
                      <path
                        d="M60 110 C40 50, 60 10, 105 28 C120 35, 115 80, 105 110 Z"
                        fill="url(#foxGradL)"
                        stroke="#09090B"
                        strokeWidth="4"
                      />
                      <path d="M72 45 C70 26, 85 14, 105 28 C100 40, 88 45, 72 45 Z" fill="#18181B" />
                      <path
                        d="M75 100 C68 70, 80 48, 98 52 C106 58, 104 80, 94 100 Z"
                        fill="#F8FAFC"
                      />
                      <path d="M80 88 L92 80 L86 94 L100 86" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

                      {/* Right Ear */}
                      <path
                        d="M175 110 C190 50, 170 10, 130 28 C115 35, 118 80, 128 110 Z"
                        fill="url(#foxGradL)"
                        stroke="#09090B"
                        strokeWidth="4"
                      />
                      <path d="M165 45 C168 26, 152 14, 130 28 C135 40, 148 45, 165 45 Z" fill="#18181B" />
                      <path
                        d="M162 100 C168 70, 155 48, 138 52 C130 58, 132 80, 140 100 Z"
                        fill="#F8FAFC"
                      />

                      {/* Spiky Anime Hair Tufts */}
                      <path
                        d="M85 52 L102 18 L118 38 L134 14 L146 36 L158 22 L160 56 Z"
                        fill="url(#foxGradL)"
                        stroke="#09090B"
                        strokeWidth="4"
                      />
                      <path d="M106 30 L120 18 L130 30 L140 20 L148 38" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />

                      {/* Main Head Base */}
                      <path
                        d="M70 100 C60 60, 175 60, 168 100 C180 130, 160 165, 118 170 C75 165, 58 130, 70 100 Z"
                        fill="url(#foxGradL)"
                        stroke="#09090B"
                        strokeWidth="4.5"
                      />

                      {/* Fluffy White Cheeks */}
                      <path
                        d="M68 105 C48 110, 32 128, 48 142 C64 154, 92 154, 108 158 C90 142, 75 122, 68 105 Z"
                        fill="#F8FAFC"
                        stroke="#09090B"
                        strokeWidth="3"
                      />
                      <path
                        d="M170 105 C190 110, 206 128, 190 142 C174 154, 146 154, 130 158 C148 142, 162 122, 170 105 Z"
                        fill="#F8FAFC"
                        stroke="#09090B"
                        strokeWidth="3"
                      />

                      {/* White Muzzle */}
                      <path
                        d="M96 122 C96 108, 144 108, 144 122 C144 152, 120 164, 120 164 C120 164, 96 152, 96 122 Z"
                        fill="#F8FAFC"
                        stroke="#09090B"
                        strokeWidth="3"
                      />

                      {/* Black Fox Nose */}
                      <path
                        d="M112 120 C114 116, 126 116, 128 120 C130 126, 124 130, 120 131 C116 130, 110 126, 112 120 Z"
                        fill="#09090B"
                      />
                      <ellipse cx="116" cy="121" rx="2" ry="1" fill="#FFFFFF" opacity="0.8" />

                      {/* Confident Smug Fox Eyes */}
                      {/* Left Eye */}
                      <g>
                        <path d="M82 98 C86 82, 108 86, 112 100 C108 106, 88 106, 82 98 Z" fill="#09090B" />
                        <path d="M85 98 C88 86, 106 88, 109 99 C106 104, 90 104, 85 98 Z" fill="#FFFFFF" />
                        <ellipse cx="98" cy="97" rx="7.5" ry="8" fill="#F97316" />
                        <ellipse cx="99" cy="97" rx="4" ry="6.5" fill="#09090B" />
                        <circle cx="96" cy="94" r="2.5" fill="#FFFFFF" />
                      </g>

                      {/* Right Eye */}
                      <g>
                        <path d="M156 98 C152 82, 130 86, 126 100 C130 106, 150 106, 156 98 Z" fill="#09090B" />
                        <path d="M153 98 C150 86, 132 88, 129 99 C132 104, 148 104, 153 98 Z" fill="#FFFFFF" />
                        <ellipse cx="140" cy="97" rx="7.5" ry="8" fill="#F97316" />
                        <ellipse cx="139" cy="97" rx="4" ry="6.5" fill="#09090B" />
                        <circle cx="142" cy="94" r="2.5" fill="#FFFFFF" />
                      </g>

                      {/* Slanted Confident Eyebrows */}
                      <path d="M82 82 Q98 76 110 88" stroke="#09090B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                      <path d="M156 82 Q140 76 128 88" stroke="#09090B" strokeWidth="4.5" strokeLinecap="round" fill="none" />

                      {/* Smug Smirk with Sharp Fang */}
                      <path d="M106 142 Q120 150, 135 138" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
                      <polygon points="128,140 132,148 136,140" fill="#FFFFFF" stroke="#09090B" strokeWidth="1" />
                    </g>

                    {/* Cyber Paws / Gloved Hand Gripping Card Corner */}
                    <g id="left-paw-grip">
                      {/* Black Tech Glove */}
                      <rect x="220" y="150" width="34" height="24" rx="10" fill="#18181B" stroke="#F97316" strokeWidth="2.5" />
                      <circle cx="230" cy="162" r="3" fill="#F97316" />
                      <circle cx="242" cy="162" r="3" fill="#F97316" />
                    </g>
                  </svg>
                </div>

                {/* Big Fluffy Fox Tail Extending from Right Side */}
                <div className="absolute -right-20 sm:-right-32 top-16 sm:top-20 w-48 sm:w-60 h-64 sm:h-76 pointer-events-none select-none">
                  {/* Right Annotation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-6 right-0 text-amber-400 font-mono text-xs sm:text-sm font-bold tracking-tight rotate-[6deg] flex items-center gap-1 drop-shadow-md whitespace-nowrap"
                  >
                    <span>Brutal honesty loading...</span>
                    <span className="text-base">😈</span>
                  </motion.div>

                  {/* SVG Giant Fluffy Tail */}
                  <svg
                    viewBox="0 0 240 280"
                    className="w-full h-full overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Tail Orange Base with Curves */}
                    <path
                      d="M20 250 C40 200, 60 140, 110 80 C150 30, 210 20, 230 60 C245 100, 210 180, 150 220 C100 250, 50 270, 20 250 Z"
                      fill="url(#foxGradL)"
                      stroke="#09090B"
                      strokeWidth="4"
                    />
                    {/* Fluffy White Tail Tip */}
                    <path
                      d="M170 45 C190 25, 215 20, 230 60 C240 85, 225 125, 195 150 C185 130, 175 110, 185 90 C170 85, 165 65, 170 45 Z"
                      fill="#F8FAFC"
                      stroke="#09090B"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STANCE 2: RIGHT PEEK (Fox on Right, Tail on Left) */}
            {/* ======================================================== */}
            {stance === "right" && (
              <motion.div
                key="stance-right"
                initial={shouldReduceMotion ? { opacity: 0 } : { x: 70, y: 30, opacity: 0, scale: 0.9 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : isSpotted
                    ? { x: 85, scale: 1.05, opacity: 1 }
                    : { x: 0, y: 0, opacity: 1, scale: 1 }
                }
                exit={shouldReduceMotion ? { opacity: 0 } : { x: 70, y: 30, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Fox Body & Head on Right Side */}
                <div
                  onClick={handleSpot}
                  onMouseEnter={handleSpot}
                  className="absolute -right-28 sm:-right-36 -top-24 sm:-top-28 w-64 sm:w-72 h-80 sm:h-96 pointer-events-auto cursor-pointer select-none group"
                  title="Cyber Roaster Fox"
                >
                  {/* Right Callout Annotation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-6 right-0 text-orange-400 font-mono text-xs sm:text-sm font-bold tracking-tight rotate-[8deg] flex items-center gap-1 drop-shadow-md whitespace-nowrap"
                  >
                    <span>Checking your repo hygiene...</span>
                    <span className="text-base">🔎</span>
                  </motion.div>

                  {/* SVG Illustration of Right Peeking Fox */}
                  <svg
                    viewBox="0 0 300 360"
                    className="w-full h-full overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="foxGradR" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" />
                        <stop offset="50%" stopColor="#EA580C" />
                        <stop offset="100%" stopColor="#C2410C" />
                      </linearGradient>
                    </defs>

                    {/* Right Shoulder & Tech Jacket */}
                    <path
                      d="M210 230 C230 200, 190 180, 140 190 L90 210 L80 340 L190 340 Z"
                      fill="#18181B"
                      stroke="#09090B"
                      strokeWidth="4"
                    />
                    <path d="M180 220 L150 210" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="125,230 133,242 125,250 117,242" fill="#F97316" />

                    {/* White Chest */}
                    <path
                      d="M155 185 C160 165, 125 160, 115 180 C105 195, 140 210, 155 185 Z"
                      fill="#F8FAFC"
                      stroke="#09090B"
                      strokeWidth="3"
                    />

                    {/* Fox Head Group */}
                    <g transform="translate(10, 0)">
                      {/* Left Ear */}
                      <path
                        d="M60 110 C40 50, 60 10, 105 28 C120 35, 115 80, 105 110 Z"
                        fill="url(#foxGradR)"
                        stroke="#09090B"
                        strokeWidth="4"
                      />
                      <path d="M72 45 C70 26, 85 14, 105 28 C100 40, 88 45, 72 45 Z" fill="#18181B" />
                      <path d="M75 100 C68 70, 80 48, 98 52 C106 58, 104 80, 94 100 Z" fill="#F8FAFC" />

                      {/* Right Ear */}
                      <path
                        d="M175 110 C190 50, 170 10, 130 28 C115 35, 118 80, 128 110 Z"
                        fill="url(#foxGradR)"
                        stroke="#09090B"
                        strokeWidth="4"
                      />
                      <path d="M165 45 C168 26, 152 14, 130 28 C135 40, 148 45, 165 45 Z" fill="#18181B" />
                      <path d="M162 100 C168 70, 155 48, 138 52 C130 58, 132 80, 140 100 Z" fill="#F8FAFC" />

                      {/* Spiky Hair */}
                      <path
                        d="M85 52 L102 18 L118 38 L134 14 L146 36 L158 22 L160 56 Z"
                        fill="url(#foxGradR)"
                        stroke="#09090B"
                        strokeWidth="4"
                      />

                      {/* Head Base */}
                      <path
                        d="M70 100 C60 60, 175 60, 168 100 C180 130, 160 165, 118 170 C75 165, 58 130, 70 100 Z"
                        fill="url(#foxGradR)"
                        stroke="#09090B"
                        strokeWidth="4.5"
                      />

                      {/* Fluffy Cheeks */}
                      <path d="M68 105 C48 110, 32 128, 48 142 C64 154, 92 154, 108 158 C90 142, 75 122, 68 105 Z" fill="#F8FAFC" stroke="#09090B" strokeWidth="3" />
                      <path d="M170 105 C190 110, 206 128, 190 142 C174 154, 146 154, 130 158 C148 142, 162 122, 170 105 Z" fill="#F8FAFC" stroke="#09090B" strokeWidth="3" />

                      {/* Snout & Nose */}
                      <path d="M96 122 C96 108, 144 108, 144 122 C144 152, 120 164, 120 164 C120 164, 96 152, 96 122 Z" fill="#F8FAFC" stroke="#09090B" strokeWidth="3" />
                      <path d="M112 120 C114 116, 126 116, 128 120 C130 126, 124 130, 120 131 C116 130, 110 126, 112 120 Z" fill="#09090B" />

                      {/* Eyes */}
                      <g>
                        <path d="M82 98 C86 82, 108 86, 112 100 C108 106, 88 106, 82 98 Z" fill="#09090B" />
                        <path d="M85 98 C88 86, 106 88, 109 99 C106 104, 90 104, 85 98 Z" fill="#FFFFFF" />
                        <ellipse cx="98" cy="97" rx="7.5" ry="8" fill="#F97316" />
                        <ellipse cx="99" cy="97" rx="4" ry="6.5" fill="#09090B" />
                        <circle cx="96" cy="94" r="2.5" fill="#FFFFFF" />
                      </g>
                      <g>
                        <path d="M156 98 C152 82, 130 86, 126 100 C130 106, 150 106, 156 98 Z" fill="#09090B" />
                        <path d="M153 98 C150 86, 132 88, 129 99 C132 104, 148 104, 153 98 Z" fill="#FFFFFF" />
                        <ellipse cx="140" cy="97" rx="7.5" ry="8" fill="#F97316" />
                        <ellipse cx="139" cy="97" rx="4" ry="6.5" fill="#09090B" />
                        <circle cx="142" cy="94" r="2.5" fill="#FFFFFF" />
                      </g>

                      {/* Eyebrows & Smirk */}
                      <path d="M82 82 Q98 76 110 88" stroke="#09090B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                      <path d="M156 82 Q140 76 128 88" stroke="#09090B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                      <path d="M106 142 Q120 150, 135 138" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
                      <polygon points="128,140 132,148 136,140" fill="#FFFFFF" stroke="#09090B" strokeWidth="1" />
                    </g>

                    {/* Right Paw Grip */}
                    <rect x="46" y="150" width="34" height="24" rx="10" fill="#18181B" stroke="#F97316" strokeWidth="2.5" />
                    <circle cx="56" cy="162" r="3" fill="#F97316" />
                    <circle cx="68" cy="162" r="3" fill="#F97316" />
                  </svg>
                </div>

                {/* Tail on Left Side */}
                <div className="absolute -left-20 sm:-left-32 top-16 sm:top-20 w-48 sm:w-60 h-64 sm:h-76 pointer-events-none select-none">
                  <svg
                    viewBox="0 0 240 280"
                    className="w-full h-full overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] -scale-x-100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 250 C40 200, 60 140, 110 80 C150 30, 210 20, 230 60 C245 100, 210 180, 150 220 C100 250, 50 270, 20 250 Z"
                      fill="url(#foxGradR)"
                      stroke="#09090B"
                      strokeWidth="4"
                    />
                    <path
                      d="M170 45 C190 25, 215 20, 230 60 C240 85, 225 125, 195 150 C185 130, 175 110, 185 90 C170 85, 165 65, 170 45 Z"
                      fill="#F8FAFC"
                      stroke="#09090B"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STANCE 3: TOP CENTER PEEK (Peeking Over the Top Border) */}
            {/* ======================================================== */}
            {stance === "top" && (
              <motion.div
                key="stance-top"
                initial={shouldReduceMotion ? { opacity: 0 } : { y: 60, opacity: 0, scale: 0.9 }}
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : isSpotted
                    ? { y: -15, scale: 1.05, opacity: 1 }
                    : { y: 0, opacity: 1, scale: 1 }
                }
                exit={shouldReduceMotion ? { opacity: 0 } : { y: 60, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* Fox Head & Paws Peeking from Top Center */}
                <div
                  onClick={handleSpot}
                  onMouseEnter={handleSpot}
                  className="absolute left-1/2 -translate-x-1/2 -top-28 sm:-top-32 w-64 sm:w-72 h-44 sm:h-48 pointer-events-auto cursor-pointer select-none group"
                  title="Cyber Roaster Fox"
                >
                  {/* Top Speech Bubble */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-orange-400 font-mono text-xs sm:text-sm font-bold tracking-tight flex items-center gap-1 drop-shadow-md whitespace-nowrap bg-card/90 px-3 py-1 rounded-full border border-orange-500/40"
                  >
                    <span>Ready to get roasted? Enter a username! 👀</span>
                  </motion.div>

                  <svg
                    viewBox="0 0 260 180"
                    className="w-full h-full overflow-visible filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="foxGradT" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#F97316" />
                        <stop offset="50%" stopColor="#EA580C" />
                        <stop offset="100%" stopColor="#C2410C" />
                      </linearGradient>
                    </defs>

                    {/* Ears */}
                    <path d="M50 100 C30 40, 50 0, 95 18 C110 25, 105 70, 95 100 Z" fill="url(#foxGradT)" stroke="#09090B" strokeWidth="4" />
                    <path d="M62 35 C60 16, 75 4, 95 18 C90 30, 78 35, 62 35 Z" fill="#18181B" />
                    <path d="M65 90 C58 60, 70 38, 88 42 C96 48, 94 70, 84 90 Z" fill="#F8FAFC" />

                    <path d="M210 100 C230 40, 210 0, 165 18 C150 25, 155 70, 165 100 Z" fill="url(#foxGradT)" stroke="#09090B" strokeWidth="4" />
                    <path d="M198 35 C200 16, 185 4, 165 18 C170 30, 182 35, 198 35 Z" fill="#18181B" />
                    <path d="M195 90 C202 60, 190 38, 172 42 C164 48, 166 70, 176 90 Z" fill="#F8FAFC" />

                    {/* Hair */}
                    <path d="M75 42 L92 8 L108 28 L124 4 L136 26 L148 12 L150 46 Z" fill="url(#foxGradT)" stroke="#09090B" strokeWidth="4" />

                    {/* Head */}
                    <path d="M60 90 C50 50, 210 50, 200 90 C210 120, 190 155, 130 160 C70 155, 50 120, 60 90 Z" fill="url(#foxGradT)" stroke="#09090B" strokeWidth="4.5" />

                    {/* Fluffy Cheeks */}
                    <path d="M58 95 C38 100, 22 118, 38 132 C54 144, 82 144, 98 148 C80 132, 65 112, 58 95 Z" fill="#F8FAFC" stroke="#09090B" strokeWidth="3" />
                    <path d="M202 95 C222 100, 238 118, 222 132 C206 144, 178 144, 162 148 C180 132, 194 112, 202 95 Z" fill="#F8FAFC" stroke="#09090B" strokeWidth="3" />

                    {/* Snout */}
                    <path d="M106 112 C106 98, 154 98, 154 112 C154 142, 130 154, 130 154 C130 154, 106 142, 106 112 Z" fill="#F8FAFC" stroke="#09090B" strokeWidth="3" />
                    <path d="M122 110 C124 106, 136 106, 138 110 C140 116, 134 120, 130 121 C126 120, 120 116, 122 110 Z" fill="#09090B" />

                    {/* Eyes */}
                    <g>
                      <path d="M88 88 C92 72, 114 76, 118 90 C114 96, 94 96, 88 88 Z" fill="#09090B" />
                      <path d="M91 88 C94 76, 112 78, 115 89 C112 94, 96 94, 91 88 Z" fill="#FFFFFF" />
                      <ellipse cx="104" cy="87" rx="7" ry="7.5" fill="#F97316" />
                      <ellipse cx="105" cy="87" rx="3.5" ry="6" fill="#09090B" />
                      <circle cx="102" cy="84" r="2" fill="#FFFFFF" />
                    </g>
                    <g>
                      <path d="M172 88 C168 72, 146 76, 142 90 C146 96, 166 96, 172 88 Z" fill="#09090B" />
                      <path d="M169 88 C166 76, 148 78, 145 89 C148 94, 164 94, 169 88 Z" fill="#FFFFFF" />
                      <ellipse cx="156" cy="87" rx="7" ry="7.5" fill="#F97316" />
                      <ellipse cx="155" cy="87" rx="3.5" ry="6" fill="#09090B" />
                      <circle cx="158" cy="84" r="2" fill="#FFFFFF" />
                    </g>

                    {/* Eyebrows & Smirk */}
                    <path d="M88 72 Q104 66 116 78" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M172 72 Q156 66 144 78" stroke="#09090B" strokeWidth="4" strokeLinecap="round" fill="none" />
                    <path d="M116 132 Q130 140, 145 128" stroke="#09090B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                    <polygon points="138,130 142,137 146,130" fill="#FFFFFF" stroke="#09090B" strokeWidth="1" />

                    {/* Both Paws Gripping Top Edge of Card */}
                    <rect x="70" y="160" width="30" height="20" rx="8" fill="#18181B" stroke="#F97316" strokeWidth="2.5" />
                    <circle cx="80" cy="170" r="2.5" fill="#F97316" />
                    <circle cx="90" cy="170" r="2.5" fill="#F97316" />

                    <rect x="160" y="160" width="30" height="20" rx="8" fill="#18181B" stroke="#F97316" strokeWidth="2.5" />
                    <circle cx="170" cy="170" r="2.5" fill="#F97316" />
                    <circle cx="180" cy="170" r="2.5" fill="#F97316" />
                  </svg>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
