package com.server.entity;


public class Stock {

  private long id;
  private long assetId;
  private String stockName;
  private double quantity;
  private double avgPrice;
  private double currentPrice;


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


  public String getStockName() {
    return stockName;
  }

  public void setStockName(String stockName) {
    this.stockName = stockName;
  }


  public double getQuantity() {
    return quantity;
  }

  public void setQuantity(double quantity) {
    this.quantity = quantity;
  }


  public double getAvgPrice() {
    return avgPrice;
  }

  public void setAvgPrice(double avgPrice) {
    this.avgPrice = avgPrice;
  }


  public double getCurrentPrice() {
    return currentPrice;
  }

  public void setCurrentPrice(double currentPrice) {
    this.currentPrice = currentPrice;
  }

}
