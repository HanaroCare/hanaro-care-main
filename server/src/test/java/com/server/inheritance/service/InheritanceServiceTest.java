package com.server.inheritance.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.server.asset.dto.dashboard.AssetDashboardResponse;
import com.server.asset.service.AssetService;
import com.server.inheritance.dto.InheritanceRequestDTO;
import com.server.inheritance.dto.InheritanceResponseDTO;
import com.server.inheritance.entity.TBInheritDetail;
import com.server.inheritance.entity.TBInheritPlan;
import com.server.inheritance.repository.InheritDetailRepository;
import com.server.inheritance.repository.InheritLetterRepository;
import com.server.inheritance.repository.InheritPlanRepository;
import com.server.user.entity.TBUser;
import com.server.user.enums.FamilyRelation;
import com.server.user.repository.UserRepository;
import com.server.user.service.FamilyService;
import com.server.user.service.UserService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class InheritanceServiceTest {

    @Mock
    private InheritPlanRepository planRepository;
    @Mock
    private InheritDetailRepository detailRepository;
    @Mock
    private InheritLetterRepository letterRepository;
    @Mock
    private AssetService assetService;
    @Mock
    private UserService userService;
    @Mock
    private FamilyService familyService;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private InheritanceService inheritanceService;

    @Test
    @DisplayName("상속 플랜 생성 또는 업데이트 테스트")
    void createOrUpdatePlanTest() {
        // given
        Long userId = 1L;
        TBUser user = TBUser.builder().userId(userId).userNm("테스트").build();
        
        InheritanceRequestDTO request = InheritanceRequestDTO.builder()
                .distributions(List.of(
                        InheritanceRequestDTO.HeirDistributionDTO.builder()
                                .heirName("배우자")
                                .relation(FamilyRelation.SPOUSE)
                                .distRatio(100.0)
                                .build()
                ))
                .build();

        AssetDashboardResponse dashboard = AssetDashboardResponse.builder()
                .financialAssets(new ArrayList<>())
                .realAssets(new ArrayList<>())
                .totalFinancialAmt(BigDecimal.ZERO)
                .build();

        TBInheritPlan plan = TBInheritPlan.builder()
                .id(1L)
                .user(user)
                .totalInheritAmt(BigDecimal.ZERO)
                .estiTaxAmt(BigDecimal.ZERO)
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(assetService.getAssetDashboard(userId)).thenReturn(dashboard);
        when(planRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(planRepository.save(any(TBInheritPlan.class))).thenReturn(plan);
        when(detailRepository.findByInheritPlanId(any())).thenReturn(new ArrayList<>());
        when(detailRepository.save(any(TBInheritDetail.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        InheritanceResponseDTO response = inheritanceService.createOrUpdatePlan(userId, request);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getPlanId()).isEqualTo(1L);
        verify(planRepository, times(1)).save(any(TBInheritPlan.class));
        verify(detailRepository, times(1)).save(any(TBInheritDetail.class));
    }

    @Test
    @DisplayName("상속 플랜 요약 조회 테스트")
    void getPlanSummaryTest() {
        // given
        Long userId = 1L;
        TBInheritPlan plan = TBInheritPlan.builder()
                .id(1L)
                .totalInheritAmt(new BigDecimal("1000000000"))
                .estiTaxAmt(new BigDecimal("100000000"))
                .build();
        
        TBInheritDetail detail = TBInheritDetail.builder()
                .inheritDetailId(1L)
                .heirName("상속인")
                .relationCd(FamilyRelation.CHILD)
                .distRatio(new BigDecimal("100.00"))
                .build();

        when(planRepository.findByUserId(userId)).thenReturn(Optional.of(plan));
        when(detailRepository.findByInheritPlanId(1L)).thenReturn(List.of(detail));

        // when
        InheritanceResponseDTO response = inheritanceService.getPlanSummary(userId);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getHeirs()).hasSize(1);
        assertThat(response.getHeirs().get(0).getHeirName()).isEqualTo("상속인");
    }
}
