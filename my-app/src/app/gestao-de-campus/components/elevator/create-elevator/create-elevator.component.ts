import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ElevatorService } from './../elevator.service';

@Component({
  selector: 'app-create-elevator',
  templateUrl: './create-elevator.component.html',
  styleUrls: ['./create-elevator.component.scss']
})
export class CreateElevatorComponent {
  createelevatorForm = new FormGroup({
    BuildingCode: new FormControl('',Validators.required),
    ElevatorCode: new FormControl('',Validators.required),
    FloorsAttended: new FormControl('',Validators.required),
    ElevatorType: new FormGroup({  
      marca: new FormControl('',Validators.required),
      modelo: new FormControl('',Validators.required),
    }),
    NumSerie: new FormControl('',Validators.required),
    Description: new FormControl('',Validators.required),
  });

  submitted = false;
  serverResponse = '';
  ElevatorList: string[] = [];
  constructor(private elevatorService: ElevatorService, private router: Router) {}

   
  ngOnInit() {
    
    this.loadElevatorList();
  }


 
   
  async loadElevatorList() {
    this.ElevatorList= this.elevatorService.loadlistCreate(this.ElevatorList);
  }
 
  
  async createElevator() {
    this.submitted = true;

    const response = await this.elevatorService.createElevator(this.createelevatorForm);
    if (response) {
      this.serverResponse = response;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/elevator']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
}
