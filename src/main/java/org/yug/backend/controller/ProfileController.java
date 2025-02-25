package org.yug.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.yug.backend.dto.ProfileRequestDTO;
import org.yug.backend.dto.ProfileResponseDTO;
import org.yug.backend.model.UserPrincipal;
import org.yug.backend.service.ProfileService;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {


    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponseDTO> getProfile(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(profileService.getProfileByUserId(currentUser.getId()));
    }

    @PutMapping
    public ResponseEntity<ProfileResponseDTO> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody ProfileRequestDTO request) {
        return ResponseEntity.ok(profileService.updateProfile(currentUser.getId(), request));
    }
}
