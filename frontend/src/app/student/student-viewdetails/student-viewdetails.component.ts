import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { StudentChatbotComponent } from '../student-chatbot/student-chatbot.component';


interface Attendance {
  date: string;
  attendenceStatus: string | null;
  trainingRoom: string;
  attendenceId: number;
}



interface Student {
  studentId: number;
  studentName: string;
  studentEmail: string;
  trainingRoom: string;
  totalduration: number;
  attendences: Attendance[];
}


@Component({
  selector: 'app-student-view-details',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule,StudentChatbotComponent],
  templateUrl: './student-viewdetails.component.html',

  styleUrl: './student-viewdetails.component.css'
})
export class StudentViewDetailsComponent implements OnInit {
  student: Student | null = null;
  isEditing: boolean = false;
  updatedName: string = '';
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    const res=sessionStorage.getItem('ust.auth');
    if(!res){
      this.router.navigate(['/login']);
    }
    this.fetchStudentDetails();
  }

  private getEmailFromToken(token: string): Promise<string|any> {
    return this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' }).toPromise();
  }

  private getStudentIdFromEmail(email: string): Promise<number|any> {
    return this.http.get<number>(`http://localhost:8888/student/getStudentbymail/${email}`).toPromise();
  }

  private getStudentDetails(id: number): Promise<Student|any> {
    return this.http.get<Student>(`http://localhost:8888/student/${id}`).toPromise();
  }

  startEditing() {
    if (this.student) {
      this.updatedName = this.student.studentName;
      this.isEditing = true;
    }

  }

  async updateName() {
    try {
      if (!this.student) return;

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      
      const response = await this.http.put<Student>(
        `http://localhost:8888/student/${this.student.studentId}`,
        { studentName: this.updatedName },
        { headers }
      ).toPromise();

      if (response) {
        this.student.studentName = response.studentName;
        this.isEditing = false;
      }
    } catch (err: any) {
      this.error = 'Failed to update name';
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }






  isChatOpen: boolean = false;



  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  private async fetchStudentDetails() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }

      const email = await this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' }).toPromise();
      const studentId = await this.http.get<number>(`http://localhost:8888/student/getStudentbymail/${email}`).toPromise();
      const studentDetails = await this.http.get<Student>(`http://localhost:8888/student/${studentId}`).toPromise();

      if (studentDetails) {
        this.student = studentDetails;
      }
    } catch (err) {
      this.error = 'Failed to fetch student details';
    } finally {
      this.loading = false;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}









