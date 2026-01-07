package com.github.mmahabadi.address.controller;



import com.github.mmahabadi.address.service.AddressService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.github.mmahabadi.address.model.Country;
import com.github.mmahabadi.address.model.Region;
import com.github.mmahabadi.address.model.City;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {
  private final AddressService addressService;

  public AddressController(AddressService addressService) {
    this.addressService = addressService;
  }

  @GetMapping("/countries")
  public List<Country> getCountries() {
    return this.addressService.getCountries();
  }

  @GetMapping("/countries/{countryCode}/regions")
  public List<Region> getRegions(@PathVariable String countryCode) {
    return this.addressService.getRegions(countryCode);
  }

  @GetMapping("/regions/{regionCode}/cities")
  public List<City> getCities(@PathVariable String regionCode) {
    return this.addressService.getCities(regionCode);
  }
}