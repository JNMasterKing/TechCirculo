package org.yug.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.yug.backend.model.User;
import org.yug.backend.model.UserRole;
import org.yug.backend.repository.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);
    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extract email from OAuth2 response
        String email = oAuth2User.getAttribute("email");
logger.info("Email: {}", email);
        // Validate email domain
        if (!email.endsWith("@paruluniversity.ac.in")) {
            throw new OAuth2AuthenticationException("Invalid email domain");
        }

        // Derive username from email (e.g., remove the domain part)
        String username = extractUsernameFromEmail(email);
        logger.info(username);
        // Check if the user already exists in your database
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    logger.info("User not found, creating a new user");
                    // Create a new user if not found
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(username); // Set the derived username
                    newUser.setRole(UserRole.STUDENT); // Default role
newUser.setPassword("123");
                    return userRepository.save(newUser);

                });
logger.info("User: {}", user);  
        return oAuth2User;
    }

    /**
     * Extracts a username from the email.
     * For example, "john.doe@paruluniversity.ac.in" -> "john.doe"
     */
    private String extractUsernameFromEmail(String email) {
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        return email.split("@")[0]; // Extract the part before the '@' symbol
    }
}