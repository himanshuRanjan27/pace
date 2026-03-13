package com.college.pace2027.dto;

import com.college.pace2027.enums.SportCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class SportDto {
    private Long id;
    private String name;
    private SportCategory category;
    private String prizePool;
    private BigDecimal registrationFee;
    private String rulebookUrl;
    private String eventHeadContact;
    private String imageUrl;
}
