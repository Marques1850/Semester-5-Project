import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  submitted = false;

  constructor(private http: HttpClient, private router: Router) {} // Inject HttpClient and Router

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    // Send a POST request to your Express server
    this.http.post('http://localhost:3000/api/auth/signin', this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log(response);
        localStorage.setItem('userRole', response.userDTO.role); // Store the user's role in local storage
        localStorage.setItem('email', response.userDTO.email);
        localStorage.setItem('token',response.token);
        this.router.navigate(['/startMenu']);
        /*

        if (response.userDTO.role === 'CampusManager') {
          this.router.navigate(['/menuGestorDeCampus']);
        } else {
          console.log('Access Denied. You do not have permission to access this page.');
        }

        if (response.userDTO.role === 'FleetManager') {
          this.router.navigate(['/menuGestorDeFrota']);
        } else {
          console.log('Access Denied. You do not have permission to access this page.');
        }

        if (response.userDTO.role === 'TaskManager') {
          this.router.navigate(['/menuGestorDeTarefas']);
        } else {
          console.log('Access Denied. You do not have permission to access this page.');
        }

        if (response.userDTO.role === 'Admin') {
          this.router.navigate(['/menuAdmin']);
        } else {
          console.log('Access Denied. You do not have permission to access this page.');
        }

        if (response.userDTO.role === 'User') {
          this.router.navigate(['/menuUtilizador']);
        } else {
          console.log('Access Denied. You do not have permission to access this page.');
        }
        */
      },
      error: error => console.error(error)
    });
  }
}
