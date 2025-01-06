import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

interface Trainer {
  trainerId: number;
  trainerName: string;
  trainerEmail: string;
  trainingRoom: string | null;
  skills: string[] | null;
}

@Component({
  selector: 'app-admin-view-all-trainers',
  standalone: true,
  imports: [CommonModule, FormsModule,AdminNavbarComponent],
  templateUrl: './admin-view-all-trainers.component.html',
  styleUrls: ['./admin-view-all-trainers.component.css']
})
export class AdminViewAllTrainersComponent implements OnInit {
  trainers: Trainer[] = [];
  filteredTrainers: Trainer[] = [];

  searchQuery: string = '';

  constructor(private http: HttpClient,private router:Router) {}


  ngOnInit(): void {
    if(!sessionStorage.getItem('ust.auth')){
      this.router.navigate(['/home']);
    }
    this.loadTrainers();
  }

  loadTrainers(): void {
    
    this.http.get<Trainer[]>('http://localhost:8888/admin/trainers')
      .subscribe({
        next: (trainers) => {
          
          this.trainers = trainers.map(trainer => ({
            ...trainer,
            trainingRoom: trainer.trainingRoom || 'Not Assigned',
            skills: trainer.skills || []
          }));
          
          this.filteredTrainers = [...this.trainers];
        },
        error: (error) => {
          console.error('Error fetching trainers', error);
          this.trainers = [];
          this.filteredTrainers = [];
        }
      });
  }

  onSearch(): void {
    const lowerSearchQuery = this.searchQuery.toLowerCase();
    console.log(this.trainers);
    

    this.filteredTrainers = this.trainers.filter((trainer) => {
      return (
        trainer.trainerId.toString().includes(lowerSearchQuery) ||
        trainer.trainerName.toLowerCase().includes(lowerSearchQuery) ||
        (trainer.trainingRoom && trainer.trainingRoom.toLowerCase().includes(lowerSearchQuery)) ||
        (trainer.skills && trainer.skills.some(skill => skill.toLowerCase().includes(lowerSearchQuery)))
      );
    });
  }

  
  clearSearch(): void {
    this.searchQuery = '';
    this.filteredTrainers = [...this.trainers]; 
  }
}
