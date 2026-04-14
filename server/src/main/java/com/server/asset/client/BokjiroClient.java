package com.server.asset.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "bokjiroClient", url = "${external.public-data.base-url}")
public interface BokjiroClient {
    @GetMapping("/B553077/api/service/list")
    String getWelfareServices(
        @RequestParam("serviceKey") String apiKey,
        @RequestParam("pageNo") int pageNo,
        @RequestParam("numOfRows") int numOfRows,
        @RequestParam("srchChar") String srchChar,
        @RequestParam("lifeArray") String lifeArray
    );
}
