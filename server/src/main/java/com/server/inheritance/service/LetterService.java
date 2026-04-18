package com.server.inheritance.service;

import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.common.s3.StorageService;
import com.server.inheritance.dto.InheritanceSummaryDto;
import com.server.inheritance.dto.LetterRequestDto;
import com.server.inheritance.dto.LetterResponseDto;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritLetter;
import com.server.inheritance.entity.TBInheritPlan;
import com.server.inheritance.enums.LetterType;
import com.server.inheritance.repository.InheritDetailRepository;
import com.server.inheritance.repository.InheritLetterRepository;
import com.server.inheritance.repository.InheritPlanRepository;
import com.server.user.repository.FamilyAuthRepository;
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

  private final FamilyAuthRepository familyAuthRepository;
  private final InheritLetterRepository letterRepository;
  private final InheritDetailRepository inheritDetailRepository;
  private final InheritPlanRepository inheritPlanRepository;
  private final StorageService storageService;

  @Value("${voice.upload-dir}")
  String uploadDir;

  @Value("${voice.base-url}")
  String baseUrl;

  // 상속비율 및 가족 조회
  @CheckUser(key = "#userId")
  public List<InheritanceSummaryDto> getInheritanceInfo(Long userId) {

    TBInheritPlan plan = inheritPlanRepository.findByUser_UserId(userId)
        .orElseThrow(() -> new ApiException(ErrorStatus.INHERIT_PLAN_NOT_FOUND)
        );
    List<TBInheritDetail> inheritDetails = inheritDetailRepository.findAllByInheritPlan_Id(
        plan.getId());

    return inheritDetails.stream().map(i -> InheritanceSummaryDto.builder()
        .inheritDetailId(String.valueOf(i.getInheritDetailId()))
        .userId(String.valueOf(i.getUser().getUserId()))
        .username(i.getUser().getUserNm())
        .percent(i.getDistRatio())
        .amt(i.getInheritPlan().getTotalInheritAmt()
            .multiply(i.getDistRatio())
            .longValue()).build()).toList();
  }

  // 편지 생성
  @Transactional
  @CheckUser(key = "#userId")
  public LetterResponseDto sendLetter(Long userId, LetterRequestDto dto, MultipartFile voice)
      throws IOException {
    TBInheritDetail detail = inheritDetailRepository.findById(Long.parseLong(dto.getInheritDetailId()))
        .orElseThrow(() -> new ApiException(ErrorStatus.INHERIT_DETAIL_NOT_FOUND));

    if (!familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId,
        detail.getUser().getUserId())) {
      throw new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND);
    }

    if (letterRepository.findByInheritDetail_InheritDetailId(Long.parseLong(dto.getInheritDetailId()))
        .isPresent()) {
      throw new ApiException(ErrorStatus.LETTER_ALREADY_EXISTS);
    }

    String key = "";
    if (dto.getLetterTypeCd() == LetterType.VOICE) {
      if (voice == null || voice.isEmpty()) {
        throw new ApiException(ErrorStatus.VOICE_FILE_REQUIRED);
      }
      key = storageService.save(voice);
      dto.setLetterCont(null);
    }
    try {
      TBInheritLetter letter = TBInheritLetter.builder()
          .inheritDetail(detail)
          .letterCont(dto.getLetterCont())
          .voiceUrl(key)
          .letterTypeCd(dto.getLetterTypeCd())
          .build();
      letterRepository.save(letter);
      return LetterResponseDto.builder().
          letterTypeCd(dto.getLetterTypeCd())
          .letterCont(dto.getLetterCont())
          .voiceUrl(key).build();
    } catch (RuntimeException e) {
      if (!key.isBlank()) {
        storageService.delete(key);
      }
      throw e;
    }
  }

  // 편지 조회
  @CheckUser(key = "#userId")
  public LetterResponseDto getLetter(Long userId, Long inheritDetailId) {

    TBInheritDetail detail = inheritDetailRepository.findById(inheritDetailId)
        .orElseThrow(() -> new ApiException(ErrorStatus.INHERIT_DETAIL_NOT_FOUND));

    Long receivedId = detail.getUser().getUserId();

    if (!familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, receivedId)) {
      throw new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND);
    }
    TBInheritLetter letter = letterRepository.findByInheritDetail_InheritDetailId(inheritDetailId)
        .orElseThrow(() -> new ApiException(ErrorStatus.INHERIT_LETTER_NOT_FOUND));
    String voiceUrl = "";
    if (letter.getLetterTypeCd() == LetterType.VOICE) {
      voiceUrl = storageService.getUrl(letter.getVoiceUrl());
    }
    return LetterResponseDto.builder()
        .letterCont(letter.getLetterCont())
        .voiceUrl(voiceUrl)
        .letterTypeCd(letter.getLetterTypeCd())
        .build();
  }

  // 로컬용 음성 저장
  public String save(MultipartFile voice) throws IOException {
    String savedFilename = UUID.randomUUID() + ".webm";
    Path savePath = Paths.get(uploadDir).resolve(savedFilename);
    Files.createDirectories(savePath.getParent());
    Files.copy(voice.getInputStream(), savePath);

    return savedFilename;
  }

  @Transactional
  @CheckUser(key = "#userId")
  public String deleteLetter(Long userId, Long inheritDetailId) {
    TBInheritDetail detail = inheritDetailRepository.findById(inheritDetailId)
        .orElseThrow(() -> new ApiException(ErrorStatus.INHERIT_DETAIL_NOT_FOUND));

    Long receivedId = detail.getUser().getUserId();

    if (!familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, receivedId)) {
      throw new ApiException(ErrorStatus.FAMILY_AUTH_NOT_FOUND);
    }

    TBInheritLetter letter = letterRepository.findByInheritDetail_InheritDetailId(
            inheritDetailId)
        .orElseThrow(() -> new ApiException(ErrorStatus.INHERIT_LETTER_NOT_FOUND));

    detail.setInheritLetter(null);
    return String.valueOf(letter.getLetterId());
  }
}

