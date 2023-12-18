import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
    private apiUrl = 'http://localhost:3000/api/auth/getMyData'; 

    constructor(private http: HttpClient) {}

    downloadUserData(email: string): Observable<any> {
      const url = `${this.apiUrl}?email=${email}`;
      return this.http.get(url, { responseType: 'blob' });
    }
}
