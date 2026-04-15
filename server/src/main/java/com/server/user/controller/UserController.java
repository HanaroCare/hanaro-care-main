package com.server.user.controller;

import com.server.common.response.ApiResponse;
import com.server.common.security.dto.SubscriberDTO;
import com.server.user.dto.UserDetailResponseDTO;
import com.server.user.dto.UserSummaryResponseDTO;
import com.server.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "유저 API", description = "유저 조회, 로그아웃, 탈퇴 기능을 제공합니다.")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @Operation(summary = "전체 유저 목록 조회", description = "가족 추가를 위해 탈퇴하지 않은 모든 유저 리스트를 조회합니다.")
  @GetMapping
  public ApiResponse<List<UserSummaryResponseDTO>> getAllUsers() {
    return ApiResponse.onSuccess(userService.findAllUsers());
  }

  @Operation(summary = "유저 상세 조회", description = "특정 유저의 상세 정보를 조회합니다. 탈퇴한 유저는 조회되지 않습니다.")
  @GetMapping("/{userId}")
  public ApiResponse<UserDetailResponseDTO> getUserDetail(
      @Parameter(description = "조회할 유저 ID", example = "1001")
      @PathVariable Long userId) {
    return ApiResponse.onSuccess(userService.findUserById(userId));
  }

  @Operation(summary = "로그아웃", description = "리프레시 토큰을 삭제하여 현재 세션을 무효화합니다.")
  @PostMapping("/logout")
  public ApiResponse<String> logout(
      @AuthenticationPrincipal SubscriberDTO subscriber) {
    userService.logout(subscriber.getUserId());
    return ApiResponse.onSuccess("로그아웃 되었습니다.");
  }

  @Operation(summary = "회원 탈퇴", description = "계정 상태를 DELETED로 변경하며, 리프레시 토큰이 즉시 삭제됩니다.")
  @DeleteMapping("/me")
  public ApiResponse<String> withdraw(
      @AuthenticationPrincipal SubscriberDTO subscriber) {
    userService.withdraw(subscriber.getUserId());
    return ApiResponse.onSuccess("회원 탈퇴가 완료되었습니다.");
  }

  @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자 본인의 상세 정보를 조회합니다.")
  @GetMapping("/me")
  public ApiResponse<UserDetailResponseDTO> getMyInfo(
      @AuthenticationPrincipal SubscriberDTO subscriber) {
    return ApiResponse.onSuccess(userService.findUserById(subscriber.getUserId()));
  }
}