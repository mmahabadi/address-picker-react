package com.github.mmahabadi.address.service;

import com.github.mmahabadi.address.model.City;
import com.github.mmahabadi.address.model.Country;
import com.github.mmahabadi.address.model.Region;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class AddressService {
  private final List<Country> countries = new ArrayList<>();
  private final List<Region> regions = new ArrayList<>();
  private final List<City> cities = new ArrayList<>();

  public AddressService() {
    this.countries.add(new Country("DE", "Germany"));
    this.countries.add(new Country("US", "United States"));
    this.countries.add(new Country("NL", "Netherlands"));

    this.regions.add(new Region("DE-BE", "Berlin", "DE"));
    this.regions.add(new Region("DE-BY", "Bavaria", "DE"));
    this.regions.add(new Region("US-CA", "California", "US"));
    this.regions.add(new Region("US-NY", "New York", "US"));
    this.regions.add(new Region("NL-NH", "North Holland", "NL"));

    this.cities.add(new City("DE-BE", "Berlin", "DE-BE"));
    this.cities.add(new City("DE-BY", "Bavaria", "DE-BY"));
    this.cities.add(new City("US-CA", "California", "US-CA"));
    this.cities.add(new City("US-NY", "New York", "US-NY"));
    this.cities.add(new City("NL-AMS", "Amsterdam", "NL-NH"));
  }

  public List<Country> getCountries() {
    return this.countries;
  }

  public List<Region> getRegions(String countryCode) {
    return this.regions.stream()
      .filter(region -> region.getCountryCode().equals(countryCode))
      .collect(Collectors.toList());
  }

  public List<City> getCities(String regionCode) {
    return this.cities.stream()
      .filter(city -> city.getRegionCode().equals(regionCode))
      .collect(Collectors.toList());
  }
}