package com.myportfolio.apigateway.api;

import com.myportfolio.apigateway.service.ResetPasswordService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class ResetPasswordController {

    @Autowired
    private ResetPasswordService passwordResetService;

    @GetMapping("hello")
    public String hello(){
        return "Hello";
    }

    @PostMapping("/auth/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        return passwordResetService.forgotPassword(email);
    }


    @PostMapping("/auth/verify-code")
    public String verifyCode(@RequestParam String email, @RequestParam int  code) {
        boolean isValid = passwordResetService.verifyCode(email, code);
        if (isValid) {
            return "Verification successful!";
        } else {
            throw new RuntimeException("Invalid verification code");
//            return "Invalid or expired verification code!";
        }
    }
    @PutMapping("/auth/update-password")
    public String updatePassword(@RequestParam String email,@RequestParam String password)
    {
        return passwordResetService.UpdatePassword(email,password);
    }

    @PostMapping("/auth/send-email")
    public String sendEmailVerificationCode(@RequestParam String email) {
        return passwordResetService.sendEmailVerificationToken(email);
    }
}
