import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http : HttpClient) { }

  getInitList() {
    return this.http.get<any[]>('/api/tc1/test2');
   }



   getParseFile(data : any) {
    return this.http.post<any[]>('/api/tc3/test', data);
   }



   
   write(data : any) {
    return this.http.post<any>('/api/tc3/write', data);
   }


}
