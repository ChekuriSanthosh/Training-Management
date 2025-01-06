

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';

interface DashboardData {
  unassignedStudents: number;
  studentsPerRoom: { [key: string]: number };
  pendingRequests: number;
  trainerAllocations: { trainer: string; room: string; email: string }[];
}

@Component({
  selector: 'app-maintainer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintainer-dashboard.component.html',
  styleUrls: ['./maintainer-dashboard.component.css']
})
export class MaintainerDashboardComponent implements OnInit {
  @ViewChild('studentsChart') studentsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('attendanceChart') attendanceChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('marksChart') marksChart!: ElementRef<HTMLCanvasElement>;

  dashboardData: DashboardData = {
    unassignedStudents: 0,
    studentsPerRoom: {},
    pendingRequests: 0,
    trainerAllocations: []
  };

  selectedRoom: string = '';
  availableRooms: string[] = [];
  private studentsChartInstance: Chart | null = null;
  private attendanceChartInstance: Chart | null = null;
  private marksChartInstance: Chart | null = null;
  noAttendanceData:boolean=false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDashboardData();
  }

  studentsdata?:any[];

  async fetchDashboardData() {
    try {
      
      const students = await this.http.get<any[]>('http://localhost:8888/maintainer/getAllStudents').toPromise();
      this.dashboardData.unassignedStudents = students?.filter(s => !s.trainingRoom).length || 0;

      
      const roomCount = await this.http.get<number>('http://localhost:8888/maintainer/GetTrainingRoomSize').toPromise() || 0;
      for (let i = 1; i <= roomCount; i++) {
        const roomStudents = await this.http.get<any[]>(`http://localhost:8888/maintainer/getStudentsByRoom/Room${i}`).toPromise();
        this.studentsdata=roomStudents;
        this.dashboardData.studentsPerRoom[`Room${i}`] = roomStudents?.length || 0;
      }

      
      const requests = await this.http.get<any[]>('http://localhost:8888/maintainer/request').toPromise();
      this.dashboardData.pendingRequests = requests?.filter(r => r.status === 'PENDING').length || 0;

      
      const trainers = await this.http.get<any[]>('http://localhost:8888/maintainer/trainers').toPromise();
      this.dashboardData.trainerAllocations = trainers?.filter(t => t.trainingRoom !== null).map(t => ({
        trainer: t.trainerName,
        room: t.trainingRoom,
        email: t.trainerEmail,
      })) || [];

      this.availableRooms = Object.keys(this.dashboardData.studentsPerRoom);
      this.createCharts();
      await this.createMarksChart();

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }

  private createCharts() {
    this.createStudentsChart();
    if (this.selectedRoom) {
      this.onRoomChange();
    }
  }

  private createStudentsChart() {
    if (this.studentsChartInstance) {
      this.studentsChartInstance.destroy();
    }

    const ctx = this.studentsChart.nativeElement.getContext('2d');
    if (ctx) {
      this.studentsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(this.dashboardData.studentsPerRoom),
          datasets: [{
            label: 'Students per Room',
            data: Object.values(this.dashboardData.studentsPerRoom),
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  async onRoomChange() {
    this.noAttendanceData=false;
    if (!this.selectedRoom) {
      this.noAttendanceData = false;
      if (this.attendanceChartInstance) {
        this.attendanceChartInstance.destroy();
        this.attendanceChartInstance = null;
      }
      return;
    }
    
    try {
      const students = await this.http.get<any[]>(`http://localhost:8888/maintainer/getStudentsByRoom/${this.selectedRoom}`).toPromise();
      
      let presentCount = 0;
      let absentCount = 0;
      
      students?.forEach(student => {
        student.attendences.forEach((attendance: any) => {
          if (attendance.attendenceStatus === 'P') {
            presentCount++;
          } else if (attendance.attendenceStatus === 'A') {
            absentCount++;
          }
        });
      });

      
      if (presentCount === 0 && absentCount === 0) {
        this.noAttendanceData = true;
        if (this.attendanceChartInstance) {
          this.attendanceChartInstance.destroy();
          this.attendanceChartInstance = null;
        }
        return;
      }

        this.noAttendanceData = false;
        let total=presentCount+absentCount;
        this.updateAttendanceChart((presentCount/total)*100, (absentCount/total)*100);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      this.noAttendanceData = true;
      if (this.attendanceChartInstance) {
        this.attendanceChartInstance.destroy();
        this.attendanceChartInstance = null;
      }
    }




  }


  private updateAttendanceChart(present: number, absent: number) {
  
    
    if (this.attendanceChartInstance) {
      this.attendanceChartInstance.destroy();
    }
  
    
    const ctx = this.attendanceChart.nativeElement.getContext('2d');
    if (ctx) {
      
      this.attendanceChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Present', 'Absent'],
          datasets: [{
            data: [present, absent],
            backgroundColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(255, 99, 132, 0.8)'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    }
  }
  

  private async createMarksChart() {
    try {
      const roomAverages: { [key: string]: number } = {};
      
      for (const room of this.availableRooms) {
        const students = await this.http.get<any[]>(`http://localhost:8888/maintainer/getStudentsByRoom/${room}`).toPromise();
        
        let totalMarks = 0;
        let totalEntries = 0;
        
        students?.forEach(student => {
          student.marks?.forEach((mark: any) => {
            totalMarks += mark.marks;
            totalEntries++;
          });
        });
        
        roomAverages[room] = totalEntries > 0 ? Math.round(totalMarks / totalEntries) : 0;
      }

      if (this.marksChartInstance) {
        this.marksChartInstance.destroy();
      }

      const ctx = this.marksChart.nativeElement.getContext('2d');
      if (ctx) {
        this.marksChartInstance = new Chart(ctx, {
          type: 'bar',

          data: {
            labels: Object.keys(roomAverages),
            datasets: [{
              label: 'Class Average',
              
              data: Object.values(roomAverages),
              backgroundColor: 'rgba(54, 162, 235, 0.8)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error creating marks chart:', error);
    }
  }
}
