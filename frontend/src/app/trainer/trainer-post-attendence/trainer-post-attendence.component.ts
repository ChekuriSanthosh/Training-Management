import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Attendance {
  date: string;
  attendenceStatus: string | null;
  attendenceId: number;
}

interface userModel{
  username:string;
  password:string;
  role:string;
}


interface Student {
  studentId: number;
  studentName: string;
  attendences: Attendance[];
  trainingRoom: string;
}

@Component({
  selector: 'app-trainer-post-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainer-post-attendence.component.html',
  styleUrl: './trainer-post-attendence.component.css'
})
export class TrainerPostAttendanceComponent implements OnInit {
  students: Student[] = [];
  currentDateIndex: number = 0;
  daysPerPage: number = 7;
  loading: boolean = true;
  error: string | null = null;
  noTrainingRoom: boolean = false;
  trainerId: number | any = null;
  savingAttendance: boolean = false;

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    this.fetchStudents();
  }

  async fetchStudents() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token){
        this.router.navigate(['/login']);
      }

      const email = await this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' }).toPromise();
      const trainerId = await this.http.get<number>(`http://localhost:8888/trainer/getTrainerByEmail/${email}`).toPromise();
      this.trainerId = trainerId;
      
      const students = await this.http.get<Student[]>(`http://localhost:8888/trainer/allstudents/${trainerId}`).toPromise();
      
      if (!students || students.length === 0 || !students[0].trainingRoom) {
        this.noTrainingRoom = true;
        this.loading = false;
        return;
      }

      
      this.students = students.map(student => ({
        ...student,
        attendences: student.attendences.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      }));

      this.loading = false;
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  getVisibleDates(): Attendance[] {
    if (!this.students.length) return [];
    const start = this.currentDateIndex * this.daysPerPage;
    return this.students[0].attendences.slice(start, start + this.daysPerPage);
  }

  async saveAttendance(student: Student, date: Attendance, status: string) {
    if (!this.trainerId) return;
    
    try {
      this.savingAttendance = true;
      const response = await this.http.post<Student>(
        `http://localhost:8888/trainer/Attendence/${this.trainerId}/${student.studentId}`,
        null,
        {
          params: {
            date: date.date,
            AttendenceStatus: status
          }
        }
      ).toPromise();

      if (response) {
        
        const studentIndex = this.students.findIndex(s => s.studentId === student.studentId);
        if (studentIndex !== -1) {
          response.attendences = response.attendences.sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          this.students[studentIndex] = response;
        }
      }
    } catch (err) {
      this.error = 'Failed to save attendance';
    } finally {
      this.savingAttendance = false;
    }
  }

  async markAllPresent(date: string) {
    if (!this.trainerId) return;
    
    try {
      this.savingAttendance = true;
      const response = await this.http.post<Student[]>(
        `http://localhost:8888/trainer/MarkAllPresent/${this.trainerId}`,
        null,
        {
          params: { date }
        }
      ).toPromise();

      if (response) {
        
        this.students = response.map(student => ({
          ...student,
          attendences: student.attendences.sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        }));
        this.showSuccessMessage('All students marked present!');
      }
    } catch (err) {
      this.error = 'Failed to mark all present';
    } finally {
      this.savingAttendance = false;
    }
  }

  showSuccessMessage(message: string) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;
    document.querySelector('.attendance-container')?.prepend(successMessage);
    
    setTimeout(() => {
      successMessage.remove();
    }, 3000);
  }

  canGoNext(): boolean {
    if (!this.students.length) return false;
    return (this.currentDateIndex + 1) * this.daysPerPage < this.students[0].attendences.length;
  }

  canGoPrevious(): boolean {
    return this.currentDateIndex > 0;
  }

  nextDates() {
    if (this.canGoNext()) {
      this.currentDateIndex++;
    }
  }

  previousDates() {
    if (this.canGoPrevious()) {
      this.currentDateIndex--;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  getAttendanceStatus(student: Student, date: Attendance): string | null {
    const attendance = student.attendences.find(a => a.date === date.date);
    return attendance?.attendenceStatus || null;
  }
}