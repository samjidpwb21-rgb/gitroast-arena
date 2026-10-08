"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Flame,
  ShieldAlert,
  Zap,
  Skull,
  ArrowRight,
  User,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Clock,
  FileCheck2,
  Github,
} from "lucide-react";
import type { RoastLevel } from "@/types";
import { validateUsername } from "@/lib/validation/username";
import { CyberFoxDeveloper } from "./CyberFoxDeveloper";

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

const FEATURE_PILLS = [
  {
    icon: Github,
    title: "Public GitHub data only",
    desc: "We use official GitHub GraphQL API",
  },
  {
    icon: ShieldCheck,
    title: "No raw code stored",
    desc: "Your privacy stays safe & secure",
  },
  {
    icon: Clock,
    title: "~30 sec analysis",
    desc: "Fast, deterministic math engine",
  },
  {
    icon: FileCheck2,
    title: "Evidence linked",
    desc: "Every roast is backed by data",
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
    rgba(249, 115, 22, 0.15),
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
    <div className="w-full max-w-7xl mx-auto space-y-10 relative">
      {/* Ambient floating flame embers behind header */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* Header section */}
      <div className="text-center space-y-3 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold uppercase tracking-wider shadow-sm hover:scale-105 transition-transform cursor-default"
        >
          <Flame className="w-4 h-4 text-orange-500" />
          <span>DETERMINISTIC ANALYSIS • EVIDENCE-BACKED ROASTS</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight text-foreground"
        >
          Git<span className="text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]">Roast</span> Arena
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
        >
          Get your real GitHub portfolio scored across 7 vectors, roasted with evidence, and handed a calculated rescue plan.
        </motion.p>
      </div>

      {/* Main Battle Station Stage: Mascot on Left + Input Card in Center + Features on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Full-Body Cyber Fox Developer Mascot */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end order-2 lg:order-1">
          <CyberFoxDeveloper speech="Let's see what you've been shipping..." />
        </div>

        {/* Center/Right Column: Main Form Card & Side Info */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-5 items-stretch order-1 lg:order-2">
          {/* Main Input Card */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex-1 rounded-3xl bg-[#0d121f]/95 border border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.12)] overflow-hidden group hover:border-orange-500/60 transition-all duration-300"
          >
            {/* Interactive cursor spotlight overlay */}
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
              style={{ background: spotlightBackground }}
            />

            <form onSubmit={handleSubmit} className="relative z-10 p-6 sm:p-7 space-y-5">
              {/* Username Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="github-username"
                    className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-orange-500" />
                    GitHub Username
                  </label>
                  <span className="text-[11px] text-muted-foreground font-mono">e.g. torvalds, octocat</span>
                </div>
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
                    className={`w-full px-4 py-3 rounded-xl bg-background/90 border text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-inner ${
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
              <div className="space-y-1.5">
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
                  className="w-full px-4 py-2.5 rounded-xl bg-background/90 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Roast Level Selector */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">
                  Roast Intensity
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                        className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer ${
                          isSelected
                            ? `${level.accent} ring-1 ring-orange-500/80 shadow-md`
                            : "bg-background/80 border-border/80 text-muted-foreground hover:border-border hover:text-foreground hover:bg-secondary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <Icon className="w-3.5 h-3.5" />
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

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                disabled={isLoading || !rawUsername.trim()}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white font-black text-sm sm:text-base shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer group/btn overflow-hidden relative"
              >
                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Entering the Arena...</span>
                  </span>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-amber-200 fill-current" />
                    <span>Enter the Arena</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Side Feature Cards matching Reference Image */}
          <div className="w-full md:w-56 flex flex-col justify-between gap-2.5">
            {FEATURE_PILLS.map((pill, i) => {
              const Icon = pill.icon;
              return (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-orange-500/30 transition-colors flex items-start gap-2.5 shadow-sm"
                >
                  <div className="p-1.5 rounded-lg bg-zinc-900 text-orange-400 border border-zinc-800 shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground leading-tight">{pill.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{pill.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Step Banner matching Reference Image */}
      <div className="w-full p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 shadow-lg">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>How it works</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 text-orange-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">CONNECT</p>
              <p className="text-[10px] text-muted-foreground">Enter your GitHub handle</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 text-orange-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">INSPECT</p>
              <p className="text-[10px] text-muted-foreground">We inspect repos & activity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 text-orange-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">ROAST</p>
              <p className="text-[10px] text-muted-foreground">Brutally honest feedback</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 text-orange-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              4
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">RESCUE</p>
              <p className="text-[10px] text-muted-foreground">Calculated action plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
