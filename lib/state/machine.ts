import type { AnalysisResult, RoastLevel } from "@/types";

export type AnalysisStage =
  | "idle"
  | "validating"
  | "fetching"
  | "analyzing"
  | "scoring"
  | "ready"
  | "error";

export type MascotPose =
  | "IDLE"
  | "SEARCHING"
  | "SURPRISED"
  | "LAUGH"
  | "SHRUG"
  | "SMIRK"
  | "LAUGH_SARCASTIC"
  | "LAUGH_HARD"
  | "TALKING"
  | "SMUG_POSE";

export interface AnalysisState {
  stage: AnalysisStage;
  stageMessage: string;
  mascotPose: MascotPose;
  mascotSpeech: string;
  result: AnalysisResult | null;
  error: string | null;
  username: string;
  roastLevel: RoastLevel;
  targetRole: string;
}

export type AnalysisAction =
  | { type: "START_ANALYSIS"; username: string; roastLevel: RoastLevel; targetRole: string }
  | { type: "SET_STAGE"; stage: AnalysisStage; message: string; pose?: MascotPose; speech?: string }
  | { type: "ANALYSIS_SUCCESS"; result: AnalysisResult }
  | { type: "ANALYSIS_ERROR"; error: string }
  | { type: "RESET" };

export const INITIAL_STATE: AnalysisState = {
  stage: "idle",
  stageMessage: "",
  mascotPose: "IDLE",
  mascotSpeech: "Drop a GitHub username. Let's see if your code speaks for itself or cries for help.",
  result: null,
  error: null,
  username: "",
  roastLevel: "spicy",
  targetRole: "",
};

export function getMascotPoseForStage(stage: AnalysisStage): MascotPose {
  switch (stage) {
    case "idle":
      return "IDLE";
    case "validating":
    case "fetching":
      return "SEARCHING";
    case "analyzing":
      return "SURPRISED";
    case "scoring":
      return "SEARCHING";
    case "ready":
      return "LAUGH";
    case "error":
      return "SHRUG";
  }
}

export function getMascotSpeechForStage(stage: AnalysisStage, username?: string): string {
  switch (stage) {
    case "idle":
      return "Drop a GitHub username. Let's see if your code speaks for itself or cries for help.";
    case "validating":
      return `Checking if ${username || "this account"} actually exists on GitHub...`;
    case "fetching":
      return "Connecting to GitHub GraphQL API. Pulling repositories, branches, and commit histories...";
    case "analyzing":
      return "Scanning flagship repositories and inspecting README documentation...";
    case "scoring":
      return "Running local math engine across 7 portfolio vectors. Calculating readiness...";
    case "ready":
      return "The verdict is in! Fresh roasts and a calculated rescue plan are ready.";
    case "error":
      return "Well, that didn't go as planned. Check the details below.";
  }
}

export function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    case "START_ANALYSIS":
      return {
        ...state,
        stage: "validating",
        stageMessage: "Validating username...",
        mascotPose: "SEARCHING",
        mascotSpeech: getMascotSpeechForStage("validating", action.username),
        username: action.username,
        roastLevel: action.roastLevel,
        targetRole: action.targetRole,
        error: null,
        result: null,
      };

    case "SET_STAGE":
      return {
        ...state,
        stage: action.stage,
        stageMessage: action.message,
        mascotPose: action.pose ?? getMascotPoseForStage(action.stage),
        mascotSpeech: action.speech ?? getMascotSpeechForStage(action.stage, state.username),
      };

    case "ANALYSIS_SUCCESS":
      return {
        ...state,
        stage: "ready",
        stageMessage: "Analysis complete!",
        mascotPose: "LAUGH",
        mascotSpeech: getMascotSpeechForStage("ready", state.username),
        result: action.result,
        error: null,
      };

    case "ANALYSIS_ERROR":
      return {
        ...state,
        stage: "error",
        stageMessage: "Analysis failed",
        mascotPose: "SHRUG",
        mascotSpeech: action.error,
        error: action.error,
      };

    case "RESET":
      return INITIAL_STATE;

    default:
      return state;
  }
}
