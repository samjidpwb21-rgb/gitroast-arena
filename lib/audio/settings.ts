import { DEFAULT_VOICE_SETTINGS, VoiceSettings, VoiceSettingsSchema } from "./types";

const STORAGE_KEY = "gitroast_voice_settings_v1";

export function loadVoiceSettings(): VoiceSettings {
  if (typeof window === "undefined") {
    return DEFAULT_VOICE_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VOICE_SETTINGS;
    const parsed = JSON.parse(raw);
    const validated = VoiceSettingsSchema.safeParse(parsed);
    if (validated.success) {
      return validated.data;
    }
  } catch {
    // Ignore JSON errors or localStorage restrictions
  }

  return DEFAULT_VOICE_SETTINGS;
}

export function saveVoiceSettings(settings: Partial<VoiceSettings>): VoiceSettings {
  if (typeof window === "undefined") {
    return { ...DEFAULT_VOICE_SETTINGS, ...settings };
  }

  try {
    const current = loadVoiceSettings();
    const updated = { ...current, ...settings };
    const validated = VoiceSettingsSchema.parse(updated);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    return validated;
  } catch {
    return { ...DEFAULT_VOICE_SETTINGS, ...settings };
  }
}
