package com.server.entity;


public class Card {

  private long id;
  private long assetId;
  private String company;
  private String cardName;
  private double usedAmount;
  private double limitAmount;
  private long paymentDate;


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


  public long getAssetId() {
    return assetId;
  }

  public void setAssetId(long assetId) {
    this.assetId = assetId;
  }


  public String getCompany() {
    return company;
  }

  public void setCompany(String company) {
    this.company = company;
  }


  public String getCardName() {
    return cardName;
  }

  public void setCardName(String cardName) {
    this.cardName = cardName;
  }


  public double getUsedAmount() {
    return usedAmount;
  }

  public void setUsedAmount(double usedAmount) {
    this.usedAmount = usedAmount;
  }


  public double getLimitAmount() {
    return limitAmount;
  }

  public void setLimitAmount(double limitAmount) {
    this.limitAmount = limitAmount;
  }


  public long getPaymentDate() {
    return paymentDate;
  }

  public void setPaymentDate(long paymentDate) {
    this.paymentDate = paymentDate;
  }

}
