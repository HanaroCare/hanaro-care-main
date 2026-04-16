package com.server.inheritance.controller;

import com.server.common.response.ApiResponse;
import com.server.inheritance.dto.InheritanceContextDTO;
import com.server.inheritance.dto.InheritanceRequestDTO;
import com.server.inheritance.dto.InheritanceResponseDTO;
import com.server.inheritance.dto.LetterDTO;
import com.server.inheritance.service.InheritanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inheritance")
@RequiredArgsConstructor
public class InheritanceController {

    private final InheritanceService inheritanceService;

    @GetMapping("/context/{userId}")
    public ApiResponse<InheritanceContextDTO> getInheritanceContext(@PathVariable Long userId) {
        return ApiResponse.onSuccess(inheritanceService.getInheritanceContext(userId));
    }

    @PostMapping("/plan/{userId}")
    public ApiResponse<InheritanceResponseDTO> createOrUpdatePlan(
            @PathVariable Long userId,
            @RequestBody InheritanceRequestDTO request) {
        return ApiResponse.onSuccess(inheritanceService.createOrUpdatePlan(userId, request));
    }

    @GetMapping("/summary/{userId}")
    public ApiResponse<InheritanceResponseDTO> getPlanSummary(@PathVariable Long userId) {
        return ApiResponse.onSuccess(inheritanceService.getPlanSummary(userId));
    }
}
