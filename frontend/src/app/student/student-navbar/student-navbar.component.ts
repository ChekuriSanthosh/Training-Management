import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


interface userModel{
  username:string;
  password:string;
  role:string;
}

@Component({
  selector: 'app-student-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-navbar.component.html',
  styleUrl: './student-navbar.component.css'
})
export class StudentNavbarComponent implements OnInit {
  @Input() studentId?: number;

  dropdownOpen = false;
  isSidebarOpen = false;
  userdetails?:userModel;

  constructor(
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('ust.auth')) {
      this.router.navigate(['/home']);
    }

    
  }

  toggleDropdown(event: MouseEvent) {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.getElementById('studentSidebarMenu');
    const body = document.body;

    if (sidebar) {
      sidebar.classList.toggle('show', this.isSidebarOpen);
    }

    if (this.isSidebarOpen) {
      this.renderer.addClass(body, 'sidebar-open');
    } else {
      this.renderer.removeClass(body, 'sidebar-open');
    }
  }

  Logout(): void {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('ust.auth');
    this.router.navigate(['']);
  }
}