import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ManagerNavbarComponent } from '../manager-navbar/manager-navbar.component';

interface userModel{
  username:string;
  password:string;
  role:string;
}


@Component({
  selector: 'app-manager-page',
  standalone: true,
  imports: [CommonModule,RouterModule,ManagerNavbarComponent],
  templateUrl: './manager-page.component.html',
  styleUrl: './manager-page.component.css'
})
export class ManagerPageComponent {

  // id?: number;

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  constructor(private route: ActivatedRoute,private router:Router,private http:HttpClient) {}

  ngOnInit() {
    // this.id=1;
    // this.route.params.subscribe(params => {
    //   this.id = +params['id']; 
    //   console.log('Received ID:', this.id); 
    // });

    const managerEmail = sessionStorage.getItem('ust.auth');
    if (!managerEmail) {
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


}
