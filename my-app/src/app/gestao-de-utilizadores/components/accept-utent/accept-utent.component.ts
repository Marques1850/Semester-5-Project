import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-accept-utent',
  templateUrl: './accept-utent.component.html',
  styleUrls: ['./accept-utent.component.scss']
})
export class AcceptUtentComponent {
  
  submitted = false;
  serverResponse = '';
  errorResponse: string | null = null;

  userList: any[] = [];
  selectedUser: any;

  userForm = new FormGroup({
    userMain: new FormControl('', Validators.required),
  });
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.loadUsersList();
  }

  async loadUsersList() {
    try {
      this.userList = await this.userService.listAllPendingUsers();
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }

  async approveUser() {
    try {
      await this.userService.approveUser(this.selectedUser.email);
      this.userList=this.userList.filter((user) => user.email != this.selectedUser.email);
      this.serverResponse = 'User approved successfully';
      this.selectedUser=this.userList[0];
      
    } catch (error) {
      this.errorResponse = 'Failed to approve user';
      console.error("Error accepting user:", error);
    }
  }

  async disapproveUser() {
    try {
      await this.userService.disapproveUser(this.selectedUser.email);
      this.userList=this.userList.filter((user) => user.email != this.selectedUser.email);
      this.serverResponse = 'User disapproved successfully';
      this.selectedUser=this.userList[0];
    } catch (error) {
      this.errorResponse = 'Failed to disapprove user';
      console.error("Error disapproving user:", error);
    }
  }

  goBackToMenu() {
    this.router.navigate(['/menuGestorDeUtilizadores']);
  }
  goToHome() {
    this.router.navigate(['/startMenu']);
  }

    

}
