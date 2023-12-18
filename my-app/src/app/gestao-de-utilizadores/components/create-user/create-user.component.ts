import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  userForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    email: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    password: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required)
  });


  submitted = false;
  serverResponse = '';
  roleList: string[] = [];
  errorResponse: string | null = null;
  user: any;
  showPassword = false;

  constructor( private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.loadRolesList();
  }

  loadRolesList() {
    this.userService.getRoles().then((roles: any[]) => {
      roles.forEach((role) => {
        if (role.name != 'User'){
          this.roleList.push(role.name);
        }
      });
      if (this.roleList.length > 0) { // set default value as first of the list by omisson
        this.userForm.patchValue({ role: this.roleList[0] });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async createUser() {
    this.submitted = true;
    this.errorResponse = null;
    this.user = null;

    this.userForm.controls['estado'].setValue("aprovado");

    const response = await this.userService.createUser(this.userForm);
    if (response !== undefined) {
      this.user = response;
      this.serverResponse = this.user;
    } else {
      this.errorResponse = this.userService.errorResponse;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/menuGestorDeUtilizadores']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
  
}
