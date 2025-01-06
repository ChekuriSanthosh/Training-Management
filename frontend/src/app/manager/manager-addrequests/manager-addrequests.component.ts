import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

interface userModel {
  username: string;
  password: string;
  role: string;
}

interface Request {
  status: string;
  skills: string[];
  managerId: number;
  managerName: string;
  accountType: string;
  requiredTrainees: number;
  adminName?: string;
  adminMessage?: string;
}

@Component({
  selector: 'app-manager-addrequests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manager-addrequests.component.html',
  styleUrl: './manager-addrequests.component.css'
})
export class ManagerAddrequestsComponent implements OnInit {
  requestForm: FormGroup;
  managerDetails: Manager | null = null;
  isSubmitting = false;
  submitSuccess = false;
  skillsList: string[] = [
    'Java', 'SpringBoot', 'Selenium', 'Testing', 'Frontend', 'Angular.js', 'React.js', 'Node.js', 'JavaScript', 'Spring Security', 
    '.Net', 'Python', 'Django', 'Microservices', 'Unit Testing', 'Machine Learning', 'DevOps', 'AWS', 'Azure', 'App Development', 'Data Analysis'
  ];
  filteredSkills: string[] = [];
  currentSkill: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      skills: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      requiredTrainees: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      adminName: [''],
      adminMessage: ['']
    });
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('ust.auth');
    if (!token) {
      this.router.navigate(['/login']);
    }

    if (token) {
      this.fetchemailfromdetails(token);
    }
  }

  get skillsControls() {
    return (this.requestForm.get('skills') as FormArray).controls;
  }

  onSkillInputChange(value: string): void {
    this.currentSkill = value;
    if(value.length>0) this.filteredSkills = this.skillsList.filter(skill => skill.toLowerCase().includes(value.toLowerCase()));
    else this.filteredSkills=[]
  }

  addSkill(skillInput: HTMLInputElement): void {
    const skill = skillInput.value.trim();
    if (skill && !this.skillsControls.some(control => control.value === skill)) {
      const skillsArray = this.requestForm.get('skills') as FormArray;
      skillsArray.push(this.fb.control(skill));
      skillInput.value = '';
      this.filteredSkills = [];
      this.currentSkill = '';
    }
  }

  addSkillFromDropdown(skill: string): void {
    if (skill && !this.skillsControls.some(control => control.value === skill)) {
      const skillsArray = this.requestForm.get('skills') as FormArray;
      skillsArray.push(this.fb.control(skill));
      this.filteredSkills = [];
      this.currentSkill = '';
    }
  }

  removeSkill(index: number): void {
    const skillsArray = this.requestForm.get('skills') as FormArray;
    skillsArray.removeAt(index);
  }

  submitRequest(): void {
    if (this.requestForm.valid && this.managerDetails) {
      this.isSubmitting = true;

      const requestPayload: Request = {
        status: 'PENDING',
        skills: this.requestForm.get('skills')?.value,
        managerId: this.managerDetails.managerId,
        managerName: this.managerDetails.managerName,
        accountType: this.managerDetails.accountType,
        requiredTrainees: this.requestForm.get('requiredTrainees')?.value,
        adminName: this.requestForm.get('adminName')?.value || '',
        adminMessage: this.requestForm.get('adminMessage')?.value || ''
      };

      this.http.post<Request>('http://localhost:8888/manager/request', requestPayload)
        .pipe(
          catchError(error => {
            console.error('Error submitting request', error);
            this.isSubmitting = false;
            return throwError(error);
          })
        )
        .subscribe(() => {
          this.isSubmitting = false;
          this.submitSuccess = true;

          setTimeout(() => {
            this.submitSuccess = false;
            this.requestForm.reset();
            const skillsArray = this.requestForm.get('skills') as FormArray;
            skillsArray.clear();
          }, 3000);
        });
    }
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
}
