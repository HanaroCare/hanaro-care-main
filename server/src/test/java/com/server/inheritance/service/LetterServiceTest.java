package com.server.inheritance.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.server.common.exception.ApiException;
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
import com.server.user.entity.TBUser;
import com.server.user.repository.FamilyAuthRepository;
import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
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
  void getInheritanceInfo_success() {

    // given
    Long userId = 1L;

    TBInheritPlan plan = mock(TBInheritPlan.class);
    given(plan.getId()).willReturn(10L);

    given(inheritPlanRepository.findByUser_UserId(userId))
        .willReturn(Optional.of(plan));

    TBInheritDetail detail = mock(TBInheritDetail.class);
    TBUser user = mock(TBUser.class);

    given(detail.getInheritDetailId()).willReturn(100L);
    given(detail.getDistRatio()).willReturn(new BigDecimal("50.0")); // 백분율 반영

    given(user.getUserId()).willReturn(userId);

    given(detail.getUser()).willReturn(user);
    given(detail.getHeirName()).willReturn("홍길동");
    given(detail.getInheritPlan()).willReturn(plan);

    given(inheritDetailRepository.findAllByInheritPlan_Id(10L))
        .willReturn(List.of(detail));

    given(plan.getTotalInheritAmt())
        .willReturn(new BigDecimal("1000000"));

    // when
    List<InheritanceSummaryDto> result = letterService.getInheritanceInfo(userId);

    // then
    assertThat(result).hasSize(1);
    assertThat(result.get(0).getUserId()).isEqualTo(String.valueOf(userId));
    assertThat(result.get(0).getUsername()).isEqualTo("홍길동");
    assertThat(result.get(0).getAmt()).isEqualTo(500000L); // 1000000 * 50 / 100
  }


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
    dto.setInheritDetailId(String.valueOf(inheritDetailId)); // ID 문자열 변환
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
  void sendLetter_update_success() throws Exception {
    Long userId = 1L;
    Long inheritDetailId = 10L;

    TBInheritDetail detail = TBInheritDetail.builder()
        .inheritDetailId(inheritDetailId)
        .user(TBUser.builder().userId(2L).build())
        .build();

    LetterRequestDto dto = new LetterRequestDto();
    dto.setInheritDetailId(String.valueOf(inheritDetailId)); // ID 문자열 변환
    dto.setLetterTypeCd(LetterType.WRITING);
    dto.setLetterCont("updated content");

    given(inheritDetailRepository.findById(inheritDetailId))
        .willReturn(Optional.of(detail));

    given(familyAuthRepository.existsByGrantor_UserIdAndGrantee_UserId(userId, 2L))
        .willReturn(true);

    given(letterRepository.findByInheritDetail_InheritDetailId(inheritDetailId))
        .willReturn(Optional.of(new TBInheritLetter()));

    given(letterRepository.save(any()))
        .willAnswer(inv -> inv.getArgument(0));

    // when
    LetterResponseDto result =
        letterService.sendLetter(userId, dto, null);

    // then
    assertThat(result.getLetterCont()).isEqualTo("updated content");
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
    dto.setInheritDetailId(String.valueOf(inheritDetailId)); // ID 문자열 변환
    dto.setLetterTypeCd(LetterType.VOICE);

    MultipartFile file = mock(MultipartFile.class);

    given(file.isEmpty()).willReturn(false);
    given(storageService.save(file)).willReturn("key123");
    given(storageService.getUrl("key123")).willReturn("http://s3/key123");

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

    assertThat(result.getVoiceUrl()).isEqualTo("http://s3/key123");
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

  @Test
  void save_voiceFile_success() throws Exception {

    // given
    MultipartFile file = mock(MultipartFile.class);

    given(file.getInputStream())
        .willReturn(new ByteArrayInputStream("test audio".getBytes()));

    ReflectionTestUtils.setField(letterService, "uploadDir", "build/test-upload");

    String result = letterService.save(file);

    assertThat(result).endsWith(".webm");
    assertThat(result).isNotBlank();
  }

  @Test
  void deleteLetter_success() {

    Long userId = 1L;
    Long inheritDetailId = 10L;

    TBUser receiver = mock(TBUser.class);
    given(receiver.getUserId()).willReturn(2L);

    TBInheritDetail detail = mock(TBInheritDetail.class);
    given(detail.getUser()).willReturn(receiver);

    given(inheritDetailRepository.findById(inheritDetailId))
        .willReturn(Optional.of(detail));

    given(familyAuthRepository
        .existsByGrantor_UserIdAndGrantee_UserId(userId, 2L))
        .willReturn(true);

    TBInheritLetter letter = mock(TBInheritLetter.class);
    given(letter.getLetterId()).willReturn(99L);

    given(letterRepository
        .findByInheritDetail_InheritDetailId(inheritDetailId))
        .willReturn(Optional.of(letter));

    String result = letterService.deleteLetter(userId, inheritDetailId);
    assertThat(result).isEqualTo("99"); // ID 문자열 변환
  }
}
