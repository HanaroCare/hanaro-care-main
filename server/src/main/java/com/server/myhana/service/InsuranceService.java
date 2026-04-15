package com.server.myhana.service;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.TBAccountRepository;
import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.myhana.dto.InsuranceDetailDto;
import com.server.myhana.dto.InsuranceDto;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.repository.TBFamilyAuthRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InsuranceService {

  private final TBFamilyAuthRepository familyAuthRepository;
  private final TBAccountRepository accountRepository;

  // 보험(자신+grantor) 조회
  @CheckUser(key = "#userId")
  public List<InsuranceDto> getInsurances(Long userId) {
    List<TBAccount> account = accountRepository.findAllByUser_UserIdAndAssetCateCd(
        userId, AssetCategory.INSURANCE);

    List<TBFamilyAuth> family = familyAuthRepository.findAllByGranteeUserIdAndIsInsView(userId,
        true);

    List<TBAccount> accounts = new ArrayList<>();
    accounts.addAll(account);

    family.stream()
        .flatMap(f ->
            accountRepository.findAllByUser_UserIdAndAssetCateCd(
                f.getGrantor().getUserId(), AssetCategory.INSURANCE).stream())
        .forEach(accounts::add);

    return accounts.stream()
        .map(a -> InsuranceDto.builder()
            .accountId(a.getAccountId())
            .instNm(a.getInstNm())
            .accountNm(a.getAccountNm())
            .monthlyPremAmt(a.getMonthlyPremAmt().intValue())
            .username(a.getUser().getUserNm())
            .build())
        .toList();
  }

  // 권한에 따른 보험 상세 조회
  @CheckUser(key = "#userId")
  public InsuranceDetailDto getInsurance(Long userId, Long insuranceId) {
    TBAccount account = accountRepository.findByAccountIdAndAssetCateCd(
            insuranceId, AssetCategory.INSURANCE)
        .orElseThrow(() -> new ApiException(ErrorStatus.INSURANCE_NOT_FOUND));

    Long accountOwnerId = account.getUser().getUserId();

    if (!accountOwnerId.equals(userId)) {
      boolean hasAuth = familyAuthRepository
          .findByGrantorUserIdAndGranteeUserIdAndIsInsView(
              accountOwnerId, userId, true)
          .isPresent();

      if (!hasAuth) {
        throw new ApiException(ErrorStatus.INSURANCE_ACCESS_DENIED);
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
