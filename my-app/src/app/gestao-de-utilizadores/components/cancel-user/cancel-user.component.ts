import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-cancel-user',
  templateUrl: './cancel-user.component.html',
  styleUrls: ['./cancel-user.component.scss']
})
export class CancelUserComponent {
  userForm = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    email: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    password: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required)
  }); 
  
  submitted = false;
  serverResponse = '';
  serverResponseState =false;
  errorResponse: string | null = null;
  showPassword = false;

  user: any;

  constructor( private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.user=localStorage.getItem('email');
  }

  cancelAccount() {
    try{
      console.log(this.user);
      this.userService.cancelAccount(this.user);
      this.serverResponse = 'Account canceled successfully';
      this.serverResponseState = true;
      this.goToHome();
    }catch (error) {
      this.errorResponse = 'Failed to cancel account';
      console.error("Error canceling account:", error);
    }
  }


  goBackToMenu() {
    this.router.navigate(['/menuGestorDeUtilizadores']);
  }
  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
