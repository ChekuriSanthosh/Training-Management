  import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, Router, RouterModule } from '@angular/router';
import { MaintainerService } from '../../maintainer.service';
import { AuthDetails, MaintainerDetails } from '../../model/MaintainerAuthServiceDetails';
import { Maintainer, Maintainermodel } from '../../model/MaintainerDetails';
import { AdminNavbarComponent } from '../admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-add-maintainer',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule,AdminNavbarComponent],
  templateUrl: './admin-add-maintainer.component.html',
  styleUrl: './admin-add-maintainer.component.css'
})
export class AdminAddMaintainerComponent implements OnInit{


  maintainer:Maintainer=new Maintainer(0,'',0);
  maintainerModel?:Maintainermodel;
  authdetails?:AuthDetails;
  id?:string;
  maintainerDetails:MaintainerDetails = new MaintainerDetails('', '', 'MAINTAINER',0);

  constructor(private maintainerService:MaintainerService,private authclient:HttpClient,private router:Router) {}

  ngOnInit():void{
    if(!sessionStorage.getItem('ust.auth')){
      this.router.navigate(['/home']);
    }
  }


  async onSubmit() {
    await this.saveMaintainer();
    
  }

  async saveMaintainer(){
    const maintainerdata={
      "maintainerName": this.maintainer.maintainerName,
      "emailId":this.maintainerDetails.username
  }
  const baseUrl="http://localhost:8888/admin/maintainer"
  

  await this.authclient.post<Maintainermodel>(baseUrl,maintainerdata).subscribe(
    response=>{
      this.maintainerModel=response
      console.log(this.maintainerModel);
      this.id="Maintainer Registered Successfully"
      this.saveuser();
    }
    // error=>alert('alert saving maintainer')
  )
  // await this.saveuser();
  
  }



  async saveuser(){
    const userdata={
      "username":this.maintainerDetails.username,
    "password":"USTMaintainer@123",
    "role":"MAINTAINER"
    }
    const baseUrl="http://localhost:8888/auth/register"
  

  await this.authclient.post<AuthDetails>(baseUrl,userdata).subscribe(
    response=>{
      this.authdetails=response
      console.log(response);
      
    },
    error=>alert('alert saving maintainer')
  )
    
  }

}


