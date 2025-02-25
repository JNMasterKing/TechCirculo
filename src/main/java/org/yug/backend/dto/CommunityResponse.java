package org.yug.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CommunityResponse {
    private UUID id;
    private String name;
    private String description;

    private int memberCount;


    public CommunityResponse(UUID id, String name, String description, int memberCount) {
        this.id = id;
        this.name = name;
        this.description = description;

        this.memberCount = memberCount;

    }
}