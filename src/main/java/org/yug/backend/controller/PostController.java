package org.yug.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.yug.backend.dto.PostRequest;
import org.yug.backend.dto.PostResponse;
import org.yug.backend.model.UserPrincipal;
import org.yug.backend.service.JwtService;
import org.yug.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
//import org.yug.backend.security.UserPrincipal;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);
@Autowired
    private final PostService postService;

    @GetMapping("/community/{communityId}")
    public ResponseEntity<List<PostResponse>> getCommunityPosts(@PathVariable UUID communityId) {
        return ResponseEntity.ok(postService.getCommunityPosts(communityId));
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(

            @RequestBody PostRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        logger.info("Creating post: {}", request.getTitle());
        return ResponseEntity.ok(postService.createPost(request, currentUser.getId()));
    }

    @PostMapping("/{postId}/upvote")
    public ResponseEntity<Void> upvotePost(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        postService.upvotePost(postId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/downvote")
    public ResponseEntity<Void> downvotePost(
            @PathVariable UUID postId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        postService.downvotePost(postId);
        return ResponseEntity.ok().build();
    }
}