package com.server.myhana.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

import com.server.common.security.dto.SubscriberDTO;
import com.server.myhana.dto.ContractDto;
import com.server.myhana.dto.FamilySummaryDto;
import com.server.user.entity.TBFamilyAuth;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.repository.FamilyAuthRepository;
import com.server.user.repository.UserRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MyHanaInheritanceServiceTest {

  @InjectMocks
  private MyHanaInheritanceService service;

  @Mock
  private FamilyAuthRepository familyAuthRepository;

  @Mock
  private UserRepository userRepository;

  @Test
  void getFamily_success() {

    Long userId = 1L;

    TBFamilyAuth auth = mock(TBFamilyAuth.class);
    TBUser grantee = mock(TBUser.class);

    given(grantee.getUserNm()).willReturn("홍길동");
    given(grantee.getUserPhone()).willReturn("01012345678");

    given(auth.getGrantee()).willReturn(grantee);
    given(auth.getRelationCd()).willReturn(FamilyRelation.PARENT);

    given(familyAuthRepository.findAllByGrantorUserId(userId))
        .willReturn(List.of(auth));

    List<FamilySummaryDto> result = service.getFamily(userId);

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getName()).isEqualTo("홍길동");
  }

  @Test
  void generateContract_success() throws Exception {

    SubscriberDTO user = mock(SubscriberDTO.class);

    given(user.getUserId()).willReturn(1L);
    given(user.getUserNm()).willReturn("김철수");

    ContractDto dto = new ContractDto();
    dto.setGuardianName("홍길동");
    dto.setGuardianRelation("부");
    dto.setPermission(new boolean[]{true, false, true, false, true});

    given(userRepository.findUserPhoneByUserId(1L))
        .willReturn("01099998888");

    byte[] result = service.generateContract(user, dto);

    assertThat(result).isNotNull();
    assertThat(result.length).isGreaterThan(0);
  }
}
