import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseMessage } from './model/ApiResponseMessage';
import { JwtToken } from './model/JwtToken';
import { UserCredentials } from './model/UserCredentials';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  constructor(private authClient:HttpClient) { }

  baseUrl="http://localhost:8888/auth/login"
  base="http://localhost:8000/api/admin"
  idurl="http://localhost:8000/auth/getId"

  authenticate(userCredentials:UserCredentials):Observable<JwtToken>{
    return this.authClient.post<JwtToken>(this.baseUrl,userCredentials)
  }

  
  getid(username:string):Observable<number>{
    return this.authClient.get<number>(this.idurl)
  }
}
