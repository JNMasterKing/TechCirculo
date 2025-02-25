package org.yug.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user; // One-to-one relationship with User

    @Column(name = "full_name")
    private String fullName; // Full name of the user

    @Column(name = "photo_url")
    private String photoUrl; // URL to the user's profile photo

    @Column(name = "skills")
    private String skills; // Comma-separated list of skills

    @ElementCollection
    @CollectionTable(name = "profile_links", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "link")
    private Set<String> links = new HashSet<>(); // Links like LinkedIn, GitHub, etc.

}

//
//    @ManyToMany(mappedBy = "members")
//    private Set<Community> joinedCommunities = new HashSet<>(); // Communities the user has joined
//
//    @OneToMany(mappedBy = "author")
//    private Set<Post> posts = new HashSet<>(); // Posts created by the user