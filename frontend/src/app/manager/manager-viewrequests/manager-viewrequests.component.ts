
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


interface userModel{
  username:string;
  password:string;
  role:string;
}

interface Request {
  status: string;
  requestId: number;
  skills: string[];
  accountType: string;
  managerId: number;
  managerName: string;
  adminName: string;
  adminMessage: string| null;
  requiredTrainees: number;
}

interface Manager {
  createdRequests: Request[];
  managerId: number;
  managerName: string;
  manageremail: string;
  accountType: string;
}

@Component({
  selector: 'app-manager-viewrequests',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './manager-viewrequests.component.html',
  styleUrl: './manager-viewrequests.component.css'
})
export class ManagerViewrequestsComponent implements OnInit{
  requests: Request[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
    const managerEmail = sessionStorage.getItem('ust.auth');
    if (managerEmail) {
      this.fetchemailfromdetails(managerEmail);
    }else{
      this.router.navigate(['/login']);
    }

    const email = this.http.get<string>(`http://localhost:8888/auth/jwtToken/${managerEmail}`, { responseType: 'text' as 'json' }).toPromise();
      
      this.http.get<userModel>(`http://localhost:8888/auth/getUser/${email}`).subscribe(
        response=>{
          
          if(response.role!=='MANAGER'){
            sessionStorage.removeItem('ust.auth');
            this.router.navigate(['/login']);
            
          }else{
            console.log('good');
            
          }

        }
      );
  }

  fetchemailfromdetails(jwt: string): void {
    this.http.get<string>(`http://localhost:8888/auth/jwtToken/${jwt}`, { responseType: 'text' as 'json' }).subscribe(
      response => {
        // console.log('Raw response:', response);
        this.fetchManagerId(response);
      },
      error => {
        console.error('Error fetching email from details', error);
      }
    );
  }

  fetchManagerId(email: string): void {
    this.http.get<number>(`http://localhost:8888/manager/getManagerByemail/${email}`)
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.errorMessage = 'Failed to fetch manager ID';
          return throwError(error);
        })
      )
      .subscribe(managerId => {
        this.fetchManagerDetails(managerId);
      });
  }

  fetchManagerDetails(id: number): void {
    this.http.get<Manager>(`http://localhost:8888/manager/${id}`)
      .pipe(
        catchError(error => {
          this.isLoading = false;
          this.errorMessage = 'Failed to fetch manager details';
          return throwError(error);
        }),
        map(manager => manager.createdRequests)
      )
      .subscribe(requests => {
        this.requests = requests;
        this.isLoading = false;
      });
  }

  
  formatField(value: string | number | undefined): string {
    return value ? String(value) : 'Not Updated';
  }

  
  getStatusColor(status: string): string {
    switch(status.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
