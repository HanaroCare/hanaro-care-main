package com.server.entity;


public class UserProduct {

  private String id;
  private String prodType;
  private String prodSubType;
  private double monthlyPayout;
  private double loanAmount;
  private String inheritanceType;
  private String status;
  private long userId;
  private String targetAssetId;
  private long repaymentChildId;
  private String productId;


  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }


  public String getProdType() {
    return prodType;
  }

  public void setProdType(String prodType) {
    this.prodType = prodType;
  }


  public String getProdSubType() {
    return prodSubType;
  }

  public void setProdSubType(String prodSubType) {
    this.prodSubType = prodSubType;
  }


  public double getMonthlyPayout() {
    return monthlyPayout;
  }

  public void setMonthlyPayout(double monthlyPayout) {
    this.monthlyPayout = monthlyPayout;
  }


  public double getLoanAmount() {
    return loanAmount;
  }

  public void setLoanAmount(double loanAmount) {
    this.loanAmount = loanAmount;
  }


  public String getInheritanceType() {
    return inheritanceType;
  }

  public void setInheritanceType(String inheritanceType) {
    this.inheritanceType = inheritanceType;
  }


  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }


  public long getUserId() {
    return userId;
  }

  public void setUserId(long userId) {
    this.userId = userId;
  }


  public String getTargetAssetId() {
    return targetAssetId;
  }

  public void setTargetAssetId(String targetAssetId) {
    this.targetAssetId = targetAssetId;
  }


  public long getRepaymentChildId() {
    return repaymentChildId;
  }

  public void setRepaymentChildId(long repaymentChildId) {
    this.repaymentChildId = repaymentChildId;
  }


  public String getProductId() {
    return productId;
  }

  public void setProductId(String productId) {
    this.productId = productId;
  }

}
