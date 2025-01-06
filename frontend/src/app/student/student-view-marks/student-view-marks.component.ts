import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

interface Mark {
  marks: number;
  weekName: number;
  marksId: number;
}

interface StudentResponse {
  marks: Mark[];
  studentId: number;
  totalduration: number;
}

@Component({
  selector: 'app-student-view-marks',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './student-view-marks.component.html',
  styleUrl: './student-view-marks.component.css'
})
export class StudentViewMarksComponent implements OnInit {
  marks: Mark[] = [];
  totalDuration: number = 0;
  averageMarks: number = 0;
  loading: boolean = true;
  error: string | null = null;
  weeks: number[] = [];

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    this.fetchStudentMarks();
  }

  async fetchStudentMarks() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token) {
        this.router.navigate(['/login']);
      }

      
      const email = await this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' }).toPromise();
      
      
      const studentId = await this.http.get<number>(`http://localhost:8888/student/getStudentbymail/${email}`).toPromise();
      

      const response = await this.http.get<StudentResponse>(`http://localhost:8888/student/${studentId}`).toPromise();
      
      if (response) {
        this.marks = response.marks;
        this.totalDuration = response.totalduration;
        this.weeks = Array.from({length: this.totalDuration}, (_, i) => i + 1);
        this.calculateAverageMarks();
      }
      
      this.loading = false;
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  getMarkForWeek(weekNumber: number): number | null {
    const mark = this.marks.find(m => m.weekName === weekNumber);
    return mark ? mark.marks : null;
  }

  calculateAverageMarks() {
    if (this.marks.length === 0) {
      this.averageMarks = 0;
      return;
    }
    
    const sum = this.marks.reduce((acc, mark) => acc + mark.marks, 0);
    this.averageMarks = Number((sum / this.marks.length).toFixed(2));
  }

  getMarkColor(mark: number | null): string {
    if (mark === null) return '';
    if (mark >= 90) return 'excellent';
    if (mark >= 80) return 'good';
    if (mark >= 70) return 'average';
    return 'needs-improvement';
  }
}