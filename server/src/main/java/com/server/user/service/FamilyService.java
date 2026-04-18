package com.server.user.service;

import com.server.user.dto.FamilyMemberDTO;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.enums.FamilyRelation;
import com.server.user.repository.FamilyAuthRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FamilyService {

  private final FamilyAuthRepository familyAuthRepository;

  public List<FamilyMemberDTO> getFamilyMembers(Long userId) {
    List<TBFamilyAuth> grantors = familyAuthRepository.findApprovedFamilyByGranteeId(userId);
    List<TBFamilyAuth> grantees = familyAuthRepository.findApprovedFamilyByGrantorId(userId);

    Map<Long, FamilyMemberDTO> memberMap = new LinkedHashMap<>();

    grantors.forEach(f -> memberMap.putIfAbsent(
        f.getGrantor().getUserId(),
        FamilyMemberDTO.builder()
            .userId(String.valueOf(f.getGrantor().getUserId()))
            .name(f.getGrantor().getUserNm())
            .relation(FamilyRelation.valueOf(f.getRelationCd().name()))
            .build()));

    grantees.forEach(f -> memberMap.putIfAbsent(
        f.getGrantee().getUserId(),
        FamilyMemberDTO.builder()
            .userId(String.valueOf(f.getGrantee().getUserId()))
            .name(f.getGrantee().getUserNm())
            .relation(FamilyRelation.valueOf(f.getRelationCd().name()))
            .build()));

    return new java.util.ArrayList<>(memberMap.values());
  }
}
