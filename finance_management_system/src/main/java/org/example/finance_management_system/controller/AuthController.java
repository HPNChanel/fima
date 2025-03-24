package org.example.finance_management_system.controller;

import jakarta.validation.Valid;
import org.example.finance_management_system.dto.request.ChangePasswordRequest;
import org.example.finance_management_system.dto.request.LoginRequest;
import org.example.finance_management_system.dto.request.ResetPasswordRequest;
import org.example.finance_management_system.dto.request.SignupRequest;
import org.example.finance_management_system.dto.response.JwtResponse;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.model.User;
import org.example.finance_management_system.repository.UserRepository;
import org.example.finance_management_system.security.jwt.JwtUtils;
import org.example.finance_management_system.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
// Use @RequestMapping without path to map at class level
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    // Support both paths: /auth/signin and /api/auth/signin
    @PostMapping({"/auth/signin", "/api/auth/signin"})
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Login attempt for user: {}", loginRequest.getUsername());

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String jwt = jwtUtils.generateJwtToken(authentication);

            // Get user details
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            logger.info("User authenticated successfully: {}", userDetails.getUsername());

            // Return token and user data
            return ResponseEntity.ok(
                    new JwtResponse(
                            jwt,
                            userDetails.getId(),
                            userDetails.getUsername(),
                            userDetails.getEmail(),
                            userDetails.getFullName()
                    )
            );
        } catch (Exception e) {
            logger.error("Authentication error: ", e);
            return ResponseEntity.status(401).body(new MessageResponse("Authentication failed: " + e.getMessage()));
        }
    }

    // Support both paths: /auth/signup and /api/auth/signup
    @PostMapping({"/auth/signup", "/api/auth/signup"})
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        // Check username availability
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check email availability
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setFullName(signUpRequest.getFullName());

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    // Add a new endpoint for changing password
    @PostMapping({"/auth/change-password", "/api/auth/change-password"})
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            // Get the currently authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Find the user in the database
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify current password
            if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.status(401)
                        .body(new MessageResponse("Error: Current password is incorrect"));
            }

            // Update the password
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
        } catch (Exception e) {
            logger.error("Error changing password", e);
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error changing password: " + e.getMessage()));
        }
    }

    // Add a new endpoint for resetting password
    @PostMapping({"/auth/reset-password", "/api/auth/reset-password"})
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            // Find the user by email
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

            if (!userOptional.isPresent()) {
                return ResponseEntity.status(404)
                        .body(new MessageResponse("Error: User not found with email " + request.getEmail()));
            }

            User user = userOptional.get();

            // Update the password
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);

            // Log the password reset
            logger.info("Password reset successful for user with email: {}", request.getEmail());

            return ResponseEntity.ok(new MessageResponse("Password reset successfully"));
        } catch (Exception e) {
            logger.error("Error resetting password", e);
            return ResponseEntity.status(500)
                    .body(new MessageResponse("Error resetting password: " + e.getMessage()));
        }
    }
}
