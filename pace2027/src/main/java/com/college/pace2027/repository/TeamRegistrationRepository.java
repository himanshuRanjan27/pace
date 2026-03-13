package com.college.pace2027.repository;

import com.college.pace2027.entity.TeamRegistration;
import com.college.pace2027.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRegistrationRepository extends JpaRepository<TeamRegistration, Long> {

    List<TeamRegistration> findBySportId(Long sportId);

    List<TeamRegistration> findBySportIdAndPaymentStatus(Long sportId, PaymentStatus status);

    List<TeamRegistration> findByPaymentStatus(PaymentStatus status);

    boolean existsByUtrNumber(String utrNumber);

    Optional<TeamRegistration> findByUtrNumber(String utrNumber);

    @Query("SELECT r FROM TeamRegistration r WHERE r.sport.id = :sportId AND r.paymentStatus = 'SUCCESS'")
    List<TeamRegistration> findSuccessfulBySportId(Long sportId);
}
