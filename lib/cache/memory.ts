interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryTtlCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlSeconds: number = 600): void {
    const clampedTtl = Math.min(900, Math.max(300, ttlSeconds));
    const expiresAt = Date.now() + clampedTtl * 1000;
    this.cache.set(key, { data, expiresAt });
  }

  public invalidate(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}

// Global singleton for server runtime
export const memoryCache = new MemoryTtlCache();
