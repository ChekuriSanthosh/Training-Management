import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Student {
  studentId: number;
  studentName: string;
  studentEmail: string;
  trainingRoom: string;
  totalduration: number;
}

@Component({
  selector: 'app-maintainerviewstudent',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './maintainerviewstudent.component.html',
  styleUrl: './maintainerviewstudent.component.css'
})
export class MaintainerviewstudentComponent implements OnInit{
  availableRooms: string[] = [];
  students: Student[] = [];
  selectedRoom: string = '';
  isLoading: boolean = false;

  private baseUrl = 'http://localhost:8888/maintainer';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTrainingRoomSize();
  }

  
  fetchTrainingRoomSize(): void {
    this.isLoading = true;
    this.http.get<number>(`${this.baseUrl}/GetTrainingRoomSize`).subscribe({
      next: (roomSize) => {
        
        this.availableRooms = Array.from({length: roomSize}, (_, i) => `Room${i + 1}`);
        
        
        if (this.availableRooms.length > 0) {
          this.selectedRoom = this.availableRooms[0];
          this.fetchStudentsByRoom(this.selectedRoom);
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching training room size:', err);
        
        this.availableRooms = ['Room1', 'Room2', 'Room3', 'Room4', 'Room5', 'Room6', 'Room7', 'Room8'];
        
        
        if (this.availableRooms.length > 0) {
          this.selectedRoom = this.availableRooms[0];
          this.fetchStudentsByRoom(this.selectedRoom);
        }
        
        this.isLoading = false;
      }
    });
  }

  
  fetchStudentsByRoom(room: string): void {
    this.isLoading = true;
    this.students = []; 

    this.http.get<Student[]>(`${this.baseUrl}/getStudentsByRoom/${room}`).subscribe({
      next: (students: Student[]) => {
        this.students = students;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching students:', err);
        this.students = [];
        this.isLoading = false;
      }
    });
  }

  
  onRoomChange(event: Event): void {
    const room = (event.target as HTMLSelectElement).value;
    this.selectedRoom = room;
    this.fetchStudentsByRoom(room);
  }

}
