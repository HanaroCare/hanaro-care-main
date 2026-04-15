package com.server.asset.dto.external.publicdata;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 복지로(공공데이터포털) API 응답 DTO
 */
public class PublicDataResponse {

    @Getter @Setter @NoArgsConstructor
    public static class WelfareListResponse {
        @JsonProperty("wantedList")
        private WantedList wantedList;
    }

    @Getter @Setter @NoArgsConstructor
    public static class WantedList {
        private String totalCount;
        private List<WelfareService> servList;
    }

    @Getter @Setter @NoArgsConstructor
    public static class WelfareService {
        private String servId;      // 서비스 ID
        private String servNm;      // 서비스명
        private String jurMnofNm;   // 소관부처명
        private String servDgst;    // 서비스 요약
        private String servDtlLink; // 서비스 상세 링크
        private String trgetNm;     // 지원대상
    }

    /**
     * 상세 조회 응답 (필요 시 확장 가능)
     * 상세 조회의 경우 XML/JSON 구조가 복잡할 수 있어 String으로 우선 받고 파싱하거나 
     * 아래와 같은 구조를 사용합니다.
     */
    @Getter @Setter @NoArgsConstructor
    public static class WelfareDetailResponse {
        private String servId;
        private String servNm;
        private String tgtrHtmlContent; // 지원 대상 상세
        private String alwServHtmlContent; // 지원 내용 상세
        private String brkdwnHtmlContent; // 선정 기준 상세
    }
}
