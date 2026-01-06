import { useEffect, useState } from "react"
import { getCities, getCountries, getRegions } from "../api/addressApi";
import type { City, Country, Region } from "../types";

export const useAddressData = (country: string, region: string) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    getCountries().then((countries) => {
      setCountries(countries);
    });
  }, []);

  useEffect(() => {
    getRegions(country).then((regions) => {
      setRegions(regions);
    });
  }, [country]);

  useEffect(() => {
    getCities(region).then((cities) => {
      setCities(cities);
    });
  }, [region]);

  return {
    countries,
    regions,
    cities,
  }
}