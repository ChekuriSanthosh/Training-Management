import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaintainerService {

  constructor(private authClient:HttpClient) { }
  baseUrl="http://localhost:8888/auth/register"
  base="http://localhost:8000/admin/maintainer"
  idurl="http://localhost:8000/auth/getId"

  // saveMaintainer(maintainer: Maintainer): Observable<Maintainer> {
  //   return this.authClient.post<Maintainer>(this.base,Maintainer)
  // }

  // saveUser(maintainerdetails:MaintainerDetails):Observable<MaintainerDetails>{
  //   return this.authClient.post<MaintainerDetails>(this.baseUrl,MaintainerDetails);
  // }
}
