
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentNavbarComponent } from '../student-navbar/student-navbar.component';

@Component({
  selector: 'app-student-page',
  standalone: true,
  imports: [CommonModule, RouterModule, StudentNavbarComponent],
  templateUrl: './student-page.component.html',
  styleUrl: './student-page.component.css'
})
export class StudentPageComponent {
  id?: number;
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  constructor(private route: ActivatedRoute,private router:Router) {}

  ngOnInit() {
    const studentEmail = sessionStorage.getItem('ust.auth');
    if (!studentEmail){
      this.router.navigate(['/login']);
    }
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      console.log('Student ID:', this.id);
    });

    
  }
}