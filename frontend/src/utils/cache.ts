interface CacheItem {
  value: unknown;
  createdAt: number;
  ttl: number;
}

// Default TTL: 5 minutes
const DEFAULT_TTL = 5 * 60 * 1000;

class Cache {
  private cacheStore = new Map<string, CacheItem>();
  private defaultTTL = DEFAULT_TTL;
  private cleanupInterval: number | null = null;

  constructor(defaultTTL: number = DEFAULT_TTL) {
    this.defaultTTL = defaultTTL;
    // Periodic cleanup of expired entries (every 5 minutes)
    this.startCleanup();
  }

  private startCleanup(): void {
    if (typeof window !== 'undefined' && this.cleanupInterval === null) {
      this.cleanupInterval = window.setInterval(() => {
        this.cleanup();
      }, DEFAULT_TTL);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cacheStore.entries()) {
      if (item.createdAt + item.ttl < now) {
        this.cacheStore.delete(key);
      }
    }
  }

  set(key: string, value: unknown, ttl: number = this.defaultTTL): void {
    const item: CacheItem = {
      value,
      createdAt: Date.now(),
      ttl,
    };
    this.cacheStore.set(key, item);
  }

  get(key: string): unknown {
    const item = this.cacheStore.get(key);
    if (!item) return null;

    if (item.createdAt + item.ttl < Date.now()) {
      this.cacheStore.delete(key);
      return null;
    }

    return item.value;
  }

  has(key: string): boolean {
    const item = this.cacheStore.get(key);
    if (!item) return false;

    if (item.createdAt + item.ttl < Date.now()) {
      this.cacheStore.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cacheStore.delete(key);
  }

  clear(): void {
    this.cacheStore.clear();
  }
}

// Export singleton instance
export const cache = new Cache();
