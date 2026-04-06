package com.server.entity;


public class SimulationSetting {

  private long id;
  private long userId;
  private long expectedAge;
  private String careType;
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


  public long getExpectedAge() {
    return expectedAge;
  }

  public void setExpectedAge(long expectedAge) {
    this.expectedAge = expectedAge;
  }


  public String getCareType() {
    return careType;
  }

  public void setCareType(String careType) {
    this.careType = careType;
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
