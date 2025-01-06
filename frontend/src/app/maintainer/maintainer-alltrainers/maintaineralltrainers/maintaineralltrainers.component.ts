

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Trainer {
  trainerId: number;
  trainingRoom: string;
  skills: string[];
  trainerEmail: string;
  trainerName: string;
  averageRating?: number;
}

interface Feedback {
  date: string;
  trainerId: number;
  feedbackMessage: string;
  feedbackId: number;
  rating: number;
}

@Component({
  selector: 'app-maintaineralltrainers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintaineralltrainers.component.html',
  styleUrl: './maintaineralltrainers.component.css'
})
export class MaintaineralltrainersComponent implements OnInit {
  trainers: Trainer[] = [];
  feedbackMap: Map<number, Feedback[]> = new Map();
  selectedTrainer: Trainer | null = null;
  showFeedbackModal = false;
  sortField: 'date' | 'rating' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTrainers();
  }

  fetchTrainers() {
    this.http.get<Trainer[]>('http://localhost:8888/maintainer/trainers')
      .subscribe({
        next: (data) => {
          this.trainers = data;
          this.trainers.forEach(trainer => {
            this.fetchTrainerFeedback(trainer.trainerId);
          });
        },
        error: (error) => {
          console.error('Error fetching trainers', error);
        }
      });
  }

  fetchTrainerFeedback(trainerId: number) {
    this.http.get<Feedback[]>(`http://localhost:8888/maintainer/getallFeedbacksbyTrainer/${trainerId}`)
      .subscribe({
        next: (feedbacks) => {
          this.feedbackMap.set(trainerId, feedbacks);
          this.calculateAverageRating(trainerId);
        },
        error: (error) => {
          console.error(`Error fetching feedback for trainer ${trainerId}`, error);
        }
      });
  }

  calculateAverageRating(trainerId: number) {
    const feedbacks = this.feedbackMap.get(trainerId) || [];
    if (feedbacks.length > 0) {
      const average = feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length;
      const trainer = this.trainers.find(t => t.trainerId === trainerId);
      if (trainer) {
        trainer.averageRating = Number(average.toFixed(1));
      }
    }
  }

  openFeedbackModal(trainer: Trainer) {
    this.selectedTrainer = trainer;
    this.showFeedbackModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.selectedTrainer = null;
    document.body.style.overflow = 'auto';
  }

  getSortedFeedback(): Feedback[] {
    const feedbacks = this.feedbackMap.get(this.selectedTrainer?.trainerId || 0) || [];
    return [...feedbacks].sort((a, b) => {
      if (this.sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return this.sortDirection === 'asc' ? 
          a.rating - b.rating : 
          b.rating - a.rating;
      }
    });
  }

  toggleSort(field: 'date' | 'rating') {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
  }

  getStarArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}