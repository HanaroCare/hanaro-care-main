package com.server.common.config;

import com.server.asset.dto.pension.PensionForecastInternalDto;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Configuration
@EnableCaching
public class CacheConfig {

	@Bean(name = "pensionForecastKeyGenerator")
	public org.springframework.cache.interceptor.KeyGenerator pensionForecastKeyGenerator() {
		return (target, method, params) -> {
			PensionForecastInternalDto.Command cmd = (PensionForecastInternalDto.Command) params[0];

			String rawKey =
				cmd.getAddr()
					+ cmd.getCurrentPrice()
					+ cmd.getAssetSize()
					+ cmd.getPeriodYears();

			return sha256(rawKey);
		};
	}

	private String sha256(String input) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));

			StringBuilder hexString = new StringBuilder();
			for (byte b : hash) {
				String hex = Integer.toHexString(0xff & b);
				if (hex.length() == 1) hexString.append('0');
				hexString.append(hex);
			}
			return hexString.toString();

		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException("SHA-256 생성 실패", e);
		}
	}
}
