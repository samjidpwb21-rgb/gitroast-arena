class SingleFlightManager {
  private inFlight = new Map<string, Promise<unknown>>();

  public async do<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.inFlight.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = (async () => {
      try {
        return await fn();
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  public isInFlight(key: string): boolean {
    return this.inFlight.has(key);
  }

  public activeCount(): number {
    return this.inFlight.size;
  }
}

export const singleFlight = new SingleFlightManager();
