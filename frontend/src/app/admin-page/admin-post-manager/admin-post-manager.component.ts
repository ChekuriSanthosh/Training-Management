import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

interface Manager {
  accountType: string;
  manageremail: string;
  managerName: string;
}

interface UserModel {
  username: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-admin-post-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-post-manager.component.html',
  styleUrl: './admin-post-manager.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class AdminPostManagerComponent {
  managerForm: FormGroup;
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.managerForm = this.fb.group({
      managerName: ['', [Validators.required, Validators.minLength(3)]],
      manageremail: ['', [Validators.required, Validators.email]],
      accountType: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.managerForm.invalid) {
      this.markFormGroupTouched(this.managerForm);
      return;
    }

    try {
      this.loading = true;
      this.successMessage = null;
      this.errorMessage = null;

      
      const managerData: Manager = this.managerForm.value;
      const manager = await this.http.post<Manager>('http://localhost:8888/admin/manager', managerData).toPromise();

      if (manager) {
        
        const userData: UserModel = {
          username: managerData.manageremail,
          password: 'USTManager@123',
          role: 'MANAGER'
        };

        await this.http.post('http://localhost:8888/auth/register', userData).toPromise();

        this.successMessage = '✓ Manager registered successfully!';
        this.managerForm.reset();
        
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      }
    } catch (err: any) {
      console.error('Error:', err);
      this.errorMessage = err.error?.message || err.message || '✗ Failed to register manager';
      
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    } finally {
      this.loading = false;
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.managerForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) return `${controlName} is required`;
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['minlength']) return `${controlName} must be at least 3 characters`;
    }
    return '';
  }
}