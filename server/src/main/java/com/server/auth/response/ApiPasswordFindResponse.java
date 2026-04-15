package com.server.auth.response;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "인증번호 발송 성공",
        content = @Content(
            // 프로젝트 공통 응답 DTO 경로 명시
            schema = @Schema(implementation = com.server.common.response.ApiResponse.class),
            examples = @ExampleObject(name = "발송 성공", value = """
                {
                    "isSuccess": true,
                    "code": "COMMON200",
                    "message": "인증번호가 발송되었습니다.",
                    "result": "인증번호가 발송되었습니다."
                }
                """))
    ),
    @ApiResponse(
        responseCode = "404",
        description = "사용자 정보 불일치 (AUTH_USER_NOT_FOUND)",
        content = @Content(
            schema = @Schema(implementation = com.server.common.response.ApiResponse.class),
            examples = @ExampleObject(name = "사용자 없음", value = """
                {
                    "isSuccess": false,
                    "code": "AUTH_010",
                    "message": "아이디 또는 전화번호가 일치하는 사용자를 찾을 수 없습니다."
                }
                """))
    )
})
public @interface ApiPasswordFindResponse {

}