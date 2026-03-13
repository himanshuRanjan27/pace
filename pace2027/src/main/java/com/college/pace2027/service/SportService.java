package com.college.pace2027.service;

import com.college.pace2027.dto.SportDto;
import com.college.pace2027.entity.Sport;
import com.college.pace2027.enums.SportCategory;
import com.college.pace2027.repository.SportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SportService {

    private final SportRepository sportRepository;

    public List<SportDto> getAllSports() {
        return sportRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<SportDto> getSportsByCategory(SportCategory category) {
        return sportRepository.findByCategory(category)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public SportDto getSportById(Long id) {
        Sport sport = sportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sport not found with id: " + id));
        return toDto(sport);
    }

    private SportDto toDto(Sport sport) {
        return SportDto.builder()
                .id(sport.getId())
                .name(sport.getName())
                .category(sport.getCategory())
                .prizePool(sport.getPrizePool())
                .registrationFee(sport.getRegistrationFee())
                .rulebookUrl(sport.getRulebookUrl())
                .eventHeadContact(sport.getEventHeadContact())
                .imageUrl(sport.getImageUrl())
                .build();
    }
}
