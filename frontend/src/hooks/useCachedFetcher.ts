import { useCallback, useEffect, useRef, useState } from 'react';
import { cache } from '../utils/cache';
import { generateCacheKey } from '../utils/cacheKey';
import { requestManager } from '../utils/requests';

interface CachedFetcherResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  fetchData: (url: string, options?: RequestInit) => Promise<void>;
}

/**
 * Flow:
 * Step 1: Check cache first
 * Step 2: Check for pending request to avoid duplicate requests
 * Step 3: Create new request
 */
export const useCachedFetcher = <T>(): CachedFetcherResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!url) {
      setError('URL is required');
      return;
    }

    setError(null);
    const cacheKey = generateCacheKey(url, options);

    // Step 1: Check cache first
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      setData(cachedData as T);
      setLoading(false);
      return;
    }

    // Step 2: Check for pending request to avoid duplicate requests
    const pendingRequest = requestManager.getPendingRequest(cacheKey);
    if (pendingRequest) {
      setLoading(true);
      try {
        const result = await pendingRequest;
        setData(result as T);
        setLoading(false);
        setError(null);
        return;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred fetching data';
        setError(errorMessage);
        setLoading(false);
        return;
      }
    }

    // Step 3: Create new request
    setLoading(true);
    setError(null);

    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const result = await requestManager.createFetchRequest(
        cacheKey,
        url,
        options,
        abortControllerRef.current.signal
      );
      setData(result as T);
      setError(null);
    } catch (err: unknown) {
      // Only set error if request wasn't aborted
      if (!(err instanceof Error && err.name === 'AbortError')) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred fetching data';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};
