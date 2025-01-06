import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

interface MarksEntry {
  marks: number;
  weekName: number;
  marksId?: number;
}

interface Student {
  studentId: number;
  studentName: string;
  studentEmail: string;
  trainingRoom: string;
  totalduration: number;
  marks: MarksEntry[];
}

@Component({
  selector: 'app-maintainer-post-marks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maitainer-post-marks.component.html',
  styleUrls: ['./maitainer-post-marks.component.css']
})
export class MaintainerPostMarksComponent implements OnInit {
  students: Student[] = [];
  marksSubject: Subject<{ studentId: number, requestBody: { marks: number, weekName: number } }> = new Subject();
  
  availableRooms: string[] = [];
  selectedRoom: string = '';
  
  
  weeks: number[] = [];
  
  private baseUrl = 'http://localhost:8888/maintainer';
  private maintainerBaseUrl = 'http://localhost:8888/maintainer/GetTrainingRoomSize';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTrainingRoomSize();

    this.marksSubject.pipe(
      filter(data => {
        const marks = data.requestBody.marks;
        return marks !== null && marks >= 0 && marks <= 100;
      }),
      debounceTime(500)
    ).subscribe((data) => {
      this.updateMarksByWeek(data.studentId, data.requestBody).subscribe(
        (response) => {
          
        },
        (error) => {
          console.error(`Error updating marks for student ${data.studentId}, week ${data.requestBody.weekName}:`, error);
        }
      );
    });
  }

  fetchTrainingRoomSize(): void {
    this.http.get<number>(`${this.maintainerBaseUrl}`).subscribe({
      next: (roomSize) => {
        this.availableRooms = Array.from({length: roomSize}, (_, i) => `Room${i + 1}`);
        
        if (this.availableRooms.length > 0) {
          this.selectedRoom = this.availableRooms[0];
          this.fetchStudentsByRoom(this.selectedRoom);
        }
      },
      error: (err) => {
        console.error('Error fetching training room size:', err);
        this.availableRooms = ['Room1', 'Room2', 'Room3', 'Room4', 'Room5', 'Room6', 'Room7', 'Room8'];
        this.selectedRoom = this.availableRooms[0];
        this.fetchStudentsByRoom(this.selectedRoom);
      }
    });
  }

  getStudentsByRoom(room: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/getStudentsByRoom/${room}`);
  }

  updateMarksByWeek(studentId: number, requestBody: { marks: number, weekName: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddNewMarks/${studentId}`, requestBody);
  }

  onRoomChange(event: Event): void {
    const room = (event.target as HTMLSelectElement).value;
    this.selectedRoom = room;
    this.fetchStudentsByRoom(room);
  }

  fetchStudentsByRoom(room: string): void {
    this.getStudentsByRoom(room).subscribe({
      next: (students: Student[]) => {
        
        this.students = students;
        
        
        this.weeks = this.calculateWeeks(students);
      },
      error: (err) => {
        console.error('Error fetching students:', err);
        this.students = [];
        this.weeks = [];
      }
    });
  }

  
  calculateWeeks(students: Student[]): number[] {
    if (students.length === 0) return [];

    
    const maxDuration = Math.max(...students.map(student => student.totalduration));
    
    
    return Array.from({length: maxDuration}, (_, i) => i + 1);
  }

  onMarksChange(studentId: number, week: number, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const marks = inputElement.value;

    const parsedMarks = parseInt(marks, 10);
    
    if (!isNaN(parsedMarks) && parsedMarks >= 0 && parsedMarks <= 100) {
      const requestBody = { marks: parsedMarks, weekName: week };
      
      this.marksSubject.next({ studentId, requestBody });
    }
  }

  getInitialMarks(student: Student, week: number): string {
    if (student && student.marks) {
      const weekMarks = student.marks.find(m => m.weekName === week);
      return weekMarks ? weekMarks.marks.toString() : '';
    }
    return '';
  }
}