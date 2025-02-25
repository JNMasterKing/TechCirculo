package org.yug.backend.repository;

import org.springframework.stereotype.Repository;
import org.yug.backend.model.Community;
import org.yug.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
@Repository
public interface CommunityRepository extends JpaRepository<Community, UUID> {
    List<Community> findByMembersContaining(UUID userId);
}