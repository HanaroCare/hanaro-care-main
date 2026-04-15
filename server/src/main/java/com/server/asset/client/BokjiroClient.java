package com.server.asset.client;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.server.asset.dto.external.PublicDataResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class BokjiroClient {

    private final ObjectMapper objectMapper;
    private final XmlMapper xmlMapper = new XmlMapper(); // 필드에서만 초기화
    private final RestTemplate restTemplate;

    @Value("${external.public-data.base-url}")
    private String baseUrl;

    @Value("${external.public-data.api-key}")
    private String apiKey;

    private static final String LIST_PATH =
        "/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001";
    private static final String DETAIL_PATH =
        "/B554287/NationalWelfareInformationsV001/NationalWelfaredetailedV001";

    public BokjiroClient(ObjectMapper objectMapper, RestTemplate restTemplate) {
        this.objectMapper = objectMapper;
        this.restTemplate = restTemplate; // Bean으로 주입받기
    }

    @Cacheable(
        cacheNames = "welfare",
        key = "#srchKeyCode + ':' + #searchWrd + ':' + #lifeArray + ':' + #pageNo + ':' + #numOfRows",
        unless = "#result == null"
    )
    public PublicDataResponse.WelfareListResponse getWelfareServices(
        String srchKeyCode,
        String searchWrd,
        String lifeArray,
        int pageNo,
        int numOfRows
    ) {
        try {
            StringBuilder url = new StringBuilder(baseUrl + LIST_PATH);
            url.append("?serviceKey=").append(apiKey);
            url.append("&callTp=L");
            url.append("&pageNo=").append(pageNo);
            url.append("&numOfRows=").append(numOfRows);
            url.append("&srchKeyCode=").append(srchKeyCode);

            if (searchWrd != null) {
                url.append("&searchWrd=")
                    .append(URLEncoder.encode(searchWrd, StandardCharsets.UTF_8));
            }
            if (lifeArray != null) {
                url.append("&lifeArray=").append(lifeArray);
            }

            URI uri = URI.create(url.toString());
            log.debug("[복지로] 목록 조회 URI: {}", uri.toString().replaceAll("serviceKey=[^&]+", "serviceKey=***"));

            String raw = restTemplate.getForObject(uri, String.class);
            log.debug("[복지로] 응답 원문: {}", raw);

            return parseWelfareListResponse(raw);

        } catch (Exception e) {
            log.error("[복지로] 목록 조회 실패: {}", e.getMessage());
            throw new RuntimeException("복지로 API 호출 실패", e);
        }
    }

    private PublicDataResponse.WelfareListResponse parseWelfareListResponse(String raw) throws Exception {
        if (raw == null) return null;

        raw = raw.trim();

        if (raw.startsWith("{") || raw.startsWith("[")) {
            return objectMapper.readValue(raw, PublicDataResponse.WelfareListResponse.class);
        }

        log.info("[복지로] XML 응답 감지 - XML 파싱 시작");
        JsonNode xmlNode = xmlMapper.readTree(raw.getBytes(StandardCharsets.UTF_8));

        String totalCount = xmlNode.path("totalCount").asText("0");

        List<PublicDataResponse.WelfareService> services = new ArrayList<>();
        JsonNode servList = xmlNode.path("servList");

        if (servList.isArray()) {
            for (JsonNode node : servList) {
                PublicDataResponse.WelfareService service = new PublicDataResponse.WelfareService();
                service.setServId(node.path("servId").asText());
                service.setServNm(node.path("servNm").asText());
                service.setJurMnofNm(node.path("jurMnofNm").asText());
                service.setServDgst(node.path("servDgst").asText());
                service.setServDtlLink(node.path("servDtlLink").asText());
                service.setTrgetNm(node.path("trgterIndvdlArray").asText());
                services.add(service);
            }
        } else if (servList.isObject()) {
            PublicDataResponse.WelfareService service = new PublicDataResponse.WelfareService();
            service.setServId(servList.path("servId").asText());
            service.setServNm(servList.path("servNm").asText());
            service.setJurMnofNm(servList.path("jurMnofNm").asText());
            service.setServDgst(servList.path("servDgst").asText());
            service.setServDtlLink(servList.path("servDtlLink").asText());
            service.setTrgetNm(servList.path("trgterIndvdlArray").asText());
            services.add(service);
        }

        log.info("[복지로] XML 파싱 완료 - 서비스 수: {}, 총 건수: {}", services.size(), totalCount);

        PublicDataResponse.WantedList wantedList = new PublicDataResponse.WantedList();
        wantedList.setTotalCount(totalCount);
        wantedList.setServList(services);

        PublicDataResponse.WelfareListResponse response = new PublicDataResponse.WelfareListResponse();
        response.setWantedList(wantedList);
        return response;
    }

    public String getWelfareDetail(String servId) {
        try {
            String url = baseUrl + DETAIL_PATH
                + "?serviceKey=" + apiKey
                + "&callTp=D"
                + "&servId=" + servId;

            URI uri = URI.create(url);
            log.debug("[복지로] 상세 조회 URI: {}", uri);

            return restTemplate.getForObject(uri, String.class);

        } catch (Exception e) {
            log.error("[복지로] 상세 조회 실패: {}", e.getMessage());
            throw new RuntimeException("복지로 API 상세 조회 실패", e);
        }
    }
}
