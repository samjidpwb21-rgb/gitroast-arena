import { z } from "zod";

export type AudioMode = "both" | "voice-only" | "sfx-only";

export const VoiceSettingsSchema = z
  .object({
    voiceUri: z.string().nullable().default(null),
    rate: z.number().min(0.8).max(1.3).default(1.0),
    pitch: z.number().min(0.7).max(1.3).default(1.0),
    volume: z.number().min(0).max(1).default(1.0),
    soundEnabled: z.boolean().default(false), // Sound is OFF until explicitly started
    audioMode: z.enum(["both", "voice-only", "sfx-only"]).default("both"),
  })
  .strict();

export type VoiceSettings = z.infer<typeof VoiceSettingsSchema>;

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceUri: null,
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  soundEnabled: false,
  audioMode: "both",
};

export type SFXName =
  | "whoosh"
  | "pop"
  | "sizzle"
  | "click"
  | "stinger"
  | "rimshot"
  | "smirk"
  | "laugh_sarcastic"
  | "laugh_hard";

export interface ReactionConfig {
  mascotPose: "SMIRK" | "LAUGH_SARCASTIC" | "LAUGH_HARD";
  sfx: SFXName;
  onomatopoeia?: "BURN!" | "OOF!" | "HA!" | "OUCH!" | "SIZZLE!" | "SNAP!";
  screenShake: boolean;
}
