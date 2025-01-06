import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// import { MaintainerNavbarComponent } from '../maintainer-navbar/maintainer-navbar/maintainer-navbar.component';
import { MaintainerNavBarComponent } from '../maintainer-nav-bar/maintainer-nav-bar.component';

@Component({
  selector: 'app-maintainer-page',
  standalone: true,
  imports: [RouterModule,MaintainerNavBarComponent],
  templateUrl: './maintainer-page.component.html',
  styleUrl: './maintainer-page.component.css'
})
export class MaintainerPageComponent implements OnInit{
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
