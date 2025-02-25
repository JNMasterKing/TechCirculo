package org.yug.backend.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import javax.management.relation.Role;

@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}