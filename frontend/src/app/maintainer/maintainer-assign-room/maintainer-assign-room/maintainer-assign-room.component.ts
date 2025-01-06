
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface Trainer {
  trainerId: number;
  trainerName: string;
  trainerEmail: string;
  trainingRoom: string;
}

@Component({
  selector: 'app-maintainer-assign-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './maintainer-assign-room.component.html',
  styleUrl: './maintainer-assign-room.component.css'
})
export class MaintainerAssignRoomComponent implements OnInit {
  trainers: Trainer[] = [];
  availableRooms: string[] = [];
  updateForm: FormGroup;
  selectedTrainer: Trainer | null = null;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      trainer: ['', Validators.required],
      trainingRoom: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchTrainers();
    this.fetchAvailableRooms();
  }

  fetchTrainers() {
    this.http.get<Trainer[]>('http://localhost:8888/maintainer/trainers')
      .subscribe({
        next: (data) => {
          this.trainers = data;
        },
        error: (error) => {
          console.error('Error fetching trainers', error);
          this.showNotification('Failed to fetch trainers. Please try again.', 'error');
        }
      });
  }

  fetchAvailableRooms() {
    this.http.get<number>('http://localhost:8888/maintainer/GetTrainingRoomSize')
      .subscribe({
        next: (roomCount) => {
          this.availableRooms = Array.from(
            { length: roomCount },
            (_, i) => `Room${i + 1}`
          );
        },
        error: (error) => {
          console.error('Error fetching training room size', error);
          this.showNotification('Failed to fetch available rooms. Please try again.', 'error');
        }
      });
  }

  onTrainerSelect() {
    const selectedTrainerId = this.updateForm.get('trainer')?.value;
    this.selectedTrainer = this.trainers.find(t => t.trainerId === +selectedTrainerId) || null;
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  onSubmit() {
    if (this.updateForm.valid) {
      const trainerId = this.updateForm.get('trainer')?.value;
      const newRoom = this.updateForm.get('trainingRoom')?.value;

      this.http.put(
        `http://localhost:8888/maintainer/UpdateTrainerTrainingRoom/${trainerId}?trainingRoom=${newRoom}`,
        {}
      ).subscribe({
        next: () => {
          const trainerIndex = this.trainers.findIndex(t => t.trainerId === +trainerId);
          if (trainerIndex !== -1) {
            this.trainers[trainerIndex].trainingRoom = newRoom;
          }

          this.showNotification('Training room assigned successfully!', 'success');
          this.updateForm.reset();
          this.selectedTrainer = null;
        },
        error: (error) => {
          console.error('Error updating training room', error);
          this.showNotification('Failed to assign training room. Please try again.', 'error');
        }
      });
    }
  }

  unassignRoom(trainerId: number) {
    this.http.put(`http://localhost:8888/maintainer/UnAssignRoom/${trainerId}`, {})
      .subscribe({
        next: (response: any) => {
          const trainerIndex = this.trainers.findIndex(t => t.trainerId === trainerId);
          if (trainerIndex !== -1) {
            this.trainers[trainerIndex].trainingRoom = '';
          }

          this.showNotification('Training room unassigned successfully!', 'success');

          if (this.selectedTrainer?.trainerId === trainerId) {
            this.updateForm.reset();
            this.selectedTrainer = null;
          }
        },
        error: (error) => {
          console.error('Error unassigning room', error);
          this.showNotification('Failed to unassign training room. Please try again.', 'error');
        }
      });
  }
}


