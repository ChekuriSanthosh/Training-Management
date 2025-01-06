import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Trainer {
  trainerId: number;
  trainerEmail: string;
  trainerName: string;
  trainingRoom: string | null;
  skills: string[] | null;
}



interface TrainerUpdateDto {
  trainerName: string;
  skills: string[];
}

@Component({
  selector: 'app-trainer-view-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainer-viewdetails.component.html',
  styleUrl: './trainer-viewdetails.component.css'
})
export class TrainerViewDetailsComponent implements OnInit {
  trainer: Trainer | null = null;
  loading: boolean = true;
  error: string | null = null;
  editMode: boolean = false;
  
  // Edit form data
  editName: string = '';
  editSkills: string[] = [];
  newSkill: string = '';
  
  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    this.fetchTrainerDetails();
  }

  async fetchTrainerDetails() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token){
        this.router.navigate(['/login']);
      }

      
      const email = await this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' })
        .toPromise()
        .catch(() => { throw new Error('Failed to validate token'); });
      
      if (!email) throw new Error('Failed to get email from token');

      
      const trainerId = await this.http.get<number>(`http://localhost:8888/trainer/getTrainerByEmail/${email}`)
        .toPromise()
        .catch(() => { throw new Error('Trainer service is not available. Please try again later.'); });
      
      
      const trainerDetails = await this.http.get<Trainer>(`http://localhost:8888/trainer/${trainerId}`)
        .toPromise()
        .catch(() => { throw new Error('Failed to fetch trainer details'); });
      
      if (!trainerDetails) throw new Error('Trainer not found');
      
      this.trainer = trainerDetails;
      this.loading = false;
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  startEdit() {
    if (!this.trainer) return;
    
    this.editMode = true;
    this.editName = this.trainer.trainerName;
    this.editSkills = this.trainer.skills || [];
  }

  cancelEdit() {
    this.editMode = false;
    this.newSkill = '';
  }

  addSkill() {
    if (this.newSkill.trim()) {
      this.editSkills.push(this.newSkill.trim());
      this.newSkill = '';
    }
  }

  removeSkill(index: number) {
    this.editSkills.splice(index, 1);
  }

  async saveChanges() {
    if (!this.trainer) return;
    
    try {
      this.error = null;
      const updateDto: TrainerUpdateDto = {
        trainerName: this.editName,
        skills: this.editSkills
      };

      const response = await this.http.put<Trainer>(
        `http://localhost:8888/trainer/update/${this.trainer.trainerId}`,
        updateDto
      ).toPromise();

      if (response) {
        this.trainer = response;
        this.editMode = false;
        this.editName = '';
        this.editSkills = [];
        this.newSkill = '';
        
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
          <span class="icon">✓</span>
          Details updated successfully!
        `;
        document.querySelector('.trainer-card')?.prepend(successMessage);
        
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
      }
    } catch (err: any) {
      this.error = 'Failed to update details. Please try again.';
      
      setTimeout(() => {
        document.querySelector('.error-message')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
}