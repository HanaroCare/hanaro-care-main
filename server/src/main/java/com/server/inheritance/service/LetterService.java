package com.server.inheritance.service;

import com.server.inheritance.dto.LetterRequestDto;
import com.server.inheritance.dto.LetterResponseDto;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritLetter;
import com.server.inheritance.enums.LetterType;
import com.server.inheritance.repository.TBInheritDetailRepository;
import com.server.inheritance.repository.TBLetterRepository;
import com.server.user.repository.TBFamilyAuthRepository;
import com.server.user.repository.TBUserRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class LetterService {

  private final TBUserRepository userRepository;
  private final TBFamilyAuthRepository familyAuthRepository;
  private final TBLetterRepository letterRepository;
  private final TBInheritDetailRepository inheritDetailRepository;

  @Value("${voice.upload-dir}")
  String uploadDir;

  @Value("${voice.base-url}")
  String baseUrl;

  // TODO: 상속비율 및 가족 조회, 총 잔액 조회


  // 편지 생성
  public void sendLetter(Long userId, LetterRequestDto dto) throws IOException {
    if (!familyAuthRepository.existsByUserIdAndFamilyId(userId, dto.getFamilyId())) {
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
    if (!familyAuthRepository.existsByUserIdAndFamilyId(userId, familyId)) {
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

