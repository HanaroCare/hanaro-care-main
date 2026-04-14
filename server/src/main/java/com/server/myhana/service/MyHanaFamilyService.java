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
     * 가족 목록 조회 (본인 포함, 승인된 가족만)
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

        // 2. 입증된(authStatus=true) 가족만 조회
        List<TBFamilyAuth> approvedFamilies = familyRepository.findAllByGrantorAndAuthStatusTrue(user);
        
        // 타입 추론 문제를 방지하기 위해 제네릭 명시
        List<FamilyMemberResponse> families = approvedFamilies.stream()
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
     * DB에 아무것도 저장하지 않고, 토큰 안에 초대 정보만 담아서 반환
     */
    public String inviteFamily(Long grantorId, FamilyInviteRequest request) {
        userRepository.findById(grantorId)
                .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

        // 토큰에 초대한 사람 ID와 관계 정보를 담음
        return jwtUtil.createInviteToken(grantorId, request.getRelation().name());
    }

    /**
     * 초대 수락 (가족 입증 및 관계 생성 시점)
     */
    @Transactional
    public void acceptInvitation(Long granteeId, FamilyInviteAcceptRequest request) {
        // 토큰 해독 및 정보 추출
        Map<String, Object> inviteInfo = jwtUtil.getInfoFromInviteToken(request.getToken());
        Long grantorId = (Long) inviteInfo.get("grantorId");
        FamilyRelation relation = FamilyRelation.valueOf((String) inviteInfo.get("relation"));

        TBUser grantor = userRepository.findById(grantorId)
                .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));
        TBUser grantee = userRepository.findById(granteeId)
                .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

        // 이미 입증된 관계인지 확인 (중복 생성 방지)
        familyRepository.findByGrantorAndGrantee(grantor, grantee)
                .ifPresent(auth -> {
                    throw new ApiException(ErrorStatus._BAD_REQUEST);
                });

        // 이 시점에 비로소 DB에 가족 관계 레코드가 생성됨
        TBFamilyAuth newAuth = TBFamilyAuth.builder()
                .grantor(grantor)
                .grantee(grantee)
                .relationCd(relation)
                .authStatus(true) // 입증 완료
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
        TBUser grantor = userRepository.findById(grantorId)
                .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));
        TBUser grantee = userRepository.findById(request.getGranteeId())
                .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

        // 입증된 가족(authStatus=true)만 권한 변경 가능
        TBFamilyAuth familyAuth = familyRepository.findByGrantorAndGrantee(grantor, grantee)
                .filter(TBFamilyAuth::getAuthStatus)
                .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

        familyAuth.setIsInsView(request.getIsInsView());
    }
}
