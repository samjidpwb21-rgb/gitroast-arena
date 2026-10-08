"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Flame, ShieldAlert, Zap, Skull, ArrowRight, User, Briefcase, Sparkles } from "lucide-react";
import type { RoastLevel } from "@/types";
import { validateUsername } from "@/lib/validation/username";

interface LandingHeroProps {
  onSubmit: (username: string, roastLevel: RoastLevel, targetRole: string) => void;
  isLoading: boolean;
}

const ROAST_LEVELS: Array<{
  id: RoastLevel;
  label: string;
  tagline: string;
  icon: React.ElementType;
  accent: string;
  glow: string;
}> = [
  {
    id: "easy",
    label: "Easy",
    tagline: "Playful & Gentle",
    icon: Zap,
    accent: "text-blue-400 border-blue-500/40 bg-blue-500/10 shadow-blue-500/20",
    glow: "#3b82f6",
  },
  {
    id: "spicy",
    label: "Spicy",
    tagline: "Sharp & Witty",
    icon: Flame,
    accent: "text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-amber-500/20",
    glow: "#f59e0b",
  },
  {
    id: "savage",
    label: "Savage",
    tagline: "Direct & Unfiltered",
    icon: ShieldAlert,
    accent: "text-orange-500 border-orange-500/40 bg-orange-500/10 shadow-orange-500/20",
    glow: "#f97316",
  },
  {
    id: "brutal",
    label: "Brutal",
    tagline: "Maximum Roast",
    icon: Skull,
    accent: "text-red-500 border-red-500/40 bg-red-500/10 shadow-red-500/20",
    glow: "#ef4444",
  },
];

export function LandingHero({ onSubmit, isLoading }: LandingHeroProps) {
  const [rawUsername, setRawUsername] = useState("");
  const [roastLevel, setRoastLevel] = useState<RoastLevel>("spicy");
  const [targetRole, setTargetRole] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Dynamic cursor spotlight tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlightBackground = useMotionTemplate`radial-gradient(
    450px circle at ${mouseX}px ${mouseY}px,
    rgba(249, 115, 22, 0.12),
    transparent 80%
  )`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateUsername(rawUsername);
    if (!check.valid) {
      setLocalError(check.error || "Invalid username");
      return;
    }
    setLocalError(null);
    onSubmit(check.normalized, roastLevel, targetRole.trim());
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 relative">
      {/* Ambient floating flame embers behind header */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* Header section */}
      <div className="text-center space-y-3 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-mono font-bold uppercase tracking-wider shadow-sm hover:scale-105 transition-transform cursor-default"
        >
          <Flame className="w-4 h-4 animate-bounce text-orange-500" />
          <span>Deterministic Math • Evidence-Backed Roasts</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
        >
          Git<span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">Roast</span> Arena
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed"
        >
          Get your real GitHub portfolio scored across 7 vectors, roasted with evidence, and handed a calculated rescue plan.
        </motion.p>
      </div>

      {/* Main Form Container */}
      <div className="relative pt-6 sm:pt-8 pb-4">
        {/* Form Card with dynamic mouse spotlight */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="relative z-10 rounded-3xl bg-[#0e131f] border border-orange-500/30 shadow-[0_0_60px_rgba(249,115,22,0.14)] overflow-hidden group hover:border-orange-500/60 transition-all duration-300"
        >
          {/* Interactive cursor spotlight overlay */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
            style={{ background: spotlightBackground }}
          />

          <form onSubmit={handleSubmit} className="relative z-10 p-6 sm:p-8 space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label
                htmlFor="github-username"
                className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-orange-500" />
                GitHub Username
              </label>
              <div className="relative group/input">
                <input
                  id="github-username"
                  type="text"
                  value={rawUsername}
                  onChange={(e) => {
                    setRawUsername(e.target.value);
                    if (localError) setLocalError(null);
                  }}
                  placeholder="e.g. torvalds, octocat"
                  disabled={isLoading}
                  autoComplete="off"
                  spellCheck={false}
                  className={`w-full px-4 py-3.5 rounded-xl bg-background/90 border text-foreground placeholder:text-muted-foreground text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-inner ${
                    localError
                      ? "border-destructive focus:ring-destructive"
                      : "border-border group-hover/input:border-border/80"
                  }`}
                  aria-invalid={Boolean(localError)}
                  aria-describedby={localError ? "username-error" : undefined}
                />
              </div>
              {localError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="username-error"
                  role="alert"
                  className="text-xs text-destructive font-mono font-medium"
                >
                  {localError}
                </motion.p>
              )}
            </div>

            {/* Target Role Input (Optional) */}
            <div className="space-y-2">
              <label
                htmlFor="target-role"
                className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5"
              >
                <Briefcase className="w-3.5 h-3.5 text-orange-500" />
                Target Role (Optional)
              </label>
              <input
                id="target-role"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, AI Dev"
                disabled={isLoading}
                maxLength={60}
                className="w-full px-4 py-3 rounded-xl bg-background/90 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Roast Level Selector */}
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">
                Roast Intensity
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ROAST_LEVELS.map((level) => {
                  const Icon = level.icon;
                  const isSelected = roastLevel === level.id;
                  return (
                    <motion.button
                      key={level.id}
                      type="button"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setRoastLevel(level.id)}
                      disabled={isLoading}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer ${
                        isSelected
                          ? `${level.accent} ring-1 ring-orange-500/80 shadow-md`
                          : "bg-background/80 border-border/80 text-muted-foreground hover:border-border hover:text-foreground hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <Icon className="w-4 h-4" />
                        {isSelected && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground font-mono">{level.label}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{level.tagline}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button with interactive pulse & glow */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              disabled={isLoading || !rawUsername.trim()}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer group/btn overflow-hidden relative"
            >
              {/* Button shimmer line on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Entering the Arena...</span>
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Enter the Arena</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
