import { AudioMode, DEFAULT_VOICE_SETTINGS, SFXName, VoiceSettings } from "./types";
import { WebAudioSynthesizer } from "./synthesizer";
import { loadVoiceSettings, saveVoiceSettings } from "./settings";

class AudioManager {
  private synth: WebAudioSynthesizer | null = null;
  private settings: VoiceSettings = DEFAULT_VOICE_SETTINGS;
  private isInitialized = false;
  private isSpeaking = false;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private listeners: Set<(settings: VoiceSettings) => void> = new Set();

  constructor() {
    // Only in browser
    if (typeof window !== "undefined") {
      this.settings = loadVoiceSettings();
      this.setupVisibilityListener();
    }
  }

  public subscribe(listener: (settings: VoiceSettings) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.settings));
  }

  private setupVisibilityListener() {
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.stopSpeech();
        }
      });
    }
  }

  /**
   * Lazily initialize audio context on user gesture
   */
  public async init(): Promise<void> {
    if (this.isInitialized || typeof window === "undefined") return;

    try {
      this.synth = new WebAudioSynthesizer();
      await this.synth.init();
      this.loadVoices();
      if (typeof window.speechSynthesis !== "undefined") {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
      this.isInitialized = true;
    } catch {
      // Degrade gracefully if Web Audio is unsupported
    }
  }

  private loadVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    this.availableVoices = voices;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.availableVoices.length === 0 && typeof window !== "undefined" && "speechSynthesis" in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }
    return this.availableVoices;
  }

  public getSettings(): VoiceSettings {
    return this.settings;
  }

  public updateSettings(partial: Partial<VoiceSettings>): VoiceSettings {
    this.settings = saveVoiceSettings(partial);
    this.notify();
    return this.settings;
  }

  public toggleSound(enabled?: boolean): boolean {
    const nextState = enabled !== undefined ? enabled : !this.settings.soundEnabled;
    this.updateSettings({ soundEnabled: nextState });
    if (nextState && !this.isInitialized) {
      this.init();
    }
    return nextState;
  }

  public setAudioMode(mode: AudioMode) {
    this.updateSettings({ audioMode: mode });
  }

  public setVolume(volume: number) {
    this.updateSettings({ volume: Math.max(0, Math.min(1, volume)) });
  }

  /**
   * Play SFX using procedural synthesis or fallback audio file
   */
  public async playSFX(name: SFXName): Promise<void> {
    if (!this.settings.soundEnabled) return;
    if (this.settings.audioMode === "voice-only") return;

    if (!this.isInitialized) {
      await this.init();
    }

    const volume = (this.isSpeaking ? 0.35 : 1.0) * this.settings.volume;

    // Procedural synthesis priority
    if (this.synth) {
      if (name === "whoosh") return this.synth.playWhoosh(volume);
      if (name === "pop") return this.synth.playPop(volume);
      if (name === "sizzle") return this.synth.playSizzle(volume);
      if (name === "click") return this.synth.playClick(volume);
      if (name === "stinger") return this.synth.playStinger(volume);
      if (name === "rimshot") return this.synth.playRimshot(volume);
    }

    // Audio file playback with silent degradation
    const fileMap: Record<string, string> = {
      smirk: "/sfx/smirk-01.mp3",
      laugh_sarcastic: "/sfx/laugh-sarcastic-01.mp3",
      laugh_hard: "/sfx/laugh-evil-01.mp3",
    };

    const filePath = fileMap[name];
    if (filePath && typeof window !== "undefined") {
      try {
        let audio = this.audioElements.get(filePath);
        if (!audio) {
          audio = new Audio(filePath);
          this.audioElements.set(filePath, audio);
        }
        audio.volume = Math.min(1, Math.max(0, volume * 0.8));
        audio.currentTime = 0;
        await audio.play().catch(() => {
          // If file not found, fall back to procedural synthesis
          if (name === "smirk") this.synth?.playStinger(volume);
          else if (name === "laugh_sarcastic" || name === "laugh_hard") this.synth?.playSizzle(volume);
        });
      } catch {
        // Silent degrade
      }
    }
  }

  /**
   * Speak text using Web Speech API with event-driven callbacks
   */
  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onBoundary?: (event: SpeechSynthesisEvent) => void;
      onEnd?: () => void;
      onError?: (error: unknown) => void;
    }
  ): boolean {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      options?.onError?.(new Error("speechSynthesis unsupported"));
      return false;
    }

    if (!this.settings.soundEnabled || this.settings.audioMode === "sfx-only") {
      // Calculate bounded reading-time fallback
      const words = text.split(/\s+/).length;
      const readingTimeMs = Math.min(4500, Math.max(1200, words * 160));
      options?.onStart?.();
      setTimeout(() => {
        options?.onEnd?.();
      }, readingTimeMs);

      // Return a way to cancel if needed
      return true;
    }

    // Cancel any current utterance before speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;

    // Pick chosen voice or sensible default
    const voices = this.getVoices();
    if (this.settings.voiceUri) {
      const matched = voices.find((v) => v.voiceURI === this.settings.voiceUri);
      if (matched) utterance.voice = matched;
    } else {
      // Pick sensible English voice
      const defaultVoice =
        voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"))) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0];
      if (defaultVoice) utterance.voice = defaultVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      options?.onStart?.();
    };

    utterance.onboundary = (e) => {
      options?.onBoundary?.(e);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      options?.onError?.(e);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  }

  public stopSpeech() {
    this.isSpeaking = false;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  public stopAll() {
    this.stopSpeech();
    this.audioElements.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignore
      }
    });
  }
}

export const audioManager = new AudioManager();
