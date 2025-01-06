import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';



interface Request {
  status: string;
  requestId: number;
  skills: string[];
  managerName: string;
  accountType: string;
  adminMessage: string;
  managerId: number;
  requiredTrainees: number;
}

interface Manager {
  createdRequests: Request[];
  managerName: string;
  accountType: string;
  managerId: number;
  manageremail: string | null;
}

@Component({
  selector: 'app-admin-view-manager',
  standalone: true,
  imports: [CommonModule,RouterModule,AdminNavbarComponent],
  templateUrl: './admin-view-manager.component.html',
  styleUrl: './admin-view-manager.component.css'
})
export class AdminViewManagerComponent {
  managers: Manager[] = [];
  
  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
      if(!sessionStorage.getItem('ust.auth')){
        this.router.navigate(['/home']);
      }
    this.loadManagers();
  }

  loadManagers(): void {
    this.getAllManagers().subscribe({
      next: (data: Manager[]) => {
        this.managers = data;
      },
      error: (error) => {
        console.error('Error fetching managers', error);
      }
    });
  }

  
  getAllManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>('http://localhost:8888/admin/managers');
  }

}
