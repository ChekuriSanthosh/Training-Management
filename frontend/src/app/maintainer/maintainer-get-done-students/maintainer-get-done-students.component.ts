

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, Subject } from 'rxjs';

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
  selector: 'app-maintainer-get-done-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintainer-get-done-students.component.html',
  styleUrls: ['./maintainer-get-done-students.component.css']
})
export class MaintainerGetDoneStudentsComponent implements OnInit {
  students: Student[] = [];
  roomSize: number = 0;
  rooms: string[] = [];
  selectedRoom: string = 'all';
  searchTerm: string = '';
  loading: boolean = true;
  error: string = '';
  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient) {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.getFilteredStudents();
    });
  }

  ngOnInit() {
    this.getRoomSize();
  }

  getRoomSize() {
    this.http.get<number>('http://localhost:8888/maintainer/GetTrainingRoomSize')
      .subscribe({
        next: (size) => {
          this.roomSize = size;
          this.initializeRooms();
          this.getAllDoneStudents();
        },
        error: (error) => {
          this.error = 'Failed to fetch room size';
          this.loading = false;
        }
      });
  }

  initializeRooms() {
    this.rooms = Array.from({ length: this.roomSize }, (_, i) => `Room${i + 1}`);
  }

  getAllDoneStudents() {
    this.loading = true;
    this.http.get<Student[]>('http://localhost:8888/maintainer/AllCompletedStudents')
      .subscribe({
        next: (students) => {
          this.students = students;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to fetch completed students';
          this.loading = false;
        }
      });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.searchSubject.next(this.searchTerm);
  }

  getFilteredStudents(): Student[] {
    return this.students.filter(student => {
      const matchesRoom = this.selectedRoom === 'all' || student.trainingRoom === this.selectedRoom;
      const matchesSearch = this.searchTerm === '' || 
        student.studentName.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesRoom && matchesSearch;
    });
  }

  getRatingStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}