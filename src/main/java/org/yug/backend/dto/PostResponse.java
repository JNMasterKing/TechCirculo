package org.yug.backend.dto;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PostResponse {
    private UUID id;
    private String title;
    private String content;
    private String author;
    private String community;
    private LocalDateTime createdAt;
    private int upvotes;
    private int downvotes;

    public PostResponse(UUID id, String title, String content, String author, String community, LocalDateTime createdAt, int upvotes, int downvotes) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.community = community;
        this.createdAt = createdAt;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
    }
}