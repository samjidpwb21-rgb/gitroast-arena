/**
 * Deterministic Seeded PRNG using Mulberry32 algorithm
 * Guarantees identical roast card and variant selection given the same seed.
 */

export function hashString(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createRoastSeed(username: string, dateStr: string, roastLevel: string): number {
  // Extract day bucket YYYY-MM-DD from date string
  const dayBucket = dateStr.slice(0, 10);
  const compositeKey = `${username.toLowerCase()}:${dayBucket}:${roastLevel}`;
  return hashString(compositeKey);
}

export class SeededRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /**
   * Generates a pseudo-random float in range [0, 1)
   */
  public next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generates a pseudo-random integer in range [min, max] (inclusive)
   */
  public int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Selects a single random item from an array
   */
  public pick<T>(items: readonly T[]): T {
    if (items.length === 0) {
      throw new Error("Cannot pick from an empty array");
    }
    const index = this.int(0, items.length - 1);
    const item = items[index];
    if (item === undefined) {
      throw new Error(`Invalid item picked at index ${index}`);
    }
    return item;
  }

  /**
   * Returns a deterministically shuffled copy of an array
   */
  public shuffle<T>(array: readonly T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      const temp = copy[i]!;
      copy[i] = copy[j]!;
      copy[j] = temp;
    }
    return copy;
  }
}
