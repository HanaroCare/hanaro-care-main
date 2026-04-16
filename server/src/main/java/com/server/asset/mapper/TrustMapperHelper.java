package com.server.asset.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import org.springframework.stereotype.Component;

@Component
public class TrustMapperHelper {

	private final ObjectMapper objectMapper;

	public TrustMapperHelper(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	public String toJson(Object obj) {
		if (obj == null) {
			return null;
		}
		try {
			return objectMapper.writeValueAsString(obj);
		} catch (Exception e) {
			throw new ApiException(ErrorStatus.TRUST_JSON_PROCESSING_ERROR);
		}
	}
}
