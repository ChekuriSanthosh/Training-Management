import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

interface Trainer {
  trainerId: number;
  trainerName: string;
  notification: boolean;
}

@Component({
  selector: 'app-trainer-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trainer-navbar.component.html',
  styleUrl: './trainer-navbar.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class TrainerNavbarComponent implements OnInit {
  trainer: Trainer | null = null;
  isSidebarOpen: boolean = false;
  dropdownOpen: boolean = false;
  showNotificationMessage: boolean = false;
  
  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchTrainerDetails();
  }

  async fetchTrainerDetails() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token){
        this.router.navigate(['/login'])
      }

      const email = await this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' }).toPromise();
      const trainerId = await this.http.get<number>(`http://localhost:8888/trainer/getTrainerByEmail/${email}`).toPromise();
      console.log(trainerId);
      
      const trainer = await this.http.get<Trainer>(`http://localhost:8888/trainer/${trainerId}`).toPromise();
      
      if (trainer) {
        this.trainer = trainer;
      }
    } catch (err) {
      console.error('Failed to fetch trainer details:', err);
    }
  }

  async handleNotificationClick() {
    if (this.trainer?.notification) {
      this.showNotificationMessage = true;
      
      
      setTimeout(() => {
        this.showNotificationMessage = false;
      }, 3000);

      try {
        
        const response = await this.http.put<Trainer>(
          `http://localhost:8888/trainer/DisableNotification/${this.trainer.trainerId}`,
          null
        ).toPromise();

        if (response) {
          this.trainer = response;
        }
      } catch (err) {
        console.error('Failed to disable notification:', err);
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  Logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('ust.auth');
    this.router.navigate([""]);
  }
}