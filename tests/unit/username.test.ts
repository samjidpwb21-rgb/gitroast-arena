import { describe, it, expect } from "vitest";
import { validateUsername, sanitizeTargetRole, validateAnalyzeInput } from "@/lib/validation/username";

describe("validateUsername", () => {
  it("accepts valid standard GitHub usernames", () => {
    expect(validateUsername("octocat")).toEqual({ valid: true, normalized: "octocat" });
    expect(validateUsername("torvalds")).toEqual({ valid: true, normalized: "torvalds" });
    expect(validateUsername("samjid-p")).toEqual({ valid: true, normalized: "samjid-p" });
    expect(validateUsername("User-123-Name")).toEqual({ valid: true, normalized: "user-123-name" });
    expect(validateUsername("a")).toEqual({ valid: true, normalized: "a" });
  });

  it("trims whitespace", () => {
    expect(validateUsername("  octocat  ")).toEqual({ valid: true, normalized: "octocat" });
  });

  it("rejects empty or whitespace-only strings", () => {
    expect(validateUsername("")).toEqual({ valid: false, normalized: "", error: "Username cannot be empty." });
    expect(validateUsername("   ")).toEqual({ valid: false, normalized: "", error: "Username cannot be empty." });
  });

  it("rejects non-string inputs", () => {
    expect(validateUsername(null)).toEqual({ valid: false, normalized: "", error: "Username must be a string." });
    expect(validateUsername(12345)).toEqual({ valid: false, normalized: "", error: "Username must be a string." });
    expect(validateUsername(undefined)).toEqual({ valid: false, normalized: "", error: "Username must be a string." });
  });

  it("rejects usernames exceeding 39 characters", () => {
    const longName = "a".repeat(40);
    const res = validateUsername(longName);
    expect(res.valid).toBe(false);
    expect(res.error).toContain("cannot exceed 39 characters");
  });

  it("rejects usernames beginning or ending with a hyphen", () => {
    expect(validateUsername("-octocat").valid).toBe(false);
    expect(validateUsername("-octocat").error).toContain("begin or end with a hyphen");
    expect(validateUsername("octocat-").valid).toBe(false);
    expect(validateUsername("octocat-").error).toContain("begin or end with a hyphen");
  });

  it("rejects usernames with consecutive hyphens", () => {
    expect(validateUsername("octo--cat").valid).toBe(false);
    expect(validateUsername("octo--cat").error).toContain("consecutive hyphens");
  });

  it("rejects usernames with invalid special characters", () => {
    expect(validateUsername("octo@cat").valid).toBe(false);
    expect(validateUsername("octo.cat").valid).toBe(false);
    expect(validateUsername("octo cat").valid).toBe(false);
    expect(validateUsername("octo/cat").valid).toBe(false);
  });
});

describe("sanitizeTargetRole", () => {
  it("cleans and clamps target role strings", () => {
    expect(sanitizeTargetRole("Frontend Engineer")).toBe("Frontend Engineer");
    expect(sanitizeTargetRole("   Senior Full-Stack Developer   ")).toBe("Senior Full-Stack Developer");
    expect(sanitizeTargetRole("Role with \x00 null and \x1F control")).toBe("Role with  null and  control");
  });

  it("clamps to 60 characters", () => {
    const longRole = "A".repeat(100);
    expect(sanitizeTargetRole(longRole)?.length).toBe(60);
  });

  it("returns null for non-strings or empty inputs", () => {
    expect(sanitizeTargetRole(null)).toBeNull();
    expect(sanitizeTargetRole("   ")).toBeNull();
    expect(sanitizeTargetRole(123)).toBeNull();
  });
});

describe("validateAnalyzeInput", () => {
  it("validates valid payload", () => {
    const res = validateAnalyzeInput({
      username: "OctoCat",
      roastLevel: "savage",
      targetRole: "Backend Dev",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.username).toBe("octocat");
      expect(res.roastLevel).toBe("savage");
      expect(res.targetRole).toBe("Backend Dev");
    }
  });

  it("defaults roastLevel to spicy if omitted", () => {
    const res = validateAnalyzeInput({
      username: "octocat",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.roastLevel).toBe("spicy");
    }
  });

  it("rejects invalid roastLevel", () => {
    const res = validateAnalyzeInput({
      username: "octocat",
      roastLevel: "nuclear",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.field).toBe("roastLevel");
    }
  });
});
