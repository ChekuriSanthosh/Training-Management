import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Trainer {
  trainerId: number;
  trainerName: string;
  trainingRoom: string;
  timeTablePDF: string | null;
  skills: string[] | null;
  trainerEmail: string | null;
  notification: boolean;
}

@Component({
  selector: 'app-uploadtrainerpdf',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uploadtrainerpdf.component.html',
  styleUrl: './uploadtrainerpdf.component.css'
})
export class UploadtrainerpdfComponent implements OnInit {
  trainers: Trainer[] = [];
  selectedTrainer: Trainer | null = null;
  uploadError: string | null = null;
  pdfPreviewUrl: SafeResourceUrl | null = null;
  isPdfPreviewVisible: boolean = false;
  uploadProgress: number = 0;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  isUploading = false;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchTrainers();
  }

  fetchTrainers(): void {
    this.http.get<Trainer[]>('http://localhost:8888/maintainer/trainers')
      .subscribe({
        next: (data) => {
          this.trainers = data;
        },
        error: (error) => {
          console.error('Error fetching trainers', error);
          this.showNotification('Failed to fetch trainers', 'error');
        }
      });
  }

  selectTrainerForUpload(trainer: Trainer): void {
    this.selectedTrainer = trainer;
    this.uploadError = null;
    this.uploadProgress = 0;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    
    if (file && this.selectedTrainer) {
      this.isUploading = true;
      this.uploadProgress = 0;
      const formData = new FormData();
      formData.append('file', file);

      this.http.post(
        `http://localhost:8888/maintainer/saveTimeTablePdf/${this.selectedTrainer.trainerId}`,
        formData,
        {
          reportProgress: true,
          observe: 'events'
        }
      ).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.showNotification('PDF uploaded successfully!', 'success');
            this.fetchTrainers();
            this.selectedTrainer = null;
            this.isUploading = false;
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.showNotification('Failed to upload PDF. Please try again.', 'error');
          this.isUploading = false;
        }
      });
    }
  }

  extractPDFFileName(fullPath: string | null): string {
    if (!fullPath) return 'No PDF';
    const pathParts = fullPath.split('\\');
    return pathParts[pathParts.length - 1];
  }

  viewPdf(trainerId: number): void {
    const previewUrl = `http://localhost:8100/maintainer/timetable/${trainerId}/preview`;
    window.open(previewUrl, '_blank');
  }

  closePdfPreview(): void {
    this.pdfPreviewUrl = null;
    this.isPdfPreviewVisible = false;
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}