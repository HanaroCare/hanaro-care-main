package com.server.user.service;

import com.server.inheritance.enums.FamilyRelation;
import com.server.user.dto.FamilyMemberDTO;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.repository.FamilyAuthRepository;
import java.util.List;
import java.util.stream.Collectors;
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

    List<FamilyMemberDTO> members = grantors.stream()
        .map(f -> FamilyMemberDTO.builder()
            .userId(f.getGrantor().getUserId())
            .name(f.getGrantor().getUserNm())
            .relation(FamilyRelation.valueOf(f.getRelationCd().name()))
            .build())
        .collect(Collectors.toList());

    members.addAll(grantees.stream()
        .map(f -> FamilyMemberDTO.builder()
            .userId(f.getGrantee().getUserId())
            .name(f.getGrantee().getUserNm())
            .relation(FamilyRelation.valueOf(f.getRelationCd().name()))
            .build())
        .collect(Collectors.toList()));

    return members;
  }
}
