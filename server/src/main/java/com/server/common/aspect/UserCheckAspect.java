package com.server.common.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.server.common.annotation.CheckUser;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.common.security.dto.SubscriberDTO;

import lombok.RequiredArgsConstructor;

@Aspect
@Component
@RequiredArgsConstructor
public class UserCheckAspect {

    private final ExpressionParser parser = new SpelExpressionParser();

    @Before("@annotation(checkUser)")
    public void validateUserId(JoinPoint joinPoint, CheckUser checkUser) {
        Object[] args = joinPoint.getArgs();
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String[] parameterNames = signature.getParameterNames();

        StandardEvaluationContext context = new StandardEvaluationContext();
        for (int i = 0; i < parameterNames.length; i++) {
            context.setVariable(parameterNames[i], args[i]);
        }

        // SpEL로 요청된 userId 추출
        Long requestedUserId = parser.parseExpression(checkUser.key()).getValue(context, Long.class);

        if (requestedUserId != null) {
            // 인가 체크: 로그인한 유저와 요청된 userId가 일치하는지만 확인
            // 이미 인증(Authentication) 필터에서 유저 존재 여부는 걸러졌다고 판단함
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof SubscriberDTO loginUser) {
                if (!loginUser.getUserId().equals(requestedUserId)) {
                    throw new ApiException(ErrorStatus._FORBIDDEN); // 내 데이터가 아니면 403 에러
                }
            } else {
                // 인증 정보가 없는 경우 (로그인 안 함)
                throw new ApiException(ErrorStatus._UNAUTHORIZED);
            }
        }
    }
}
