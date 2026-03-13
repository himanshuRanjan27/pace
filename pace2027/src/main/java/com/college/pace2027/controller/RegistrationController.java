package com.college.pace2027.controller;

import com.college.pace2027.dto.RegistrationRequestDto;
import com.college.pace2027.dto.RegistrationResponseDto;
import com.college.pace2027.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<RegistrationResponseDto> register(
            @Valid @RequestBody RegistrationRequestDto request) {
        RegistrationResponseDto response = registrationService.registerTeam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
