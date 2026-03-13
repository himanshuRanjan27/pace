package com.college.pace2027.controller;

import com.college.pace2027.dto.SportDto;
import com.college.pace2027.enums.SportCategory;
import com.college.pace2027.service.SportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sports")
@RequiredArgsConstructor
public class SportController {

    private final SportService sportService;

    @GetMapping
    public ResponseEntity<List<SportDto>> getAllSports() {
        return ResponseEntity.ok(sportService.getAllSports());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<SportDto>> getByCategory(@PathVariable SportCategory category) {
        return ResponseEntity.ok(sportService.getSportsByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SportDto> getSportById(@PathVariable Long id) {
        return ResponseEntity.ok(sportService.getSportById(id));
    }
}
