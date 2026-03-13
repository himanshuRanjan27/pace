package com.college.pace2027.controller;

import com.college.pace2027.dto.RegistrationResponseDto;
import com.college.pace2027.entity.TeamRegistration;
import com.college.pace2027.service.RegistrationService;
import com.college.pace2027.service.SportService;
import com.opencsv.CSVWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final RegistrationService registrationService;
    private final SportService sportService;

    @GetMapping("/registrations/all")
    public ResponseEntity<List<RegistrationResponseDto>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }

    @GetMapping("/registrations")
    public ResponseEntity<List<RegistrationResponseDto>> getRegistrations(
            @RequestParam Long sportId) {
        return ResponseEntity.ok(registrationService.getRegistrationsBySport(sportId));
    }

    @GetMapping("/registrations/pending")
    public ResponseEntity<List<RegistrationResponseDto>> getPending(
            @RequestParam Long sportId) {
        return ResponseEntity.ok(registrationService.getPendingRegistrations(sportId));
    }

    @PutMapping("/registrations/{id}/approve")
    public ResponseEntity<RegistrationResponseDto> approve(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.approveRegistration(id));
    }

    @PutMapping("/registrations/{id}/reject")
    public ResponseEntity<RegistrationResponseDto> reject(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.rejectRegistration(id));
    }

    @GetMapping("/registrations/export")
    public void exportCsv(@RequestParam Long sportId,
                          HttpServletResponse response) throws IOException {

        String sportName = sportService.getSportById(sportId).getName().replace(" ", "_");
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition",
                "attachment; filename=\"" + sportName + "_registrations.csv\"");

        List<TeamRegistration> registrations =
                registrationService.getSuccessfulRegistrationsForExport(sportId);

        try (CSVWriter writer = new CSVWriter(response.getWriter())) {
            writer.writeNext(new String[]{
                "Registration ID", "Team Name", "Captain Name",
                "Captain Email", "Captain Phone", "UTR Number",
                "Registered At", "Members"
            });

            for (TeamRegistration r : registrations) {
                String members = r.getMembers().stream()
                        .map(m -> m.getMemberName() + " (" + m.getStudentId() + ")")
                        .reduce("", (a, b) -> a.isEmpty() ? b : a + " | ");

                writer.writeNext(new String[]{
                    String.valueOf(r.getId()),
                    r.getTeamName(),
                    r.getCaptainName(),
                    r.getCaptainEmail(),
                    r.getCaptainPhone(),
                    r.getUtrNumber(),
                    r.getCreatedAt().toString(),
                    members
                });
            }
        }
        log.info("CSV exported for sport id={}", sportId);
    }
}
