import { useEffect, useMemo } from 'react';
import type { AddressDataValues, City, Country, Region } from '../types';
import { useCachedFetcher } from './useCachedFetcher';

export const useAddressData = (country: string, region: string): AddressDataValues => {
  const {
    data: countriesData,
    loading: countriesLoading,
    error: countriesError,
    fetchData: fetchCountries,
  } = useCachedFetcher<Country[]>();
  const {
    data: regionsData,
    loading: regionsLoading,
    error: regionsError,
    fetchData: fetchRegions,
  } = useCachedFetcher<Region[]>();
  const {
    data: citiesData,
    loading: citiesLoading,
    error: citiesError,
    fetchData: fetchCities,
  } = useCachedFetcher<City[]>();

  const countries = useMemo(() => countriesData ?? [], [countriesData]);
  const regions = useMemo(() => regionsData ?? [], [regionsData]);
  const cities = useMemo(() => citiesData ?? [], [citiesData]);

  const loading = useMemo(
    () => ({
      countries: countriesLoading,
      regions: regionsLoading,
      cities: citiesLoading,
    }),
    [countriesLoading, regionsLoading, citiesLoading]
  );
  const error = useMemo(
    () => ({
      countries: countriesError ?? undefined,
      regions: regionsError ?? undefined,
      cities: citiesError ?? undefined,
    }),
    [countriesError, regionsError, citiesError]
  );

  useEffect(() => {
    fetchCountries('/api/countries');
  }, [fetchCountries]);

  useEffect(() => {
    if (!country) {
      return;
    }
    fetchRegions(`/api/countries/${country}/regions`);
  }, [country, fetchRegions]);

  useEffect(() => {
    if (!region) {
      return;
    }
    fetchCities(`/api/regions/${region}/cities`);
  }, [region, fetchCities]);

  return {
    countries,
    regions,
    cities,
    loading,
    error,
  };
};
