package com.example.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${email.from:BookingTour <noreply@bookingtour.com>}")
    private String fromEmail;

    @Value("${email.verification.code-length:6}")
    private int codeLength;


    public void sendVerificationEmail(String toEmail, String fullName, String verificationCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🔐 Mã xác thực BookingTour");

            String htmlContent = String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<h2 style='color: #2563eb; text-align: center;'>🔐 Mã xác thực tài khoản</h2>" +
                "<p style='color: #374151; text-align: center;'>Xin chào <strong>%s</strong>,</p>" +
                "<div style='background-color: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;'>" +
                "<h1 style='color: #1e40af; font-size: 36px; margin: 0; letter-spacing: 4px;'>%s</h1>" +
                "</div>" +
                "<p style='color: #64748b; text-align: center; margin: 20px 0;'>Mã có hiệu lực trong 10 phút</p>" +
                "<hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;'>" +
                "<p style='color: #94a3b8; font-size: 12px; text-align: center;'>BookingTour - Hệ thống đặt tour du lịch</p>" +
                "</div>",
                fullName, verificationCode
            );

            helper.setText(htmlContent, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            sendPlainTextVerificationEmail(toEmail, fullName, verificationCode);
        }
    }


    private void sendPlainTextVerificationEmail(String toEmail, String fullName, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Xác thực tài khoản BookingTour");

        String content = String.format(
            "Xin chào %s,\n\n" +
            "Cảm ơn bạn đã đăng ký tài khoản BookingTour!\n\n" +
            "Mã xác thực của bạn là: %s\n\n" +
            "Vui lòng nhập mã này trong vòng 15 phút để hoàn tất đăng ký.\n\n" +
            "Trân trọng,\n" +
            "Đội ngũ BookingTour",
            fullName, verificationCode
        );

        message.setText(content);
        mailSender.send(message);
    }


    public String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < codeLength; i++) {
            code.append(random.nextInt(10));
        }

        return code.toString();
    }


    public void sendWelcomeEmail(String toEmail, String fullName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Chào mừng đến với BookingTour!");

            Context context = new Context();
            context.setVariable("fullName", fullName);

            String htmlContent = templateEngine.process("welcome-email", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            sendPlainTextWelcomeEmail(toEmail, fullName);
        }
    }

    private void sendPlainTextWelcomeEmail(String toEmail, String fullName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Chào mừng đến với BookingTour!");

        String content = String.format(
            "Xin chào %s,\n\n" +
            "Chào mừng bạn đến với BookingTour!\n\n" +
            "Tài khoản của bạn đã được kích hoạt thành công. " +
            "Bây giờ bạn có thể:\n" +
            "• Khám phá các tour du lịch hấp dẫn\n" +
            "• Đặt tour yêu thích\n" +
            "• Quản lý lịch sử đặt tour\n" +
            "• Nhận thông báo về các ưu đãi đặc biệt\n\n" +
            "Chúc bạn có những trải nghiệm tuyệt vời!\n\n" +
            "Trân trọng,\n" +
            "Đội ngũ BookingTour",
            fullName
        );

        message.setText(content);
        mailSender.send(message);
    }


    public void sendBookingInvoiceEmail(String toEmail, String fullName,
                                        Long bookingId, String tourName,
                                        Integer numSeats, BigDecimal totalAmount,
                                        String departureDate, String paymentMethod) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Xác nhận đặt tour thành công #" + bookingId);

            Context context = new Context();
            context.setVariable("fullName", fullName);
            context.setVariable("bookingId", bookingId);
            context.setVariable("tourName", tourName);
            context.setVariable("numSeats", numSeats);
            context.setVariable("totalAmount", totalAmount);
            context.setVariable("departureDate", departureDate);
            context.setVariable("paymentMethod", paymentMethod);
            context.setVariable("bookingDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));

            String htmlContent = templateEngine.process("booking-invoice", context);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            sendPlainTextBookingInvoice(toEmail, fullName, bookingId, tourName, numSeats, totalAmount);
        }
    }

    private void sendPlainTextBookingInvoice(String toEmail, String fullName,
                                             Long bookingId, String tourName,
                                             Integer numSeats, BigDecimal totalAmount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Xác nhận đặt tour thành công #" + bookingId);

        String content = String.format(
            "Xin chào %s,\n\n" +
            "Cảm ơn bạn đã đặt tour tại BookingTour!\n\n" +
            "THÔNG TIN ĐẶT TOUR:\n" +
            "━━━━━━━━━━━━━━━━━━━━━━\n" +
            "Mã đặt tour: #%d\n" +
            "Tour: %s\n" +
            "Số khách: %d người\n" +
            "Tổng tiền: %,.0f VND\n" +
            "Trạng thái: ĐÃ THANH TOÁN\n\n" +
            "Chúng tôi sẽ liên hệ với bạn để xác nhận chi tiết trong thời gian sớm nhất.\n\n" +
            "Trân trọng,\n" +
            "Đội ngũ BookingTour",
            fullName, bookingId, tourName, numSeats, totalAmount.doubleValue()
        );

        message.setText(content);
        mailSender.send(message);
    }


    public void sendBookingConfirmationEmail(String toEmail, String customerName,
                                           String bookingId, String tourName,
                                           String departureDate, String numberOfPeople,
                                           String contactEmail, String contactPhone,
                                           String totalAmount, String paymentMethod,
                                           String paymentTime) {
        try {
            sendHtmlBookingConfirmationEmail(toEmail, customerName, bookingId, tourName,
                                           departureDate, numberOfPeople, contactEmail,
                                           contactPhone, totalAmount, paymentMethod, paymentTime);
        } catch (Exception e) {
            logger.warn("Failed to send HTML booking confirmation email, falling back to plain text", e);
            sendPlainTextBookingConfirmationEmail(toEmail, customerName, bookingId, tourName,
                                                departureDate, numberOfPeople, totalAmount);
        }
    }

    private void sendHtmlBookingConfirmationEmail(String toEmail, String customerName,
                                                String bookingId, String tourName,
                                                String departureDate, String numberOfPeople,
                                                String contactEmail, String contactPhone,
                                                String totalAmount, String paymentMethod,
                                                String paymentTime) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("🎉 Xác nhận đặt tour thành công - BookingTour");

        Context context = new Context();
        context.setVariable("customerName", customerName);
        context.setVariable("bookingId", bookingId);
        context.setVariable("tourName", tourName);
        context.setVariable("departureDate", departureDate);
        context.setVariable("numberOfPeople", numberOfPeople);
        context.setVariable("contactEmail", contactEmail);
        context.setVariable("contactPhone", contactPhone);
        context.setVariable("totalAmount", totalAmount);
        context.setVariable("paymentMethod", paymentMethod);
        context.setVariable("paymentTime", paymentTime);

        String htmlContent = templateEngine.process("booking-confirmation-email", context);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    private void sendPlainTextBookingConfirmationEmail(String toEmail, String customerName,
                                                     String bookingId, String tourName,
                                                     String departureDate, String numberOfPeople,
                                                     String totalAmount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Xác nhận đặt tour thành công - BookingTour");

        String content = String.format(
            "Xin chào %s,\n\n" +
            "🎉 Chúng tôi xác nhận rằng đơn đặt tour của bạn đã được xử lý thành công!\n\n" +
            "THÔNG TIN ĐẶT TOUR:\n" +
            "🎫 Mã đặt tour: %s\n" +
            "🏖️ Tên tour: %s\n" +
            "📅 Ngày khởi hành: %s\n" +
            "👥 Số người: %s\n" +
            "💰 Tổng thanh toán: %s VND\n\n" +
            "BƯỚC TIẾP THEO:\n" +
            "📱 Kiểm tra lịch sử đặt tour trên website\n" +
            "📞 Chúng tôi sẽ liên hệ trước ngày khởi hành 2-3 ngày\n" +
            "🎒 Chuẩn bị giấy tờ tùy thân và hành lý\n" +
            "🚌 Thông tin điểm tập trung sẽ được gửi qua SMS/Email\n\n" +
            "Cảm ơn bạn đã sử dụng dịch vụ BookingTour!\n" +
            "Chúc bạn có chuyến du lịch tuyệt vời!\n\n" +
            "Trân trọng,\n" +
            "Đội ngũ BookingTour\n" +
            "📧 support@bookingtour.com\n" +
            "📞 1900-xxxx",
            customerName, bookingId, tourName, departureDate, numberOfPeople, totalAmount
        );

        message.setText(content);
        mailSender.send(message);
    }


    public boolean testEmailConnection() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(fromEmail);
            message.setSubject("Test Email Connection");
            message.setText("This is a test email to verify email configuration.");

            mailSender.send(message);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}