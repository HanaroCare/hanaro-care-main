package com.server.myhana.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.AccountRepository;
import com.server.common.exception.ApiException;
import com.server.myhana.dto.InsuranceDetailDto;
import com.server.myhana.dto.InsuranceDto;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.repository.FamilyAuthRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MyHanaInsuranceServiceTest {

  @InjectMocks
  private MyHanaInsuranceService service;

  @Mock
  private AccountRepository accountRepository;

  @Mock
  private FamilyAuthRepository familyAuthRepository;

  @Test
  void getInsurances_success() {

    Long userId = 1L;

    TBAccount myAccount = mock(TBAccount.class);
    TBUser user = mock(TBUser.class);

    given(myAccount.getAccountId()).willReturn(100L);
    given(myAccount.getInstNm()).willReturn("삼성생명");
    given(myAccount.getAccountNm()).willReturn("보험1");
    given(myAccount.getMonthlyPremAmt()).willReturn(BigDecimal.valueOf(100000L));
    given(user.getUserNm()).willReturn("나");
    given(myAccount.getUser()).willReturn(user);

    given(accountRepository.findByUser_UserIdAndAssetCateCd(userId, AssetCategory.INSURANCE))
        .willReturn(List.of(myAccount));

    TBFamilyAuth family = mock(TBFamilyAuth.class);
    TBUser grantor = mock(TBUser.class);

    given(grantor.getUserId()).willReturn(2L);
    given(family.getGrantor()).willReturn(grantor);

    given(familyAuthRepository.findAllByGrantee_UserIdAndIsInsView(userId, true))
        .willReturn(List.of(family));

    TBAccount familyAccount = mock(TBAccount.class);
    TBUser familyUser = mock(TBUser.class);

    given(familyAccount.getAccountId()).willReturn(200L);
    given(familyAccount.getInstNm()).willReturn("한화생명");
    given(familyAccount.getAccountNm()).willReturn("보험2");
    given(familyAccount.getMonthlyPremAmt()).willReturn(BigDecimal.valueOf(200000L));
    given(familyUser.getUserNm()).willReturn("부모");
    given(familyAccount.getUser()).willReturn(familyUser);

    given(accountRepository.findByUser_UserIdAndAssetCateCd(2L, AssetCategory.INSURANCE))
        .willReturn(List.of(familyAccount));

    List<InsuranceDto> result = service.getInsurances(userId);

    assertThat(result).hasSize(2);
  }

  @Test
  void getInsurance_owner_success() {

    Long userId = 1L;
    Long insuranceId = 100L;

    TBAccount account = mock(TBAccount.class);
    TBUser owner = mock(TBUser.class);

    given(account.getInstNm()).willReturn("삼성");
    given(account.getAccountNm()).willReturn("보험");
    given(account.getMonthlyPremAmt()).willReturn(BigDecimal.valueOf(10000L));

    given(owner.getUserId()).willReturn(userId);
    given(account.getUser()).willReturn(owner);

    given(accountRepository.findByAccountIdAndAssetCateCd(insuranceId, AssetCategory.INSURANCE))
        .willReturn(Optional.of(account));

    InsuranceDetailDto result = service.getInsurance(userId, insuranceId);

    assertThat(result.getInsuranceDto().getInstNm()).isEqualTo("삼성");
  }

  @Test
  void getInsurance_access_denied() {

    Long userId = 1L;
    Long insuranceId = 100L;

    TBAccount account = mock(TBAccount.class);
    TBUser owner = mock(TBUser.class);

    given(owner.getUserId()).willReturn(2L);
    given(account.getUser()).willReturn(owner);

    given(accountRepository.findByAccountIdAndAssetCateCd(insuranceId, AssetCategory.INSURANCE))
        .willReturn(Optional.of(account));

    assertThatThrownBy(() ->
        service.getInsurance(userId, insuranceId)
    ).isInstanceOf(ApiException.class);
  }

  @Test
  void isInsAgent_success() {

    Long userId = 1L;

    given(familyAuthRepository.existsByGrantee_UserIdAndIsProxyClaimTrue(userId))
        .willReturn(true);

    Boolean result = service.isInsAgent(userId);

    assertThat(result).isTrue();
  }
}
