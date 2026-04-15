package com.server.myhana.service;

import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.common.security.JwtUtil;
import com.server.myhana.dto.request.FamilyInviteRequest;
import com.server.myhana.dto.request.GrantInsuranceViewRequest;
import com.server.myhana.dto.response.FamilyMemberResponse;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.repository.TBFamilyAuthRepository;
import com.server.user.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MyHanaFamilyService {

  private final TBFamilyAuthRepository familyAuthRepository;
  private final UserRepository userRepository;
  private final JwtUtil jwtUtil;

  /**
   * 가족 목록 조회 (본인 포함)
   */
  public List<FamilyMemberResponse> getFamilyMembers(Long userId) {
    TBUser user = userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

    List<FamilyMemberResponse> result = new ArrayList<>();

    // 1. 본인 추가
    result.add(FamilyMemberResponse.builder()
        .userId(user.getUserId())
        .name(user.getUserNm())
        .phone(user.getUserPhone())
        .relation(FamilyRelation.FAMILY.getDescription())
        .isSharing(true)
        .isMe(true)
        .build());

    // 2. 가족 목록 조회
    List<TBFamilyAuth> familyAuths = familyAuthRepository.findAllByGrantorUserId(userId);

    List<FamilyMemberResponse> families = familyAuths.stream()
        .map(auth -> FamilyMemberResponse.builder()
            .userId(auth.getGrantee().getUserId())
            .name(auth.getGrantee().getUserNm())
            .phone(auth.getGrantee().getUserPhone())
            .relation(auth.getRelationCd().getDescription())
            .isSharing(auth.getIsInsView())
            .isMe(false)
            .build())
        .collect(Collectors.toList());

    result.addAll(families);

    return result;
  }

  /**
   * 가족 초대용 링크 발급
   */
  public String inviteFamily(Long grantorId, FamilyInviteRequest request) {
    userRepository.findById(grantorId)
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

    String token = jwtUtil.createInviteToken(grantorId);
    // 프론트엔드 URL (추후 설정 파일로 분리 가능)
    String baseUrl = "http://localhost:3000";
    return String.format("%s/onboarding?token=%s", baseUrl, token);
  }

  /**
   * 보험 내역 열람 권한 관리
   */
  @Transactional
  public void updateInsuranceViewPermission(Long grantorId, GrantInsuranceViewRequest request) {
    Long granteeId = request.getGranteeId();

    TBFamilyAuth familyAuth = familyAuthRepository.findByGrantor_UserIdAndGrantee_UserId(grantorId,
            granteeId)
        .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));

    familyAuth.setIsInsView(request.getIsInsView());
  }
}
