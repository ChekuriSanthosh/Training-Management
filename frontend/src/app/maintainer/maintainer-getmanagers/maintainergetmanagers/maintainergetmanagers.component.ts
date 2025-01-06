import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
  selector: 'app-maintainergetmanagers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maintainergetmanagers.component.html',
  styleUrl: './maintainergetmanagers.component.css'
})
export class MaintainergetmanagersComponent {
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
    
    return this.http.get<Manager[]>('http://localhost:8888/maintainer/managers');
  }
}
