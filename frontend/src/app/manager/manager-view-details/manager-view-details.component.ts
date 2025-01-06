import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

  

interface Manager {
  managerId: number;
  managerName: string;
  accountType: string;
  manageremail: string;
}

interface userModel{
  username:string;
  password:string;
  role:string;
}


@Component({
  selector: 'app-manager-view-details',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './manager-view-details.component.html',
  styleUrl: './manager-view-details.component.css'
})
export class ManagerViewDetailsComponent implements OnInit{

  managerDetails: Manager | null = null;
  isEditMode = false;
  managerForm: FormGroup;
  
  constructor(
    private http: HttpClient, 
    private fb: FormBuilder,
    private router:Router
  ) {
    this.managerForm = this.fb.group({
      managerName: ['', [Validators.required, Validators.minLength(2)]],
      accountType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
    const managerEmail = sessionStorage.getItem('ust.auth');
    if (managerEmail) {
      this.fetchemailfromdetails(managerEmail);
      
    }else{
      this.router.navigate(['/login']);
    }

    const email = this.http.get<string>(`http://localhost:8888/auth/jwtToken/${managerEmail}`, { responseType: 'text' as 'json' }).toPromise();
      
      // this.http.get<userModel>(`http://localhost:8888/auth/getUser/${email}`,{responseType:'text' as 'json'}).subscribe(
      //   response=>{
      //     if(response.role!=='MANAGER'){
      //       sessionStorage.removeItem('ust.auth');
      //       this.router.navigate(['/login']);
            
      //     }else{
      //       console.log('good');
            
      //     }

      //   }
      // );

  }

  fetchemailfromdetails(jwt: string): void {
    this.http.get<string>(`http://localhost:8888/auth/jwtToken/${jwt}`, { responseType: 'text' as 'json' }).subscribe(
      response => {
        console.log('Raw response:', response); 
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
          console.error('Error fetching manager ID', error);
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
          console.error('Error fetching manager details', error);
          return throwError(error);
        })
      )
      .subscribe(manager => {
        this.managerDetails = manager;
      });
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      
      this.managerForm.patchValue({
        managerName: this.managerDetails?.managerName || '',
        accountType: this.managerDetails?.accountType || ''
      });
    } else {
      
      this.managerForm.patchValue({
        managerName: this.managerDetails?.managerName || '',
        accountType: this.managerDetails?.accountType || ''
      });
    }
    this.isEditMode = !this.isEditMode;
  }

  updateManagerDetails(): void {
    if (this.managerForm.valid && this.managerDetails) {
      const updatePayload = {
        ...this.managerDetails,
        managerName: this.managerForm.get('managerName')?.value,
        accountType: this.managerForm.get('accountType')?.value
      };

      this.http.put<Manager>(`http://localhost:8888/manager/update/${this.managerDetails.managerId}`, updatePayload)
        .pipe(
          catchError(error => {
            console.error('Error updating manager details', error);
            return throwError(error);
          })
        )
        .subscribe(updatedManager => {
          this.managerDetails = updatedManager;
          this.isEditMode = false;
        });
    }
  }

}
