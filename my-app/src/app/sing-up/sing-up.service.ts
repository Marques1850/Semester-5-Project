import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SingUPService {
  constructor(private http: HttpClient) {}
  buildings: any[] = [];
  errorResponse: string | null = null;

  async singUp(singUpForm: FormGroup) {
    if (singUpForm.invalid) {
      return;
    }
     
    const auth0Body = {
      client_id: 'g38QDAUhptuo2x8YT9VmfXIecW5sm2WA',
      email: singUpForm.value.email,
      password: singUpForm.value.password,
      connection: 'Username-Password-Authentication', 
      user_metadata: { 
        userRole: 'User',
      }
    };
  
    const auth0Headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
      
    this.http.post('https://dev-0fx2f0gsk33505xi.eu.auth0.com/dbconnections/signup', auth0Body, { headers: auth0Headers })
      .subscribe(response => {
        console.log(response);
      });
    
    try {
      return this.http.post('http://localhost:3000/api/auth/signup', singUpForm.value).toPromise().then((response: any) => {
        return `Account created\nPlease go back to the start up page.`;
      }).catch(error => this.errorResponse = error.error);
    }catch (error: any) {
      return this.errorResponse;
    }
  
  }

  async getRoles(): Promise<any[]> {
    try {
      let allRoles: any[] = [];
      return this.http.get<any[]>('http://localhost:3000/api/roles/getRoles').toPromise().then((response: any) => {
        allRoles = response;
        return allRoles;
      });
    } catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return [];
    }
  }
  
}