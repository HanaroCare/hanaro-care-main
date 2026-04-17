package com.server.common.config;

import com.server.asset.dto.pension.PensionForecastInternalDto;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Configuration
@EnableCaching
@EnableAsync
public class CacheConfig {

	@Bean(name = "pensionForecastKeyGenerator")
	public org.springframework.cache.interceptor.KeyGenerator pensionForecastKeyGenerator() {
		return (target, method, params) -> {
			if (params.length == 0 || !(params[0] instanceof PensionForecastInternalDto.Command cmd)) {
				throw new IllegalArgumentException("pensionForecastKeyGenerator expects PensionForecastInternalDto.Command as first argument");
			}

			String rawKey = "addr=%s|currentPrice=%s|assetSize=%s|periodYears=%s".formatted(String.valueOf(cmd.getAddr()),
				cmd.getCurrentPrice() == null ? "" : cmd.getCurrentPrice().stripTrailingZeros().toPlainString(),
				cmd.getAssetSize() == null ? "" : cmd.getAssetSize().stripTrailingZeros().toPlainString(),
				String.valueOf(cmd.getPeriodYears())
			);

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
