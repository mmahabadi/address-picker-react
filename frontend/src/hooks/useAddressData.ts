import { useEffect, useState } from 'react';
import { getCities, getCountries, getRegions } from '../api/addressApi';
import type { AddressDataValues, City, Country, Region } from '../types';

type DataType = 'countries' | 'regions' | 'cities';

export const useAddressData = (country: string, region: string): AddressDataValues => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState({
    countries: false,
    regions: false,
    cities: false,
  });
  const [error, setError] = useState<{
    countries?: string;
    regions?: string;
    cities?: string;
  }>({});

  const fetchData = async <T>(
    type: DataType,
    fetchFn: () => Promise<T[]>,
    setData: (data: T[]) => void
  ) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const data = await fetchFn();
      setData(data);
      setError((prev) => ({ ...prev, [type]: undefined }));
    } catch (err) {
      setError((prev) => ({ ...prev, [type]: (err as Error).message }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const clearData = <T>(type: DataType, setData: (data: T[]) => void) => {
    setData([]);
    setError((prev) => ({ ...prev, [type]: undefined }));
    setLoading((prev) => ({ ...prev, [type]: false }));
  };

  useEffect(() => {
    fetchData<Country>('countries', getCountries, setCountries);
  }, []);

  useEffect(() => {
    if (!country) {
      clearData<Region>('regions', setRegions);
    } else {
      fetchData<Region>('regions', () => getRegions(country), setRegions);
    }
  }, [country]);

  useEffect(() => {
    if (!region) {
      clearData<City>('cities', setCities);
    } else {
      fetchData<City>('cities', () => getCities(region), setCities);
    }
  }, [region]);

  return {
    countries,
    regions,
    cities,
    loading,
    error,
  };
};
