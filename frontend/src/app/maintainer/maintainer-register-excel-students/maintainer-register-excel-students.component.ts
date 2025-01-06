import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

interface Student {
  studentName: string;
  studentEmail: string;
  isSelected: boolean;
}

interface RegistrationStatus {
  student: Student;
  status: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-maintainer-register-excel-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintainer-register-excel-students.component.html',
  styleUrl: './maintainer-register-excel-students.component.css'
})
export class MaintainerRegisterExcelStudentsComponent {
  isDragging = false;
  isUploading = false;
  registrationStatus: RegistrationStatus[] = [];
  students: Student[] = [];
  allSelected = false;

  constructor(private http: HttpClient) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) this.handleFile(files[0]);
  }

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      this.students = [];
      
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as string[];
        if (row[0] && row[1]) {
          this.students.push({
            studentName: row[0],
            studentEmail: row[1],
            isSelected: false
          });
        }
      }
    };
    reader.readAsBinaryString(file);
  }

  toggleAll(): void {
    this.allSelected = !this.allSelected;
    this.students.forEach(student => student.isSelected = this.allSelected);
  }

  hasSelectedStudents(): boolean {
    return this.students.some(student => student.isSelected);
  }

  async registerSelectedStudents(): Promise<void> {
    this.isUploading = true;
    this.registrationStatus = [];

    const selectedStudents = this.students.filter(student => student.isSelected);
    
    for (const student of selectedStudents) {
      await this.registerStudent(student);
    }

    this.isUploading = false;
  }

  private async registerStudent(student: Student): Promise<void> {
    try {
      await this.http.post('http://localhost:8888/maintainer/registerStudents', {
        studentName: student.studentName,
        studentEmail: student.studentEmail
      }).toPromise();

      await this.http.post('http://localhost:8888/auth/register', {
        username: student.studentEmail,
        password: 'ust@123',
        role: 'STUDENT'
      }).toPromise();

      this.registrationStatus.push({
        student,
        status: 'success',
        message: 'Successfully registered'
      });
    } catch (error) {
      this.registrationStatus.push({
        student,
        status: 'error',
        message: 'Student Already Exists or Failed to register'
      });
    }
  }

  clearResults(): void {
    this.registrationStatus = [];
  }
}