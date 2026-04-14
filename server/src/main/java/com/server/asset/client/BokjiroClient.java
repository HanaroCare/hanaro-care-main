package com.server.asset.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.server.asset.dto.external.publicdata.PublicDataResponse;

@FeignClient(name = "bokjiroClient", url = "${external.public-data.base-url}")
public interface BokjiroClient {

    /**
     * 중앙부처 복지서비스 목록조회
     * callTp: L (목록), D (상세)
     * srchKeyCode: 001 제목, 002 내용, 003 제목+내용
     */
    @GetMapping("/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001")
    PublicDataResponse.WelfareListResponse getWelfareServices(
        @RequestParam("serviceKey") String apiKey,
        @RequestParam("callTp") String callTp,
        @RequestParam("pageNo") int pageNo,
        @RequestParam("numOfRows") int numOfRows,
        @RequestParam("srchKeyCode") String srchKeyCode,
        @RequestParam(value = "searchWrd", required = false) String searchWrd,
        @RequestParam(value = "lifeArray", required = false) String lifeArray,
        @RequestParam(value = "_type", defaultValue = "json") String type
    );
}
