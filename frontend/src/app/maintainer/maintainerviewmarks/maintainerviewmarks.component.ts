import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

interface MarksEntry {
  marks: number;
  weekName: number;
  marksId?: number;
}

interface Student {
  studentId: number;
  studentName: string;
  studentEmail: string;
  trainingRoom: string;
  totalduration: number;
  marks: MarksEntry[];
  averageScore?: number;
}

interface RankedStudent extends Student {
  rank: number;
  averageScore: number;
}

@Component({
  selector: 'app-maintainerviewmarks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintainerviewmarks.component.html',
  styleUrl: './maintainerviewmarks.component.css'
})
export class MaintainerviewmarksComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  availableRooms: string[] = [];
  selectedRoom: string = '';
  trainingDuration: number = 6;
  rankedStudents$: BehaviorSubject<RankedStudent[]>;
  private subscription: Subscription | null = null;
  private averageCache = new Map<number, number>();
  
  private baseUrl = 'http://localhost:8888/maintainer';
  private maintainerBaseUrl = 'http://localhost:8888/maintainer/GetTrainingRoomSize';

  constructor(private http: HttpClient) {
    this.rankedStudents$ = new BehaviorSubject<RankedStudent[]>([]);
  }

  ngOnInit(): void {
    this.fetchTrainingRoomSize();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.rankedStudents$.complete();
    this.averageCache.clear();
  }

  fetchTrainingRoomSize(): void {
    this.subscription = this.http.get<number>(this.maintainerBaseUrl).subscribe({
      next: (roomSize) => {
        this.availableRooms = Array.from({length: roomSize}, (_, i) => `Room${i + 1}`);
        if (this.availableRooms.length > 0) {
          this.selectedRoom = this.availableRooms[0];
          this.fetchStudentsByRoom(this.selectedRoom);
        }
      },
      error: (err) => {
        console.error('Error fetching training room size:', err);
        this.availableRooms = ['Room1', 'Room2', 'Room3', 'Room4', 'Room5', 'Room6', 'Room7', 'Room8'];
        this.selectedRoom = this.availableRooms[0];
        this.fetchStudentsByRoom(this.selectedRoom);
      }
    });
  }

  fetchStudentsByRoom(room: string): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.http.get<Student[]>(`${this.baseUrl}/getStudentsByRoom/${room}`)
      .pipe(
        map(students => this.processStudents(students))
      )
      .subscribe({
        next: (rankedStudents) => {
          this.students = rankedStudents;
          if (rankedStudents.length > 0) {
            this.trainingDuration = Math.max(...rankedStudents.map(student => student.totalduration || 6));
          }
          this.rankedStudents$.next(this.getRankedStudents());
        },
        error: (err) => {
          console.error('Error fetching students:', err);
          this.students = [];
          this.trainingDuration = 6;
          this.rankedStudents$.next([]);
        }
      });
  }

  onRoomChange(event: Event): void {
    this.averageCache.clear();
    const room = (event.target as HTMLSelectElement).value;
    this.selectedRoom = room;
    this.fetchStudentsByRoom(room);
  }

  getMarksForWeek(student: Student, week: number): string {
    if (student && student.marks) {
      const weekMarks = student.marks.find(m => m.weekName === week);
      return weekMarks ? weekMarks.marks.toString() : ' - ';
    }
    return 'No marks entered';
  }

  getWeeks(): number[] {
    return Array.from({length: this.trainingDuration}, (_, i) => i + 1);
  }

  calculateStudentAverage(student: Student): number {
    if (this.averageCache.has(student.studentId)) {
      return this.averageCache.get(student.studentId)!;
    }

    if (!student.marks || student.marks.length === 0) return 0;
    const validMarks = student.marks.filter(mark => mark.marks !== null && mark.marks !== undefined);
    if (validMarks.length === 0) return 0;
    
    const average = Math.round(
      validMarks.reduce((acc, mark) => acc + mark.marks, 0) / validMarks.length
    );
    
    this.averageCache.set(student.studentId, average);
    return average;
  }

  calculateClassAverage(): number {
    if (this.students.length === 0) return 0;
    const averages = this.students.map(student => this.calculateStudentAverage(student));
    return Math.round(averages.reduce((acc, val) => acc + val, 0) / averages.length);
  }

  getHighestScore(): number {
    if (this.students.length === 0) return 0;
    return Math.max(...this.students.map(student => this.calculateStudentAverage(student)));
  }

  getLowestScore(): number {
    if (this.students.length === 0) return 0;
    return Math.min(...this.students.map(student => this.calculateStudentAverage(student)));
  }

  getAverageClass(input: Student | { averageScore: number }): string {
    let average: number;
    
    if ('averageScore' in input && typeof input.averageScore === 'number') {
      average = input.averageScore;
    } else if ('marks' in input) {
      average = this.calculateStudentAverage(input);
    } else {
      average = 0;
    }

    if (average >= 90) return 'brilliant-score';
    if (average >= 80) return 'good-score';
    if (average >= 70) return 'average-score';
    return 'poor-score';
  }

  getRankedStudents(): RankedStudent[] {
    const studentsWithScores = this.students.map(student => ({
      ...student,
      averageScore: this.calculateStudentAverage(student),
      rank: 0
    }));

    studentsWithScores.sort((a, b) => b.averageScore - a.averageScore);

    let currentRank = 1;
    let previousScore: number | null = null;

    return studentsWithScores.map((student, index) => {
      if (previousScore !== student.averageScore) {
        currentRank = index + 1;
      }
      previousScore = student.averageScore;
      return { ...student, rank: currentRank };
    });
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-other';
  }


  trackByStudentId(index: number, student: RankedStudent): number {
    return student.studentId;
  }

  trackByWeek(index: number, week: number): number {
    return week;
  }

  trackByRoom(index: number, room: string): string {
    return room;
  }

  private processStudents(students: Student[]): Student[] {
    return students.map(student => ({
      ...student,
      marks: student.marks || []
    }));
  }
}











