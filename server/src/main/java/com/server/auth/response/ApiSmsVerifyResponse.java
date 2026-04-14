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
        description = "인증 성공 (인증번호 일치 및 3분 이내 확인)",
        content = @Content(schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(name = "인증 성공", value = """
                {
                    "isSuccess": true,
                    "code": "COMMON200",
                    "message": "인증에 성공하였습니다.",
                    "result": "OK"
                }
                """))
    ),
    @ApiResponse(
        responseCode = "400",
        description = "인증번호 불일치 (SMS_003)",
        content = @Content(schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(name = "번호 불일치", value = """
                {
                    "isSuccess": false,
                    "code": "SMS_003",
                    "message": "인증번호가 일치하지 않습니다."
                }
                """))
    ),
    @ApiResponse(
        responseCode = "401",
        description = "인증 시간 만료 (SMS_002)",
        content = @Content(schema = @Schema(implementation = ApiResponse.class),
            examples = @ExampleObject(name = "시간 만료", value = """
                {
                    "isSuccess": false,
                    "code": "SMS_002",
                    "message": "인증 시간이 만료되었습니다. 다시 시도해 주세요."
                }
                """))
    )
})
public @interface ApiSmsVerifyResponse {

}
