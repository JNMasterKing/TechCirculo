package org.yug.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.yug.backend.dto.CommunityRequest;
import org.yug.backend.dto.CommunityResponse;
import org.yug.backend.model.UserPrincipal;
import org.yug.backend.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/communities")

public class CommunityController {
    @Autowired
     CommunityService communityService;

    @GetMapping
    public ResponseEntity<List<CommunityResponse>> getAllCommunities() {
        return ResponseEntity.ok(communityService.getAllCommunities());
    }


    @GetMapping("/my")
    public ResponseEntity<List<CommunityResponse>> getMyCommunities(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(communityService.getMyCommunities(currentUser.getId()));
    }

    @PostMapping
    public ResponseEntity<CommunityResponse> createCommunity(
            @RequestBody CommunityRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(communityService.createCommunity(request, currentUser.getId()));
    }

    @PostMapping("/{communityId}/join")
    public ResponseEntity<Void> joinCommunity(
            @PathVariable UUID communityId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        communityService.joinCommunity(communityId, currentUser.getId());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{communityId}/leave")
    public ResponseEntity<Void> leaveCommunity(
            @PathVariable UUID communityId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        communityService.leaveCommunity(communityId, currentUser.getId());
        return ResponseEntity.ok().build();
    }
    @PostMapping("/{communityId}/delete")
    public ResponseEntity<Void> deleteCommunity(
            @PathVariable UUID communityId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        communityService.deleteCommunity(communityId);
        return ResponseEntity.ok().build();
    }
}