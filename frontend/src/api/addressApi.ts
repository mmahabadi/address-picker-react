import type { Country, Region, City } from "../types";

export const getCountries = (): Promise<Country[]> => {
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
}

export const getRegions = (countryCode: string): Promise<Region[]> => {
  // return fetch(`/countries/${countryCode}/regions`).then(res => res.json());
  return Promise.resolve([
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
  ].filter((region) => region.countryCode === countryCode));

}

export const getCities = (regionCode: string): Promise<City[]> => {
  // return fetch(`/regions/${regionCode}/cities`).then(res => res.json());
  return Promise.resolve([
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
      code: 'NL-NH',
      name: 'North Holland',
      regionCode: 'NL-NH',
    },
  ].filter((city) => city.regionCode === regionCode));
}
