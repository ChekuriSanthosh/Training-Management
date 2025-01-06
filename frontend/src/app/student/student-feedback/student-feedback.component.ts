import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Feedback {
  feedbackId: number;
  rating: number;
  feedbackMessage: string;
}
interface FeedbackRequest {
  rating: number;
  feedbackMessage: string;
}

interface userModel{
  username:string;
  password:string;
  role:string;
}


interface Student {
  studentId: number;
  studentName: string;
  feedback: Feedback | null;
}

@Component({
  selector: 'app-student-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-feedback.component.html',
  styleUrl: './student-feedback.component.css'
})
export class StudentFeedbackComponent implements OnInit {
  student: Student | null = null;
  loading: boolean = true;
  error: string | null = null;
  

  rating: number = 0;
  hoverRating: number = 0;
  feedbackMessage: string = '';
  submitting: boolean = false;
  
  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    this.fetchStudentFeedback();
  }

  userdetails?:userModel;
  async fetchStudentFeedback() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token){
        this.router.navigate(['/login']);
      }

      
      const email = await this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' }).toPromise();

      // if(this.userdetails?.role!=='STUDENT'){
      //   console.log(this.userdetails?.role);
        
      //   const res="/"+this.userdetails?.role.toLowerCase;
      //   console.log(res);
        
      //   this.router.navigate([res]);
      // }
      
      const studentId = await this.http.get<number>(`http://localhost:8888/student/getStudentbymail/${email}`).toPromise();
      
      
      const studentDetails = await this.http.get<Student>(`http://localhost:8888/student/${studentId}`).toPromise();
      
      if (!studentDetails) throw new Error('Student not found');
      
      this.student = studentDetails;
      this.loading = false;
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  setHoverRating(rating: number) {
    this.hoverRating = rating;
  }

  async submitFeedback() {


    if (!this.student || !this.rating || !this.feedbackMessage) {
      return;
    }
    
    try {
      this.submitting = true;
      this.error = null;
      
      const feedbackRequest: FeedbackRequest = {
        rating: this.rating,
        feedbackMessage: this.feedbackMessage
      };

      
      const response = await this.http.post<Student>(
        `http://localhost:8888/student/FeedBack/${this.student.studentId}`,
        feedbackRequest
      ).toPromise();

      if (response) {
        this.student = response; 
        
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Feedback submitted successfully!';
        document.querySelector('.feedback-form')?.prepend(successMessage);
        
        
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      }
      
      this.submitting = false;
    } catch (err: any) {
      this.error = 'Failed to submit feedback. Please try again.';
      this.submitting = false;
      
      
      setTimeout(() => {
        document.querySelector('.error-message')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  shouldShowStar(index: number, type: 'rating' | 'hover'): boolean {
    const value = type === 'hover' ? this.hoverRating : this.rating;
    return index <= value;
  }
}