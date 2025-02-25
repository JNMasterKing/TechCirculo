package org.yug.backend.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import java.util.Set;

@Data
public class ProfileRequestDTO {
    private String photoUrl;
    private String skills;

    private Set<String> links; // LinkedIn, GitHub, LeetCode, etc.
}