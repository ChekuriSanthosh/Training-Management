package com.capstone.util;
import org.springframework.stereotype.Component;
import jakarta.mail.*;
import jakarta.mail.internet.*;

import java.util.Properties;

@Component
public class EmailUtil {
    public static void sendEmail(String toEmail, String subject, String body) {
        String fromEmail = "amaankhan7018@gmail.com"; // Sender's email
        String password = "pdwz vgsb rwig rsie"; // Use App Password if 2FA is enabled
        String host = "smtp.gmail.com"; // Gmail SMTP server
        String port = "587"; // SMTP port for Gmail

        // Set up properties for the SMTP server
        Properties properties = new Properties();
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", port);
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.ssl.enable", "false");

        // Get the Session object for authentication
        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(fromEmail, password);
            }
        });

        try {
            // Create the email message
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setContent(body, "text/html; charset=UTF-8"); // Ensure HTML content type
            message.setSubject(subject);

            // Send the email
            Transport.send(message);
            System.out.println("Email sent successfully!");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Failed to send email.");
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
