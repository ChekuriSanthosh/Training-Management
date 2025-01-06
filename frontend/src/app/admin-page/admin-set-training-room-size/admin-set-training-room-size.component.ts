import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-set-training-room-size',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,AdminNavbarComponent],
  templateUrl: './admin-set-training-room-size.component.html',
  styleUrls: ['./admin-set-training-room-size.component.css']
})
export class AdminSetTrainingRoomSizeComponent implements OnInit {
  currentRoomSize$: Observable<number> | undefined;  
  roomSizeForm!: FormGroup;  
  submitted = false;
  submitSuccess = false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router:Router
  ) {}

  ngOnInit(): void {
    if(!sessionStorage.getItem('ust.auth')){
      this.router.navigate(['/home']);
    }
    this.initForm();
    this.loadCurrentRoomSize();
    
  }

  initForm(): void {
    this.roomSizeForm = this.formBuilder.group({
      roomSize: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  loadCurrentRoomSize(): void {
    
    this.currentRoomSize$ = this.http.get<number>('http://localhost:8888/admin/GetTrainingRoomSize');
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitSuccess = false;

    if (this.roomSizeForm.valid) {
      const roomSize = this.roomSizeForm.get('roomSize')?.value;  
      
      if (roomSize !== undefined) { 
        this.http.post(`http://localhost:8888/admin/AssignTrainingRoomSize/${roomSize}`, {})
          .subscribe({
            next: () => {
              this.submitSuccess = true;
              this.loadCurrentRoomSize(); 
            },
            error: (error) => {
              console.error('Error setting room size', error);
              this.submitSuccess = false;
            }
          });
      }
    }
  }

  
  get f() { return this.roomSizeForm.controls; }
}
