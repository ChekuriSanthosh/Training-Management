
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { timeout } from 'rxjs';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  stage: 'email' | 'verification' | 'reset' = 'email';
  
  
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient,private router:Router) {}

  
  sendVerificationCode() {
    
    this.clearMessages();
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    
    this.http.post(`http://localhost:8888/auth/send-email`, null, { 
      params: { email: this.email },
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.stage = 'verification';
      },
      error: (error: HttpErrorResponse) => {
        // this.successMessage='Successfully sent';
        // this.stage='verification';
        alert('cant send email');
      }
    });
  }

  verifyCode() {
    
    this.clearMessages();
    if (this.verificationCode.length !== 6) {
      this.errorMessage = 'Verification code must be 6 digits';
      return;
    }

    
    this.http.post(`http://localhost:8888/auth/verify-code`, null, { 
      params: { 
        email: this.email,
        code: this.verificationCode 
      },
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.stage = 'reset';
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Invalid verification code';
        
      }
    });
  }

  
  resetPassword() {
    this.clearMessages();
    if (!this.validatePassword()) {
      return;
    }

    this.http.put(`http://localhost:8888/auth/update-password`, null, { 
      params: { 
        email: this.email,
        password: this.newPassword 
      },
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.resetForm();
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error || 'Failed to reset password';
      }
    });
  }

  private validatePassword(): boolean {
    
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (this.newPassword.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  
  private resetForm() {
    this.email = '';
    this.verificationCode = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.stage = 'email';
  }

  
  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

}



