"use client";

import React, { useEffect, useState } from "react";
import { Play, Pause, Square, SkipForward, Volume2, VolumeX, Sparkles, Smile, Flame, Sliders } from "lucide-react";
import { audioManager } from "@/lib/audio/audioManager";
import { AudioMode, VoiceSettings } from "@/lib/audio/types";

interface RoastShowControllerProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentIndex: number;
  totalPanels: number;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSkip: () => void;
}

type ComedianPersona = "fox" | "deadpan" | "hyper";

const PERSONAS: Array<{
  id: ComedianPersona;
  name: string;
  tagline: string;
  rate: number;
  pitch: number;
  icon: React.ElementType;
}> = [
  {
    id: "fox",
    name: "Sarcastic Fox",
    tagline: "Witty & punchy standup",
    rate: 1.05,
    pitch: 1.1,
    icon: Sparkles,
  },
  {
    id: "deadpan",
    name: "Deadpan Critic",
    tagline: "Dry & brutally calm",
    rate: 0.95,
    pitch: 0.9,
    icon: Smile,
  },
  {
    id: "hyper",
    name: "Hyper Roast",
    tagline: "Fast & aggressive roast",
    rate: 1.25,
    pitch: 1.2,
    icon: Flame,
  },
];

export const RoastShowController: React.FC<RoastShowControllerProps> = ({
  isPlaying,
  isPaused,
  currentIndex,
  totalPanels,
  onPlay,
  onPause,
  onResume,
  onStop,
  onSkip,
}) => {
  const [settings, setSettings] = useState<VoiceSettings>(audioManager.getSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [activePersona, setActivePersona] = useState<ComedianPersona>("fox");

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((next) => {
      setSettings(next);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleSound = () => {
    audioManager.toggleSound();
  };

  const handleModeChange = (mode: AudioMode) => {
    audioManager.setAudioMode(mode);
  };

  const handleApplyPersona = (personaId: ComedianPersona) => {
    setActivePersona(personaId);
    const p = PERSONAS.find((item) => item.id === personaId);
    if (p) {
      audioManager.updateSettings({ rate: p.rate, pitch: p.pitch });
    }
  };

  const handleVolumeChange = (volume: number) => {
    audioManager.setVolume(volume);
  };

  return (
    <div className="w-full flex flex-col gap-2.5 p-3 bg-zinc-950/85 border-2 border-zinc-800 rounded-xl shadow-md backdrop-blur-md">
      {/* Polite Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isPlaying
          ? `Playing Comic Roast Show: Panel ${currentIndex + 1} of ${totalPanels}`
          : "Comic Roast Show is idle"}
      </div>

      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Main Play / Navigation Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {!isPlaying ? (
            <button
              onClick={() => {
                audioManager.toggleSound(true);
                onPlay();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              aria-label="Play Comic Roast Show"
            >
              <Play className="w-4 h-4 fill-current" />
              Play Roast Show
            </button>
          ) : isPaused ? (
            <button
              onClick={onResume}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-500 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-orange-600 transition-all"
              aria-label="Resume Roast Show"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Resume
            </button>
          ) : (
            <button
              onClick={onPause}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-amber-600 transition-all"
              aria-label="Pause Roast Show"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              Pause
            </button>
          )}

          {isPlaying && (
            <>
              <button
                onClick={onSkip}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-foreground font-semibold text-xs rounded-lg transition-colors"
                aria-label="Skip to next panel"
              >
                <SkipForward className="w-3.5 h-3.5" />
                Skip
              </button>

              <button
                onClick={onStop}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 border border-zinc-700 hover:border-rose-500/50 hover:text-rose-400 text-muted-foreground font-semibold text-xs rounded-lg transition-colors"
                aria-label="Stop Roast Show"
              >
                <Square className="w-3.5 h-3.5" />
                Stop
              </button>

              {/* Progress indicator */}
              <span className="font-mono text-xs font-semibold px-2 py-1 bg-zinc-900 text-orange-400 border border-zinc-800 rounded-md">
                Panel {currentIndex + 1} / {totalPanels}
              </span>
            </>
          )}
        </div>

        {/* Audio & Persona Quick Controls */}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Sound Toggle (Mute / Unmute) */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-colors ${
              settings.soundEnabled
                ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                : "bg-zinc-900 border-zinc-800 text-muted-foreground hover:text-foreground"
            }`}
            aria-label={settings.soundEnabled ? "Mute audio" : "Enable sound"}
            title={settings.soundEnabled ? "Mute sound" : "Turn sound ON"}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Audio Mode Quick Toggle */}
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 text-xs font-mono">
            {(["both", "voice-only", "sfx-only"] as AudioMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  settings.audioMode === mode
                    ? "bg-orange-500 text-zinc-950 font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={`Set audio mode to ${mode}`}
              >
                {mode === "both" ? "Voice+SFX" : mode === "voice-only" ? "Voice" : "SFX"}
              </button>
            ))}
          </div>

          {/* Persona / Settings Drawer Trigger */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showSettings
                ? "bg-zinc-800 border-zinc-600 text-foreground"
                : "bg-zinc-900 border-zinc-800 text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Comedian Personality Settings"
            title="Choose Comedian Voice & Speed"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Persona</span>
          </button>
        </div>
      </div>

      {/* Comedian Persona Selector & Volume */}
      {showSettings && (
        <div className="w-full pt-3 mt-1 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            const isSelected = activePersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleApplyPersona(p.id)}
                className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-orange-500/15 border-orange-500/60 text-orange-400 shadow-sm"
                    : "bg-zinc-900 border-zinc-800 text-muted-foreground hover:text-foreground hover:bg-zinc-800/60"
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Icon className="w-3.5 h-3.5 text-orange-400" />
                  <span>{p.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5">{p.tagline}</span>
              </button>
            );
          })}

          {/* Master Volume */}
          <div className="flex flex-col justify-center gap-1 px-2">
            <div className="flex justify-between text-muted-foreground font-semibold text-[11px]">
              <span>Volume</span>
              <span className="font-mono text-orange-400">{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="accent-orange-500 w-full"
              aria-label="Master Volume"
            />
          </div>
        </div>
      )}
    </div>
  );
};
