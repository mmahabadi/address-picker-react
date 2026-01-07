import type { Country, Region, City } from '../types';

export const getCountries = async (): Promise<Country[]> => {
  return fetch('/api/countries').then((res) => res.json());
};

export const getRegions = async (countryCode: string): Promise<Region[]> => {
  return fetch(`/api/countries/${countryCode}/regions`).then((res) => res.json());
};

export const getCities = async (regionCode: string): Promise<City[]> => {
  return fetch(`/api/regions/${regionCode}/cities`).then((res) => res.json());
};
