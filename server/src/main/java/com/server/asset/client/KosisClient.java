package com.server.asset.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.server.asset.dto.external.publicdata.PublicDataResponse;

@FeignClient(name = "kosisClient", url = "${external.kosis.base-url}")
public interface KosisClient {
    @GetMapping("/openapi/statisticsData.do")
    List<PublicDataResponse.KosisData> getMedicalInflation(
        @RequestParam("apiKey") String apiKey,
        @RequestParam("method") String method,
        @RequestParam("format") String format,
        @RequestParam("userStatsId") String userStatsId,
        @RequestParam("prdSe") String prdSe,
        @RequestParam("startPrdDe") String startPrdDe,
        @RequestParam("endPrdDe") String endPrdDe
    );
}
