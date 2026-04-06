package com.server.entity;


public class TermsAgreement {

  private long id;
  private long userId;
  private long termsId;
  private long isAgreed;
  private java.sql.Timestamp agreedAt;


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


  public long getTermsId() {
    return termsId;
  }

  public void setTermsId(long termsId) {
    this.termsId = termsId;
  }


  public long getIsAgreed() {
    return isAgreed;
  }

  public void setIsAgreed(long isAgreed) {
    this.isAgreed = isAgreed;
  }


  public java.sql.Timestamp getAgreedAt() {
    return agreedAt;
  }

  public void setAgreedAt(java.sql.Timestamp agreedAt) {
    this.agreedAt = agreedAt;
  }

}
