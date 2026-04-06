package com.server.entity;


public class InheritancePlan {

  private long id;
  private long userId;
  private double gifted;
  private double estimatedTax;
  private String familyType;
  private java.sql.Timestamp createdAt;
  private java.sql.Timestamp updatedAt;


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


  public long getUserId() {
    return userId;
  }

  public void setUserId(long userId) {
    this.userId = userId;
  }


  public double getGifted() {
    return gifted;
  }

  public void setGifted(double gifted) {
    this.gifted = gifted;
  }


  public double getEstimatedTax() {
    return estimatedTax;
  }

  public void setEstimatedTax(double estimatedTax) {
    this.estimatedTax = estimatedTax;
  }


  public String getFamilyType() {
    return familyType;
  }

  public void setFamilyType(String familyType) {
    this.familyType = familyType;
  }


  public java.sql.Timestamp getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(java.sql.Timestamp createdAt) {
    this.createdAt = createdAt;
  }


  public java.sql.Timestamp getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(java.sql.Timestamp updatedAt) {
    this.updatedAt = updatedAt;
  }

}
