import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient} from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-maintainerregisterstudent',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './maintainerregisterstudent.component.html',
  styleUrl: './maintainerregisterstudent.component.css'
})
export class MaintainerregisterstudentComponent implements OnInit {
  registrationForm!: FormGroup;
  trainingRooms: string[] = [];
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    
    this.registrationForm = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(2)]],
      studentEmail: ['', [Validators.required, Validators.email]],
      trainingRoom: ['', Validators.required],
      totalDuration: ['', [Validators.required, Validators.min(1)]]
    });

    
    this.fetchTrainingRooms();
  }

  fetchTrainingRooms() {
    this.http.get<number>('http://localhost:8888/maintainer/GetTrainingRoomSize')
      .subscribe({
        next: (roomCount) => {
          this.trainingRooms = Array.from(
            { length: roomCount }, 
            (_, i) => `Room${i + 1}`
          );
        },
        error: (error) => {
          console.error('Failed to fetch training rooms', error);
          
        }
      });
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
    if (this.registrationForm.invalid) {
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const studentData = {
      studentName: this.registrationForm.get('studentName')?.value ?? '',
      trainingRoom: this.registrationForm.get('trainingRoom')?.value ?? '',
      totalduration: +(this.registrationForm.get('totalDuration')?.value ?? 0),
      studentEmail: this.registrationForm.get('studentEmail')?.value ?? ''
    };

    this.http.post('http://localhost:8888/maintainer/registerStudents', studentData)
      .subscribe({
        next: () => {
          this.registerForAuth(studentData.studentEmail);
        },
        error: (error) => {
          this.showNotification('Failed to register student. Please try again.', 'error');
          console.error('Student registration failed', error);
        }
      });
  }

  private registerForAuth(email: string) {
    const authData = {
      username: email,
      password: 'ust@123',
      role: 'STUDENT'
    };

    this.http.post('http://localhost:8888/auth/register', authData)
      .subscribe({
        next: () => {
          this.showNotification('Student registered successfully!', 'success');
          this.registrationForm.reset();
        },
        error: (error) => {
          this.showNotification('Authentication registration failed. Please try again.', 'error');
          console.error('Authentication registration failed', error);
        }
      });
  }
}