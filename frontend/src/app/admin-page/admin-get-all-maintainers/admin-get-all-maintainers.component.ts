import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';


interface Maintainer {
  maintainerId: number;
  maintainerName: string;
  emailId: string;
  roomSize: number;
}

@Component({
  standalone:true,
  selector: 'app-admin-get-all-maintainers',
  templateUrl: './admin-get-all-maintainers.component.html',
  styleUrls: ['./admin-get-all-maintainers.component.css'],
  imports:[CommonModule,RouterModule,AdminNavbarComponent]
})
export class AdminGetAllMaintainersComponent implements OnInit {
  maintainers$!: Observable<Maintainer[]>;  

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
    if(!sessionStorage.getItem('ust.auth')){
      this.router.navigate(['/home']);
    }
    this.loadMaintainers();
  }

  loadMaintainers(): void {
    this.maintainers$ = this.http.get<Maintainer[]>('http://localhost:8888/admin/maintainers');
  }
}
