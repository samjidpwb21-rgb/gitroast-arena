"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { DialogueTrigger, getDialogueLine } from "@/lib/mascot/dialogue";
import type { MascotPose } from "@/lib/state/machine";

interface PeekingMascotProps {
  trigger?: DialogueTrigger;
  isTyping?: boolean;
  isValid?: boolean;
  isHoveringSubmit?: boolean;
  isSubmitting?: boolean;
  hasError?: boolean;
  cursorPos?: { x: number; y: number };
}

export const PeekingMascot: React.FC<PeekingMascotProps> = memo(function PeekingMascot({
  trigger = "idle",
  isTyping = false,
  isValid,
  isHoveringSubmit = false,
  isSubmitting = false,
  hasError = false,
  cursorPos,
}) {
  const shouldReduceMotion = useReducedMotion();
  const [sessionCount, setSessionCount] = useState(0);
  const [currentLine, setCurrentLine] = useState<string>(() =>
    getDialogueLine("idle", 0)
  );
  const [mascotPose, setMascotPose] = useState<MascotPose>("IDLE");
  const [isClicked, setIsClicked] = useState(false);
  const [isDucking, setIsDucking] = useState(false);
  const [isIdleActive, setIsIdleActive] = useState(true);

  const previousLineRef = useRef(currentLine);
  const mascotRef = useRef<HTMLDivElement>(null);

  // Update line and pose deterministically on trigger change
  const updateLine = useCallback((newTrigger: DialogueTrigger) => {
    setSessionCount((prev) => {
      const nextCount = prev + 1;
      const newLine = getDialogueLine(newTrigger, nextCount, previousLineRef.current);
      previousLineRef.current = newLine;
      setCurrentLine(newLine);
      return nextCount;
    });
  }, []);

  // Sync state with incoming props
  useEffect(() => {
    if (isSubmitting) {
      updateLine("submit");
      setMascotPose("SEARCHING");
      setIsDucking(true);
      return;
    }

    if (hasError) {
      setMascotPose("SURPRISED");
      return;
    }

    if (isHoveringSubmit) {
      updateLine("hoverEnter");
      setMascotPose("SMIRK");
      return;
    }

    if (isValid === false) {
      updateLine("usernameInvalid");
      setMascotPose("SURPRISED");
      return;
    }

    if (isValid === true) {
      updateLine("usernameLooksValid");
      setMascotPose("SMUG_POSE");
      return;
    }

    if (isTyping) {
      setIsIdleActive(false);
      updateLine("typing");
      setMascotPose("TALKING");
      setIsDucking(false);
      return;
    }

    if (trigger && trigger !== "idle") {
      updateLine(trigger);
    }
  }, [trigger, isTyping, isValid, isHoveringSubmit, isSubmitting, hasError, updateLine]);

  // Handle single idle rotation timer (rotates every 9s if inactive and tab is visible)
  useEffect(() => {
    if (!isIdleActive || isTyping || isSubmitting || shouldReduceMotion) {
      return;
    }

    const timer = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        updateLine(sessionCount > 3 ? "idleLong" : "idle");
      }
    }, 9000);

    return () => clearInterval(timer);
  }, [isIdleActive, isTyping, isSubmitting, sessionCount, shouldReduceMotion, updateLine]);

  // Click reaction
  const handleMascotClick = () => {
    setIsClicked(true);
    setMascotPose("SURPRISED");
    updateLine("hoverEnter");
    setTimeout(() => {
      setIsClicked(false);
      setMascotPose("LAUGH");
      setTimeout(() => {
        setMascotPose("SMUG_POSE");
      }, 1000);
    }, 500);
  };

  // Subtle pupil tracking based on cursor position
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!cursorPos || shouldReduceMotion || !mascotRef.current) return;
    const rect = mascotRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = cursorPos.x - centerX;
    const dy = cursorPos.y - centerY;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(3, Math.hypot(dx, dy) / 80);

    setEyeOffset({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
    });
  }, [cursorPos, shouldReduceMotion]);

  // Calculate dynamic peek height
  const isLeaningIn = isTyping || isHoveringSubmit;

  // Mascot vertical variants
  const mascotVariants = {
    peek: {
      y: isDucking ? 100 : isLeaningIn ? -20 : 0,
      opacity: isDucking ? 0.2 : 1,
      scale: isClicked ? 1.06 : 1,
      transition: shouldReduceMotion
        ? { duration: 0.1 }
        : { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  const isMeaningfulAnnouncement =
    hasError || isSubmitting || trigger.startsWith("error");

  return (
    <div
      ref={mascotRef}
      className="absolute -top-[clamp(5.5rem,14vw,8.5rem)] left-1/2 -translate-x-1/2 w-full max-w-sm flex flex-col items-center pointer-events-none z-0 select-none overflow-visible"
    >
      {/* Speech Bubble Above Mascot */}
      <div className="relative mb-2 flex flex-col items-center pointer-events-none">
        {/* Screen Reader Live Region for meaningful updates only */}
        {isMeaningfulAnnouncement ? (
          <div className="sr-only" role="status" aria-live="polite">
            {currentLine}
          </div>
        ) : null}

        {/* Visual Animated Speech Bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLine}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="relative max-w-[280px] sm:max-w-xs px-3.5 py-1.5 rounded-2xl bg-zinc-900/95 border-2 border-orange-500/50 shadow-[0_8px_20px_rgba(0,0,0,0.6)] backdrop-blur-md text-center"
            aria-hidden={!isMeaningfulAnnouncement}
          >
            <p className="text-xs sm:text-sm font-bold text-foreground font-sans leading-tight">
              {currentLine}
            </p>

            {/* Bubble Tail pointing down to Mascot Head */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-orange-500/60"
              aria-hidden="true"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Mascot Head & Body (Layered Behind Card) */}
      <motion.div
        variants={mascotVariants}
        animate="peek"
        className="relative flex items-center justify-center w-48 sm:w-56 h-36 sm:h-40"
      >
        {/* Clickable Hit Box for Mascot Fun Interactions */}
        <div
          onClick={handleMascotClick}
          className="absolute inset-x-8 top-0 bottom-6 z-10 pointer-events-auto cursor-pointer rounded-full"
          title="Click to interact with the Cyber Fox mascot!"
          aria-label="Interactive Cyber Fox Mascot"
        />

        {/* Layered Cyber Fox Head SVG */}
        <svg
          viewBox="0 0 260 180"
          className="w-full h-full overflow-visible filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="peekOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="50%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>

            <radialGradient id="peekHeadGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Glow */}
          <circle cx="130" cy="90" r="75" fill="url(#peekHeadGlow)" />

          {/* EARS */}
          {/* Left Ear */}
          <g id="mascot-left-ear">
            <path
              d="M50 100 C30 40, 50 0, 95 18 C110 25, 105 70, 95 100 Z"
              fill="url(#peekOrangeGrad)"
              stroke="#09090B"
              strokeWidth="4"
            />
            <path d="M62 35 C60 16, 75 4, 95 18 C90 30, 78 35, 62 35 Z" fill="#18181B" />
            <path d="M65 90 C58 60, 70 38, 88 42 C96 48, 94 70, 84 90 Z" fill="#F8FAFC" />
            <path d="M70 78 L80 70 L76 84 L88 78" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Right Ear */}
          <g id="mascot-right-ear">
            <path
              d="M210 100 C230 40, 210 0, 165 18 C150 25, 155 70, 165 100 Z"
              fill="url(#peekOrangeGrad)"
              stroke="#09090B"
              strokeWidth="4"
            />
            <path d="M198 35 C200 16, 185 4, 165 18 C170 30, 182 35, 198 35 Z" fill="#18181B" />
            <path d="M195 90 C202 60, 190 38, 172 42 C164 48, 166 70, 176 90 Z" fill="#F8FAFC" />
            <path d="M190 78 L180 70 L184 84 L172 78" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Spiky Anime Hair Crest */}
          <g id="mascot-hair">
            <path
              d="M75 42 L92 8 L108 28 L124 4 L136 26 L148 12 L150 46 Z"
              fill="url(#peekOrangeGrad)"
              stroke="#09090B"
              strokeWidth="4"
            />
            <path d="M96 22 L110 10 L120 22 L130 12 L136 28" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Main Head Base */}
          <path
            id="mascot-head"
            d="M60 90 C50 50, 210 50, 200 90 C210 120, 190 155, 130 160 C70 155, 50 120, 60 90 Z"
            fill="url(#peekOrangeGrad)"
            stroke="#09090B"
            strokeWidth="4.5"
          />

          {/* Fluffy White Cheeks */}
          <g id="mascot-cheeks">
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
          </g>

          {/* White Muzzle */}
          <g id="mascot-muzzle">
            <path
              d="M106 112 C106 98, 154 98, 154 112 C154 142, 130 154, 130 154 C130 154, 106 142, 106 112 Z"
              fill="#F8FAFC"
              stroke="#09090B"
              strokeWidth="3"
            />
            {/* Black Nose */}
            <path
              d="M122 110 C124 106, 136 106, 138 110 C140 116, 134 120, 130 121 C126 120, 120 116, 122 110 Z"
              fill="#09090B"
            />
            <ellipse cx="126" cy="111" rx="2" ry="1" fill="#FFFFFF" opacity="0.8" />
          </g>

          {/* EYES with Dynamic Eye Tracking */}
          <g id="mascot-eyes">
            {mascotPose === "LAUGH" ? (
              <g>
                <path d="M88 88 Q103 74 118 88" stroke="#09090B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                <path d="M142 88 Q157 74 172 88" stroke="#09090B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              </g>
            ) : mascotPose === "SURPRISED" ? (
              <g>
                {/* Left Eye Alert */}
                <ellipse cx="104" cy="86" rx="10" ry="12" fill="#FFFFFF" stroke="#09090B" strokeWidth="3.5" />
                <circle cx={104 + eyeOffset.x} cy={86 + eyeOffset.y} r="6.5" fill="#F97316" />
                <circle cx={104 + eyeOffset.x} cy={86 + eyeOffset.y} r="4" fill="#09090B" />
                <circle cx={102 + eyeOffset.x} cy={83 + eyeOffset.y} r="2" fill="#FFFFFF" />

                {/* Right Eye Alert */}
                <ellipse cx="156" cy="86" rx="10" ry="12" fill="#FFFFFF" stroke="#09090B" strokeWidth="3.5" />
                <circle cx={156 + eyeOffset.x} cy={86 + eyeOffset.y} r="6.5" fill="#F97316" />
                <circle cx={156 + eyeOffset.x} cy={86 + eyeOffset.y} r="4" fill="#09090B" />
                <circle cx={158 + eyeOffset.x} cy={83 + eyeOffset.y} r="2" fill="#FFFFFF" />
              </g>
            ) : (
              <g>
                {/* Left Eye Sleek */}
                <path d="M88 88 C92 72, 114 76, 118 90 C114 96, 94 96, 88 88 Z" fill="#09090B" />
                <path d="M91 88 C94 76, 112 78, 115 89 C112 94, 96 94, 91 88 Z" fill="#FFFFFF" />
                <ellipse cx={104 + eyeOffset.x} cy={87 + eyeOffset.y} rx="7" ry="7.5" fill="#F97316" />
                <ellipse cx={105 + eyeOffset.x} cy={87 + eyeOffset.y} rx="3.5" ry="6" fill="#09090B" />
                <circle cx={102 + eyeOffset.x} cy={84 + eyeOffset.y} r="2" fill="#FFFFFF" />

                {/* Right Eye Sleek */}
                <path d="M172 88 C168 72, 146 76, 142 90 C146 96, 166 96, 172 88 Z" fill="#09090B" />
                <path d="M169 88 C166 76, 148 78, 145 89 C148 94, 164 94, 169 88 Z" fill="#FFFFFF" />
                <ellipse cx={156 + eyeOffset.x} cy={87 + eyeOffset.y} rx="7" ry="7.5" fill="#F97316" />
                <ellipse cx={155 + eyeOffset.x} cy={87 + eyeOffset.y} rx="3.5" ry="6" fill="#09090B" />
                <circle cx={158 + eyeOffset.x} cy={84 + eyeOffset.y} r="2" fill="#FFFFFF" />
              </g>
            )}
          </g>

          {/* EYEBROWS */}
          <g id="mascot-eyebrows">
            <path
              d={mascotPose === "SURPRISED" ? "M88 66 Q104 54 116 66" : "M88 72 Q104 66 116 78"}
              stroke="#09090B"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={mascotPose === "SURPRISED" ? "M172 66 Q156 54 144 66" : "M172 72 Q156 66 144 78"}
              stroke="#09090B"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* MOUTH */}
          <g id="mascot-mouth">
            {mascotPose === "LAUGH" ? (
              <g>
                <path d="M112 130 Q130 148 148 130 Z" fill="#991B1B" stroke="#09090B" strokeWidth="3" />
                <polygon points="118,130 122,137 126,130" fill="#FFFFFF" />
                <polygon points="134,130 138,137 142,130" fill="#FFFFFF" />
              </g>
            ) : mascotPose === "SURPRISED" ? (
              <ellipse cx="130" cy="134" rx="7" ry="8" fill="#09090B" />
            ) : (
              <g>
                <path d="M116 132 Q130 140, 145 128" stroke="#09090B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <polygon points="138,130 142,137 146,130" fill="#FFFFFF" stroke="#09090B" strokeWidth="1" />
              </g>
            )}
          </g>
        </svg>
      </motion.div>
    </div>
  );
});

