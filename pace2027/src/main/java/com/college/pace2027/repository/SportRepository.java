package com.college.pace2027.repository;

import com.college.pace2027.entity.Sport;
import com.college.pace2027.enums.SportCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
    List<Sport> findByCategory(SportCategory category);
    Optional<Sport> findByNameIgnoreCase(String name);
}
