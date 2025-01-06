import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent implements OnInit {
  dropdownOpen = false;
  isSidebarOpen = false;

  
  toggleDropdown(event: MouseEvent) {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }



  constructor(
    private router: Router, 
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('ust.auth')) {
      this.router.navigate(['/home']);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.getElementById('sidebarMenu');
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