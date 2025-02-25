package org.yug.backend.dto;


import lombok.Data;
import java.util.Set;
import java.util.UUID;

@Data
public class ProfileResponseDTO {
    private UUID id;
    private String photoUrl;
    private String fullName;
    private String email;
    private String role;
    private String skills;
    private Set<String> links;
    private Set<String> joinedCommunities; // Names of communities the user has joined
    private Set<PostResponse> posts; // Posts created by the user
}