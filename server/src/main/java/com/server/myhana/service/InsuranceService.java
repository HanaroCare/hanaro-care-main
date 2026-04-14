package com.server.myhana.service;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.TBAccountRepository;
import com.server.myhana.dto.InsuranceDetailDto;
import com.server.myhana.dto.InsuranceDto;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.repository.TBFamilyAuthRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InsuranceService {

  private final TBFamilyAuthRepository familyAuthRepository;
  private final TBAccountRepository accountRepository;

  // 보험(자신+grantor) 조회
  public List<InsuranceDto> getInsurances(Long userId) {
    TBAccount[] account = accountRepository.findAllByUserIdAndAssetCateCd(
        userId, AssetCategory.INSURANCE);

    List<TBFamilyAuth> family = familyAuthRepository.findAllByGranteeUserIdAndIsInsView(userId,
        true);

    List<TBAccount> accounts = new ArrayList<>();
    accounts.addAll(Arrays.asList(account));

    // flatMap으로 TBAccount[]를 펼쳐서 합치기
    family.stream()
        .flatMap(f -> Arrays.stream(
            accountRepository.findAllByUserIdAndAssetCateCd(
                f.getGrantor().getUserId(), AssetCategory.INSURANCE)))
        .forEach(accounts::add);

    return accounts.stream()
        .map(a -> InsuranceDto.builder()
            .instNm(a.getInstNm())
            .accountNm(a.getAccountNm())
            .monthlyPremAmt(a.getMonthlyPremAmt().intValue())
            .username(a.getUser().getUserNm())
            .build())
        .toList();
  }

  // 권한에 따른 보험 상세 조회
  public InsuranceDetailDto getInsurance(Long userId, Long insuranceId) {
    TBAccount account = accountRepository.findByAccountId(insuranceId)
        .orElseThrow(() -> new IllegalArgumentException("해당 보험을 찾을 수 없습니다."));

    Long accountOwnerId = account.getUser().getUserId();

    if (!accountOwnerId.equals(userId)) {
      boolean hasAuth = familyAuthRepository
          .findByGrantorUserIdAndGranteeUserIdAndIsInsView(
              accountOwnerId, userId, true)
          .isPresent();

      if (!hasAuth) {
        throw new IllegalArgumentException("해당 보험에 접근할 수 없습니다.");
      }
    }

    InsuranceDto insuranceDto = InsuranceDto.builder().instNm(account.getInstNm())
        .accountNm(account.getAccountNm()).monthlyPremAmt(account.getMonthlyPremAmt().intValue())
        .build();
    return InsuranceDetailDto.builder()
        .insuranceDto(insuranceDto)
        .contrDt(account.getContrDt())
        .expireDt(account.getExpireDt())
        .build();
  }
}
