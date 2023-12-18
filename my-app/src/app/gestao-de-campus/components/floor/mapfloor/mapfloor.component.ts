import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http'; // Import it up here
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { FloorService } from '../floor.service';
import { BuildingService } from '../../building/building.service';
import { forEach } from 'lodash'

@Component({
  selector: 'app-mapfloor',
  templateUrl: './mapfloor.component.html',
  styleUrls: ['./mapfloor.component.scss']
})
export class MapfloorComponent {
  mapForm = new FormGroup({
    buildingCode: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
  });

  submitted = false;
  serverResponse = '';
  errorResponse: string | null = null;
  fileToUpload: File | null = null;
  selectedFileName: string | null = null;
  buildingList: string[] = [];
  selectedBuildingFloors: string[] = [];
  floor: any;
  selectedFloor: any;

  constructor(
    private router: Router, 
    private floorService: FloorService, 
    private buildingService: BuildingService) {}

  handleFileInput(event: Event) {
    const element = event.target as HTMLInputElement;
    let files: FileList | null = element.files;
    if (files) {
      this.fileToUpload = files.item(0);
      this.selectedFileName = this.fileToUpload ? this.fileToUpload.name : null;
    }
  }

  ngOnInit() {
    this.loadBuildingList();
  }
  
  loadBuildingList() {
    this.buildingService.listAllBuildings().then((buildings: any[]) => {
      buildings.forEach((building) => {
        this.buildingList.push(building.code);
      });
      if (this.buildingList.length > 0) { // set default value as first of the list by omisson
        this.mapForm.patchValue({ buildingCode: this.buildingList[0] }); 
      }
    });
    

    this.mapForm.get('buildingCode')?.valueChanges.subscribe((selectedBuilding: any) => {
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
        this.mapForm.patchValue({ name: this.selectedBuildingFloors[0] });
      }
    });
  }
  
  
  
  async uploadMap() {
    this.submitted = true;
    this.serverResponse = '';

    let formData = new FormData();

    let nameControl = this.mapForm.get('name');
    if (nameControl) {
      let nameValue = nameControl.value;
      if (nameValue) {
        formData.append('name', nameValue);
      }
    }

    console.log("component"+formData);


    if (this.fileToUpload) {
      formData.append('plant', this.fileToUpload, this.fileToUpload.name);
    }

    const response = await this.floorService.uploadMap(formData);
    if (response) {
      this.serverResponse = response;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/floor']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
  
}