/**
 * Separate Paw Layer to sit IN FRONT of the form card edge (z-30)
 */
export const PeekingPaws: React.FC = memo(function PeekingPaws() {
  return (
    <div
      className="absolute -top-3 left-1/2 -translate-x-1/2 w-44 sm:w-52 flex items-center justify-between px-6 pointer-events-none z-30 select-none"
      aria-hidden="true"
    >
      {/* Left Paw Gripping Top Edge */}
      <div className="relative">
        <svg width="42" height="24" viewBox="0 0 42 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Paw Base */}
          <rect x="2" y="2" width="38" height="20" rx="10" fill="#18181B" stroke="#F97316" strokeWidth="2.5" />
          {/* Claw pads */}
          <circle cx="12" cy="12" r="3" fill="#F97316" />
          <circle cx="21" cy="10" r="3" fill="#F97316" />
          <circle cx="30" cy="12" r="3" fill="#F97316" />
        </svg>
      </div>

      {/* Right Paw Gripping Top Edge */}
      <div className="relative">
        <svg width="42" height="24" viewBox="0 0 42 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Paw Base */}
          <rect x="2" y="2" width="38" height="20" rx="10" fill="#18181B" stroke="#F97316" strokeWidth="2.5" />
          {/* Claw pads */}
          <circle cx="12" cy="12" r="3" fill="#F97316" />
          <circle cx="21" cy="10" r="3" fill="#F97316" />
          <circle cx="30" cy="12" r="3" fill="#F97316" />
        </svg>
      </div>
    </div>
  );
});
