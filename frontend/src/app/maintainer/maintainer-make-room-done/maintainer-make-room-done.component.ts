import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Student {
  trainingdone: boolean;
  marks: {
    marks: number;
    weekName: number;
    marksId: number;
  }[];
  feedback: {
    feedbackMessage: string;
    feedbackId: number;
    rating: number;
  };
  attendences: {
    date: string;
    student: string;
    attendenceId: number;
    attendenceStatus: string;
    trainingRoom: string;
  }[];
  studentId: number;
  trainingRoom: string;
  studentEmail: string;
  studentName: string;
  totalduration: number;
}

@Component({
  selector: 'app-maintainer-make-room-done',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './maintainer-make-room-done.component.html',
  styleUrls: ['./maintainer-make-room-done.component.css']
})
export class MaintainerMakeRoomDoneComponent implements OnInit {
  rooms: string[] = [];
  selectedRoom: string = '';
  students: Student[] = [];
  loading: boolean = false;
  processing: boolean = false;
  error: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRoomSize();
  }

  getRoomSize() {
    this.loading = true;
    this.http.get<number>('http://localhost:8888/maintainer/GetTrainingRoomSize')
      .subscribe({
        next: (size) => {
          this.rooms = Array.from({ length: size }, (_, i) => `Room${i + 1}`);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch room size';
          this.loading = false;
        }
      });
  }

  onRoomSelect() {
    if (!this.selectedRoom) return;
    
    this.loading = true;
    this.error = '';
    this.successMessage = '';
    
    this.http.get<Student[]>(`http://localhost:8888/maintainer/getStudentsByRoom/${this.selectedRoom}`)
      .subscribe({
        next: (students) => {
          this.students = students;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch students for the selected room';
          this.loading = false;
        }
      });
  }

  makeRoomDone() {
    if (!this.selectedRoom || this.students.length === 0) return;

    this.processing = true;
    this.error = '';
    this.successMessage = '';

    this.http.put(`http://localhost:8888/maintainer/makeTrainingRoomDone/${this.selectedRoom}`, {})
      .subscribe({
        next: () => {
          this.successMessage = `Successfully unassigned all students from ${this.selectedRoom}`;
          this.processing = false;
          this.students = [];
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          this.error = 'Failed to unassign students from the room';
          this.processing = false;
        }
      });
  }
}