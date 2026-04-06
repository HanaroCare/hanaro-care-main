package com.server.entity;


public class Product {

  private long id;
  private String category;
  private String subCategory;
  private String name;
  private String description;
  private double baseRate;
  private long isAvailable;
  private double mortgageType;


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }


  public String getSubCategory() {
    return subCategory;
  }

  public void setSubCategory(String subCategory) {
    this.subCategory = subCategory;
  }


  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }


  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }


  public double getBaseRate() {
    return baseRate;
  }

  public void setBaseRate(double baseRate) {
    this.baseRate = baseRate;
  }


  public long getIsAvailable() {
    return isAvailable;
  }

  public void setIsAvailable(long isAvailable) {
    this.isAvailable = isAvailable;
  }


  public double getMortgageType() {
    return mortgageType;
  }

  public void setMortgageType(double mortgageType) {
    this.mortgageType = mortgageType;
  }

}
