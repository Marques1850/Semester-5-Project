import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ElevatorService } from './../elevator.service';

@Component({
  selector: 'app-update-elevator',
  templateUrl: './update-elevator.component.html',
  styleUrls: ['./update-elevator.component.scss']
})
export class UpdateElevatorComponent {

  updateelevatorForm = new FormGroup({
    BuildingCode: new FormControl('',Validators.required),
    ElevatorCode: new FormControl(''),
    FloorsAttended: new FormControl(''),
    ElevatorType: new FormGroup({  
      marca: new FormControl(''),
      modelo: new FormControl(''),
    }),
    NumSerie: new FormControl(''),
    Description: new FormControl(''),
  });
  submitted = false;
  serverResponse = '';
  ElevatorList: string[] = [];
  selectedElevators: string[] = [];
  constructor(private elevatorService: ElevatorService, private router: Router) {}

  
  ngOnInit() {
    
    this.loadElevatorList();
  }


 
   
  async loadElevatorList() {
    this.ElevatorList= this.elevatorService.loadlist(this.ElevatorList);
  }
 
 
  checkInput(event: Event) {
    const marca = this.updateelevatorForm.get('ElevatorType.marca');
    const modelo = this.updateelevatorForm.get('ElevatorType.modelo');
    if (marca?.value && !modelo?.value) {
      alert("Please fill out Modelo");
      event.preventDefault();
    } else if (!marca?.value && modelo?.value) {
      alert("Please fill out Marca");
      event.preventDefault();
    }
  }
  
  
  

  async updateElevator() {
    this.submitted = true;

    const response = await this.elevatorService.updateElevator(this.updateelevatorForm);
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
