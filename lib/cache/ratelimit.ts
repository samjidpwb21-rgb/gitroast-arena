interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

class TokenBucketRateLimiter {
  private buckets = new Map<string, RateLimitEntry>();
  private readonly maxTokens: number;
  private readonly refillRatePerSecond: number;

  constructor(maxTokens: number = 30, refillRatePerSecond: number = 0.5) {
    this.maxTokens = maxTokens;
    this.refillRatePerSecond = refillRatePerSecond;
  }

  public check(key: string, cost: number = 1): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    let entry = this.buckets.get(key);

    if (!entry) {
      entry = { tokens: this.maxTokens, lastRefill: now };
      this.buckets.set(key, entry);
    } else {
      // Refill tokens based on elapsed time
      const elapsedSeconds = (now - entry.lastRefill) / 1000;
      const refilled = elapsedSeconds * this.refillRatePerSecond;
      entry.tokens = Math.min(this.maxTokens, entry.tokens + refilled);
      entry.lastRefill = now;
    }

    if (entry.tokens >= cost) {
      entry.tokens -= cost;
      return {
        allowed: true,
        remaining: Math.floor(entry.tokens),
        resetMs: Math.ceil(((this.maxTokens - entry.tokens) / this.refillRatePerSecond) * 1000),
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.ceil(((cost - entry.tokens) / this.refillRatePerSecond) * 1000),
    };
  }

  public clear(): void {
    this.buckets.clear();
  }
}

// IP Rate Limiter instance: 30 requests capacity, refills 0.5 tokens/sec (30 tokens/minute)
export const ipRateLimiter = new TokenBucketRateLimiter(30, 0.5);

// Refresh Rate Limiter instance: 5 requests capacity, refills 0.1 tokens/sec (6 tokens/minute)
export const refreshRateLimiter = new TokenBucketRateLimiter(5, 0.1);
