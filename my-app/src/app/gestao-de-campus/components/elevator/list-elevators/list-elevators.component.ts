import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ElevatorService } from './../elevator.service';

@Component({
  selector: 'app-list-elevators',
  templateUrl: './list-elevators.component.html',
  styleUrls: ['./list-elevators.component.scss']
})
export class ListElevatorsComponent {
  getelevatorForm = new FormGroup({
    BuildingCode: new FormControl('',Validators.required),
   });
  serverResponse = '';
  submitted=false;
  ElevatorList: string[] = [];
  constructor(private elevatorService: ElevatorService, private router: Router) {}

  ngOnInit() {
    this.loadElevatorList();
  }


 
   
  async loadElevatorList() {
    this.ElevatorList= this.elevatorService.loadlist(this.ElevatorList);
  }
 

  async listAllElevators() {
    this.serverResponse = '';
    this.submitted = true;
    const buildingCode = this.getelevatorForm.get('BuildingCode')?.value;

    if (this.getelevatorForm.invalid) {
      return;
    }

    if (buildingCode == null || buildingCode == undefined || buildingCode == '') {
      this.serverResponse = 'Building Code is required';
      return;
    }

    const response = await this.elevatorService.listAllElevators(buildingCode);
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
