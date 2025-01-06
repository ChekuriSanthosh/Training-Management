import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Feedback {
  feedbackId: number;
  rating: number;
  feedbackMessage: string;
}

interface Student {
  studentId: number;
  studentName: string;
  studentEmail: string;
  feedback: Feedback | null;
  trainingRoom: string;
}

@Component({
  selector: 'app-trainer-view-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trainer-viewfeedback.component.html',
  styleUrl: './trainer-viewfeedback.component.css'
})
export class TrainerViewFeedbackComponent implements OnInit {
  students: Student[] = [];
  loading: boolean = true;
  error: string | null = null;
  noTrainingRoom: boolean = false;
  resetInProgress: boolean = false;
  
  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    this.fetchFeedbacks();
  }

  async fetchFeedbacks() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token){
        this.router.navigate(['/login']);
      }

      const email = await this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' }).toPromise();
      
      
      const trainerId = await this.http.get<number>(`http://localhost:8888/trainer/getTrainerByEmail/${email}`).toPromise();
      
      const students = await this.http.get<Student[]>(`http://localhost:8888/trainer/allstudents/${trainerId}`).toPromise();
      
      if (!students || students.length === 0 || !students[0].trainingRoom) {
        this.noTrainingRoom = true;
        this.loading = false;
        return;
      }

      this.students = students;
      this.loading = false;
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  getFeedbackStats() {
    const studentsWithFeedback = this.students.filter(s => s.feedback !== null);
    const totalRating = studentsWithFeedback.reduce((sum, s) => sum + (s.feedback?.rating || 0), 0);
    
    return {
      total: this.students.length,
      submitted: studentsWithFeedback.length,
      averageRating: studentsWithFeedback.length ? 
        (totalRating / studentsWithFeedback.length).toFixed(1) : 0
    };
  }

  getAnonymousFeedbacks(): string[] {
    return this.students
      .filter(s => s.feedback !== null)
      .map(s => s.feedback?.feedbackMessage || '')
      .sort(() => Math.random() - 0.5); 
  }

  async resetFeedbacks() {
    if (!this.students.length || !this.students[0].trainingRoom) return;
    
    try {
      this.resetInProgress = true;
      await this.http.put(
        `http://localhost:8888/trainer/makeFeedbackNull/${this.students[0].trainingRoom}`,
        null
      ).toPromise();

      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'All feedbacks have been reset successfully!';
      document.querySelector('.feedback-container')?.prepend(successMessage);
      
    
      await this.fetchFeedbacks();
      
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    } catch (err) {
      this.error = 'Failed to reset feedbacks';
    } finally {
      this.resetInProgress = false;
    }
  }
}