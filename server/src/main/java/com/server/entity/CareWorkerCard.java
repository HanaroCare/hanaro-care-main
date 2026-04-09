package com.server.entity;


public class CareWorkerCard {

  private long id;
  private String name;
  private double amount;
  private long isActive;
  private java.sql.Timestamp createdAt;
  private java.sql.Timestamp updatedAt;
  private long accountId;
  private double limit;


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }


  public double getAmount() {
    return amount;
  }

  public void setAmount(double amount) {
    this.amount = amount;
  }


  public long getIsActive() {
    return isActive;
  }

  public void setIsActive(long isActive) {
    this.isActive = isActive;
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


  public long getAccountId() {
    return accountId;
  }

  public void setAccountId(long accountId) {
    this.accountId = accountId;
  }


  public double getLimit() {
    return limit;
  }

  public void setLimit(double limit) {
    this.limit = limit;
  }

}
