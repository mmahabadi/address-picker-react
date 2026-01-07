import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCities, getCountries, getRegions } from '../api/addressApi';
import { mockAddressDataValue } from '../test/mock';
import { useAddressData } from './useAddressData';

vi.mock('../api/addressApi', () => ({
  getCountries: vi.fn(),
  getRegions: vi.fn(),
  getCities: vi.fn(),
}));

describe('useAddressData', () => {
  const mockGetCountries = vi.mocked(getCountries);
  const mockGetRegions = vi.mocked(getRegions);
  const mockGetCities = vi.mocked(getCities);

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCountries.mockResolvedValue(mockAddressDataValue.countries);
    mockGetRegions.mockResolvedValue(mockAddressDataValue.regions);
    mockGetCities.mockResolvedValue(mockAddressDataValue.cities);
  });

  describe('countries loading', () => {
    it('should load countries on mount', async () => {
      const { result } = renderHook(() => useAddressData('', ''));

      expect(result.current.loading.countries).toBe(true);
      expect(mockGetCountries).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(result.current.countries).toEqual(mockAddressDataValue.countries);
      });

      expect(result.current.loading.countries).toBe(false);
      expect(result.current.error.countries).toBeUndefined();
    });

    it('should handle countries loading/error', async () => {
      const errorMessage = 'Failed to fetch countries';
      mockGetCountries.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useAddressData('', ''));

      await waitFor(() => {
        expect(result.current.error.countries).toBe(errorMessage);
      });

      expect(result.current.countries).toEqual([]);
      expect(result.current.loading.countries).toBe(false);
    });
  });

  describe('regions loading', () => {
    it('should not load regions when country is empty', () => {
      const { result } = renderHook(() => useAddressData('', ''));

      expect(mockGetRegions).not.toHaveBeenCalled();
      expect(result.current.regions).toEqual([]);
      expect(result.current.loading.regions).toBe(false);
    });

    it('should load regions when country is provided', async () => {
      const { result } = renderHook(() => useAddressData('NL', ''));

      await waitFor(() => {
        expect(result.current.regions).toEqual(mockAddressDataValue.regions);
      });

      expect(result.current.loading.regions).toBe(false);
      expect(result.current.error.regions).toBeUndefined();
    });

    it('should handle regions loading/error', async () => {
      const errorMessage = 'Failed to fetch regions';
      mockGetRegions.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useAddressData('NL', ''));

      await waitFor(() => {
        expect(result.current.error.regions).toBe(errorMessage);
      });

      expect(result.current.regions).toEqual([]);
      expect(result.current.loading.regions).toBe(false);
    });
  });

  describe('cities loading', () => {
    it('should not load cities when region is empty', () => {
      const { result } = renderHook(() => useAddressData('NL', ''));

      expect(mockGetCities).not.toHaveBeenCalled();
      expect(result.current.cities).toEqual([]);
      expect(result.current.loading.cities).toBe(false);
    });
    it('should load cities when region is provided', async () => {
      const { result } = renderHook(() => useAddressData('NL', 'NL-NH'));

      await waitFor(() => {
        expect(result.current.cities).toEqual(mockAddressDataValue.cities);
      });

      expect(result.current.loading.cities).toBe(false);
      expect(result.current.error.cities).toBeUndefined();
    });
    it('should handle cities loading/error', async () => {
      const errorMessage = 'Failed to fetch cities';
      mockGetCities.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useAddressData('NL', 'NL-NH'));

      await waitFor(() => {
        expect(result.current.error.cities).toBe(errorMessage);
      });

      expect(result.current.cities).toEqual([]);
      expect(result.current.loading.cities).toBe(false);
    });
  });
});
