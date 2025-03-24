package org.example.finance_management_system.dto.response;

import org.example.finance_management_system.model.FinancialDiaryEntry;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class FinancialDiaryResponse {
    private Long id;
    private String title;
    private String content;
    private LocalDate entryDate;
    private BigDecimal relatedAmount;
    private String financialGoal;
    private String lessonsLearned;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static FinancialDiaryResponse fromEntity(FinancialDiaryEntry entry) {
        FinancialDiaryResponse response = new FinancialDiaryResponse();
        response.setId(entry.getId());
        response.setTitle(entry.getTitle());
        response.setContent(entry.getContent());
        response.setEntryDate(entry.getEntryDate());
        response.setRelatedAmount(entry.getRelatedAmount());
        response.setFinancialGoal(entry.getFinancialGoal());
        response.setLessonsLearned(entry.getLessonsLearned());

        // Parse comma-separated tags into a list
        if (entry.getTags() != null && !entry.getTags().isEmpty()) {
            List<String> tagList = Arrays.stream(entry.getTags().split(","))
                    .map(String::trim)
                    .filter(tag -> !tag.isEmpty())
                    .collect(Collectors.toList());
            response.setTags(tagList);
        }

        response.setCreatedAt(entry.getCreatedAt());
        response.setUpdatedAt(entry.getUpdatedAt());

        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public BigDecimal getRelatedAmount() {
        return relatedAmount;
    }

    public void setRelatedAmount(BigDecimal relatedAmount) {
        this.relatedAmount = relatedAmount;
    }

    public String getFinancialGoal() {
        return financialGoal;
    }

    public void setFinancialGoal(String financialGoal) {
        this.financialGoal = financialGoal;
    }

    public String getLessonsLearned() {
        return lessonsLearned;
    }

    public void setLessonsLearned(String lessonsLearned) {
        this.lessonsLearned = lessonsLearned;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
