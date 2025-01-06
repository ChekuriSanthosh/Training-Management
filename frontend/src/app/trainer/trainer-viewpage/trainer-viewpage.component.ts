import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TrainerNavbarComponent } from '../trainer-navbar/trainer-navbar.component';


@Component({
  selector: 'app-trainer-viewpage',
  standalone: true,
  imports: [RouterOutlet, TrainerNavbarComponent],
  templateUrl: './trainer-viewpage.component.html',
  styleUrl: './trainer-viewpage.component.css'
})
export class TrainerViewpageComponent implements OnInit{
  constructor(private router:Router){}

  ngOnInit():void{
    const token = sessionStorage.getItem('ust.auth');
      if (!token){
        this.router.navigate(['/login']);
      }
  }
}