package com.college.pace2027.dto;

import com.college.pace2027.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RegistrationResponseDto {
    private Long id;
    private String teamName;
    private String captainName;
    private String captainEmail;
    private String captainPhone;
    private String sportName;
    private String utrNumber;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private List<TeamMemberDto> members;
}
