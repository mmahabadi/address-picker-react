import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cache } from '../utils/cache';
import { requestManager } from '../utils/requests';
import { useCachedFetcher } from './useCachedFetcher';

vi.mock('../utils/cache', () => ({
  cache: {
    get: vi.fn(),
  },
}));

vi.mock('../utils/requests', () => ({
  requestManager: {
    getPendingRequest: vi.fn(),
    createFetchRequest: vi.fn(),
  },
}));

describe('useCachedFetcher', () => {
  const mockCache = vi.mocked(cache);
  const mockRequestManager = vi.mocked(requestManager);

  beforeEach(() => {
    vi.clearAllMocks();

    mockCache.get.mockReturnValue(undefined);
    mockRequestManager.getPendingRequest.mockReturnValue(null);
    mockRequestManager.createFetchRequest.mockResolvedValue(null);
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useCachedFetcher<unknown>());

    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.fetchData).toBe('function');
  });

  it('should set error for empty URL', async () => {
    const { result } = renderHook(() => useCachedFetcher<unknown>());

    await act(async () => {
      await result.current.fetchData('');
    });

    expect(result.current.error).toBe('URL is required');
    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it('should return cached data without making a request', async () => {
    const cachedData = { id: 1, name: 'Cached Item' };
    mockCache.get.mockReturnValue(cachedData);

    const { result } = renderHook(() => useCachedFetcher<unknown>());

    await act(async () => {
      await result.current.fetchData('/api/countries');
    });

    expect(mockCache.get).toHaveBeenCalledWith('/api/countries');
    expect(result.current.data).toEqual(cachedData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockRequestManager.getPendingRequest).not.toHaveBeenCalled();
    expect(mockRequestManager.createFetchRequest).not.toHaveBeenCalled();
  });

  it('should make request when cached value is undefined', async () => {
    const responseData = { id: 1, name: 'Fresh Data' };
    mockCache.get.mockReturnValue(undefined);
    mockRequestManager.createFetchRequest.mockResolvedValue(responseData);

    const { result } = renderHook(() => useCachedFetcher<unknown>());

    await act(async () => {
      await result.current.fetchData('/api/countries');
    });

    expect(mockRequestManager.createFetchRequest).toHaveBeenCalled();
    expect(result.current.data).toEqual(responseData);
  });

  it('should use pending request instead of creating new one', async () => {
    const pendingData = { id: 1, name: 'Pending Item' };
    const pendingPromise = Promise.resolve(pendingData);

    mockRequestManager.getPendingRequest.mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useCachedFetcher<unknown>());

    await act(async () => {
      await result.current.fetchData('/api/countries');
    });

    expect(mockRequestManager.getPendingRequest).toHaveBeenCalledWith('/api/countries');
    expect(result.current.data).toEqual(pendingData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockRequestManager.createFetchRequest).not.toHaveBeenCalled();
  });

  it('should create new request successfully', async () => {
    const responseData = { id: 1, name: 'New Item' };
    mockRequestManager.createFetchRequest.mockResolvedValue(responseData);

    const { result } = renderHook(() => useCachedFetcher<unknown>());

    await act(async () => {
      await result.current.fetchData('/api/countries');
    });

    expect(mockRequestManager.createFetchRequest).toHaveBeenCalledWith(
      '/api/countries',
      '/api/countries',
      {},
      expect.any(AbortSignal)
    );
    expect(result.current.data).toEqual(responseData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});
