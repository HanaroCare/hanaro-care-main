package com.server.asset;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.server.asset.client.BokjiroClient;
import com.server.asset.client.KosisClient;
import com.server.asset.dto.external.publicdata.PublicDataResponse;
import com.server.common.config.external.ExternalApiProperties;

@SpringBootTest
public class ClientConnectionTest {

    @Autowired
    private KosisClient kosisClient;

    @Autowired
    private BokjiroClient bokjiroClient;

    @Autowired
    private ExternalApiProperties apiProperties;

    @Test
    public void testKosisConnection() {
        String apiKey = apiProperties.getKosis().getApiKey();
        System.out.println("Using KOSIS API Key: " + apiKey);
        
        try {
            List<PublicDataResponse.KosisData> response = kosisClient.getMedicalInflation(
                apiKey, "getList", "json", "101", "Y", "2023", "2023");
            
            assertThat(response).isNotEmpty();
            System.out.println("KOSIS Success: " + response.get(0).getValue());
        } catch (Exception e) {
            System.err.println("KOSIS Failed: " + e.getMessage());
            throw e;
        }
    }

    @Test
    public void testBokjiroConnection() {
        String apiKey = apiProperties.getPublicData().getApiKey();
        System.out.println("Using Bokjiro API Key: " + apiKey);
        
        try {
            PublicDataResponse.WelfareListResponse response = bokjiroClient.getWelfareServices(
                apiKey, "L", 1, 5, "003", "노인", "006", "json");
            
            assertThat(response).isNotNull();
            assertThat(response.getWantedList()).isNotNull();
            System.out.println("Bokjiro Success, count: " + response.getWantedList().getTotalCount());
        } catch (Exception e) {
            System.err.println("Bokjiro Failed: " + e.getMessage());
            throw e;
        }
    }
}
