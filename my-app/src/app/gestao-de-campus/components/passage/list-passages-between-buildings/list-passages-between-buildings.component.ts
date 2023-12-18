import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuildingService } from '../../building/building.service';
import { PassageService } from './../passage.service';

@Component({
  selector: 'app-list-passages-between-buildings',
  templateUrl: './list-passages-between-buildings.component.html',
  styleUrls: ['./list-passages-between-buildings.component.scss']
})
export class ListPassagesBetweenBuildingsComponent {
  Passages: any[] = [];
  submitted = false;
  serverResponse = '';
  listPassagesForm = new FormGroup({
    building1: new FormControl('', Validators.required),
    building2: new FormControl('', Validators.required),
  });

  buildingList: string[] = [];
  selectedBuilding1: any;
  selectedBuilding2: any;

  constructor(
    private passageService: PassageService,
     private router: Router,
      private buildingService: BuildingService,
     ) {}

  ngOnInit() {
    this.loadBuildingList();
  }

  // Make it so you can't select the same building on the 2 drop downs (NOT NEEDED FOR NOW)
  async loadBuildingList() {
    try {
      const buildings = await this.buildingService.listAllBuildings();

      if (this.buildingList.length > 0) {
        this.listPassagesForm.patchValue({ building1: this.buildingList[0] });
        this.listPassagesForm.patchValue({ building2: this.buildingList[0] });
      }

      
      buildings.forEach((building) => {
        this.buildingList.push(building.code);
      });
      
    } catch (error) {
      console.error("Error loading buildings:", error);
    }
  }

  async listPassagesBetweenBuildings() {
    this.submitted = true;
    if (this.listPassagesForm.invalid) {
      return;
    }

    console.log(this.listPassagesForm.value.building1);

    try {
      this.Passages = await this.passageService.listPassagesBetweenBuildings(this.listPassagesForm);
    } catch (error) {
      console.error(error);
    }
  }

  goBackToMenu() {
    this.router.navigate(['/passage']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
  
}
