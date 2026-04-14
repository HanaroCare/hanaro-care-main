package com.server.inheritance.service;

import com.server.inheritance.dto.InheritanceSummaryDto;
import com.server.inheritance.dto.LetterRequestDto;
import com.server.inheritance.dto.LetterResponseDto;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritLetter;
import com.server.inheritance.enums.LetterType;
import com.server.inheritance.repository.TBInheritDetailRepository;
import com.server.inheritance.repository.TBLetterRepository;
import com.server.user.entity.TBUser;
import com.server.user.repository.TBFamilyAuthRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class LetterService {

  private final TBFamilyAuthRepository familyAuthRepository;
  private final TBLetterRepository letterRepository;
  private final TBInheritDetailRepository inheritDetailRepository;

  @Value("${voice.upload-dir}")
  String uploadDir;

  @Value("${voice.base-url}")
  String baseUrl;

  // 상속비율 및 가족 조회
  public List<InheritanceSummaryDto> getInheritanceInfo(Long userId) {
    List<TBUser> families = familyAuthRepository.findAllByGrantorUserId(userId).stream()
        .map(a -> a.getGrantee()).toList();

    return families.stream()
        .filter(f -> inheritDetailRepository.existsByUser_UserId(f.getUserId()))
        .map(f -> {
          TBInheritDetail detail = inheritDetailRepository.findByUser_UserId(f.getUserId())
              .orElseThrow(() -> new IllegalArgumentException("상속 정보를 찾을 수 없습니다."));

          int amount =
              detail.getInheritPlan().getTotalInheritAmt().intValue() * detail.getDistRatio()
                  .intValue();
          return InheritanceSummaryDto.builder()
              .id(f.getUserId())
              .username(f.getUserNm())
              .percent(detail.getDistRatio())
              .amt(amount)
              .build();
        }).toList();
  }

  // 편지 생성
  public void sendLetter(Long userId, LetterRequestDto dto) throws IOException {
    if (!familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, dto.getFamilyId())) {
      throw new IllegalArgumentException("해당 가족을 찾을 수 없습니다.");
    }
    TBInheritDetail detail = inheritDetailRepository.findById(dto.getFamilyId())
        .orElseThrow(() -> new IllegalArgumentException("상속 상세 정보를 찾을 수 없습니다."));

    String filename = "";
    if (dto.getLetterTypeCd() == LetterType.VOICE) {
      // TODO: s3에 저장.
      filename = save(dto.getVoice());
    }

    TBInheritLetter letter = TBInheritLetter.builder()
        .inheritDetail(detail)
        .letterCont(dto.getLetterCont())
        .voiceUrl(filename)
        .letterTypeCd(dto.getLetterTypeCd())
        .build();
    letterRepository.save(letter);
  }

  // 편지 조회
  public LetterResponseDto getLetter(Long userId, Long familyId) {
    if (!familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, familyId)) {
      throw new IllegalArgumentException("해당 가족을 찾을 수 없습니다.");
    }
    TBInheritLetter letter = letterRepository.findByUserId(familyId)
        .orElseThrow(() -> new IllegalArgumentException("해당 가족이 남긴 편지가 없습니다."));

    if (letter.getLetterTypeCd() == LetterType.VOICE) {
      // TODO: s3 링크 가져오기
      //  String voiceUrl = s3Service.getVoiceUrl(letter.getVoiceUrl());
      //  letter.setVoiceUrl(voiceUrl);
    }

    return LetterResponseDto.builder()
        .letterCont(letter.getLetterCont())
        .voiceUrl(baseUrl + letter.getVoiceUrl())
        .letterTypeCd(letter.getLetterTypeCd())
        .build();
  }

  public String save(MultipartFile voice) throws IOException {
    String savedFilename = UUID.randomUUID() + ".webm";
    Path savePath = Paths.get(uploadDir).resolve(savedFilename);
    Files.createDirectories(savePath.getParent());
    Files.copy(voice.getInputStream(), savePath);

    return savedFilename;
  }
}

