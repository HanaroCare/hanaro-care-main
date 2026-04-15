package com.server.auth.service;

public interface SmsService {

  void send(String phone, String code);
}
