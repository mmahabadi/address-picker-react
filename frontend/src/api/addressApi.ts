import type { Country, Region, City } from '../types';

export const getCountries = async (): Promise<Country[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // return Promise.reject(new Error('Failed to fetch countries'));
  // return fetch('/countries').then(res => res.json());
  return Promise.resolve([
    {
      code: 'DE',
      name: 'Germany',
    },
    {
      code: 'US',
      name: 'United States',
    },
    {
      code: 'NL',
      name: 'Netherlands',
    },
  ]);
};

export const getRegions = async (countryCode: string): Promise<Region[]> => {
  // return fetch(`/countries/${countryCode}/regions`).then(res => res.json());
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return Promise.resolve(
    [
      {
        code: 'DE-BE',
        name: 'Berlin',
        countryCode: 'DE',
      },
      {
        code: 'DE-BY',
        name: 'Bavaria',
        countryCode: 'DE',
      },
      {
        code: 'US-CA',
        name: 'California',
        countryCode: 'US',
      },
      {
        code: 'US-NY',
        name: 'New York',
        countryCode: 'US',
      },
      {
        code: 'NL-NH',
        name: 'North Holland',
        countryCode: 'NL',
      },
    ].filter((region) => region.countryCode === countryCode)
  );
};

export const getCities = async (regionCode: string): Promise<City[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // return fetch(`/regions/${regionCode}/cities`).then(res => res.json());
  return Promise.resolve(
    [
      {
        code: 'DE-BE',
        name: 'Berlin',
        regionCode: 'DE-BE',
      },
      {
        code: 'DE-BY',
        name: 'Bavaria',
        regionCode: 'DE-BY',
      },
      {
        code: 'US-CA',
        name: 'California',
        regionCode: 'US-CA',
      },
      {
        code: 'US-NY',
        name: 'New York',
        regionCode: 'US-NY',
      },
      {
        code: 'NL-AMS',
        name: 'Amsterdam',
        regionCode: 'NL-NH',
      },
    ].filter((city) => city.regionCode === regionCode)
  );
};
