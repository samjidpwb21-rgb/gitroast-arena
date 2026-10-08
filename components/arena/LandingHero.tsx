"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import {
  Flame,
  ShieldAlert,
  Zap,
  Skull,
  ArrowRight,
  User,
  Briefcase,
  Lock,
  Clock,
  FileCheck2,
  Github,
  CheckCircle2,
  Terminal,
  ExternalLink,
} from "lucide-react";
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
}> = [
  {
    id: "easy",
    label: "Easy",
    tagline: "Playful & Gentle",
    icon: Zap,
    accent: "text-blue-400 border-blue-500/40 bg-blue-500/10 shadow-blue-500/20",
  },
  {
    id: "spicy",
    label: "Spicy",
    tagline: "Sharp & Witty",
    icon: Flame,
    accent: "text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-amber-500/20",
  },
  {
    id: "savage",
    label: "Savage",
    tagline: "Direct & Unfiltered",
    icon: ShieldAlert,
    accent: "text-orange-500 border-orange-500/40 bg-orange-500/10 shadow-orange-500/20",
  },
  {
    id: "brutal",
    label: "Brutal",
    tagline: "Maximum Roast",
    icon: Skull,
    accent: "text-red-500 border-red-500/40 bg-red-500/10 shadow-red-500/20",
  },
];

const TERMINAL_LOGS = [
  "> Connecting to GitHub...",
  "> Fetching profile...",
  "> Scanning repositories...",
  "> Analyzing code patterns...",
  "> Preparing the roast...",
];

