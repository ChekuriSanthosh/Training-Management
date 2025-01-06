import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


interface Attendance {
  date: string;
  attendenceStatus: string | null;
  trainingRoom: string;
  attendenceId: number;
}

interface Trainer {
  trainerId: number;
  trainerEmail: string;
  trainerName: string;
  trainingRoom: string | null;
  skills: string[] | null;
}

interface Student {
  studentId: number;
  studentName: string;
  studentEmail: string;
  attendences: Attendance[];
  trainingRoom: string;
}

interface StudentWithAttendance extends Student {
  attendancePercentage: number;
}

@Component({
  selector: 'app-trainer-viewattendence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trainer-viewattendence.component.html',
  styleUrl: './trainer-viewattendence.component.css'
})
export class TrainerViewattendenceComponent {
  students: StudentWithAttendance[] = [];
  currentTrainermail: string = '';
  loading: boolean = true;
  error: string | null = null;
  currentWeekIndex: number = 0;
  dates: string[] = [];
  
  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    this.fetchClassAttendance();
  }
  
trackByStudentId(index: number, student: any): number {
  return student.studentId;
}


  async fetchClassAttendance() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token){
        this.router.navigate(['/login']);
      }

      
      const email = await this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' }).toPromise();
      if (!email) throw new Error('Failed to get email from token');
      this.currentTrainermail = email;
      
    
      
      const TrainerId = await this.http.get<number>(`http://localhost:8888/trainer/getTrainerByEmail/${this.currentTrainermail}`).toPromise();
      const currentTrainer = await this.http.get<Trainer>(`http://localhost:8888/trainer/${TrainerId}`).toPromise();
      
      if (!currentTrainer) throw new Error('Trainer not found');
      
      
      const classmates = await this.http.get<Student[]>(`http://localhost:8888/trainer/allstudents/${TrainerId}`).toPromise();
      
      if (!classmates) throw new Error('No class data found');

      
      this.processStudentsAttendance(classmates);
      this.loading = false;
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  private processStudentsAttendance(students: Student[]) {
    
    const allDates = new Set<string>();
    students.forEach(student => {
      student.attendences.forEach(att => allDates.add(att.date));
    });
    this.dates = Array.from(allDates).sort();

    
    this.students = students.map(student => {
      const totalAttendances = student.attendences.filter(att => att.attendenceStatus !== null).length;
      const presentAttendances = student.attendences.filter(att => att.attendenceStatus === 'P').length;
      const percentage = totalAttendances > 0 
        ? Number(((presentAttendances / totalAttendances) * 100).toFixed(2))
        : 0;

      return {
        ...student,
        attendancePercentage: percentage
      };
    }).sort((a, b) => b.attendancePercentage - a.attendancePercentage);
  }

  getCurrentWeekDates(): string[] {
    const startIdx = this.currentWeekIndex * 7;
    return this.dates.slice(startIdx, startIdx + 7);
  }

  getAttendanceStatus(student: Student, date: string): string | null {
    const attendance = student.attendences.find(att => att.date === date);
    return attendance?.attendenceStatus || null;
  }

  nextWeek() {
    if ((this.currentWeekIndex + 1) * 7 < this.dates.length) {
      this.currentWeekIndex++;
    }
  }

  previousWeek() {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  iscurrentTrainer(student: Student): boolean {
    return student.studentEmail === this.currentTrainermail;
  }

  canGoNext(): boolean {
    return (this.currentWeekIndex + 1) * 7 < this.dates.length;
  }

  canGoPrevious(): boolean {
    return this.currentWeekIndex > 0;
  }
}
