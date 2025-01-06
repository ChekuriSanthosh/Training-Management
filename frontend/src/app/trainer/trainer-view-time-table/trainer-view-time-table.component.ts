import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SafePipe } from '../../pipes/safe.pipe';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';

interface Trainer {
  trainerId: number;
  trainerName: string;
  trainerEmail: string;
  trainingRoom: string;
  timeTablePDF: string | null;
}

@Component({
  selector: 'app-trainer-view-timetable',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './trainer-view-time-table.component.html',
  styleUrl: './trainer-view-time-table.component.css'
})
export class TrainerViewTimeTableComponent implements OnInit, OnDestroy {
  trainer: Trainer | null = null;
  loading: boolean = true;
  error: string | null = null;
  successMessage: string | null = null;
  previewUrl: SafeResourceUrl | null = null;
  isPreviewVisible: boolean = false;
  cachedPreviewUrl: SafeResourceUrl | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.fetchTrainerDetails();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async fetchTrainerDetails() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }

      const email = await this.http.get<string>(
        `http://localhost:8888/auth/jwtToken/${token}`, 
        { responseType: 'text' as 'json' }
      ).toPromise();
      
      const trainerId = await this.http.get<number>(
        `http://localhost:8888/trainer/getTrainerByEmail/${email}`
      ).toPromise();
      
      const trainer = await this.http.get<Trainer>(
        `http://localhost:8888/trainer/${trainerId}`
      ).toPromise();
      
      if (!trainer) throw new Error('Trainer not found');
      
      this.trainer = trainer;
      this.loading = false;
    } catch (err: any) {
      this.error = err.message;
      this.loading = false;
    }
  }

  getFileName(): string {
    if (!this.trainer?.timeTablePDF) return '';
    return this.trainer.timeTablePDF.split('\\').pop() || '';
  }

  async downloadPdf() {
    if (!this.trainer?.trainerId) return;

    try {
      this.loading = true;
      const response = await this.http.get(
        `http://localhost:8888/trainer/timetable/${this.trainer.trainerId}/download`,
        {
          observe: 'response',
          responseType: 'blob'
        }
      ).toPromise();

      if (response && response.body) {
        const fileName = this.getFileName() || 'timetable.pdf';
        saveAs(response.body, fileName);
        this.showSuccessMessage('Timetable downloaded successfully!');
      }
    } catch (error) {
      console.error('Download error:', error);
      this.error = 'Failed to download timetable. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  getPdfUrl(): string {
    if (!this.trainer?.trainerId) return '';
    return `http://localhost:8200/trainer/timetable/${this.trainer.trainerId}/download`;
  }

  getDownloadName(): string {
    return this.getFileName() || 'timetable.pdf';
  }

  showPreview() {
    if (!this.trainer?.trainerId) {
      this.previewUrl = null;
      return;
    }
    this.isPreviewVisible = true;
    if (!this.cachedPreviewUrl) {
      this.cachedPreviewUrl = this.getPreviewUrl();
    }
    this.previewUrl = this.cachedPreviewUrl;
  }

  hidePreview() {
    this.isPreviewVisible = false;
    this.previewUrl = null;
  }

  private getPreviewUrl(): SafeResourceUrl {
    if (!this.trainer?.trainerId) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl('');
    }
    const url = `http://localhost:8200/trainer/timetable/${this.trainer.trainerId}/preview`;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = null, 3000);
  }
}

