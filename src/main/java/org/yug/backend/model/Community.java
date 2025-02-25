package org.yug.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "communities")
@EntityListeners(AuditingEntityListener.class)
public class Community {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(name = "member_count")
    private int memberCount = 0;

    // Corrected @ElementCollection mapping
    @ElementCollection
    @CollectionTable(name = "community_members", joinColumns = @JoinColumn(name = "community_id"))
    @Column(name = "user_id")
    private Set<UUID> members = new HashSet<>();
}