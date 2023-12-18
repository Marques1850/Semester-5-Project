import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BuildingService } from './../building.service';

@Component({
  selector: 'app-update-building',
  templateUrl: './update-building.component.html',
  styleUrls: ['./update-building.component.scss']
})

export class UpdateBuildingComponent {
  updatebuildingForm = new FormGroup({
    code: new FormControl('', Validators.required),
    name: new FormControl(''),
    description: new FormControl('', Validators.maxLength(255)),
    width: new FormControl(''),
    length: new FormControl(''),
  });


  submitted = false;
  serverResponse = '';
  errorResponse: string | null = null;
  buildingList: string[] = [];
  floor: any;
  selectedFloor: any;

  constructor( private router: Router, private BuildingService: BuildingService) {}

  ngOnInit() {
    this.loadBuildingList();
  }
  
  async loadBuildingList() {
    this.buildingList = await this.BuildingService.loadBuildingList(this.buildingList);
  }

  async updateBuilding() {
    this.submitted = true;

    const response = await this.BuildingService.updateBuilding(this.updatebuildingForm);
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
