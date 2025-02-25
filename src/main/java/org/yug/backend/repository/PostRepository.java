package org.yug.backend.repository;

import org.springframework.stereotype.Repository;
import org.yug.backend.model.Community;
import org.yug.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    List<Post> findByCommunityOrderByCreatedAtDesc(Community community);


    Optional<Post> findByCommunity(Community community);


    Optional<Post> findByAuthorId(UUID id);
}