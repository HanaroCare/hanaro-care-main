package com.server.entity;


public class CarePermission {

  private String id;
  private long viewInsurance;
  private String status;
  private String relation;
  private java.sql.Timestamp createdAt;
  private java.sql.Timestamp updatedAt;
  private long grantorId;
  private long granteeId;
  private long viewCard;
  private long workercardId;


  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }


  public long getViewInsurance() {
    return viewInsurance;
  }

  public void setViewInsurance(long viewInsurance) {
    this.viewInsurance = viewInsurance;
  }


  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }


  public String getRelation() {
    return relation;
  }

  public void setRelation(String relation) {
    this.relation = relation;
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


  public long getGrantorId() {
    return grantorId;
  }

  public void setGrantorId(long grantorId) {
    this.grantorId = grantorId;
  }


  public long getGranteeId() {
    return granteeId;
  }

  public void setGranteeId(long granteeId) {
    this.granteeId = granteeId;
  }


  public long getViewCard() {
    return viewCard;
  }

  public void setViewCard(long viewCard) {
    this.viewCard = viewCard;
  }


  public long getWorkercardId() {
    return workercardId;
  }

  public void setWorkercardId(long workercardId) {
    this.workercardId = workercardId;
  }

}
