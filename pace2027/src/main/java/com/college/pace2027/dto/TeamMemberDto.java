package com.college.pace2027.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TeamMemberDto {

    @NotBlank(message = "Member name is required")
    private String memberName;

    @NotBlank(message = "Student ID is required")
    private String studentId;
}
