export type GitHubErrorCode =
  | "INVALID_USERNAME"
  | "USER_NOT_FOUND"
  | "UNSUPPORTED_ACCOUNT_TYPE"
  | "BOT_ACCOUNT"
  | "RATE_LIMITED"
  | "GITHUB_TIMEOUT"
  | "GITHUB_UNAVAILABLE"
  | "SCHEMA_MISMATCH"
  | "INSUFFICIENT_DATA";

export interface GitHubErrorDetails {
  code: GitHubErrorCode;
  message: string;
  userFacingMessage: string;
  rateLimitReset?: Date;
  status?: number;
}

export class GitHubApiError extends Error {
  public readonly code: GitHubErrorCode;
  public readonly userFacingMessage: string;
  public readonly rateLimitReset?: Date;
  public readonly status?: number;

  constructor(details: GitHubErrorDetails) {
    super(details.message);
    this.name = "GitHubApiError";
    this.code = details.code;
    this.userFacingMessage = details.userFacingMessage;
    this.rateLimitReset = details.rateLimitReset;
    this.status = details.status;
  }
}

export function createGitHubError(details: GitHubErrorDetails): GitHubApiError {
  return new GitHubApiError(details);
}

export function getUserFacingErrorMessage(code: GitHubErrorCode, resetDate?: Date): string {
  switch (code) {
    case "INVALID_USERNAME":
      return "The requested GitHub username is invalid.";
    case "USER_NOT_FOUND":
      return "GitHub user not found. Please double-check the username.";
    case "UNSUPPORTED_ACCOUNT_TYPE":
      return "Organizations cannot be roasted directly. Please provide an individual developer username.";
    case "BOT_ACCOUNT":
      return "Bot accounts cannot be analyzed. Please provide a human developer account.";
    case "RATE_LIMITED":
      return resetDate
        ? `GitHub API rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}.`
        : "GitHub API rate limit exceeded. Please wait a few minutes before trying again.";
    case "GITHUB_TIMEOUT":
      return "GitHub took too long to respond (timeout). Please try again in a moment.";
    case "GITHUB_UNAVAILABLE":
      return "GitHub servers appear unavailable or returned an upstream error. Try again shortly.";
    case "SCHEMA_MISMATCH":
      return "Unexpected response format received from GitHub API.";
    case "INSUFFICIENT_DATA":
      return "Not enough public activity or repositories to generate an evidence-backed roast.";
  }
}
