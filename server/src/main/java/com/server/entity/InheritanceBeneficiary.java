package com.server.entity;


public class InheritanceBeneficiary {

  private String id;
  private String relation;
  private double ratio;
  private String planId;
  private long userId;


  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }


  public String getRelation() {
    return relation;
  }

  public void setRelation(String relation) {
    this.relation = relation;
  }


  public double getRatio() {
    return ratio;
  }

  public void setRatio(double ratio) {
    this.ratio = ratio;
  }


  public String getPlanId() {
    return planId;
  }

  public void setPlanId(String planId) {
    this.planId = planId;
  }


  public long getUserId() {
    return userId;
  }

  public void setUserId(long userId) {
    this.userId = userId;
  }

}
