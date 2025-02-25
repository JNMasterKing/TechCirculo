package org.yug.backend.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.yug.backend.dto.PostRequest;
import org.yug.backend.model.Community;
import org.yug.backend.model.Post;
import org.yug.backend.model.User;
import org.yug.backend.repository.CommunityRepository;
import org.yug.backend.repository.PostRepository;
import org.yug.backend.repository.UserRepository;
import  org.yug.backend.dto.PostResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service

public class PostService {
    private static final Logger logger = LoggerFactory.getLogger(PostService.class);
@Autowired
    PostRepository postRepository;
@Autowired
     UserRepository userRepository;
@Autowired
    CommunityRepository communityRepository;

    public List<PostResponse> getCommunityPosts(UUID communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found!"));
        return postRepository.findByCommunity(community).stream()
                .map(this::mapToPostResponse)
                .collect(Collectors.toList());
    }

    public PostResponse createPost(PostRequest request, UUID userId) {
        logger.info("inside creatpost " + userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        logger.info("Creating post for user: " + request.getCommunityId());
        Community community = communityRepository.findById(request.getCommunityId())
                .orElseThrow(() -> new RuntimeException("Community not found!"));
logger.info("Creating post for community: " + community.getName());
        Post post = new Post();
      //  post.setId(UUID.randomUUID());
        post.setTitle(request.getTitle());
            logger.info("Creating post with title: " + request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(user);
        post.setCommunity(community);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpvotes(0);
        post.setDownvotes(0);

        postRepository.save(post);
        return mapToPostResponse(post);
    }

    public void upvotePost(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found!"));
        post.setUpvotes(post.getUpvotes() + 1);
        postRepository.save(post);
    }

    public void downvotePost(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found!"));
        post.setDownvotes(post.getDownvotes() + 1);
        postRepository.save(post);
    }

    private PostResponse mapToPostResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getAuthor().getUsername(),
                post.getCommunity().getName(),
                post.getCreatedAt(),
                post.getUpvotes(),
                post.getDownvotes()
        );
    }
}