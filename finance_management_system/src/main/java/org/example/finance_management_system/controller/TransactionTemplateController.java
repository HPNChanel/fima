package org.example.finance_management_system.controller;

import jakarta.validation.Valid;
import org.example.finance_management_system.dto.request.TransactionTemplateRequest;
import org.example.finance_management_system.dto.response.MessageResponse;
import org.example.finance_management_system.dto.response.TransactionTemplateResponse;
import org.example.finance_management_system.exception.ResourceNotFoundException;
import org.example.finance_management_system.model.Account;
import org.example.finance_management_system.model.TransactionTemplate;
import org.example.finance_management_system.model.User;
import org.example.finance_management_system.repository.AccountRepository;
import org.example.finance_management_system.repository.TransactionTemplateRepository;
import org.example.finance_management_system.repository.UserRepository;
import org.example.finance_management_system.security.services.UserDetailsImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class TransactionTemplateController {

    @Autowired
    private TransactionTemplateRepository templateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    private static final Logger logger = LoggerFactory.getLogger(TransactionTemplateController.class);

    // Get all templates for current user
    @GetMapping({"/transaction-templates", "/api/transaction-templates"})
    public ResponseEntity<?> getAllTemplates() {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            List<TransactionTemplate> templates = templateRepository.findByUserOrderByNameAsc(user);

            List<TransactionTemplateResponse> responses = templates.stream()
                    .map(TransactionTemplateResponse::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            logger.error("Error fetching transaction templates", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error fetching templates: " + e.getMessage()));
        }
    }

    // Create new template
    @PostMapping({"/transaction-templates", "/api/transaction-templates"})
    public ResponseEntity<?> createTemplate(@Valid @RequestBody TransactionTemplateRequest request) {
        try {
            logger.info("Creating template with request: {}", request);

            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

            TransactionTemplate template = new TransactionTemplate();
            template.setName(request.getName());
            template.setDescription(request.getDescription());
            template.setAmount(request.getAmount());
            template.setType(request.getType());
            template.setCategory(request.getCategory());
            template.setUser(user);
            template.setNotes(request.getNotes());
            template.setCreatedAt(LocalDateTime.now());

            // Set account if provided
            if (request.getAccountId() != null) {
                try {
                    Account account = accountRepository.findById(request.getAccountId())
                            .orElseThrow(() -> new ResourceNotFoundException("Account", "id", request.getAccountId()));

                    // Check if account belongs to user
                    if (!account.getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(new MessageResponse("You don't have permission to use this account"));
                    }

                    template.setAccount(account);
                } catch (Exception e) {
                    logger.warn("Error setting account for template: {}", e.getMessage());
                    // Continue without setting account
                }
            }

            TransactionTemplate savedTemplate = templateRepository.save(template);
            logger.info("Template saved successfully with ID: {}", savedTemplate.getId());

            return ResponseEntity.ok(TransactionTemplateResponse.fromEntity(savedTemplate));
        } catch (Exception e) {
            logger.error("Error creating transaction template", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error creating template: " + e.getMessage()));
        }
    }

    // Delete template
    @DeleteMapping({"/transaction-templates/{id}", "/api/transaction-templates/{id}"})
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();

            // Check if template exists and belongs to user
            if (!templateRepository.existsByIdAndUserId(id, userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Template not found or you don't have permission to delete it"));
            }

            templateRepository.deleteById(id);

            return ResponseEntity.ok(new MessageResponse("Template deleted successfully"));
        } catch (Exception e) {
            logger.error("Error deleting template", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error deleting template: " + e.getMessage()));
        }
    }
}
