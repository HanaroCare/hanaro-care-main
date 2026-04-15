package com.server.common.security.service;

import com.server.common.security.dto.SubscriberDTO;
import com.server.user.entity.TBUser;
import com.server.user.repository.TBUserRepository;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

  private final TBUserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

    TBUser user = userRepository.findByUserNm(username)
        .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 사용자: " + username));

    log.info("### [인증 단계] DB에서 유저를 찾았습니다: {}", username);

    return new SubscriberDTO(
        user.getUserId(),
        user.getUserNm(),
        user.getUserPwd(),
        user.getIsHanaCert(),
        Collections.singletonList(new SimpleGrantedAuthority(user.getUserRole().name()))
    );
  }
}
