package com.college.pace2027.service;

import com.college.pace2027.dto.RegistrationRequestDto;
import com.college.pace2027.dto.RegistrationResponseDto;
import com.college.pace2027.dto.TeamMemberDto;
import com.college.pace2027.entity.Sport;
import com.college.pace2027.entity.TeamMember;
import com.college.pace2027.entity.TeamRegistration;
import com.college.pace2027.enums.PaymentStatus;
import com.college.pace2027.repository.SportRepository;
import com.college.pace2027.repository.TeamRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final TeamRegistrationRepository registrationRepository;
    private final SportRepository sportRepository;
    private final EmailService emailService;

    @Transactional
    public RegistrationResponseDto registerTeam(RegistrationRequestDto request) {
        if (registrationRepository.existsByUtrNumber(request.getUtrNumber())) {
            throw new RuntimeException("UTR number already used. Each payment can only register one team.");
        }

        Sport sport = sportRepository.findById(request.getSportId())
                .orElseThrow(() -> new RuntimeException("Sport not found with id: " + request.getSportId()));

        TeamRegistration registration = TeamRegistration.builder()
                .teamName(request.getTeamName())
                .captainName(request.getCaptainName())
                .captainEmail(request.getCaptainEmail())
                .captainPhone(request.getCaptainPhone())
                .utrNumber(request.getUtrNumber())
                .sport(sport)
                .paymentStatus(PaymentStatus.PENDING)
                .build();

        request.getMembers().forEach(memberDto -> {
            TeamMember member = TeamMember.builder()
                    .memberName(memberDto.getMemberName())
                    .studentId(memberDto.getStudentId())
                    .build();
            registration.addMember(member);
        });

        TeamRegistration saved = registrationRepository.save(registration);
        log.info("New registration saved: Team '{}' for sport '{}', UTR: {}",
                saved.getTeamName(), sport.getName(), saved.getUtrNumber());

        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponseDto> getAllRegistrations() {
        return registrationRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponseDto> getRegistrationsBySport(Long sportId) {
        return registrationRepository.findBySportId(sportId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponseDto> getPendingRegistrations(Long sportId) {
        return registrationRepository
                .findBySportIdAndPaymentStatus(sportId, PaymentStatus.PENDING)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RegistrationResponseDto approveRegistration(Long registrationId) {
        TeamRegistration registration = findRegistrationById(registrationId);
        registration.setPaymentStatus(PaymentStatus.SUCCESS);
        TeamRegistration saved = registrationRepository.save(registration);
        log.info("Registration APPROVED: id={}, team={}", saved.getId(), saved.getTeamName());

        try {
            emailService.sendApprovalEmail(saved);
        } catch (Exception e) {
            log.error("Email failed for registration id={}: {}", saved.getId(), e.getMessage());
        }

        return toDto(saved);
    }

    @Transactional
    public RegistrationResponseDto rejectRegistration(Long registrationId) {
        TeamRegistration registration = findRegistrationById(registrationId);
        registration.setPaymentStatus(PaymentStatus.FAILED);
        TeamRegistration saved = registrationRepository.save(registration);
        log.info("Registration REJECTED: id={}, team={}", saved.getId(), saved.getTeamName());
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<TeamRegistration> getSuccessfulRegistrationsForExport(Long sportId) {
        return registrationRepository.findSuccessfulBySportId(sportId);
    }

    private TeamRegistration findRegistrationById(Long id) {
        return registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
    }

    private RegistrationResponseDto toDto(TeamRegistration r) {
        List<TeamMemberDto> memberDtos = r.getMembers().stream()
                .map(m -> {
                    TeamMemberDto dto = new TeamMemberDto();
                    dto.setMemberName(m.getMemberName());
                    dto.setStudentId(m.getStudentId());
                    return dto;
                })
                .collect(Collectors.toList());

        return RegistrationResponseDto.builder()
                .id(r.getId())
                .teamName(r.getTeamName())
                .captainName(r.getCaptainName())
                .captainEmail(r.getCaptainEmail())
                .captainPhone(r.getCaptainPhone())
                .sportName(r.getSport().getName())
                .utrNumber(r.getUtrNumber())
                .paymentStatus(r.getPaymentStatus())
                .createdAt(r.getCreatedAt())
                .members(memberDtos)
                .build();
    }
}
