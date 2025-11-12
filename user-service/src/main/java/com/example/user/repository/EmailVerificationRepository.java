package com.example.user.repository;

import com.example.user.model.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    /**
     * Find the latest verification record for an email
     */
    Optional<EmailVerification> findTopByEmailOrderByCreatedAtDesc(String email);

    /**
     * Find verification by email and code
     */
    Optional<EmailVerification> findByEmailAndVerificationCode(String email, String verificationCode);

    /**
     * Find unverified verification by email and code
     */
    Optional<EmailVerification> findByEmailAndVerificationCodeAndVerifiedFalse(String email, String verificationCode);

    /**
     * Find all unverified records for an email
     */
    List<EmailVerification> findByEmailAndVerifiedFalse(String email);

    /**
     * Find verified record for an email
     */
    Optional<EmailVerification> findByEmailAndVerifiedTrue(String email);

    /**
     * Check if email is already verified
     */
    boolean existsByEmailAndVerifiedTrue(String email);

    /**
     * Find all expired and unverified records
     */
    @Query("SELECT ev FROM EmailVerification ev WHERE ev.verified = false AND ev.expiresAt < :currentTime")
    List<EmailVerification> findExpiredUnverifiedRecords(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Delete expired unverified records (cleanup)
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM EmailVerification ev WHERE ev.verified = false AND ev.expiresAt < :currentTime")
    int deleteExpiredUnverifiedRecords(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Delete all unverified records for an email (when creating new verification)
     */
    @Modifying
    @Transactional
    void deleteByEmailAndVerifiedFalse(String email);

    /**
     * Find by user ID
     */
    Optional<EmailVerification> findByUserIdAndVerifiedTrue(Long userId);

    /**
     * Count verification attempts for email in time period
     */
    @Query("SELECT COUNT(ev) FROM EmailVerification ev WHERE ev.email = :email AND ev.createdAt > :since")
    int countByEmailAndCreatedAtAfter(@Param("email") String email, @Param("since") LocalDateTime since);
}