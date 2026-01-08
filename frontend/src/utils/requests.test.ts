import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { cache } from './cache';
import { requestManager } from './requests';

vi.mock('./cache', () => ({
  cache: {
    set: vi.fn(),
    get: vi.fn(),
    clear: vi.fn(),
  },
}));

describe('RequestManager', () => {
  const mockFetch = vi.fn();
  const originalFetch = globalThis.fetch;

  beforeAll(() => {
    globalThis.fetch = mockFetch;
  });

  afterAll(() => {
    globalThis.fetch = originalFetch;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  it('should create a fetch request', async () => {
    const responseData = { code: 'NL', name: 'Netherlands' };
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(responseData),
    });

    const result = await requestManager.createFetchRequest(
      '/api/countries',
      '/api/countries',
      {},
      new AbortSignal()
    );

    expect(result).toEqual(responseData);
    expect(mockFetch).toHaveBeenCalledWith('/api/countries', { signal: expect.any(AbortSignal) });
    expect(cache.set).toHaveBeenCalledWith('/api/countries', responseData);
  });

  it('should handle errors', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(
      requestManager.createFetchRequest('/api/countrie', '/api/countries', {}, new AbortSignal())
    ).rejects.toThrow('HTTP error! status: 404');

    expect(cache.set).not.toHaveBeenCalled();
  });

  it('should manage pending requests', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    const requestPromise = requestManager.createFetchRequest(
      '/api/countries',
      '/api/countries',
      {},
      new AbortSignal()
    );

    expect(requestManager.getPendingRequest('/api/countries')).toBe(requestPromise);
    expect(requestManager.getPendingRequest('nonexistent')).toBe(null);

    await requestPromise;

    // Should clean up after completion
    expect(requestManager.getPendingRequest('/api/countries')).toBe(null);
  });
});
