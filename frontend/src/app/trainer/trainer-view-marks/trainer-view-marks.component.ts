
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


interface Trainer {
  trainerId: number;
  trainerEmail: string;
  trainerName: string;
  trainingRoom: string | null;
  skills: string[] | null;
}

interface Mark {
  marks: number;
  weekName: number;
  marksId: number;
}

interface Student {
  trainerId: number;
  studentName: string;
  studentEmail: string;
  marks: Mark[];
  trainingRoom: string;
  totalduration: number;
}

interface StudentWithAverage extends Student {
  averageMarks: number;
  rank: number;
}

@Component({
  selector: 'app-trainer-view-marks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trainer-view-marks.component.html',
  styleUrl: './trainer-view-marks.component.css',
  
})
export class TrainerViewMarksComponent implements OnInit {
  students: StudentWithAverage[] = [];
  currentStudentEmail: string = '';
  totalDuration: number = 0;
  loading: boolean = true;
  error: string | null = null;
  weeks: number[] = [];
  noTrainingRoom: boolean = false;

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    this.fetchClassMarks();
  }

  // classmates?:Student[];

  

trackByStudentId(index: number, student: any): number {
  return student.studentId;
}

classmates?:Student[];

  async fetchClassMarks() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token){
        this.router.navigate(['/login']);
      }

      
      const email = await this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' }).toPromise();
      if (!email) throw new Error('Failed to get email from token');
      this.currentStudentEmail = email;
      
      
      
      const studentId = await this.http.get<number>(`http://localhost:8888/trainer/getTrainerByEmail/${this.currentStudentEmail}`).toPromise();
      // const currentStudent = await this.http.get<Student>(`http://localhost:8300/student/${studentId}`).toPromise();
      
      // if (!currentStudent) throw new Error('Student not found');
      
      
      const classmates1 = await this.http.get<Student[]>(`http://localhost:8888/trainer/allstudents/${studentId}`).toPromise();


      if (!classmates1 || classmates1.length === 0 || !classmates1[0].trainingRoom) {
        this.noTrainingRoom = true;
        this.loading = false;
        return;
      }
      
      if (!classmates1) throw new Error('No class data found');
      this.classmates=classmates1;

      // this.classmates.map(student=>this.totalDuration=student.totalduration);


      const res=classmates1[0];
      this.totalDuration = res.totalduration;
      // console.log(res);
      
      this.weeks = Array.from({length: this.totalDuration}, (_, i) => i + 1);

      
      this.students = this.processStudents(classmates1);
      
      this.loading = false;
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  private processStudents(students: Student[]): StudentWithAverage[] {
    
    const studentsWithAverage = students.map(student => {
      const validMarks = student.marks.filter(mark => mark.weekName <= this.totalDuration);
      const average = validMarks.length > 0
        ? Number((validMarks.reduce((acc, mark) => acc + mark.marks, 0) / validMarks.length).toFixed(2))
        : 0;

      return {
        ...student,
        averageMarks: average,
        rank: 0
      };
    });

    
    return studentsWithAverage
      .sort((a, b) => b.averageMarks - a.averageMarks)
      .map((student, index) => ({
        ...student,
        rank: index + 1
      }));
  }

  getMarkForWeek(student: Student, weekNumber: number): number | null {
    const mark = student.marks.find(m => m.weekName === weekNumber);
    return mark ? mark.marks : null;
  }

  getMarkColor(mark: number | null): string {
    if (mark === null) return '';
    if (mark >= 90) return 'excellent';
    if (mark >= 80) return 'good';
    if (mark >= 70) return 'average';
    return 'needs-improvement';
  }

  isCurrentStudent(student: Student): boolean {
    return student.studentEmail === this.currentStudentEmail;
  }
}




















