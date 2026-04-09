package com.server.entity;


public class Account {

  private long id;
  private String company;
  private String accountName;
  private String accountNumber;
  private double balance;
  private String assetId;
  private String category;
  private double rate;


  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }


  public String getCompany() {
    return company;
  }

  public void setCompany(String company) {
    this.company = company;
  }


  public String getAccountName() {
    return accountName;
  }

  public void setAccountName(String accountName) {
    this.accountName = accountName;
  }


  public String getAccountNumber() {
    return accountNumber;
  }

  public void setAccountNumber(String accountNumber) {
    this.accountNumber = accountNumber;
  }


  public double getBalance() {
    return balance;
  }

  public void setBalance(double balance) {
    this.balance = balance;
  }


  public String getAssetId() {
    return assetId;
  }

  public void setAssetId(String assetId) {
    this.assetId = assetId;
  }


  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }


  public double getRate() {
    return rate;
  }

  public void setRate(double rate) {
    this.rate = rate;
  }

}
