package com.server.inheritance.service;

import com.server.inheritance.dto.LetterRequestDto;
import com.server.inheritance.dto.LetterResponseDto;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritLetter;
import com.server.inheritance.enums.LetterType;
import com.server.inheritance.repository.InheritDetailRepository;
import com.server.inheritance.repository.LetterRepository;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LetterService {

  private final UserRepository userRepository;
  private final FamilyAuthRepository familyAuthRepository;
  private final LetterRepository letterRepository;
  private final InheritDetailRepository inheritDetailRepository;

  public void sendLetter(Long userId, LetterRequestDto dto) {
    userRepository.findById(dto.getFamilyId()).orelse(()=> throw new IllegalArgumentException("해당 가족을 찾을 수 없습니다."));
    familyAuthRepository.findByUserIdAndFamilyId(userId, dto.getFamilyId())
        .orElseThrow(() -> new IllegalArgumentException("해당 가족을 찾을 수 없습니다."));
    TBInheritDetail detail = inheritDetailRepository.findById(dto.getInheritDetailId())
        .orElseThrow(() -> new IllegalArgumentException("상속 상세 정보를 찾을 수 없습니다."));
    if(dto.getLetterTypeCd()== LetterType.VOICE) {
      //s3에 저장.
      //저장 링크 가져오려면
    }

    TBInheritLetter letter = TBInheritLetter.builder()
        .inheritDetail(detail)        // ID가 아닌 엔티티 객체 주입
        .letterCont(dto.getLetterCont())
        .voiceUrl(dto.getVoiceUrl())
        .letterTypeCd(dto.getLetterTypeCd()) // Enum 타입 확인
        .build();
    letterRepository.save(letter);
  }

  public LetterResponseDto getLetter(Long userId,Long familyId) {
    familyAuthRepository.findByUserIdAndFamilyId(userId, dto.getFamilyId())
        .orElseThrow(() -> new IllegalArgumentException("해당 가족을 찾을 수 없습니다."));
    TBInheritLetter letter = letterRepository.findByInheritDetail_User_UserId(familyId)
        .orElseThrow(() -> new IllegalArgumentException("해당 가족이 남긴 편지가 없습니다."));

    if(letter.getLetterTypeCd()== LetterType.VOICE) {
      //s3 링크 가져오기
    }
    return LetterResponseDto.builder()
        .letterCont(letter.getLetterCont())
        .voiceUrl(letter.getVoiceUrl())
        .letterTypeCd(letter.getLetterTypeCd())
        .build();}
}

