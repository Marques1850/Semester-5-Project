import { HttpClient, HttpParams ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}
  roles: any[] = [];
  user: any;
  utents: any[] = [];
  errorResponse: string | null = null;

  async createUser(userForm: FormGroup) {
    if (userForm.invalid) {
      return;
    }
    let userData: { [key: string]: any; } = {};
     
    for (let control in userForm.controls) {
      let value = userForm.get(control)?.value;
      if( value != '' ){
        userData[control] = value;
      }
    }
    const auth0Body = {
      client_id: 'g38QDAUhptuo2x8YT9VmfXIecW5sm2WA',
      email: userData['email'],
      password: userData['password'],
      connection: 'Username-Password-Authentication', // your database connection name
      user_metadata: { role: userData['role'] }
    };
   
  
    const auth0Headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
      
    this.http.post('https://dev-0fx2f0gsk33505xi.eu.auth0.com/dbconnections/signup', auth0Body, { headers: auth0Headers })
      .subscribe(response => {
        console.log(response);
      });

    try {
      const response = await this.http.post('http://localhost:3000/api/auth/createUser', userData).toPromise();
      this.user = response;
      return this.user;
    } catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return;
    }
  }

  async getRoles(): Promise<any[]> {
    const url = 'http://localhost:3000/api/roles/getRoles';
    this.errorResponse = null;
    this.roles = [];
  
    try {
      const response = await this.http.get<any>(url).toPromise();
      this.roles = response;
      return this.roles;
    } catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return [];
    }
  }  

  async listAllPendingUsers(): Promise<any[]> {
    const url = 'http://localhost:3000/api/auth/listAllPendingUsers';
    this.errorResponse = null;
    this.utents = [];

    try {
      const response = await this.http.get<any>(url).toPromise();

      this.utents = response;
      return this.utents;
    } catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async approveUser(email: string): Promise<any> {
    const url = 'http://localhost:3000/api/auth/approveUser';
    this.errorResponse = null;
    
    try{
      const response = await this.http.patch<any>(url, {email}).toPromise();
      return response;
    }catch(error: any){
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async disapproveUser(email: string): Promise<any> {
    const url = 'http://localhost:3000/api/auth/disapproveUser';
    this.errorResponse = null;
    
    try{
      const response = await this.http.patch<any>(url, {email}).toPromise();
      return response;
    }catch(error: any){
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async cancelAccount(email: string): Promise<any> {
    const url = 'http://localhost:3000/api/auth/cancelAccount';
    this.errorResponse = null;
    
    try{
      const response = await this.http.delete<any>(url, {body : {email}}).toPromise();
      return response;
    }catch(error: any){
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return null;
    }
  }

}