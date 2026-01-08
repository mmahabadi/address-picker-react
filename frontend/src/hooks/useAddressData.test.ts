import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockAddressDataValue } from '../test/mock';
import { useAddressData } from './useAddressData';

vi.mock('./useCachedFetcher', () => ({
  useCachedFetcher: vi.fn(),
}));

import { useCachedFetcher } from './useCachedFetcher';

describe('useAddressData', () => {
  const mockUseCachedFetcher = vi.mocked(useCachedFetcher);

  // Helper to mock all three useCachedFetcher calls
  const mockAllFetchers = (
    countries: Partial<ReturnType<typeof useCachedFetcher>> = {},
    regions: Partial<ReturnType<typeof useCachedFetcher>> = {},
    cities: Partial<ReturnType<typeof useCachedFetcher>> = {}
  ) => {
    const defaultMock = {
      data: null,
      loading: false,
      error: null,
      fetchData: vi.fn(),
    };

    mockUseCachedFetcher
      .mockReturnValueOnce({ ...defaultMock, ...countries } as ReturnType<typeof useCachedFetcher>)
      .mockReturnValueOnce({ ...defaultMock, ...regions } as ReturnType<typeof useCachedFetcher>)
      .mockReturnValueOnce({ ...defaultMock, ...cities } as ReturnType<typeof useCachedFetcher>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('countries', () => {
    it('should fetch countries on mount', () => {
      const mockFetchCountries = vi.fn();
      mockAllFetchers({ fetchData: mockFetchCountries });

      renderHook(() => useAddressData('', ''));

      expect(mockFetchCountries).toHaveBeenCalledWith('/api/countries');
    });

    it('should return countries data', () => {
      mockAllFetchers({ data: mockAddressDataValue.countries });

      const { result } = renderHook(() => useAddressData('', ''));

      expect(result.current.countries).toEqual(mockAddressDataValue.countries);
    });

    it('should return countries loading state', () => {
      mockAllFetchers({ loading: true });

      const { result } = renderHook(() => useAddressData('', ''));

      expect(result.current.loading.countries).toBe(true);
    });

    it('should return countries error state', () => {
      const errorMessage = 'Failed to fetch countries';
      mockAllFetchers({ error: errorMessage });

      const { result } = renderHook(() => useAddressData('', ''));

      expect(result.current.error.countries).toBe(errorMessage);
    });
  });

  describe('regions', () => {
    it('should not fetch regions when country is empty', () => {
      const mockFetchRegions = vi.fn();
      mockAllFetchers({}, { fetchData: mockFetchRegions });

      renderHook(() => useAddressData('', ''));

      expect(mockFetchRegions).not.toHaveBeenCalled();
    });

    it('should fetch regions when country is provided', () => {
      const mockFetchRegions = vi.fn();
      mockAllFetchers({}, { fetchData: mockFetchRegions });

      renderHook(() => useAddressData('NL', ''));

      expect(mockFetchRegions).toHaveBeenCalledWith('/api/countries/NL/regions');
    });

    it('should return regions data', () => {
      mockAllFetchers({}, { data: mockAddressDataValue.regions });

      const { result } = renderHook(() => useAddressData('NL', ''));

      expect(result.current.regions).toEqual(mockAddressDataValue.regions);
    });

    it('should return regions error state', () => {
      const errorMessage = 'Failed to fetch regions';
      mockAllFetchers({}, { error: errorMessage });

      const { result } = renderHook(() => useAddressData('NL', ''));

      expect(result.current.error.regions).toBe(errorMessage);
    });
  });

  describe('cities', () => {
    it('should not fetch cities when region is empty', () => {
      const mockFetchCities = vi.fn();
      mockAllFetchers({}, {}, { fetchData: mockFetchCities });

      renderHook(() => useAddressData('NL', ''));

      expect(mockFetchCities).not.toHaveBeenCalled();
    });

    it('should fetch cities when region is provided', () => {
      const mockFetchCities = vi.fn();
      mockAllFetchers({}, {}, { fetchData: mockFetchCities });

      renderHook(() => useAddressData('NL', 'NL-NH'));

      expect(mockFetchCities).toHaveBeenCalledWith('/api/regions/NL-NH/cities');
    });

    it('should return cities data', () => {
      mockAllFetchers({}, {}, { data: mockAddressDataValue.cities });

      const { result } = renderHook(() => useAddressData('NL', 'NL-NH'));

      expect(result.current.cities).toEqual(mockAddressDataValue.cities);
    });

    it('should return cities error state', () => {
      const errorMessage = 'Failed to fetch cities';
      mockAllFetchers({}, {}, { error: errorMessage });

      const { result } = renderHook(() => useAddressData('NL', 'NL-NH'));

      expect(result.current.error.cities).toBe(errorMessage);
    });
  });
});
