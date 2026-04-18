package com.server.myhana.service;

import com.server.asset.entity.TBAccount;
import com.server.asset.entity.enums.AssetCategory;
import com.server.asset.repository.AccountRepository;
import com.server.card.entity.TBCard;
import com.server.card.entity.TBCardUsage;
import com.server.card.entity.TBCardUsage.UsageType;
import com.server.card.repository.CardRepository;
import com.server.card.repository.CardUsageRepository;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.common.security.JwtUtil;
import com.server.myhana.dto.request.FamilyAcceptRequest;
import com.server.myhana.dto.request.FamilyInviteRequest;
import com.server.myhana.dto.request.GrantInsuranceViewRequest;
import com.server.myhana.dto.response.FamilyMemberResponse;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.repository.FamilyAuthRepository;
import com.server.user.repository.UserRepository;
import java.math.BigDecimal;
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

  private final FamilyAuthRepository familyAuthRepository;
  private final UserRepository userRepository;
  private final AccountRepository accountRepository;
  private final CardRepository cardRepository;
  private final CardUsageRepository cardUsageRepository;
  private final JwtUtil jwtUtil;

  public List<FamilyMemberResponse> getFamilyMembers(Long userId) {
    TBUser user = userRepository.findById(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

    List<FamilyMemberResponse> result = new ArrayList<>();

    result.add(FamilyMemberResponse.builder()
        .userId(String.valueOf(user.getUserId()))
        .name(user.getUserNm())
        .phone(user.getUserPhone())
        .relation(FamilyRelation.FAMILY.getDescription())
        .isSharing(true)
        .isMe(true)
        .build());

    // 내가 부모(grantor)인 경우 → 자녀 목록
    List<TBFamilyAuth> grantorAuths = familyAuthRepository.findApprovedFamilyByGrantorId(userId);
    grantorAuths.stream()
        .map(auth -> FamilyMemberResponse.builder()
            .userId(String.valueOf(auth.getGrantee().getUserId()))
            .name(auth.getGrantee().getUserNm())
            .phone(auth.getGrantee().getUserPhone())
            .relation(auth.getRelationCd().getDescription())
            .isSharing(auth.getIsInsView())
            .isMe(false)
            .build())
        .forEach(result::add);

    // 내가 자녀(grantee)인 경우 → 부모 목록 (초대 링크로 가입한 경우)
    List<TBFamilyAuth> granteeAuths = familyAuthRepository.findApprovedFamilyByGranteeId(userId);
    granteeAuths.stream()
        .map(auth -> FamilyMemberResponse.builder()
            .userId(auth.getGrantor().getUserId())
            .name(auth.getGrantor().getUserNm())
            .phone(auth.getGrantor().getUserPhone())
            .relation(inverseRelation(auth.getRelationCd()))
            .isSharing(auth.getIsInsView())
            .isMe(false)
            .build())
        .forEach(result::add);

    return result;
  }

  private String inverseRelation(FamilyRelation relation) {
    return switch (relation) {
      case CHILD -> FamilyRelation.PARENT.getDescription();
      case PARENT -> FamilyRelation.CHILD.getDescription();
      default -> relation.getDescription();
    };
  }

  public String inviteFamily(Long grantorId, FamilyInviteRequest request) {
    userRepository.findById(grantorId)
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

    return jwtUtil.createInviteToken(grantorId);
  }

  @Transactional
  public void updateInsuranceViewPermission(Long grantorId, GrantInsuranceViewRequest request) {
    Long granteeId = Long.parseLong(request.getGranteeId());

    TBFamilyAuth familyAuth = familyAuthRepository.findByGrantor_UserIdAndGrantee_UserId(grantorId,
            granteeId)
        .orElseThrow(() -> new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND));

    familyAuth.setIsInsView(request.getIsInsView());
  }

  @Transactional
  public void acceptFamilyInvite(Long granteeId, FamilyAcceptRequest request) {
    Map<String, Object> info = jwtUtil.getInfoFromInviteToken(request.getInviteToken());
    Long grantorId = (Long) info.get("grantorId");

    if (grantorId == null || grantorId.equals(granteeId)) {
      throw new ApiException(ErrorStatus._BAD_REQUEST);
    }

    if (familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(grantorId, granteeId)) {
      return;
    }

    TBUser grantor = userRepository.findById(grantorId)
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));
    TBUser grantee = userRepository.findById(granteeId)
        .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST));

    // 1. 부모(grantor)의 카드 계좌 조회 — 없으면 첫 번째 계좌 사용
    TBAccount cardAccount = accountRepository
        .findByUser_UserIdAndAssetCateCd(grantorId, AssetCategory.CARD)
        .stream().findFirst()
        .orElseGet(() -> accountRepository.findAllByUser_UserId(grantorId)
            .stream().findFirst()
            .orElseThrow(() -> new ApiException(ErrorStatus._BAD_REQUEST)));

    // 2. 자식(grantee) 명의 요양보호사 카드 생성
    TBCard card = cardRepository.save(TBCard.builder()
        .cardNm("A::" + grantee.getUserNm() + " 요양보호사 간병비 카드")
        .account(cardAccount)
        .limitAmt(new BigDecimal("1500000"))
        .balanceAmt(new BigDecimal("320000"))
        .autoTransAmt(BigDecimal.ZERO)
        .payDay(15)
        .isUse(true)
        .build());

    // 3. 샘플 카드 이용 내역 일괄 생성
    cardUsageRepository.saveAll(buildSampleUsages(card, grantor.getUserNm()));

    // 4. 가족 인증 등록 (GRANTOR=부모, GRANTEE=자식)
    familyAuthRepository.save(TBFamilyAuth.builder()
        .grantor(grantor)
        .grantee(grantee)
        .relationCd(FamilyRelation.CHILD)
        .isInsView(true)
        .isCardView(true)
        .isProxyClaim(true)
        .isTrustView(true)
        .card(card)
        .build());
  }

  private List<TBCardUsage> buildSampleUsages(TBCard card, String grantorName) {
    record U(String nm, String loc, UsageType type, String amt, String abnml) {}
    List<U> rows = List.of(
        new U("강남성심병원",        "서울 강남구 도곡로 117",         UsageType.SPEND,  "25000",  "N"),
        new U(grantorName,           null,                             UsageType.CHARGE, "300000", "N"),
        new U("네일샵 강남점",        "서울 강남구 강남대로 396",       UsageType.SPEND,  "45000",  "Y"),
        new U("삼성서울병원 약국",    "서울 강남구 일원로 81",          UsageType.SPEND,  "18500",  "N"),
        new U("강남구보건소",         "서울 강남구 삼성로 212",         UsageType.SPEND,  "5000",   "N"),
        new U("온누리약국 역삼점",    "서울 강남구 역삼로 165",         UsageType.SPEND,  "12800",  "N"),
        new U("노래방 강남점",        "서울 강남구 역삼로 180",         UsageType.SPEND,  "35000",  "Y"),
        new U("의료기기센터 강남",    "서울 강남구 논현로 508",         UsageType.SPEND,  "45000",  "N"),
        new U("강남재활의학과",       "서울 강남구 역삼로 146",         UsageType.SPEND,  "32000",  "N"),
        new U("한마음약국",           "서울 강남구 대치동 944-7",       UsageType.SPEND,  "9500",   "N")
    );

    return rows.stream()
        .map(u -> TBCardUsage.builder()
            .card(card)
            .usageNm(u.nm())
            .usageLoc(u.loc())
            .usageTypeCd(u.type())
            .usageAmt(new BigDecimal(u.amt()))
            .abnmlYn(u.abnml())
            .aprvlYn("Y")
            .build())
        .collect(Collectors.toList());
  }

  public String getUser(Long userId) {
    return userRepository.findUserNmById(userId);
  }
}
