import { cache } from './cache';

class RequestManager {
  private pendingRequests = new Map<string, Promise<unknown>>();

  getPendingRequest(cacheKey: string): Promise<unknown> | null {
    return this.pendingRequests.get(cacheKey) || null;
  }

  createFetchRequest(
    cacheKey: string,
    url: string,
    options: RequestInit,
    signal: AbortSignal
  ): Promise<unknown> {
    const requestPromise = (async () => {
      try {
        const response = await fetch(url, { ...options, signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        cache.set(cacheKey, data);
        return data;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          throw err;
        }
        throw err;
      } finally {
        this.pendingRequests.delete(cacheKey);
      }
    })();

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }
}

// Export singleton instance
export const requestManager = new RequestManager();
