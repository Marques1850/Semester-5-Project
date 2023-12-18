import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http'; // Import it up here
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { FloorService } from '../floor.service';
import { BuildingService } from '../../building/building.service';
import { forEach } from 'lodash'


@Component({
  selector: 'app-update-floor',
  templateUrl: './update-floor.component.html',
  styleUrls: ['./update-floor.component.scss']
})

export class UpdateFloorComponent {
  floorForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.maxLength(255)]),
    buildingCode: new FormControl('', Validators.required),
    level: new FormControl('', Validators.pattern('^[0-9]*$')),
    width: new FormControl('', Validators.pattern('^[0-9]*$')),
    length: new FormControl('', Validators.pattern('^[0-9]*$')),
  });


  submitted = false;
  serverResponse = '';
  errorResponse: string | null = null;
  buildingList: string[] = [];
  selectedBuildingFloors: string[] = [];
  floor: any;
  selectedFloor: any;

  constructor(
    private router: Router, 
    private floorService: FloorService, 
    private buildingService: BuildingService) {}

  ngOnInit() {
    this.loadBuildingList();
  }
  
  loadBuildingList() {
    this.buildingService.listAllBuildings().then((buildings: any[]) => {
      buildings.forEach((building) => {
        this.buildingList.push(building.code);
      });
      if (this.buildingList.length > 0) { // set default value as first of the list by omisson
        this.floorForm.patchValue({ buildingCode: this.buildingList[0] }); 
      }
    });
    

    this.floorForm.get('buildingCode')?.valueChanges.subscribe((selectedBuilding: any) => {
      this.selectedBuildingFloors = [];
      if (selectedBuilding) {
        this.loadBuildingFloors(selectedBuilding);
      }
    });
  }

  loadBuildingFloors(buildingCode: string) {
    this.floorService.getBuildingFloors(buildingCode).then((floors: any[]) => {
      floors.forEach((floor) => {
        this.selectedBuildingFloors.push(floor.name);
      });
      if (this.selectedBuildingFloors.length > 0) { // set default value as first of the list by omisson
        this.floorForm.patchValue({ name: this.selectedBuildingFloors[0] });
      }
    });
  }

  async updateFloor() {
    this.submitted = true;
    this.errorResponse = null;
    this.floor = null;
    
    const response = await this.floorService.updateFloor(this.floorForm);
    if (response !== undefined) {
      this.floor = response;
      this.serverResponse = this.floor;
    } else {
      this.errorResponse = this.floorService.errorResponse;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/floor']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
  
}
