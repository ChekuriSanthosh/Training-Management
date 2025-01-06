package com.myportfolio.apigateway.service;

import com.myportfolio.apigateway.model.UserModel;
import com.myportfolio.apigateway.repository.UserRepository;
import com.myportfolio.apigateway.util.EmailUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;
import software.amazon.awssdk.services.ses.model.SendEmailRequest;
import io.github.cdimascio.dotenv.Dotenv;


import java.time.LocalDateTime;
@Slf4j
@Service
public class ResetPasswordService {
    private final SesClient sesClient;
    public ResetPasswordService(SesClient sesClient) {
        this.sesClient = sesClient;
    }
    Dotenv dotenv = Dotenv.configure().load();
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailUtil emailUtil;



    public String forgotPassword(String email) {


        UserModel user = userRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        int  verificationCode = emailUtil.generateVerificationCode();


        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);


        String subject = "Password Reset Verification Code";
        String body = "<html>"
                + "<body>"
                + "<h2 style='color: #333;'>Password Reset Verification</h2>"
                + "<p style='font-size: 16px;'>Hello,</p>"
                + "<p style='font-size: 16px;'>You have requested to reset your password. Please use the following verification code:</p>"
                + "<p style='font-size: 20px; font-weight: bold; color: #007BFF;'>" + verificationCode + "</p>"
                + "<p style='font-size: 16px;'>This code is valid for a limited time. If you did not request this change, please ignore this email.</p>"
                + "<hr>"
                + "<p style='font-size: 14px; color: #555;'>If you have any issues, feel free to contact us at skillbuilders@example.com</p>"
                + "<br>"
                + "<p style='font-size: 14px;'>Best regards,</p>"
                + "<p style='font-size: 14px;'>The Support Team</p>"
                + "</body>"
                + "</html>";
        emailUtil.sendEmail(email, subject, body);

        return "Verification code sent to your email!";
    }


    public boolean verifyCode(String email, int  code) {
        UserModel user = userRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (user.getVerificationCode()==code && LocalDateTime.now().isBefore(user.getVerificationCodeExpiration())) {
            return true;
        }

        return false;
    }

    public String UpdatePassword(String email, String password) {
        UserModel user = userRepository.findByUsername(email).orElse(null);
        if (user == null) {
            return "user not found for given email...";
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return "Password updated successfully!...";
    }
    public String sendEmailVerificationToken(String email) {
        if (email == null || email.trim().isEmpty()) {
            return "Email address is required. Please provide a valid email address.";
        }

        UserModel user = userRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        int verificationCode = emailUtil.generateVerificationCode();


        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(10));


        userRepository.save(user);


        sendEmail(email, verificationCode);

        return "If the provided email address is associated with an account, a reset password link has been sent.";
    }
    private void sendEmail(String destinationEmail, int token) {

        String subject = "Reset Your Password";

        String emailBodyContent = "<html>"
                + "<body>"
                + "<h2 style='color: #333;'>Password Reset Verification</h2>"
                + "<p style='font-size: 16px;'>Hello,</p>"
                + "<p style='font-size: 16px;'>You have requested to reset your password. Please use the following verification code:</p>"
                + "<p style='font-size: 20px; font-weight: bold; color: #007BFF;'>" + token + "</p>"
                + "<p style='font-size: 16px;'>This code is valid for a limited time. If you did not request this change, please ignore this email.</p>"
                + "<hr>"
                + "<p style='font-size: 14px; color: #555;'>If you have any issues, feel free to contact us at skillbuilders@gmail.com</p>"
                + "<br>"
                + "<p style='font-size: 14px;'>Best regards,</p>"
                + "<p style='font-size: 14px;'>The Support Team</p>"
                + "</body>"
                + "</html>";

        Destination destination = Destination.builder().toAddresses(destinationEmail).build();
        Content subjectContent = Content.builder().data(subject).build();
        Content bodyContent = Content.builder().data(emailBodyContent).build();
        Body emailBody = Body.builder().html(bodyContent).build();


        Message message = Message.builder().subject(subjectContent).body(emailBody).build();


        SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                .source(dotenv.get("AWS_SES_VERIFIED_EMAIL"))
                .destination(destination)
                .message(message)
                .build();


        sesClient.sendEmail(sendEmailRequest);


        log.info("Email sent successfully to {}", destinationEmail);
    }
}
