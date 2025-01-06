import { CommonModule } from '@angular/common';
import { HttpClient} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, switchMap, catchError } from 'rxjs';

export interface Request {
  requestId: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  adminName?: string;
  adminMessage?: string;
  skills: string[];
  managerId: number;
  managerName: string;
  accountType: string;
  requiredTrainees: number;
  maintainerName?: string;
}

@Component({
  selector: 'app-maintainer-accessrequests',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgbModalModule
  ],
  templateUrl: './maintainer-accessrequests.component.html',
  styleUrl: './maintainer-accessrequests.component.css'
})
export class MaintainerAccessrequestsComponent implements OnInit {
  private originalRequests: Request[] = [];
  filteredRequests: Request[] = [];
  
  selectedRequest: Request | null = null;
  selectedStatus: string = '';
  maintainerName: string = '';
  error: string | null = null;
  currentFilter: 'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED' = 'ALL';
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  private baseUrlAuth = 'http://localhost:8888/auth';
  private baseUrlMaintainer = 'http://localhost:8888/maintainer';

  constructor(
    private http: HttpClient, 
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.fetchAllRequests();  
  }

  fetchAllRequests(): void {
    this.getRequests().subscribe({
      next: (requests) => {
        this.originalRequests = requests;
        this.applyFilter('ALL');
      },
      error: (err) => {
        this.error = 'Failed to fetch requests';
        console.error(err);
      }
    });
  }

  fetchRequestsByStatus(status: 'PENDING' | 'COMPLETED' | 'REJECTED'): void {
    this.http.get<Request[]>(`${this.baseUrlMaintainer}/request/status/${status}`).subscribe({
      next: (requests) => {
        this.filteredRequests = requests;
        this.currentFilter = status;
      },
      error: (err) => {
        this.error = `Failed to fetch ${status} requests`;
        console.error(err);
      }
    });
  }

  applyFilter(filter: 'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED'): void {
    this.currentFilter = filter;
    
    if (filter === 'ALL') {
      this.filteredRequests = this.originalRequests;
    } else {
      this.filteredRequests = this.originalRequests.filter(request => request.status === filter);
    }
  }

  openEditModal(content: any, request: Request): void {
    if (request.status !== 'PENDING') return;

    this.selectedRequest = request;
    this.selectedStatus = request.status;
    
    this.fetchMaintainerName().subscribe({
      next: (name) => {
        this.maintainerName = name;
      },
      error: (err) => {
        console.error('Failed to fetch maintainer name', err);
        this.maintainerName = '';
      }
    });

    this.modalService.open(content, { 
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg'
    });
  }

  fetchMaintainerName(): Observable<string> {
    const jwtToken = sessionStorage.getItem('ust.auth');
    
    if (!jwtToken) {
      return of('');
    }

    return this.http.get(`${this.baseUrlAuth}/jwtToken/${jwtToken}`, { responseType: 'text' }).pipe(
      switchMap(email => 
        this.http.get(`${this.baseUrlMaintainer}/getMaintainerNameByEmail/${email}`, { responseType: 'text' })
      ),
      catchError(error => {
        console.error('Error fetching maintainer name', error);
        return of('');
      })
    );
  }

  updateRequest(adminMessage: string): void {
    if (!this.selectedRequest) return;

    this.updateRequest1(
      this.selectedRequest.requestId, 
      this.selectedStatus, 
      adminMessage, 
      this.maintainerName
    ).subscribe({
      next: () => {
        this.showNotification('Request updated successfully!', 'success');
        this.fetchAllRequests();
        this.modalService.dismissAll();
      },
      error: (err) => {
        this.showNotification('Failed to update request. Please try again.', 'error');
        console.error(err);
      }
    });
  }

  getRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(`${this.baseUrlMaintainer}/request`);
  }

  updateRequest1(
    requestId: number, 
    requestStatus: string, 
    adminMessage: string, 
    maintainerName: string
  ): Observable<any> {
    return this.http.put(
      `${this.baseUrlMaintainer}/updateRequest/${requestId}`, 
      null, 
      {
        params: {
          requestStatus: requestStatus,
          msg: adminMessage,
          maintainerName: maintainerName
        }
      }
    );
  }

  private showNotification(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}