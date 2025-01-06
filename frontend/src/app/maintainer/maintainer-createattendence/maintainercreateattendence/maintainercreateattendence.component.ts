import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-maintainercreateattendence',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './maintainercreateattendence.component.html',
  styleUrl: './maintainercreateattendence.component.css'
})
export class MaintainercreateattendenceComponent implements OnInit{
  attendanceForm: FormGroup;
  
  
  rooms: string[] = [];
  
  
  minDate: Date = new Date();

  
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    
    this.attendanceForm = this.fb.group({
      room: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit() {
    
    this.fetchRooms();
  }

  
  fetchRooms() {
    this.http.get<number>('http://localhost:8888/maintainer/GetTrainingRoomSize')
      .subscribe({
        next: (roomCount) => {
          
          this.rooms = Array.from(
            { length: roomCount }, 
            (_, index) => `Room${index + 1}`
          );
        },
        error: (error) => {
          console.error('Error fetching rooms:', error);
          
          this.rooms = ['Room1', 'Room2', 'Room3'];
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
    
    if (this.attendanceForm.invalid) {
      return;
    }

    
    const { room, date } = this.attendanceForm.value;

    this.http.post(
      `http://localhost:8888/maintainer/createnewDateAttendence/${room}?date=${date}`,
      {}
    ).subscribe({
      next: () => {
        this.showNotification('Attendance created successfully!', 'success');
        
        this.attendanceForm.reset();
      },
      error: (error) => {
        console.error('Error creating attendance:', error);
        this.showNotification('Failed to create attendance. Please try again.', 'error');
      }
    });
  }


}
