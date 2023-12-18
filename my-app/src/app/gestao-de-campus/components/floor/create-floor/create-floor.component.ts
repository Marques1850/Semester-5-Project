import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FloorService } from '../floor.service';
import { BuildingService } from '../../building/building.service';


@Component({
  selector: 'app-create-floor',
  templateUrl: './create-floor.component.html',
  styleUrls: ['./create-floor.component.scss']
})
export class CreateFloorComponent {
  floorForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    buildingCode: new FormControl('', Validators.required),
    level: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    width: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    length: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
  });


  submitted = false;
  serverResponse = '';
  buildingList: string[] = [];
  errorResponse: string | null = null;
  floor: any;

  constructor( private router: Router, private floorService: FloorService, private buildingService: BuildingService) {}

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
  }

  async createFloor() {
    this.submitted = true;

    const response = await this.floorService.createFloor(this.floorForm);
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
