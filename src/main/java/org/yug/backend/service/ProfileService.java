package org.yug.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.yug.backend.dto.PostResponse;
import org.yug.backend.dto.ProfileRequestDTO;
import org.yug.backend.dto.ProfileResponseDTO;
import org.yug.backend.model.Community;
import org.yug.backend.model.Post;
import org.yug.backend.model.Profile;
import org.yug.backend.model.User;
import org.yug.backend.repository.CommunityRepository;
import org.yug.backend.repository.PostRepository;
import org.yug.backend.repository.ProfileRepository;
import org.yug.backend.repository.UserRepository;

import java.util.HashSet;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {


    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final CommunityService communityService;
    private final PostRepository postRepository;
    private final CommunityRepository communityRepository;

    public ProfileResponseDTO getProfileByUserId(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found!"));

        return mapToProfileResponseDTO(profile,user);
    }

    public ProfileResponseDTO updateProfile(UUID userId, ProfileRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // Create a new profile if not found
                    Profile newProfile = new Profile();
                    newProfile.setUser(user);
                    return newProfile;
                });

        profile.setPhotoUrl(request.getPhotoUrl());
        profile.setSkills(String.join(",", request.getSkills())); // Convert list to comma-separated string
        profile.setLinks(new HashSet<>(request.getLinks())); // Convert list to HashSet

        profileRepository.save(profile);
        return mapToProfileResponseDTO(profile, user);
    }

    private ProfileResponseDTO mapToProfileResponseDTO(Profile profile, User user) {
        ProfileResponseDTO response = new ProfileResponseDTO();
        response.setId(profile.getId());
        response.setPhotoUrl(profile.getPhotoUrl());
        response.setFullName(profile.getUser().getFullName());
        response.setEmail(profile.getUser().getEmail());
        response.setRole(profile.getUser().getRole().name());
        response.setSkills(profile.getSkills());
        response.setLinks(profile.getLinks());
        response.setJoinedCommunities(communityRepository.findByMembersContaining(user.getId()).stream()
                .map(Community::getName)
                .collect(Collectors.toSet()));
        response.setPosts(postRepository.findByAuthorId(user.getId()).stream()
                .map(this::mapToPostResponseDTO)
                .collect(Collectors.toSet()));
        return response;
    }

    private PostResponse mapToPostResponseDTO(Post post) {
     return new PostResponse( post.getId(), post.getTitle(), post.getContent(),post.getAuthor().getUsername(),post.getCommunity().getName(),post.getCreatedAt(),post.getUpvotes(),post.getDownvotes());


    }
}