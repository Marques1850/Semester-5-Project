import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss']
})
export class DefaultPageComponent {
  title = 'my-app';

  constructor(public auth: AuthService, private http: HttpClient) {}

   loginWithRedirect() {
  
  
   this.auth.loginWithRedirect({
    appState: { target: '/startMenu' }
  });
   
  }

  
 
}

