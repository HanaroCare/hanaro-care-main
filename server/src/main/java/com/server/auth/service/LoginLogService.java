package com.server.auth.service;

import com.server.user.entity.TBUser;
import com.server.user.entity.TBUserLoginLog;
import com.server.user.enums.LoginMeans;
import com.server.user.repository.UserLoginLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@RequiredArgsConstructor
public class LoginLogService {

  private final UserLoginLogRepository loginLogRepository;

  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void save(TBUser user, LoginMeans means, boolean success) {
    String ipAddr = null;
    String devNm = null;

    ServletRequestAttributes attrs =
        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

    if (attrs != null) {
      HttpServletRequest req = attrs.getRequest();
      String forwarded = req.getHeader("X-Forwarded-For");
      ipAddr = StringUtils.hasText(forwarded)
          ? forwarded.split(",")[0].trim()
          : req.getRemoteAddr();
      devNm = req.getHeader("User-Agent");
    }

    loginLogRepository.save(
        TBUserLoginLog.builder()
            .user(user)
            .userMeansCd(means)
            .userResultYn(success)
            .accessIpAddr(ipAddr)
            .accessDevNm(devNm)
            .build()
    );
  }
}
