package com.server.inheritance.dto;

import com.server.inheritance.enums.LetterType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LetterDTO {
    private Long letterId;
    private Long inheritDetailId;
    private LetterType letterType;
    private String content;
    private String voiceUrl;
}
