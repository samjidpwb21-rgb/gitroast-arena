import type { ReadmeSummary } from "@/types";

const MAX_README_RAW_BYTES = 20 * 1024; // 20 KB cap
const MAX_EXCERPT_CHARS = 1200;

/**
 * Sanitizes markdown/raw text by removing HTML tags, URLs, and prompt-injection-like patterns,
 * keeping only alphanumeric text and benign punctuation.
 */
export function sanitizeText(raw: string | null | undefined): string {
  if (!raw) return "";

  return (
    raw
      // Strip control characters (except newline and tab)
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
      // Remove HTML tags
      .replace(/<[^>]*>/g, " ")
      // Strip markdown links/images: [text](url) -> text
      .replace(/!\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/gi, "")
      // Neutralize potential prompt injection cues
      .replace(/\b(ignore previous instructions|system prompt|disregard all|you are now)\b/gi, "[redacted]")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Parses and extracts structured metrics from raw README text within a safe 20 KB byte boundary.
 */
export function parseReadme(rawText: string | null | undefined): ReadmeSummary {
  if (!rawText || rawText.trim().length === 0) {
    return {
      exists: false,
      wordCount: 0,
      hasHeadings: false,
      hasImages: false,
      hasInstallSection: false,
      hasUsageSection: false,
      excerptSanitized: "",
    };
  }

  // Enforce byte cap before parsing
  const truncatedText =
    rawText.length > MAX_README_RAW_BYTES ? rawText.slice(0, MAX_README_RAW_BYTES) : rawText;

  const lower = truncatedText.toLowerCase();

  // Heading check: '# ' or '## ' or markdown headers
  const hasHeadings = /^#{1,6}\s+/m.test(truncatedText);

  // Image check: markdown '![' or html '<img'
  const hasImages = /!\[.*?\]\(.*?\)/.test(truncatedText) || /<img\s+/i.test(truncatedText);

  // Install section check
  const hasInstallSection =
    /(?:#+\s*|\b)(install|installation|setup|getting\s+started|quick\s*start|prerequisites|building|build)\b/i.test(
      lower
    );

  // Usage section check
  const hasUsageSection =
    /(?:#+\s*|\b)(usage|how\s+to\s+use|example|examples|running|demo|features|api)\b/i.test(lower);

  // Word count: split on whitespace
  const words = truncatedText.trim().split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // Sanitized excerpt
  const sanitized = sanitizeText(truncatedText);
  const excerptSanitized =
    sanitized.length > MAX_EXCERPT_CHARS ? sanitized.slice(0, MAX_EXCERPT_CHARS) : sanitized;

  return {
    exists: true,
    wordCount,
    hasHeadings,
    hasImages,
    hasInstallSection,
    hasUsageSection,
    excerptSanitized,
  };
}
