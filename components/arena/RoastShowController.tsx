"use client";

import React, { useEffect, useState } from "react";
import { Play, Pause, Square, SkipForward, Volume2, VolumeX, Settings2 } from "lucide-react";
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Subscribe to settings updates
    const unsubscribe = audioManager.subscribe((next) => {
      setSettings(next);
    });

    // Load voices
    if (typeof window !== "undefined") {
      const v = audioManager.getVoices();
      setVoices(v);
      if (typeof window.speechSynthesis !== "undefined") {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoices(audioManager.getVoices());
        };
      }
    }

    return () => unsubscribe();
  }, []);

  const handleToggleSound = () => {
    audioManager.toggleSound();
  };

  const handleModeChange = (mode: AudioMode) => {
    audioManager.setAudioMode(mode);
  };

  const handleVoiceChange = (voiceUri: string) => {
    audioManager.updateSettings({ voiceUri });
  };

  const handleRateChange = (rate: number) => {
    audioManager.updateSettings({ rate });
  };

  const handlePitchChange = (pitch: number) => {
    audioManager.updateSettings({ pitch });
  };

  const handleVolumeChange = (volume: number) => {
    audioManager.setVolume(volume);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-zinc-950/80 border-2 border-zinc-800 rounded-xl shadow-md backdrop-blur-md">
      {/* Polite Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isPlaying
          ? `Playing Comic Roast Show: Panel ${currentIndex + 1} of ${totalPanels}`
          : "Comic Roast Show is idle"}
      </div>

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

      {/* Audio & Voice Settings Controls */}
      <div className="flex items-center gap-2 ml-auto">
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
              {mode === "both" ? "All" : mode === "voice-only" ? "Voice" : "SFX"}
            </button>
          ))}
        </div>

        {/* Voice Settings Popover Trigger */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg border transition-colors ${
            showSettings
              ? "bg-zinc-800 border-zinc-600 text-foreground"
              : "bg-zinc-900 border-zinc-800 text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Configure Voice Settings"
          title="Voice & Speed Settings"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      {/* Voice & Sound Settings Drawer / Popover */}
      {showSettings && (
        <div className="w-full mt-2 pt-3 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Voice Selector */}
          <div className="flex flex-col gap-1">
            <label htmlFor="voice-picker" className="font-semibold text-muted-foreground">
              Narrator Voice
            </label>
            {voices.length > 0 ? (
              <select
                id="voice-picker"
                value={settings.voiceUri || ""}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-xs text-foreground focus:outline-none focus:border-orange-500"
              >
                <option value="">Default English Voice</option>
                {voices
                  .filter((v) => v.lang.startsWith("en"))
                  .map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
              </select>
            ) : (
              <span className="text-muted-foreground italic text-[11px]">Browser TTS voices loading...</span>
            )}
          </div>

          {/* Speed / Rate Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-muted-foreground font-semibold">
              <span>Speed</span>
              <span className="font-mono">{settings.rate}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.05"
              value={settings.rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="accent-orange-500 w-full"
              aria-label="Speech Speed"
            />
          </div>

          {/* Pitch Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-muted-foreground font-semibold">
              <span>Pitch</span>
              <span className="font-mono">{settings.pitch}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={settings.pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="accent-orange-500 w-full"
              aria-label="Voice Pitch"
            />
          </div>

          {/* Volume Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-muted-foreground font-semibold">
              <span>Master Volume</span>
              <span className="font-mono">{Math.round(settings.volume * 100)}%</span>
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

