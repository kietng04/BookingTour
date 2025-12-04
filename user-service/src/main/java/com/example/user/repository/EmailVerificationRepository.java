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


    Optional<EmailVerification> findTopByEmailOrderByCreatedAtDesc(String email);


    Optional<EmailVerification> findByEmailAndVerificationCode(String email, String verificationCode);


    Optional<EmailVerification> findByEmailAndVerificationCodeAndVerifiedFalse(String email, String verificationCode);


    List<EmailVerification> findByEmailAndVerifiedFalse(String email);


    Optional<EmailVerification> findByEmailAndVerifiedTrue(String email);


    boolean existsByEmailAndVerifiedTrue(String email);


    @Query("SELECT ev FROM EmailVerification ev WHERE ev.verified = false AND ev.expiresAt < :currentTime")
    List<EmailVerification> findExpiredUnverifiedRecords(@Param("currentTime") LocalDateTime currentTime);


    @Modifying
    @Transactional
    @Query("DELETE FROM EmailVerification ev WHERE ev.verified = false AND ev.expiresAt < :currentTime")
    int deleteExpiredUnverifiedRecords(@Param("currentTime") LocalDateTime currentTime);


    @Modifying
    @Transactional
    void deleteByEmailAndVerifiedFalse(String email);


    Optional<EmailVerification> findByUserIdAndVerifiedTrue(Long userId);


    @Query("SELECT COUNT(ev) FROM EmailVerification ev WHERE ev.email = :email AND ev.createdAt > :since")
    int countByEmailAndCreatedAtAfter(@Param("email") String email, @Param("since") LocalDateTime since);
}