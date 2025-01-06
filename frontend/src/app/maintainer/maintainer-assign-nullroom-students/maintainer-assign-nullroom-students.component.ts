import { CommonModule } from '@angular/common';
import { HttpClient} from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Student {
  studentId: number;
  studentName: string;
  studentEmail: string;
  trainingRoom: string | null;
  totalduration: number;
  marks: any[];
  attendences: any[];
  feedback: any;
}

@Component({
  selector: 'app-maintainer-assign-nullroom-students',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './maintainer-assign-nullroom-students.component.html',
  styleUrl: './maintainer-assign-nullroom-students.component.css'
})
export class MaintainerAssignNullroomStudentsComponent implements OnInit {
  students: Student[] = [];
  selectedStudents: Set<number> = new Set();
  trainingRoom: string = '';
  duration: number | null = null;
  loading = true;
  error: string | null = null;
  success: string | null = null;
  availableRooms: string[] = [];
  searchTerm: string = '';

  private http = inject(HttpClient);

  ngOnInit() {
    this.fetchRooms();
    this.fetchStudents();
  }

  private async fetchRooms() {
    try {
      const roomCount = await this.http.get<number>('http://localhost:8888/maintainer/GetTrainingRoomSize').toPromise() ?? 0;
      this.availableRooms = Array.from(
        { length: roomCount }, 
        (_, i) => `Room${i + 1}`
      );
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
  }

  private async fetchStudents() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token) throw new Error('No auth token found');

      const email = await this.http.get(`http://localhost:8888/auth/jwtToken/${token}`, 
        { responseType: 'text' }).toPromise();

      const students = await this.http.get<Student[]>(`http://localhost:8888/maintainer/getAllStudents`).toPromise();
      
      this.students = students?.filter((s: Student) => !s.trainingRoom) || [];
      this.loading = false;
    } catch (error) {
      this.error = 'Failed to fetch students';
      this.loading = false;
    }
  }

  toggleStudent(studentId: number) {
    if (this.selectedStudents.has(studentId)) {
      this.selectedStudents.delete(studentId);
    } else {
      this.selectedStudents.add(studentId);
    }
  }

  async assignRooms() {
    if (!this.trainingRoom || !this.duration) {
      this.error = 'Please enter both training room and duration';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = null;

    try {
      for (const studentId of this.selectedStudents) {
        await this.http.put(
          `http://localhost:8888/maintainer/updateroomandDuration/${studentId}`,
          null,
          {
            params: {
              trainingRoom: this.trainingRoom,
              duration: this.duration.toString()
            }
          }
        ).toPromise();
      }

      this.success = 'Successfully assigned rooms to selected students';
      this.selectedStudents.clear();
      this.trainingRoom = '';
      this.duration = null;
      await this.fetchStudents();
    } catch (error) {
      this.error = 'Failed to assign rooms to some students';
    } finally {
      this.loading = false;
    }
  }

  toggleAllStudents() {
    if (this.selectedStudents.size === this.students.length) {
      this.selectedStudents.clear();
    } else {
      this.students.forEach(student => {
        this.selectedStudents.add(student.studentId);
      });
    }
  }

  get filteredStudents(): Student[] {
    return this.students.filter(student => 
      student.studentName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
