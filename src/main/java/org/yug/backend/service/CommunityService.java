package org.yug.backend.service;



import jakarta.transaction.Transactional;
import org.apache.catalina.connector.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.yug.backend.dto.CommunityRequest;
import org.yug.backend.dto.CommunityResponse;
import org.yug.backend.model.Community;
import org.yug.backend.model.User;
import org.yug.backend.repository.CommunityRepository;
import org.yug.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service


public class CommunityService {
    private static final Logger logger = LoggerFactory.getLogger(CommunityService.class);
@Autowired
     CommunityRepository communityRepository;
@Autowired
     UserRepository userRepository;

    public List<CommunityResponse> getAllCommunities() {
        return communityRepository.findAll().stream()
                .map(this::mapToCommunityResponse)
                .collect(Collectors.toList());

    }

    public List<CommunityResponse> getMyCommunities(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
       List<CommunityResponse> rs =communityRepository.findByMembersContaining(user.getId()).stream()
                .map(this::mapToCommunityResponse)
                .collect(Collectors.toList()
                );
       logger.info("My communities: {}");
       return  rs;
    }
@Transactional
    public CommunityResponse createCommunity(CommunityRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
 logger.info("Creating community: {}", request.getName());
 logger.info(user.getUsername());
        Community community = new Community();
       // community.setId(UUID.randomUUID());
        community.setName(request.getName());
        community.setDescription(request.getDescription());
      //  community.setCreatedBy(user);

        community.setMemberCount(0);
logger.info("before save");
        communityRepository.save(community);
logger.info("after save");
        return mapToCommunityResponse(community);
    }

    public void joinCommunity(UUID communityId, UUID userId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found!"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        community.getMembers().add(userId);
        community.setMemberCount(community.getMemberCount() + 1);
        communityRepository.save(community);
    }
public void deleteCommunity(UUID communityId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found!"));
        communityRepository.delete(community);
    }
    public void leaveCommunity(UUID communityId, UUID userId) {
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found!"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        community.getMembers().remove(userId);
        community.setMemberCount(community.getMemberCount() - 1);
        communityRepository.save(community);
    }

    private CommunityResponse mapToCommunityResponse(Community community) {
        return new CommunityResponse(
                community.getId(),
                community.getName(),
                community.getDescription(),

            //  community.getCreatedBy().getUsername(),
                community.getMemberCount()

        );
    }
}