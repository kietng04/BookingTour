package com.example.user.service;

import com.example.user.model.User;
import com.example.user.model.EmailVerification;
import com.example.user.repository.EmailVerificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Service
public class EmailVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationService.class);

    @Autowired
    private EmailVerificationRepository verificationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.example.user.repository.UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${email.verification.expiration-minutes:15}")
    private int expirationMinutes;

    @Value("${email.verification.max-attempts:5}")
    private int maxAttempts;

    @Value("${email.verification.development-mode:false}")
    private boolean developmentMode;

    @Value("${email.verification.default-code:123456}")
    private String defaultCode;

    @Value("${email.verification.delete-unverified-users:true}")
    private boolean deleteUnverifiedUsers;

    /**
     * Tạo và gửi mã xác thực cho user
     */
    public void createAndSendVerificationCode(User user) {
        verificationRepository.deleteByEmailAndVerifiedFalse(user.getEmail());

        String code;
        if (developmentMode) {
            code = defaultCode; // Development mode: sử dụng mã cố định
            logger.info("Development mode: Using default verification code {} for email: {}", code, user.getEmail());
        } else {
            code = emailService.generateVerificationCode(); // Production mode: tạo mã random
        }
        
        EmailVerification verification = new EmailVerification();
        verification.setEmail(user.getEmail());
        verification.setUserId(user.getId());
        verification.setVerificationCode(code);
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(expirationMinutes));
        verification.setAttempts(0);
        verification.setVerified(false);

        verificationRepository.save(verification);

        if (!developmentMode) {
            try {
                emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), code);
                logger.info("Verification email sent to: {}", user.getEmail());
            } catch (Exception e) {
                logger.error("Failed to send verification email to: {}", user.getEmail(), e);
            }
        } else {
            logger.info("Development mode: Skipped sending email to {}, use code: {}", user.getEmail(), code);
        }
    }

    /**
     * Xác thực mã và kích hoạt user
     */
    public boolean verifyCode(String email, String code) {
        logger.info("Attempting to verify email: {} with code: {}", email, code);
        
        List<EmailVerification> allVerifications = verificationRepository.findByEmailAndVerifiedFalse(email);
        logger.info("Found {} unverified records for email: {}", allVerifications.size(), email);
        
        for (EmailVerification v : allVerifications) {
            logger.info("Record: code={}, expires={}, attempts={}", 
                v.getVerificationCode(), v.getExpiresAt(), v.getAttempts());
        }
        
        Optional<EmailVerification> verificationOpt = verificationRepository
            .findByEmailAndVerificationCodeAndVerifiedFalse(email, code);

        if (verificationOpt.isEmpty()) {
            logger.warn("No unverified verification record found for email: {} with code: {}", email, code);
            
            Optional<EmailVerification> anyVerificationOpt = verificationRepository
                .findTopByEmailOrderByCreatedAtDesc(email);
            
            if (anyVerificationOpt.isPresent()) {
                EmailVerification anyVerification = anyVerificationOpt.get();
                
                if (!anyVerification.getVerified() && !anyVerification.isExpired()) {
                    anyVerification.setAttempts(anyVerification.getAttempts() + 1);
                    
                    if (!anyVerification.canAttempt(maxAttempts)) {
                        logger.warn("Maximum attempts ({}) exceeded for email: {} after wrong code input. Current attempts: {}", 
                            maxAttempts, email, anyVerification.getAttempts());
                        
                        verificationRepository.delete(anyVerification);
                        
                        if (deleteUnverifiedUsers) {
                            deleteUnverifiedUser(email, "Maximum verification attempts exceeded (wrong code)");
                        }
                    } else {
                        verificationRepository.save(anyVerification);
                        logger.info("Wrong code for email: {}. Attempts: {}/{}", 
                            email, anyVerification.getAttempts(), maxAttempts);
                    }
                }
            }
            
            return false;
        }

        EmailVerification verification = verificationOpt.get();

        LocalDateTime now = LocalDateTime.now();
        logger.info("Checking expiration: Current time: {}, Expires at: {}, Is expired: {}", 
            now, verification.getExpiresAt(), verification.isExpired());
        
        if (verification.isExpired()) {
            logger.warn("Verification code expired for email: {}. Expires at: {}, Current time: {}", 
                email, verification.getExpiresAt(), now);
            
            verificationRepository.delete(verification);
            
            if (deleteUnverifiedUsers) {
                deleteUnverifiedUser(email, "Verification code expired");
            }
            
            return false;
        }

        if (!verification.canAttempt(maxAttempts)) {
            logger.warn("Maximum attempts ({}) exceeded for email: {}. Current attempts: {}", 
                maxAttempts, email, verification.getAttempts());
            
            verificationRepository.delete(verification);
            
            if (deleteUnverifiedUsers) {
                deleteUnverifiedUser(email, "Maximum verification attempts exceeded");
            }
            
            return false;
        }

        verification.setVerified(true);
        verification.setVerifiedAt(LocalDateTime.now());
        verificationRepository.save(verification);
        
        try {
            userRepository.findByEmail(email).ifPresent(user -> {
                user.setActive(true);
                userRepository.save(user);
                logger.info("Activated user account for email: {}", email);
            });
        } catch (Exception e) {
            logger.error("Failed to activate user account for: {}", email, e);
        }
        
        try {
            emailService.sendWelcomeEmail(email, "User");
            logger.info("Welcome email sent to: {}", email);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", email, e);
        }
        
        logger.info("Email verification successful for: {}", email);
        return true;
    }

    /**
     * Gửi lại mã xác thực
     */
    public boolean resendVerificationCode(String email) {
        Optional<EmailVerification> verificationOpt = verificationRepository
            .findTopByEmailOrderByCreatedAtDesc(email);

        if (verificationOpt.isEmpty() || verificationOpt.get().getVerified()) {
            return false;
        }

        EmailVerification verification = verificationOpt.get();
        
        if (verification.isExpired()) {
            logger.warn("Cannot resend - verification code already expired for email: {}", email);
            
            verificationRepository.delete(verification);
            
            if (deleteUnverifiedUsers) {
                deleteUnverifiedUser(email, "Verification code expired before resend");
            }
            
            return false;
        }
        
        String newCode;
        if (developmentMode) {
            newCode = defaultCode; // Development mode: sử dụng mã cố định
            logger.info("Development mode: Resending default verification code {} for email: {}", newCode, email);
        } else {
            newCode = emailService.generateVerificationCode(); // Production mode: tạo mã random
        }
        
        verification.setVerificationCode(newCode);
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(expirationMinutes));
        verification.setAttempts(0); // Reset attempts

        verificationRepository.save(verification);

        if (!developmentMode) {
            try {
                emailService.sendVerificationEmail(email, "User", newCode);
                logger.info("Verification email resent to: {}", email);
                return true;
            } catch (Exception e) {
                logger.error("Failed to resend verification email to: {}", email, e);
                return false;
            }
        } else {
            logger.info("Development mode: Skipped resending email to {}, use code: {}", email, newCode);
            return true;
        }
    }

    /**
     * Kiểm tra xem email đã được xác thực chưa
     */
    public boolean isEmailVerified(String email) {
        return verificationRepository.existsByEmailAndVerifiedTrue(email);
    }

    /**
     * Xóa user chưa verify
     */
    private void deleteUnverifiedUser(String email, String reason) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (user.getActive() == null || !user.getActive()) {
                    userRepository.delete(user);
                    logger.info("Deleted unverified user account for email: {}. Reason: {}", email, reason);
                }
            }
        } catch (Exception e) {
            logger.error("Failed to delete unverified user for email: {}", email, e);
        }
    }

    /**
     * Xóa tất cả verification records cho một email
     */
    public void deleteVerificationsByEmail(String email) {
        try {
            verificationRepository.deleteByEmailAndVerifiedFalse(email);
            logger.info("Deleted verification records for email: {}", email);
        } catch (Exception e) {
            logger.error("Failed to delete verification records for email: {}", email, e);
        }
    }

    /**
     * Tạo và gửi mã xác thực cho reset password
     */
    public void sendPasswordResetCode(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.warn("Cannot send password reset code - user not found for email: {}", email);
            throw new RuntimeException("Email không tồn tại trong hệ thống");
        }

        User user = userOpt.get();
        
        verificationRepository.deleteByEmailAndVerifiedFalse(email);

        String code;
        if (developmentMode) {
            code = defaultCode;
            logger.info("Development mode: Using default password reset code {} for email: {}", code, email);
        } else {
            code = emailService.generateVerificationCode();
        }
        
        EmailVerification verification = new EmailVerification();
        verification.setEmail(email);
        verification.setUserId(user.getId());
        verification.setVerificationCode(code);
        verification.setExpiresAt(LocalDateTime.now().plusMinutes(expirationMinutes));
        verification.setAttempts(0);
        verification.setVerified(false);

        verificationRepository.save(verification);

        if (!developmentMode) {
            try {
                emailService.sendVerificationEmail(email, user.getFullName(), code);
                logger.info("Password reset code sent to: {}", email);
            } catch (Exception e) {
                logger.error("Failed to send password reset email to: {}", email, e);
                throw new RuntimeException("Không thể gửi email xác thực");
            }
        } else {
            logger.info("Development mode: Skipped sending password reset email to {}, use code: {}", email, code);
        }
    }

    /**
     * Reset password với code verification
     */
    public void resetPasswordWithCode(String email, String code, String newPassword) {
        logger.info("Attempting to reset password for email: {} with code: {}", email, code);
        
        Optional<EmailVerification> verificationOpt = verificationRepository
            .findByEmailAndVerificationCodeAndVerifiedFalse(email, code);

        if (verificationOpt.isEmpty()) {
            logger.warn("No verification record found for email: {} with code: {}", email, code);
            
            Optional<EmailVerification> anyVerificationOpt = verificationRepository
                .findTopByEmailOrderByCreatedAtDesc(email);
            
            if (anyVerificationOpt.isPresent()) {
                EmailVerification anyVerification = anyVerificationOpt.get();
                if (!anyVerification.getVerified() && !anyVerification.isExpired()) {
                    anyVerification.setAttempts(anyVerification.getAttempts() + 1);
                    
                    if (!anyVerification.canAttempt(maxAttempts)) {
                        logger.warn("Maximum attempts exceeded for password reset: {}", email);
                        verificationRepository.delete(anyVerification);
                        throw new RuntimeException("Đã vượt quá số lần thử. Vui lòng yêu cầu mã mới");
                    }
                    verificationRepository.save(anyVerification);
                }
            }
            
            throw new RuntimeException("Mã xác thực không đúng");
        }

        EmailVerification verification = verificationOpt.get();

        if (verification.isExpired()) {
            logger.warn("Password reset code expired for email: {}", email);
            verificationRepository.delete(verification);
            throw new RuntimeException("Mã xác thực đã hết hạn");
        }

        if (!verification.canAttempt(maxAttempts)) {
            logger.warn("Maximum attempts exceeded for password reset: {}", email);
            verificationRepository.delete(verification);
            throw new RuntimeException("Đã vượt quá số lần thử");
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.error("User not found for email: {}", email);
            throw new RuntimeException("Không tìm thấy tài khoản");
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword)); // Mã hóa password trước khi lưu
        userRepository.save(user);
        
        verification.setVerified(true);
        verification.setVerifiedAt(LocalDateTime.now());
        verificationRepository.save(verification);
        
        logger.info("Password reset successful for email: {}", email);
    }
}