package com.server.common.security;

import com.server.auth.service.LoginLogService;
import com.server.common.exception.AccountDormantException;
import com.server.common.exception.AccountSuspendedException;
import com.server.common.security.dto.SubscriberDTO;
import com.server.user.entity.TBUser;
import com.server.user.entity.TBUserSimpleAuth;
import com.server.user.enums.LoginMeans;
import com.server.user.enums.UserStatus;
import com.server.user.repository.UserRepository;
import com.server.user.repository.UserSimpleAuthRepository;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class LoginAuthenticationProvider implements AuthenticationProvider {

  private static final int DORMANCY_MONTHS = 6;

  private final UserRepository userRepository;
  private final UserSimpleAuthRepository simpleAuthRepository;
  private final LoginLogService loginLogService;
  private final BCryptPasswordEncoder passwordEncoder;

  @Override
  @Transactional(noRollbackFor = AuthenticationException.class)
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    LoginAuthenticationToken token = (LoginAuthenticationToken) authentication;
    String loginId = (String) token.getPrincipal();
    String inputSecret = (String) token.getCredentials();
    LoginMeans means = token.getMeans();

    TBUser user = resolveUser(loginId, means);

    checkAccountStatus(user, loginId, means);
    verifyCredential(user, inputSecret, means);

    user.setLastLoginAt(LocalDateTime.now());

    SubscriberDTO subscriberDTO = new SubscriberDTO(
        user.getUserId(),
        user.getLoginId(),
        user.getUserNm(),
        "",
        user.getIsHanaCert(),
        Collections.singletonList(new SimpleGrantedAuthority(user.getUserRole().name()))
    );

    return new LoginAuthenticationToken(subscriberDTO, means, subscriberDTO.getAuthorities());
  }

  /**
   * loginId로 유저를 조회합니다.
   * 1) 정확히 일치하는 유저가 있고 authMeansCd도 일치하면 그대로 반환합니다.
   * 2) 정확히 일치하지 않거나 authMeansCd가 다를 경우,
   *    loginId를 접두사로 삼아 authMeansCd가 일치하는 첫 번째 유저를 반환합니다.
   *    (예: "Tsid" + PATTERN → TsidZ, "Tsid" + SIMPLE_PASSWORD → Tsid)
   */
  private TBUser resolveUser(String loginId, LoginMeans means) {
    Optional<TBUser> exact = userRepository.findByLoginId(loginId);
    if (exact.isPresent() && exact.get().getAuthMeansCd() == means) {
      return exact.get();
    }
    return userRepository
        .findFirstByLoginIdStartingWithAndAuthMeansCd(loginId, means)
        .orElseThrow(() -> new BadCredentialsException("AUTH_BAD_CREDENTIALS"));
  }

  private void checkAccountStatus(TBUser user, String loginId, LoginMeans means) {
    if (user.getUserStatusCd() == UserStatus.SUSPENDED) {
      log.warn("[로그인 실패] 정지 계정 - loginId={}", loginId);
      loginLogService.save(user, means, false);
      throw new AccountSuspendedException();
    }

    if (user.getUserStatusCd() == UserStatus.DORMANT) {
      log.warn("[로그인 실패] 휴면 계정 - loginId={}", loginId);
      loginLogService.save(user, means, false);
      throw new AccountDormantException();
    }

    if (isDormancyDue(user)) {
      log.warn("[휴면 전환] {}개월 이상 미사용 계정 - loginId={}", DORMANCY_MONTHS, loginId);
      user.setUserStatusCd(UserStatus.DORMANT);
      loginLogService.save(user, means, false);
      throw new AccountDormantException();
    }
  }

  private boolean isDormancyDue(TBUser user) {
    LocalDateTime threshold = LocalDateTime.now().minusMonths(DORMANCY_MONTHS);
    LocalDateTime reference = user.getLastLoginAt() != null
        ? user.getLastLoginAt()
        : user.getPwdChangedAt();
    return reference != null && reference.isBefore(threshold);
  }

  private void verifyCredential(TBUser user, String inputSecret, LoginMeans means) {
    if (user.getAuthMeansCd() != means) {
      log.warn("[로그인 실패] 인증 수단 불일치 - loginId={}, registered={}, requested={}",
          user.getLoginId(), user.getAuthMeansCd(), means);
      loginLogService.save(user, means, false);
      throw new BadCredentialsException("AUTH_BAD_CREDENTIALS");
    }

    if (means == LoginMeans.PASSWORD) {
      if (!passwordEncoder.matches(inputSecret, user.getUserPwd())) {
        log.warn("[로그인 실패] 비밀번호 불일치 - loginId={}", user.getLoginId());
        loginLogService.save(user, means, false);
        throw new BadCredentialsException("AUTH_BAD_CREDENTIALS");
      }
      return;
    }

    if (!user.getIsHanaCert()) {
      log.warn("[간편 로그인 실패] 하나 인증 미완료 - loginId={}, means={}", user.getLoginId(),
          means.getDescription());
      loginLogService.save(user, means, false);
      throw new BadCredentialsException("AUTH_BAD_CREDENTIALS");
    }

    Optional<TBUserSimpleAuth> authOpt = simpleAuthRepository.findByUserAndAuthMeansCd(user, means);
    if (authOpt.isEmpty()) {
      log.warn("[간편 로그인 실패] 등록된 인증 정보 없음 - loginId={}, means={}", user.getLoginId(),
          means.getDescription());
      loginLogService.save(user, means, false);
      throw new BadCredentialsException("AUTH_BAD_CREDENTIALS");
    }

    if (!passwordEncoder.matches(inputSecret, authOpt.get().getAuthValue())) {
      log.warn("[간편 로그인 실패] 인증 값 불일치 - loginId={}, means={}", user.getLoginId(),
          means.getDescription());
      loginLogService.save(user, means, false);
      throw new BadCredentialsException("AUTH_BAD_CREDENTIALS");
    }
  }

  @Override
  public boolean supports(Class<?> authentication) {
    return LoginAuthenticationToken.class.isAssignableFrom(authentication);
  }
}
