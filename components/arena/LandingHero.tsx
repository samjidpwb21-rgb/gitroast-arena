"use client";

import React, { useState } from "react";
import { Flame, ShieldAlert, Zap, Skull, ArrowRight, User, Briefcase } from "lucide-react";
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
    accent: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  },
  {
    id: "spicy",
    label: "Spicy",
    tagline: "Sharp & Witty",
    icon: Flame,
    accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  {
    id: "savage",
    label: "Savage",
    tagline: "Direct & Unfiltered",
    icon: ShieldAlert,
    accent: "text-orange-500 border-orange-500/30 bg-orange-500/10",
  },
  {
    id: "brutal",
    label: "Brutal",
    tagline: "Maximum Roast",
    icon: Skull,
    accent: "text-red-500 border-red-500/30 bg-red-500/10",
  },
];

export function LandingHero({ onSubmit, isLoading }: LandingHeroProps) {
  const [rawUsername, setRawUsername] = useState("");
  const [roastLevel, setRoastLevel] = useState<RoastLevel>("spicy");
  const [targetRole, setTargetRole] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

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
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 animate-pulse" />
          Deterministic Math • Evidence-Backed Roasts
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          GitRoast <span className="text-primary">Arena</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Get your real GitHub portfolio scored across 7 vectors, roasted with evidence, and handed a calculated rescue plan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-5">
        {/* Username Input */}
        <div className="space-y-2">
          <label htmlFor="github-username" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            GitHub Username
          </label>
          <div className="relative">
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
              className={`w-full px-4 py-3 rounded-xl bg-background border text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                localError ? "border-destructive focus:ring-destructive" : "border-border"
              }`}
              aria-invalid={Boolean(localError)}
              aria-describedby={localError ? "username-error" : undefined}
            />
          </div>
          {localError && (
            <p id="username-error" role="alert" className="text-xs text-destructive font-medium">
              {localError}
            </p>
          )}
        </div>

        {/* Target Role Input (Optional) */}
        <div className="space-y-2">
          <label htmlFor="target-role" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-primary" />
            Target Role (Optional)
          </label>
          <input
            id="target-role"
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Full-Stack Engineer, Backend Dev"
            disabled={isLoading}
            maxLength={60}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Roast Level Selector */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
            Roast Intensity
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
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-primary ${
                    isSelected
                      ? `${level.accent} ring-1 ring-primary`
                      : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className="w-4 h-4" />
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{level.label}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{level.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !rawUsername.trim()}
          className="w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Entering the Arena...
            </span>
          ) : (
            <>
              <span>Enter the Arena</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
