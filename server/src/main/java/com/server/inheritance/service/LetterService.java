package com.server.inheritance.service;

import com.server.inheritance.dto.InheritanceSummaryDto;
import com.server.inheritance.dto.LetterRequestDto;
import com.server.inheritance.dto.LetterResponseDto;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritLetter;
import com.server.inheritance.entity.TBInheritPlan;
import com.server.inheritance.enums.LetterType;
import com.server.inheritance.repository.TBInheritDetailRepository;
import com.server.inheritance.repository.TBInheritPlanRepository;
import com.server.inheritance.repository.TBLetterRepository;
import com.server.user.repository.TBFamilyAuthRepository;
import jakarta.transaction.Transactional;
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
  private final TBInheritPlanRepository inheritPlanRepository;

  @Value("${voice.upload-dir}")
  String uploadDir;

  @Value("${voice.base-url}")
  String baseUrl;

  // 상속비율 및 가족 조회
  public List<InheritanceSummaryDto> getInheritanceInfo(Long userId) {

    TBInheritPlan plan = inheritPlanRepository.findByUser_UserId(userId)
        .orElseThrow(() -> new IllegalArgumentException("계획하신 상속 비율을 정보를 확인할 수 없습니다."));
    List<TBInheritDetail> inheritDetails = inheritDetailRepository.findAllByInheritPlan_Id(
        plan.getId());

    return inheritDetails.stream().map(i -> InheritanceSummaryDto.builder()
        .id(i.getUser().getUserId())
        .username(i.getUser().getUserNm())
        .percent(i.getDistRatio())
        .amt(i.getInheritPlan().getTotalInheritAmt().intValue() * i.getDistRatio().intValue())
        .build()).toList();
  }

  // 편지 생성
  public void sendLetter(Long userId, LetterRequestDto dto, MultipartFile voice)
      throws IOException {
    TBInheritDetail detail = inheritDetailRepository.findById(dto.getInheritDetailId())
        .orElseThrow(() -> new IllegalArgumentException("상속 상세 정보를 찾을 수 없습니다."));

    if (!familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId,
        detail.getUser().getUserId())) {
      throw new IllegalArgumentException("해당 가족을 찾을 수 없습니다.");
    }

    String filename = "";
    if (dto.getLetterTypeCd() == LetterType.VOICE) {
      if (voice == null || voice.isEmpty()) {
        throw new IllegalArgumentException("음성 파일을 첨부해야 합니다.");
      }
      filename = save(voice);
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
  public LetterResponseDto getLetter(Long userId, Long inheritDetailId) {

    TBInheritDetail detail = inheritDetailRepository.findById(inheritDetailId)
        .orElseThrow(() -> new IllegalArgumentException("상속 상세 정보를 찾을 수 없습니다."));

    Long receivedId = detail.getUser().getUserId();

    if (!familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, receivedId)) {
      throw new IllegalArgumentException("해당 가족을 찾을 수 없습니다.");
    }
    TBInheritLetter letter = letterRepository.findByInheritDetail_InheritDetailId(inheritDetailId)
        .orElseThrow(() -> new IllegalArgumentException("해당 가족에게 남긴 편지가 없습니다."));

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

  @Transactional
  public void deleteLetter(Long userId, Long inheritDetailId) {
    TBInheritDetail detail = inheritDetailRepository.findById(inheritDetailId)
        .orElseThrow(() -> new IllegalArgumentException("상속 상세 정보를 찾을 수 없습니다."));

    Long receivedId = detail.getUser().getUserId();

    if (!familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, receivedId)) {
      throw new IllegalArgumentException("해당 가족을 찾을 수 없습니다.");
    }

    TBInheritLetter letter = letterRepository.findByInheritDetail_InheritDetailId(inheritDetailId)
        .orElseThrow(() -> new IllegalArgumentException("해당 가족에게 남긴 편지가 없습니다."));

    detail.setInheritLetter(null);
  }
}

