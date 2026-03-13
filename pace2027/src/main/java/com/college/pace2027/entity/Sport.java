package com.college.pace2027.entity;

import com.college.pace2027.enums.SportCategory;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SportCategory category;

    @Column(name = "prize_pool", nullable = false)
    private String prizePool;

    @Column(name = "registration_fee", nullable = false)
    private BigDecimal registrationFee;

    @Column(name = "rulebook_url")
    private String rulebookUrl;

    @Column(name = "event_head_contact")
    private String eventHeadContact;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "sport", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TeamRegistration> registrations = new ArrayList<>();
}
