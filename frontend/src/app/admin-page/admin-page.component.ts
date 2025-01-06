import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { AdminAddMaintainerComponent } from './admin-add-maintainer/admin-add-maintainer.component';
import { AdminViewStudentsComponent } from './admin-view-students/admin-view-students.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule,RouterModule,AdminNavbarComponent,AdminAddMaintainerComponent,AdminViewStudentsComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit{

  constructor(private router:Router){}
  sidebarOpen = false;
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit():void{
    if(!sessionStorage.getItem('ust.auth')){
      this.router.navigate(['/home']);
    }
  }
  

  Logout(){
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('ust.auth');
    this.router.navigate(["/home"]);
  }

}
