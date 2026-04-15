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
        description = "SMS 인증 성공",
        content = @Content(
            schema = @Schema(implementation = com.server.common.response.ApiResponse.class),
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
        description = "인증번호 불일치 또는 만료 (AUTH_005, AUTH_006)",
        content = @Content(
            schema = @Schema(implementation = com.server.common.response.ApiResponse.class),
            examples = {
                @ExampleObject(name = "번호 불일치", value = """
                    {
                        "isSuccess": false,
                        "code": "AUTH_005",
                        "message": "인증번호가 일치하지 않습니다."
                    }
                    """),
                @ExampleObject(name = "인증 만료/없음", value = """
                    {
                        "isSuccess": false,
                        "code": "AUTH_006",
                        "message": "인증 정보가 없거나 만료되었습니다. 다시 시도해주세요."
                    }
                    """)
            })
    )
})
public @interface ApiSmsVerifyResponse {

}