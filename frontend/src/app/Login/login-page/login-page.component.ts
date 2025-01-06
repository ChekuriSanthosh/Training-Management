import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthApiService } from '../../auth-api.service';
import { UserCredentials } from '../../model/UserCredentials';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  
  constructor(
    private authapiService: AuthApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  roles: string[] = ['ADMIN', 'MAINTAINER', 'TRAINER', 'MANAGER', 'STUDENT'];
  
  login(userCredentials: UserCredentials) {
    this.authapiService.authenticate(userCredentials).subscribe(
      response => {
        sessionStorage.setItem('ust.auth', response.jwt);
        this.loginError = null;
        if (userCredentials.role === "ADMIN") {
          this.router.navigate(['/admin']);
        } else if (userCredentials.role === "MAINTAINER") {
          this.router.navigate(['/maintainer']);
        } else if (userCredentials.role === "MANAGER") {
          this.router.navigate(['/manager']);
        } else if (userCredentials.role === "TRAINER") {
          this.router.navigate(['/trainer']);
        } else if (userCredentials.role === "STUDENT") {
          this.router.navigate(['/student']);
        }
      },
      error => {
        this.loginError = 'Login Failed. Please try again.';
        setTimeout(() => {
          this.loginError = null;
        }, 2000);
      }
    );
  }

  ForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}


