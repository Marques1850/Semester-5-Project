import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BuildingService } from './../building.service';

@Component({
  selector: 'app-create-building',
  templateUrl: './create-building.component.html',
  styleUrls: ['./create-building.component.scss']
})

export class CreateBuildingComponent {
  buildingForm = new FormGroup({
    code: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    width: new FormControl('', Validators.required),
    length: new FormControl('', Validators.required),
  });


  submitted = false;
  serverResponse = '';
  errorResponse: string | null = null;

  constructor(private router: Router, private buildingService: BuildingService) {}

  
  async createBuilding() {
    this.submitted = true;

    const response = await this.buildingService.createBuilding(this.buildingForm);
    if (response) {
      this.serverResponse = response;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/building']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
}
