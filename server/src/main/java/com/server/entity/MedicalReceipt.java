package com.server.entity;


public class MedicalReceipt {

  private long id;
  private long userId;
  private String receiptType;
  private String placeName;
  private double amount;
  private java.sql.Date receiptDate;
  private String imageUrl;


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


  public String getReceiptType() {
    return receiptType;
  }

  public void setReceiptType(String receiptType) {
    this.receiptType = receiptType;
  }


  public String getPlaceName() {
    return placeName;
  }

  public void setPlaceName(String placeName) {
    this.placeName = placeName;
  }


  public double getAmount() {
    return amount;
  }

  public void setAmount(double amount) {
    this.amount = amount;
  }


  public java.sql.Date getReceiptDate() {
    return receiptDate;
  }

  public void setReceiptDate(java.sql.Date receiptDate) {
    this.receiptDate = receiptDate;
  }


  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

}
