package com.server.inheritance.dto;

import com.server.asset.dto.AssetSummaryDTO;
import com.server.user.dto.FamilyMemberDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InheritanceContextDTO {
    private AssetSummaryDTO assetSummary;
    private List<FamilyMemberDTO> familyMembers;
}
