package com.server.asset.dto.external.publicdata;

import java.util.List;
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
    public static class WelfareListResponse {
        private WantedList wantedList;
    }

    @Getter @NoArgsConstructor
    public static class WantedList {
        private String totalCount;
        private List<WelfareService> servList;
    }

    @Getter @NoArgsConstructor
    public static class WelfareService {
        private String servNm;
        private String servId;
        private String servDtlLink;
        private String jurMnofNm;
        private String servDgst;
    }
}
