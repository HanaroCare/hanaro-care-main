package com.server.myhana.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InsuranceService {

  private final FamilyAuthRepository familyAuthRepository;
  private final AccountRepository accountRepository;


}
