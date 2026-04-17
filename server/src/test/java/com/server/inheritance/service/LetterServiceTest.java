package com.server.inheritance.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.server.common.exception.ApiException;
import com.server.common.s3.StorageService;
import com.server.inheritance.dto.LetterRequestDto;
import com.server.inheritance.dto.LetterResponseDto;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritLetter;
import com.server.inheritance.enums.LetterType;
import com.server.inheritance.repository.InheritDetailRepository;
import com.server.inheritance.repository.InheritLetterRepository;
import com.server.inheritance.repository.InheritPlanRepository;
import com.server.user.entity.TBUser;
import com.server.user.repository.FamilyAuthRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
class LetterServiceTest {

  @InjectMocks
  private LetterService letterService;

  @Mock
  private InheritLetterRepository letterRepository;

  @Mock
  private InheritDetailRepository inheritDetailRepository;

  @Mock
  private InheritPlanRepository inheritPlanRepository;

  @Mock
  private FamilyAuthRepository familyAuthRepository;

  @Mock
  private StorageService storageService;

  @Test
  void sendLetter_success() throws Exception {
    // given
    Long userId = 1L;
    Long inheritDetailId = 10L;

    TBInheritDetail detail = TBInheritDetail.builder()
        .inheritDetailId(inheritDetailId)
        .user(TBUser.builder().userId(2L).build())
        .build();

    LetterRequestDto dto = new LetterRequestDto();
    dto.setInheritDetailId(inheritDetailId);
    dto.setLetterTypeCd(LetterType.WRITING);
    dto.setLetterCont("hello");

    MultipartFile voice = null;

    given(inheritDetailRepository.findById(inheritDetailId))
        .willReturn(Optional.of(detail));

    given(familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, 2L))
        .willReturn(true);

    given(letterRepository.findByInheritDetail_InheritDetailId(inheritDetailId))
        .willReturn(Optional.empty());

    given(letterRepository.save(any()))
        .willAnswer(inv -> inv.getArgument(0));

    // when
    LetterResponseDto result =
        letterService.sendLetter(userId, dto, voice);

    // then
    assertThat(result.getLetterCont()).isEqualTo("hello");
  }

  @Test
  void sendLetter_fail_duplicate() {
    Long userId = 1L;
    Long inheritDetailId = 10L;

    TBInheritDetail detail = TBInheritDetail.builder()
        .inheritDetailId(inheritDetailId)
        .user(TBUser.builder().userId(2L).build())
        .build();

    LetterRequestDto dto = new LetterRequestDto();
    dto.setInheritDetailId(inheritDetailId);
    dto.setLetterTypeCd(LetterType.WRITING);

    given(inheritDetailRepository.findById(inheritDetailId))
        .willReturn(Optional.of(detail));

    given(familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, 2L))
        .willReturn(true);

    given(letterRepository.findByInheritDetail_InheritDetailId(inheritDetailId))
        .willReturn(Optional.of(new TBInheritLetter()));

    assertThatThrownBy(() ->
        letterService.sendLetter(userId, dto, null)
    ).isInstanceOf(ApiException.class);
  }

  @Test
  void sendLetter_voice_success() throws Exception {

    Long userId = 1L;
    Long inheritDetailId = 10L;

    TBInheritDetail detail = TBInheritDetail.builder()
        .inheritDetailId(inheritDetailId)
        .user(TBUser.builder().userId(2L).build())
        .build();

    LetterRequestDto dto = new LetterRequestDto();
    dto.setInheritDetailId(inheritDetailId);
    dto.setLetterTypeCd(LetterType.VOICE);

    MultipartFile file = mock(MultipartFile.class);

    given(file.isEmpty()).willReturn(false);
    given(storageService.save(file)).willReturn("key123");

    given(inheritDetailRepository.findById(inheritDetailId))
        .willReturn(Optional.of(detail));

    given(familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, 2L))
        .willReturn(true);

    given(letterRepository.findByInheritDetail_InheritDetailId(inheritDetailId))
        .willReturn(Optional.empty());

    given(letterRepository.save(any()))
        .willAnswer(inv -> inv.getArgument(0));

    LetterResponseDto result =
        letterService.sendLetter(userId, dto, file);

    assertThat(result.getVoiceUrl()).isEqualTo("key123");
  }

  @Test
  void getLetter_success() {

    Long userId = 1L;
    Long inheritDetailId = 10L;

    TBInheritDetail detail = TBInheritDetail.builder()
        .inheritDetailId(inheritDetailId)
        .user(TBUser.builder().userId(2L).build())
        .build();

    TBInheritLetter letter = TBInheritLetter.builder()
        .letterCont("hi")
        .letterTypeCd(LetterType.WRITING)
        .build();

    given(inheritDetailRepository.findById(inheritDetailId))
        .willReturn(Optional.of(detail));

    given(familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, 2L))
        .willReturn(true);

    given(letterRepository.findByInheritDetail_InheritDetailId(inheritDetailId))
        .willReturn(Optional.of(letter));

    LetterResponseDto result =
        letterService.getLetter(userId, inheritDetailId);

    assertThat(result.getLetterCont()).isEqualTo("hi");
  }
}
