package com.server.entity;


public class WorkerCardSpending {

  private String id;
  private long cardId;
  private String name;
  private String location;
  private String type;
  private double amount;
  private long isAbnormal;
  private java.sql.Timestamp createdAt;
  private long isApproved;


  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }


  public long getCardId() {
    return cardId;
  }

  public void setCardId(long cardId) {
    this.cardId = cardId;
  }


  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }


  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }


  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }


  public double getAmount() {
    return amount;
  }

  public void setAmount(double amount) {
    this.amount = amount;
  }


  public long getIsAbnormal() {
    return isAbnormal;
  }

  public void setIsAbnormal(long isAbnormal) {
    this.isAbnormal = isAbnormal;
  }


  public java.sql.Timestamp getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(java.sql.Timestamp createdAt) {
    this.createdAt = createdAt;
  }


  public long getIsApproved() {
    return isApproved;
  }

  public void setIsApproved(long isApproved) {
    this.isApproved = isApproved;
  }

}
