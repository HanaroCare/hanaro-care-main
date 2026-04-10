package com.server.common.exception;

import com.server.common.response.code.ErrorReasonDTO;
import com.server.common.response.code.status.ErrorStatus;

public class ApiException extends RuntimeException{
    private final ErrorStatus errorStatus;

    public ApiException(ErrorStatus errorStatus) {
        super(errorStatus.getMessage());
        this.errorStatus = errorStatus;
    }

    public ErrorReasonDTO getErrorReason() {
        return this.errorStatus.getReason();
    }

    public ErrorReasonDTO getErrorReasonHttpStatus() {
        return this.errorStatus.getReasonHttpStatus();
    }

}
