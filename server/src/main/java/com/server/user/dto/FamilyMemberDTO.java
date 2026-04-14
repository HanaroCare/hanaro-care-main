package com.server.user.dto;

import com.server.user.enums.FamilyRelation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMemberDTO {
    private Long userId;
    private String name;
    private FamilyRelation relation; // Simplified for this view
}
