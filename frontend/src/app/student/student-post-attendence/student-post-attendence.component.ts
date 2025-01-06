import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Attendance {
  date: string;
  trainingRoom: string;
  attendenceStatus: string | null;
  attendenceId: number;
}

interface Student {
  studentId: number;
  studentName: string;
  studentEmail: string;
  trainingRoom: string;
  totalduration: number;
  attendences: Attendance[];
}

@Component({
  selector: 'app-student-post-attendence',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-post-attendence.component.html',
  styleUrls: ['./student-post-attendence.component.css']
})
export class StudentPostAttendenceComponent implements OnInit, OnDestroy {
  loading = true;
  error: string | null = null;
  success: string | null = null;
  canMarkAttendance = false;
  attendanceMessage = '';
  student: Student | null = null;
  currentTime = new Date();
  timeInterval: any;
  locationWatchId: number | null = null;
  
  isLocationValid = false;
  isTimeValid = false;
  isLocationPermissionGranted = false;

  
  ustLocation = {
    latitude: 8.536747,
    longitude: 76.883389,
    name: 'UST Trivandrum'
  };

  currentLocation = {
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    distance: 0,
    address: 'Fetching location...'
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.startClock();
    this.startLocationTracking();
    const token = sessionStorage.getItem('ust.auth');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.checkAndFetchDetails();
    // this.checkTodayAttendance();
  }

  ngOnDestroy() {
    if (this.timeInterval) clearInterval(this.timeInterval);
    if (this.locationWatchId !== null) {
      navigator.geolocation.clearWatch(this.locationWatchId);
    }
  }

  private startClock() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date();
      this.isTimeValid = this.isWithinTimeWindow();
      this.updateAttendanceStatus();
    }, 1000);
  }

  private startLocationTracking() {
    if ('geolocation' in navigator) {
      this.locationWatchId = navigator.geolocation.watchPosition(
        async (position) => {
          this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            distance: this.calculateDistance(
              position.coords.latitude,
              position.coords.longitude,
              this.ustLocation.latitude,
              this.ustLocation.longitude
            ),
            address: await this.fetchAddress(position.coords.latitude, position.coords.longitude)
          };
          this.isLocationValid = this.currentLocation.distance <= 1;
          this.isLocationPermissionGranted = true;
          this.checkTodayAttendance();
          this.updateAttendanceStatus();
        },
        (error) => {
          this.error = 'Unable to get location: ' + error.message;
          this.isLocationPermissionGranted = false;
        },
        {
          enableHighAccuracy: true,
          timeout: 50000,
          maximumAge: 0
        }
      );
    } else {
      this.error = 'Geolocation is not supported by this browser';
    }
  }

  private async fetchAddress(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      return 'Address not available';
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; 
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  private isWithinTimeWindow(): boolean {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours === 10 || (hours === 11 && minutes === 0);
  }

  private updateAttendanceStatus() {
    this.canMarkAttendance = this.isTimeValid && this.isLocationValid;

    if (!this.isLocationPermissionGranted) {
      this.attendanceMessage = 'Please enable location services';
    } else if (!this.isTimeValid) {
      this.attendanceMessage = 'Attendance can only be marked between 9:00 AM and 10:00 AM';
    } else if (!this.isLocationValid) {
      this.attendanceMessage = 'You must be within 1km of the UST Trivandrum office';
    }
  }

  private async checkAndFetchDetails() {
    try {
      const token = sessionStorage.getItem('ust.auth');
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }
      const email = await this.http.get<string>(`http://localhost:8888/auth/jwtToken/${token}`, { responseType: 'text' as 'json' }).toPromise();

      const studentId = await this.http.get<number>(`http://localhost:8888/student/getStudentbymail/${email}`).toPromise();
      
      const studentDetails = await this.http.get<Student>(`http://localhost:8888/student/${studentId}`).toPromise();

      if (studentDetails) {
        this.student = studentDetails;
        this.loading = false;
        this.checkTodayAttendance();
      }
    } catch (err) {
      this.error = 'Failed to fetch student details';
      this.loading = false;
    }
  }

  private checkTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = this.student?.attendences.find(a => a.date === today);
    
    if (todayAttendance?.attendenceStatus) {
      console.log("commmmmmm");
      
      this.attendanceMessage = 'Attendance already marked for today';
      this.canMarkAttendance = false;
    }else{
      this.canMarkAttendance=true;
    }

    console.log(this.canMarkAttendance);
    
  }

  async markAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = this.student?.attendences.find(a => a.date === today);
    // console.log(this.canMarkAttendance);
    
    
    if (todayAttendance?.attendenceStatus) {
      this.attendanceMessage = 'Attendance already marked for today';
      this.canMarkAttendance = false;
      console.log("coming");
      
      return;
    }

    try {
      if (!this.student) return;

      const response = await this.http.post<Student>(
        `http://localhost:8888/student/SaveAttendence/${this.student.studentId}`,
        null,
        {
          params: {
            Trainingroom: this.student.trainingRoom,
            date: today,
            attendanceStatus: 'P'
          }
        }
      ).toPromise();

      if (response) {
        this.success = 'Attendance marked successfully!';
        this.canMarkAttendance = false;
        this.student = response;
        
        setTimeout(() => {
          this.success = null;
        }, 3000);
      }
    } catch (err) {
      this.error = 'Failed to mark attendance. Please try again.';
      
      setTimeout(() => {
        this.error = null;
      }, 3000);
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getRequirementStatus(requirement: boolean): string {
    return requirement ? 'requirement-met' : 'requirement-not-met';
  }

  getGoogleMapsLink(): string {
    return `https://www.google.com/maps?q=${this.currentLocation.latitude},${this.currentLocation.longitude}`;
  }

  getUSTMapsLink(): string {
    return `https://www.google.com/maps?q=${this.ustLocation.latitude},${this.ustLocation.longitude}`;
  }
}












