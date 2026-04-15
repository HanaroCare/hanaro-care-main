package com.server.asset.dto.external.publicdata;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

public class PublicDataResponse {

    @Getter @Setter @NoArgsConstructor
    public static class WelfareListResponse implements Serializable {
        @JsonProperty("wantedList")
        private WantedList wantedList;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class WantedList implements Serializable {
        private String totalCount;
        private List<WelfareService> servList;
    }

    @Getter @Setter @NoArgsConstructor
    public static class WelfareService implements Serializable {
        private String servId;
        private String servNm;
        private String jurMnofNm;
        private String servDgst;
        private String servDtlLink;
        private String trgetNm;
    }
}
