import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Attendance {
  date: string;
  attendenceStatus: string | null;
  trainingRoom: string;
  attendenceId: number;
}

interface Student {
  studentId: number;
  studentName: string;
  attendences: Attendance[];
}

interface WeekData {
  startDate: string;
  endDate: string;
  dates: string[];
}

@Component({
  selector: 'app-maintainerviewattendence',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintainerviewattendence.component.html',
  styleUrl: './maintainerviewattendence.component.css'
})
export class MaintainerviewattendenceComponent implements OnInit {
  isSidebarOpen: boolean = false;
  trainingRooms: string[] = [];
  selectedRoom: string = '';
  students: Student[] = [];
  
  // Week-related properties
  allUniqueDates: string[] = [];
  currentWeekIndex: number = 0;
  weeksData: WeekData[] = [];
  
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTrainingRooms();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  fetchTrainingRooms() {
    this.http.get<number>('http://localhost:8888/maintainer/GetTrainingRoomSize')
      .subscribe({
        next: (roomCount) => {
          this.trainingRooms = Array.from({length: roomCount}, (_, i) => `Room${i + 1}`);
        },
        error: (err) => {
          console.error('Error fetching training rooms', err);
        }
      });
  }

  onRoomSelect() {
    if (this.selectedRoom) {
      this.isLoading = true;
      this.http.get<Student[]>(`http://localhost:8888/maintainer/getStudentsByRoom/${this.selectedRoom}`)
        .subscribe({
          next: (students) => {
            this.students = students;
            this.processAttendanceDates();
            this.isLoading = false;
          },
          error: (err) => {
            console.error(`Error fetching students for ${this.selectedRoom}`, err);
            this.students = [];
            this.weeksData = [];
            this.isLoading = false;
          }
        });
    }
  }

  processAttendanceDates() {
    
    this.allUniqueDates = [...new Set(
      this.students.flatMap(student => 
        student.attendences.map(attendance => attendance.date)
      )
    )].sort();

    
    this.allUniqueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    
    this.weeksData = this.groupDatesIntoWeeks(this.allUniqueDates);
    
    
    this.currentWeekIndex = 0;
  }

  groupDatesIntoWeeks(dates: string[]): WeekData[] {
    const weeks: WeekData[] = [];
    
    if (dates.length === 0) return weeks;

    let currentWeekStart: Date | null = null;
    let currentWeekDates: string[] = [];

    dates.forEach((dateStr, index) => {
      const date = new Date(dateStr);
      
      
      if (!currentWeekStart || this.isStartOfNewWeek(currentWeekStart, date)) {
        
        if (currentWeekDates.length > 0) {
          weeks.push({
            startDate: new Date(currentWeekDates[0]).toISOString().split('T')[0],
            endDate: new Date(currentWeekDates[currentWeekDates.length - 1]).toISOString().split('T')[0],
            dates: currentWeekDates
          });
        }

        
        currentWeekStart = date;
        currentWeekDates = [dateStr];
      } else {
        currentWeekDates.push(dateStr);
      }

      
      if (index === dates.length - 1) {
        weeks.push({
          startDate: new Date(currentWeekDates[0]).toISOString().split('T')[0],
          endDate: new Date(currentWeekDates[currentWeekDates.length - 1]).toISOString().split('T')[0],
          dates: currentWeekDates
        });
      }
    });

    return weeks;
  }

  isStartOfNewWeek(prevDate: Date, currentDate: Date): boolean {
    
    const dayDifference = (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);
    return dayDifference >= 7;
  }

  getCurrentWeekDates(): string[] {
    return this.weeksData.length > 0 ? this.weeksData[this.currentWeekIndex].dates : [];
  }

  getAttendanceStatus(studentId: number, date: string): string {
    const student = this.students.find(s => s.studentId === studentId);
    if (student) {
      const attendance = student.attendences.find(a => a.date === date);
      return attendance?.attendenceStatus || '-';
    }
    return '-';
  }

  goToPreviousWeek() {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
    }
  }

  goToNextWeek() {
    if (this.currentWeekIndex < this.weeksData.length - 1) {
      this.currentWeekIndex++;
    }
  }

  getCurrentWeekLabel(): string {
    if (this.weeksData.length > 0) {
      const currentWeek = this.weeksData[this.currentWeekIndex];
      return `Week ${this.currentWeekIndex + 1} (${currentWeek.startDate} to ${currentWeek.endDate})`;
    }
    return 'No weeks available';
  }
}