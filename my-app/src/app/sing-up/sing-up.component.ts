import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SingUPService } from './sing-up.service';
import {MatDialog} from '@angular/material/dialog';
import { DataConsentComponent } from '../data-consent/data-consent.component';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.scss']
})
export class SingUpComponent {

  singupForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    taxpayerNumber: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required)
  });

  submitted = false;
  serverResponse = '';
  roleList: string[] = [];



  constructor(private http: HttpClient, private router: Router, private service: SingUPService,private dialog:MatDialog) {}

  ngOnInit() {
    this.loadRolesList();
  }
  
  loadRolesList() {
    this.service.getRoles().then((roles: any[]) => {
      roles.forEach((role) => {
        if(role.name == "Student")
        this.singupForm.controls['role'].setValue(role.name);
      });
    }
  )}

  async singUp() {
 
    this.singupForm.controls['role'].setValue("User");
    this.singupForm.controls['estado'].setValue("Pendente");
    
    this.submitted = true;
    console.log(this.singupForm.value);
  
    if (this.singupForm.invalid) {
      return;
    }
  
    const dialogRef = this.dialog.open(DataConsentComponent);

  
    let result = await dialogRef.afterClosed().toPromise();
  
    if (result === true) {
     
      const response = await this.service.singUp(this.singupForm);
      if (response) {
        this.serverResponse = response;
      }
      return;
      
    }
  
    this.serverResponse = 'You must accept the data consent to continue';
   
  }
  

  


  goBackToMenu() {
    this.router.navigate(['/']);
  }

}
