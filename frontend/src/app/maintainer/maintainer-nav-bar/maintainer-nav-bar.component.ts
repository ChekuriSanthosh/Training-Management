import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

type DropdownType = 'students' | 'trainers' | 'managers' | null;

@Component({
  selector: 'app-maintainer-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './maintainer-nav-bar.component.html',
  styleUrls: ['./maintainer-nav-bar.component.css']
})
export class MaintainerNavBarComponent {
  isSidebarOpen = false;
  isStudentsOpen = false;
  isTrainersOpen = false;
  isManagersOpen = false;
  dropdownOpen = false;


  
  toggleDropdownn(event: MouseEvent) {
    this.dropdownOpen = !this.dropdownOpen;
    event.stopPropagation();
  }


  constructor(private router: Router) {}

  toggleDropdown(type: DropdownType): void {
    
    switch (type) {
      case 'students':
        if (this.isStudentsOpen) {
          this.isStudentsOpen = false;
          return;
        }
        break;
      case 'trainers':
        if (this.isTrainersOpen) {
          this.isTrainersOpen = false;
          return;
        }
        break;
      case 'managers':
        if (this.isManagersOpen) {
          this.isManagersOpen = false;
          return;
        }
        break;
    }

    
    this.isStudentsOpen = false;
    this.isTrainersOpen = false;
    this.isManagersOpen = false;

    switch (type) {
      case 'students':
        this.isStudentsOpen = true;
        break;
      case 'trainers':
        this.isTrainersOpen = true;
        break;
      case 'managers':
        this.isManagersOpen = true;
        break;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    sessionStorage.removeItem('ust.auth');
    this.router.navigate(['']);
  }
}