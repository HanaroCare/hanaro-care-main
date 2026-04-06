package com.server.entity;


public class Transaction {

  private long id;
  private long userproductId;
  private long type;
  private double amount;
  private String status;
  private java.sql.Timestamp transactionAt;


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


  public long getUserproductId() {
    return userproductId;
  }

  public void setUserproductId(long userproductId) {
    this.userproductId = userproductId;
  }


  public long getType() {
    return type;
  }

  public void setType(long type) {
    this.type = type;
  }


  public double getAmount() {
    return amount;
  }

  public void setAmount(double amount) {
    this.amount = amount;
  }


  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }


  public java.sql.Timestamp getTransactionAt() {
    return transactionAt;
  }

  public void setTransactionAt(java.sql.Timestamp transactionAt) {
    this.transactionAt = transactionAt;
  }

}
