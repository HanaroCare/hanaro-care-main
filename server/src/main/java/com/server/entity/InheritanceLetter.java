package com.server.entity;


public class InheritanceLetter {

  private long id;
  private long userId;
  private long beneficiaryId;
  private String content;
  private long isLocked;
  private java.sql.Timestamp createdAt;


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


  public long getBeneficiaryId() {
    return beneficiaryId;
  }

  public void setBeneficiaryId(long beneficiaryId) {
    this.beneficiaryId = beneficiaryId;
  }


  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }


  public long getIsLocked() {
    return isLocked;
  }

  public void setIsLocked(long isLocked) {
    this.isLocked = isLocked;
  }


  public java.sql.Timestamp getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(java.sql.Timestamp createdAt) {
    this.createdAt = createdAt;
  }

}
