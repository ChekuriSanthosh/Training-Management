import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

interface Student {
  studentId: number;
  studentName: string;
  studentEmail: string;
  trainingRoom: string;
  totalduration: number;
}

@Component({
  standalone: true,
  selector: 'app-admin-view-students',
  templateUrl: './admin-view-students.component.html',
  styleUrls: ['./admin-view-students.component.css'],
  imports: [CommonModule, FormsModule,RouterModule,AdminNavbarComponent]  
})
export class AdminViewStudentsComponent implements OnInit {
  students: Student[] = [];
  selectedTrainingRoom: string = '';
  trainingRooms: string[] = [];
  loading: boolean = true;
  error: string | null = null;
  noTrainingRooms: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient,private router:Router) {}


  ngOnInit(): void {
    
    if(!sessionStorage.getItem('ust.auth')){
      this.router.navigate(['/home']);
    }
    this.fetchTrainingRooms();

  }
  async fetchTrainingRooms() {
    try {
      const response = await this.http.get<any>('http://localhost:8888/admin/GetTrainingRoomSize').toPromise();
      const roomSize = response;
      
      if (roomSize > 0) {
        this.trainingRooms = Array.from({ length: roomSize }, (_, i) => `Room${i + 1}`);
        
        if (this.trainingRooms.length > 0) {
          this.loadStudentsByTrainingRoom(this.trainingRooms[0]);
        }
      } else {
        this.trainingRooms = [];
        this.students = [];
      }
      this.loading = false; 
    } catch (err) {
      console.error('Error fetching room size:', err);
      this.trainingRooms = [];
      this.students = [];
      this.loading = false; 
      this.errorMessage = 'Failed to fetch training rooms';
    }
  }

  loadStudentsByTrainingRoom(event: Event | string): void {
    this.loading = true; 
    let trainingRoom: string;

    if (typeof event === 'string') {
      trainingRoom = event;
    } else {
      const selectElement = event.target as HTMLSelectElement;
      trainingRoom = selectElement.value;
    }

    this.selectedTrainingRoom = trainingRoom;
    this.errorMessage = '';

    this.http.get<Student[]>(`http://localhost:8888/admin/students/${trainingRoom}`)
      .subscribe({
        next: (data) => {
          this.students = data;
          this.loading = false; 
        },
        error: (error) => {
          console.error('Error fetching students:', error);
          this.students = [];
          this.errorMessage = 'Failed to load students. Please try again later.';
          this.loading = false; 
        }
      });
  }
}
