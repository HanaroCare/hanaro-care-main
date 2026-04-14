package com.server.asset.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class PublicDataResponse {
    @Getter @NoArgsConstructor
    public static class KosisData {
        @JsonProperty("UNIT_NM")
        private String unit;
        @JsonProperty("DT")
        private String value;
        @JsonProperty("ITM_NM")
        private String itemName;
    }
    @Getter @NoArgsConstructor
    public static class BokjiroService {
        private String servNm;
        private String servId;
        private String servDtlLink;
        private String jurMnofNm;
    }
}
