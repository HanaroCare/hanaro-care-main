package com.server.myhana.service;

import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.common.security.JwtUtil;
import com.server.myhana.dto.request.FamilyInviteAcceptRequest;
import com.server.myhana.dto.request.FamilyInviteRequest;
import com.server.myhana.dto.request.GrantInsuranceViewRequest;
import com.server.myhana.dto.response.FamilyMemberResponse;
import com.server.myhana.repository.MyHanaFamilyRepository;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.repository.TBUserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MyHanaFamilyService {

    private final MyHanaFamilyRepository familyRepository;
    private final TBUserRepository userRepository;
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
        List<TBFamilyAuth> familyAuths = familyRepository.findAllByGrantor_UserId(userId);
        
        List<FamilyMemberResponse> families = familyAuths.stream()
                .map(auth -> FamilyMemberResponse.builder()
                        .userId(auth.getGrantee().getUserId())
                        .name(auth.getGrantee().getUserNm())
                        .phone(auth.getGrantee().getUserPhone())
                        .relation(auth.getRelationCd().getDescription())
                        .isSharing(auth.getIsInsView())
                        .isMe(false)
                        .build())
                .collect(Collectors.<FamilyMemberResponse>toList());
        
        result.addAll(families);

        return result;
    }

    /**
     * 가족 초대용 토큰 발급
     */
    public String inviteFamily(Long grantorId, FamilyInviteRequest request) {
        userRepository.findById(grantorId)
                .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

        return jwtUtil.createInviteToken(grantorId, request.getRelation().name());
    }

    /**
     * 초대 수락 (가족 관계 생성 시점)
     */
    @Transactional
    public void acceptInvitation(Long granteeId, FamilyInviteAcceptRequest request) {
        Map<String, Object> inviteInfo = jwtUtil.getInfoFromInviteToken(request.getToken());
        Long grantorId = (Long) inviteInfo.get("grantorId");
        FamilyRelation relation = FamilyRelation.valueOf((String) inviteInfo.get("relation"));

        TBUser grantor = userRepository.findById(grantorId)
                .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));
        TBUser grantee = userRepository.findById(granteeId)
                .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

        // 이미 존재하는 관계인지 확인
        familyRepository.findByGrantor_UserIdAndGrantee_UserId(grantorId, granteeId)
                .ifPresent(auth -> {
                    throw new ApiException(ErrorStatus._BAD_REQUEST);
                });

        // 가족 관계 레코드 생성 (authStatus 없음)
        TBFamilyAuth newAuth = TBFamilyAuth.builder()
                .grantor(grantor)
                .grantee(grantee)
                .relationCd(relation)
                .isInsView(false)
                .isCardView(false)
                .isProxyClaim(false)
                .isTrustView(false)
                .build();

        familyRepository.save(newAuth);
    }

    /**
     * 보험 내역 열람 권한 관리
     */
    @Transactional
    public void updateInsuranceViewPermission(Long grantorId, GrantInsuranceViewRequest request) {
        Long granteeId = request.getGranteeId();

        // 가족 권한 조회 (authStatus 체크 제거)
        TBFamilyAuth familyAuth = familyRepository.findByGrantor_UserIdAndGrantee_UserId(grantorId, granteeId)
                .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));

        familyAuth.setIsInsView(request.getIsInsView());
    }
}
