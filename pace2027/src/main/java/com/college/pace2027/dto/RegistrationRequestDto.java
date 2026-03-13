package com.college.pace2027.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class RegistrationRequestDto {

    @NotBlank(message = "Team name is required")
    private String teamName;

    @NotBlank(message = "Captain name is required")
    private String captainName;

    @NotBlank(message = "Captain email is required")
    @Email(message = "Invalid email format")
    private String captainEmail;

    @NotBlank(message = "Captain phone is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
    private String captainPhone;

    @NotNull(message = "Sport must be selected")
    private Long sportId;

    @NotBlank(message = "UTR number is required")
    @Size(min = 12, max = 12, message = "UTR number must be exactly 12 characters")
    private String utrNumber;

    @NotEmpty(message = "At least one team member is required")
    @Valid
    private List<TeamMemberDto> members;
}
