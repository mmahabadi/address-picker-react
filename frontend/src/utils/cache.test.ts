import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cache } from './cache';

describe('Cache', () => {
  beforeEach(() => {
    cache.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    cache.clear();
  });

  it('should set and get values', () => {
    cache.set('key1', 'value1');
    cache.set('key2', { id: 1, name: 'test' });
    cache.set('key3', null);

    expect(cache.get('key1')).toBe('value1');
    expect(cache.get('key2')).toEqual({ id: 1, name: 'test' });
    expect(cache.get('key3')).toBe(null);
    expect(cache.get('nonexistent')).toBe(null);
  });

  it('should check if key exists', () => {
    cache.set('key1', 'value1');

    expect(cache.has('key1')).toBe(true);
    expect(cache.has('nonexistent')).toBe(false);
  });

  it('should delete key', () => {
    cache.set('key1', 'value1');

    cache.delete('key1');

    expect(cache.get('key1')).toBe(null);
  });

  it('should clear cache', () => {
    cache.set('key1', 'value1');
    cache.set('key2', { id: 1, name: 'test' });

    cache.clear();

    expect(cache.has('key1')).toBeFalsy();
    expect(cache.has('key2')).toBeFalsy();
  });

  it('should handle expired entries', () => {
    cache.set('key1', 'value1', 1000);

    vi.advanceTimersByTime(2000);

    expect(cache.has('key1')).toBeFalsy();
  });

  it('should use custom TTL', () => {
    cache.set('key1', 'value', 2000);

    vi.advanceTimersByTime(1000);
    expect(cache.get('key1')).toBe('value');

    vi.advanceTimersByTime(1500);
    expect(cache.get('key1')).toBe(null);
    expect(cache.has('key1')).toBe(false);
  });

  it('should automatically remove expired items', () => {
    cache.set('key1', 'value1', 1000);
    cache.set('key2', 'value2', 2000);

    expect(cache.has('key1')).toBe(true);
    expect(cache.has('key2')).toBe(true);

    vi.advanceTimersByTime(1500);

    expect(cache.has('key1')).toBeFalsy();
    expect(cache.has('key2')).toBe(true);
  });
});
