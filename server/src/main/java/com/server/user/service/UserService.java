package com.server.user.service;

import com.server.auth.repository.RefreshTokenRepository;
import com.server.common.exception.ApiException;
import com.server.common.response.code.status.ErrorStatus;
import com.server.user.dto.UserDetailResponseDTO;
import com.server.user.dto.UserSummaryResponseDTO;
import com.server.user.entity.TBUser;
import com.server.user.enums.UserStatus;
import com.server.user.mapper.UserMapper;
import com.server.user.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;

  @Transactional(readOnly = true)
  public List<UserSummaryResponseDTO> findAllUsers() {
    log.info("[유저 목록 조회 시작]");
    List<UserSummaryResponseDTO> result = userRepository
        .findAllByUserStatusCdNot(UserStatus.DELETED)
        .stream()
        .map(UserMapper::toSummaryResponse)
        .toList();
    log.info("[유저 목록 조회 완료] count={}", result.size());
    return result;
  }

  @Transactional(readOnly = true)
  public UserDetailResponseDTO findUserById(Long userId) {
    log.info("[유저 상세 조회 시작] userId={}", userId);
    TBUser user = userRepository.findById(userId)
        .filter(u -> u.getUserStatusCd() != UserStatus.DELETED)
        .orElseThrow(() -> {
          log.warn("[유저 상세 조회 실패] 존재하지 않는 유저: userId={}", userId);
          return new ApiException(ErrorStatus.USER_NOT_FOUND);
        });
    log.info("[유저 상세 조회 완료] userId={}, loginId={}", userId, user.getLoginId());
    return UserMapper.toDetailResponse(user);
  }

  @Transactional
  public void logout(Long userId) {
    refreshTokenRepository.deleteById(userId);
    log.info("[로그아웃 완료] userId={}", userId);
  }
  
  @Transactional
  public void withdraw(Long userId) {
    log.info("[회원 탈퇴 시작] userId={}", userId);
    TBUser user = userRepository.findById(userId)
        .orElseThrow(() -> {
          log.warn("[회원 탈퇴 실패] 존재하지 않는 유저: userId={}", userId);
          return new ApiException(ErrorStatus.USER_NOT_FOUND);
        });

    if (user.getUserStatusCd() == UserStatus.DELETED) {
      log.warn("[회원 탈퇴 실패] 이미 탈퇴한 계정: userId={}", userId);
      throw new ApiException(ErrorStatus.USER_ALREADY_WITHDRAWN);
    }

    user.setUserStatusCd(UserStatus.DELETED);
    refreshTokenRepository.deleteById(userId);
    log.info("[회원 탈퇴 완료] userId={}, loginId={}", userId, user.getLoginId());
  }
}
