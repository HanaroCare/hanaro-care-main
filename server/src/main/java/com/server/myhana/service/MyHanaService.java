package com.server.myhana.service;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.TBAccountRepository;
import com.server.myhana.dto.FamilyMemberResponse;
import com.server.myhana.dto.InsuranceResponse;
import com.server.myhana.entity.TBSharedInsurance;
import com.server.myhana.repository.TBSharedInsuranceRepository;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.repository.TBFamilyAuthRepository;
import com.server.user.repository.TBUserRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyHanaService {

  private final TBUserRepository userRepository;
  private final TBFamilyAuthRepository familyAuthRepository;
  private final TBAccountRepository accountRepository;
  private final TBSharedInsuranceRepository sharedInsuranceRepository;

  /**
   * 등록된 가족 목록 조회
   */
  public List<FamilyMemberResponse> getFamilyList(Long userId) {
    TBUser user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    // 내가 권한을 준 가족들 (내가 Grantor)
    List<TBFamilyAuth> familyAuths = familyAuthRepository.findByGrantor(user);

    return familyAuths.stream().map(auth -> {
      TBUser grantee = auth.getGrantee();
      
      // 보험 공유 여부 확인 (최소 하나 이상의 보험이 공유되고 있는지)
      List<TBSharedInsurance> shared = sharedInsuranceRepository.findByGrantorAndGrantee(user, grantee);
      boolean isSharing = !shared.isEmpty();

      return FamilyMemberResponse.builder()
          .userId(grantee.getUserId())
          .name(grantee.getUserNm())
          .relation(auth.getRelationCd() ? "부모" : "자녀")
          .phone(grantee.getUserPhone())
          .isSharing(isSharing)
          .build();
    }).collect(Collectors.toList());
  }

  /**
   * 나의 보험 내역 조회
   */
  public List<InsuranceResponse> getMyInsurances(Long userId) {
    TBUser user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

    List<TBAccount> insurances = accountRepository.findByUserAndAssetCateCd(user, AssetCategory.INSURANCE);

    return insurances.stream().map(ins -> InsuranceResponse.builder()
        .accountId(ins.getId())
        .instNm(ins.getInstNm())
        .accountNm(ins.getAccountNm())
        .accountNum(ins.getAccountNum())
        .build()).collect(Collectors.toList());
  }

  /**
   * 보험 공유 설정 (선택한 보험들만 공유)
   */
  @Transactional
  public void shareInsurances(Long grantorId, Long granteeId, List<Long> insuranceIds) {
    TBUser grantor = userRepository.findById(grantorId)
        .orElseThrow(() -> new IllegalArgumentException("Grantor not found"));
    TBUser grantee = userRepository.findById(granteeId)
        .orElseThrow(() -> new IllegalArgumentException("Grantee not found"));

    // 기존 공유 내역 삭제
    sharedInsuranceRepository.deleteByGrantorAndGrantee(grantor, grantee);

    // 새로운 공유 내역 추가
    if (insuranceIds != null && !insuranceIds.isEmpty()) {
      for (Long insId : insuranceIds) {
        TBAccount insurance = accountRepository.findById(insId)
            .orElseThrow(() -> new IllegalArgumentException("Insurance not found: " + insId));
        
        // 내 보험이 맞는지 확인
        if (!insurance.getUser().getUserId().equals(grantorId)) {
          throw new IllegalArgumentException("This insurance does not belong to the grantor");
        }

        TBSharedInsurance shared = TBSharedInsurance.builder()
            .grantor(grantor)
            .grantee(grantee)
            .insurance(insurance)
            .build();
        sharedInsuranceRepository.save(shared);
      }
    }
  }

  /**
   * 보험 공유 중단 (모두 중단)
   */
  @Transactional
  public void stopSharingInsurances(Long grantorId, Long granteeId) {
    TBUser grantor = userRepository.findById(grantorId)
        .orElseThrow(() -> new IllegalArgumentException("Grantor not found"));
    TBUser grantee = userRepository.findById(granteeId)
        .orElseThrow(() -> new IllegalArgumentException("Grantee not found"));

    sharedInsuranceRepository.deleteByGrantorAndGrantee(grantor, grantee);
  }
}
