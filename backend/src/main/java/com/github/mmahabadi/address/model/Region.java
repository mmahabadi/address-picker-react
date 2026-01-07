package com.github.mmahabadi.address.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Region {
  private String code;
  private String name;
  private String countryCode;
}