package com.college.pace2027.service;

import com.college.pace2027.entity.TeamRegistration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    public void sendApprovalEmail(TeamRegistration registration) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(registration.getCaptainEmail());
        helper.setSubject("✅ PACE 2027 - Payment Confirmed! | " + registration.getTeamName());

        String rulebookUrl = registration.getSport().getRulebookUrl() != null
                ? registration.getSport().getRulebookUrl()
                : "#";

        String htmlBody = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                  <div style="background-color: #1a1a2e; padding: 24px; text-align: center;">
                    <h1 style="color: #f5a623; margin: 0;">PACE 2027</h1>
                    <p style="color: #aaa; margin: 4px 0;">Annual Sports Meet</p>
                  </div>
                  <div style="padding: 32px;">
                    <h2 style="color: #1a1a2e;">Payment Confirmed! 🎉</h2>
                    <p>Dear <strong>%s</strong>,</p>
                    <p>Your team registration for <strong>%s</strong> has been <span style="color: green; font-weight: bold;">approved</span>.</p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 20px 0;">
                      <tr style="background:#f4f4f4;"><td style="padding:8px; border:1px solid #ddd;"><strong>Team Name</strong></td><td style="padding:8px; border:1px solid #ddd;">%s</td></tr>
                      <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Sport</strong></td><td style="padding:8px; border:1px solid #ddd;">%s</td></tr>
                      <tr style="background:#f4f4f4;"><td style="padding:8px; border:1px solid #ddd;"><strong>UTR Number</strong></td><td style="padding:8px; border:1px solid #ddd;">%s</td></tr>
                      <tr><td style="padding:8px; border:1px solid #ddd;"><strong>Registration Fee</strong></td><td style="padding:8px; border:1px solid #ddd;">₹%s</td></tr>
                    </table>
                    <a href="%s" style="display:inline-block; background:#f5a623; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; margin-top:8px;">📖 View Rulebook</a>
                    <p style="margin-top: 24px; color: #666;">Good luck to your team! See you at PACE 2027.</p>
                  </div>
                  <div style="background:#f4f4f4; padding:16px; text-align:center; color:#888; font-size:12px;">
                    PACE 2027 | College Sports Meet | For queries, contact the Sports Secretary
                  </div>
                </div>
                """.formatted(
                registration.getCaptainName(),
                registration.getSport().getName(),
                registration.getTeamName(),
                registration.getSport().getName(),
                registration.getUtrNumber(),
                registration.getSport().getRegistrationFee().toPlainString(),
                rulebookUrl
        );

        helper.setText(htmlBody, true);
        mailSender.send(message);
        log.info("Approval email sent to: {}", registration.getCaptainEmail());
    }
}