export function LandingHero({ onSubmit, isLoading }: LandingHeroProps) {
  const [rawUsername, setRawUsername] = useState("");
  const [roastLevel, setRoastLevel] = useState<RoastLevel>("spicy");
  const [targetRole, setTargetRole] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Terminal animated typing line
  const [activeLogIndex, setActiveLogIndex] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % TERMINAL_LOGS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

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
    500px circle at ${mouseX}px ${mouseY}px,
    rgba(249, 115, 22, 0.16),
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

  const fillSampleUsername = (sample: string) => {
    setRawUsername(sample);
    if (localError) setLocalError(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 relative px-2 sm:px-4">
      {/* ========================================================================= */}
      {/* 3-COLUMN HERO SECTION MATCHING REFERENCE DESIGN */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: Full Fox Developer Mascot Battlestation Scene */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start space-y-4">
          {/* Fox Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-zinc-950/90 border border-orange-500/40 rounded-xl px-4 py-2.5 shadow-[0_0_20px_rgba(249,115,22,0.2)] backdrop-blur-md max-w-xs"
          >
            <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
              <span>Let&apos;s see what you&apos;ve been shipping...</span>
              <span className="inline-block w-2 h-3.5 bg-orange-500 animate-pulse" />
            </p>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 left-8 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-orange-500/50" />
          </motion.div>

          {/* Mascot Battlestation Card */}
          <div className="relative w-full rounded-2xl bg-zinc-950/80 border border-orange-500/30 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] group">
            {/* Background Terminal Scan Code */}
            <div className="p-3.5 bg-zinc-900/90 border-b border-zinc-800/80 font-mono text-[11px] text-zinc-400 space-y-1">
              <div className="flex items-center gap-2 pb-1 text-orange-400 font-bold border-b border-zinc-800">
                <Terminal className="w-3.5 h-3.5" />
                <span>TERMINAL://gitroast-scan</span>
              </div>
              {TERMINAL_LOGS.map((log, idx) => {
                const isPassed = idx < activeLogIndex;
                const isCurrent = idx === activeLogIndex;
                return (
                  <div
                    key={log}
                    className={`flex items-center justify-between transition-colors ${
                      isCurrent
                        ? "text-orange-400 font-semibold"
                        : isPassed
                        ? "text-emerald-400/90"
                        : "text-zinc-600"
                    }`}
                  >
                    <span>{log}</span>
                    {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />}
                  </div>
                );
              })}
            </div>

            {/* Fox Developer Battlestation Illustration Container */}
            <div className="relative w-full h-[320px] sm:h-[360px] overflow-hidden bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent">
              {/* Full Illustrated Fox Artwork from Reference */}
              <div
                className="absolute inset-0 bg-no-repeat bg-contain bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: "url('/images/hero-fox-reference.jpg')",
                  backgroundPosition: "left 20% center",
                  backgroundSize: "280% auto",
                }}
              />

              {/* Glowing Orange Rim Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90" />

              {/* Developer Desk Stack: Bad Code Good Roasts Mug + Book Stack */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none z-10">
                {/* Desk Books Stack */}
                <div className="flex flex-col gap-1 font-mono text-[9px] font-bold text-zinc-400 tracking-wider">
                  <span className="px-2 py-0.5 bg-zinc-900/90 border border-orange-500/30 text-orange-400 rounded">
                    ANALYZE
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-900/90 border border-orange-500/30 text-orange-400 rounded">
                    ROAST
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-900/90 border border-orange-500/30 text-orange-400 rounded">
                    IMPROVE
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-900/90 border border-orange-500/30 text-orange-400 rounded">
                    REPEAT
                  </span>
                </div>

                {/* Desk Coffee Mug Badge */}
                <div className="px-2.5 py-1.5 rounded-lg bg-zinc-950/90 border border-orange-500/40 text-[10px] font-mono font-bold text-orange-400 flex items-center gap-1.5 shadow-lg">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span>BAD CODE • GOOD ROASTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* CENTER COLUMN: Hero Title, Subtitle & Main Roast Input Form */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6">
          {/* Header Title Section */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold uppercase tracking-wider shadow-sm"
            >
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>DETERMINISTIC ANALYSIS • EVIDENCE-BACKED ROASTS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
            >
              Git<span className="text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.5)]">Roast</span> Arena
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md mx-auto"
            >
              Get your real GitHub portfolio scored across 7 vectors, roasted with evidence, and handed a calculated rescue plan.
            </motion.p>
          </div>

          {/* Interactive Form Card */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="w-full text-left rounded-3xl bg-zinc-950/90 border border-orange-500/35 shadow-[0_0_60px_rgba(249,115,22,0.18)] overflow-hidden group hover:border-orange-500/60 transition-all duration-300 relative"
          >
            {/* Interactive cursor spotlight overlay */}
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
              style={{ background: spotlightBackground }}
            />

            <form onSubmit={handleSubmit} className="relative z-10 p-5 sm:p-7 space-y-5">
              {/* GitHub Username Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="github-username"
                    className="text-xs font-mono font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-orange-500" />
                    GITHUB USERNAME
                  </label>
                  <button
                    type="button"
                    onClick={() => fillSampleUsername("torvalds")}
                    className="text-[11px] font-mono text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                  >
                    Try sample &apos;torvalds&apos; <ExternalLink className="w-2.5 h-2.5" />
                  </button>
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
                    className={`w-full px-4 py-3 rounded-xl bg-zinc-900/90 border text-foreground placeholder:text-zinc-500 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-inner ${
                      localError
                        ? "border-destructive focus:ring-destructive"
                        : "border-zinc-800 group-hover/input:border-zinc-700"
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
                  TARGET ROLE (OPTIONAL)
                </label>
                <input
                  id="target-role"
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full-Stack Engineer, Backend Dev"
                  disabled={isLoading}
                  maxLength={60}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-foreground placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Roast Intensity Selector */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-foreground uppercase tracking-wider block">
                  ROAST INTENSITY
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ROAST_LEVELS.map((level) => {
                    const Icon = level.icon;
                    const isSelected = roastLevel === level.id;
                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setRoastLevel(level.id)}
                        disabled={isLoading}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer ${
                          isSelected
                            ? `${level.accent} ring-1 ring-orange-500/80 shadow-md`
                            : "bg-zinc-900/80 border-zinc-800 text-muted-foreground hover:border-zinc-700 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
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
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Glowing Orange Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                disabled={isLoading || !rawUsername.trim()}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-zinc-950 font-black text-sm sm:text-base shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2 cursor-pointer group/btn overflow-hidden relative uppercase tracking-wider"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Entering the Arena...</span>
                  </span>
                ) : (
                  <>
                    <Flame className="w-4 h-4 fill-current text-zinc-950" />
                    <span>Enter the Arena</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: Trust Cards & Cyberpunk Banner */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-3 flex flex-col space-y-3">
          {/* Stack of 4 Trust / Feature Badges */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 flex items-start gap-3 shadow-md hover:border-orange-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Public GitHub data only</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">We use official GitHub API</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 flex items-start gap-3 shadow-md hover:border-orange-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">No raw code stored</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Your privacy stays safe</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 flex items-start gap-3 shadow-md hover:border-orange-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">~30 sec analysis</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Fast and efficient</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 flex items-start gap-3 shadow-md hover:border-orange-500/40 transition-colors">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">Evidence linked</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Every roast is backed by data</p>
            </div>
          </div>

          {/* Cyberpunk Banner "GOOD DEVS TAKE ROASTS" */}
          <div className="relative rounded-2xl bg-zinc-950/90 border border-orange-500/30 p-4 text-center overflow-hidden shadow-lg mt-2">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <Flame className="w-6 h-6 text-orange-500 mb-1" />
              <span className="font-black text-xs font-mono tracking-widest text-orange-400 uppercase">
                GOOD DEVS
              </span>
              <span className="font-black text-sm font-mono tracking-widest text-foreground uppercase">
                TAKE ROASTS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM STRIP: HOW IT WORKS HORIZONTAL TRACK */}
      {/* ========================================================================= */}
      <div className="w-full rounded-2xl bg-zinc-950/90 border border-zinc-800/90 p-4 sm:p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4 text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
          <span className="text-orange-500">❯❯</span>
          <span>How it works</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
            <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono font-black text-xs flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h5 className="text-xs font-bold text-foreground uppercase font-mono">CONNECT</h5>
              <p className="text-[11px] text-muted-foreground mt-0.5">Enter your GitHub username</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
            <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono font-black text-xs flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h5 className="text-xs font-bold text-foreground uppercase font-mono">INSPECT</h5>
              <p className="text-[11px] text-muted-foreground mt-0.5">We analyze your repos, code, and activity</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
            <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono font-black text-xs flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h5 className="text-xs font-bold text-foreground uppercase font-mono">ROAST</h5>
              <p className="text-[11px] text-muted-foreground mt-0.5">Get brutally honest feedback with evidence</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
            <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono font-black text-xs flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h5 className="text-xs font-bold text-foreground uppercase font-mono">RESCUE</h5>
              <p className="text-[11px] text-muted-foreground mt-0.5">Receive a calculated improvement plan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
