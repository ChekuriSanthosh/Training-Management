import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-maintainerregistertrainer',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './maintainerregistertrainer.component.html',
  styleUrl: './maintainerregistertrainer.component.css'
})
export class MaintainerregistertrainerComponent {
  trainerForm: FormGroup;
  skills: string[] = [];
  newSkill: string = '';
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient
  ) {
    this.trainerForm = this.fb.group({
      trainerEmail: ['', [Validators.required, Validators.email]],
      trainerName: ['', Validators.required]
    });
  }

  addSkill() {
    if (this.newSkill && !this.skills.includes(this.newSkill)) {
      this.skills.push(this.newSkill);
      this.newSkill = '';
    }
  }

  removeSkill(skill: string) {
    this.skills = this.skills.filter(s => s !== skill);
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  onSubmit() {
    if (this.trainerForm.valid) {
      const email = this.trainerForm.get('trainerEmail')?.value;
      const name = this.trainerForm.get('trainerName')?.value;

      this.http.post('http://localhost:8888/maintainer/registerTrainer', {
        trainerEmail: email,
        trainerName: name,
        skills: this.skills
      }).subscribe({
        next: (trainerResponse) => {
          this.http.post('http://localhost:8888/auth/register', {
            username: email,
            password: 'ustTrainer@123',
            role: 'TRAINER'
          }).subscribe({
            next: (authResponse) => {
              this.showNotification('Trainer registered successfully!', 'success');
              this.resetForm();
            },
            error: (authError) => {
              this.showNotification('Authentication registration failed. Please try again.', 'error');
              console.error('Auth Registration Error', authError);
            }
          });
        },
        error: (trainerError) => {
          this.showNotification('Failed to register trainer. Please try again.', 'error');
          console.error('Trainer Registration Error', trainerError);
        }
      });
    }
  }

  resetForm() {
    this.trainerForm.reset();
    this.skills = [];
    this.newSkill = '';
  }
}
