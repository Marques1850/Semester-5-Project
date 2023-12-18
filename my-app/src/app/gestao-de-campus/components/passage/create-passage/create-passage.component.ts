import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PassageService } from './../passage.service';
import { BuildingService } from '../../building/building.service';
import { FloorService } from '../../floor/floor.service';

@Component({
  selector: 'app-create-passage',
  templateUrl: './create-passage.component.html',
  styleUrls: ['./create-passage.component.scss']
})
export class CreatePassageComponent {
  createPassageForm = new FormGroup({
    codigo: new FormControl('', Validators.required),
    codeBuilding1: new FormControl('', Validators.required),
    codeBuilding2: new FormControl('', Validators.required),
    FloorBuilding1Name: new FormControl('', Validators.required),
    FloorBuilding2Name: new FormControl('', Validators.required),
  });

  submitted = false;
  buildingList: string[] = [];
  selectedBuilding1: any;
  selectedBuilding2: any;
  floorList1: string[] = [];
  floorList2: string[] = [];
  serverResponse = '';

  constructor(
    private router: Router,
    private passageService: PassageService,
    private buildingService: BuildingService,
    private floorService: FloorService
  ) {}


  ngOnInit() {
    this.loadBuildingList();
  }
  
  async loadBuildingList() {
    try {
      const buildings = await this.buildingService.listAllBuildings();
      
      buildings.forEach((building) => {
        this.buildingList.push(building.code);
      });
      
      if (this.buildingList.length > 0) {
        this.createPassageForm.patchValue({ codeBuilding1: this.buildingList[0] });
        this.createPassageForm.patchValue({ codeBuilding2: this.buildingList[0] });
      }
  
      this.createPassageForm.get('codeBuilding1')?.valueChanges.subscribe(async (selectedBuilding1: any) => {
        this.floorList1 = [];
        if (selectedBuilding1) {
          this.floorList1 = await this.loadBuildingFloors(selectedBuilding1);
          if (this.floorList1.length > 0) {
            this.createPassageForm.patchValue({ FloorBuilding1Name: this.floorList1[0] });
          }
        }
      });
  
      this.createPassageForm.get('codeBuilding2')?.valueChanges.subscribe(async (selectedBuilding2: any) => {
        this.floorList2 = [];
        if (selectedBuilding2) {
          this.floorList2 = await this.loadBuildingFloors(selectedBuilding2);
          
          if (this.floorList2.length > 0) {
            this.createPassageForm.patchValue({ FloorBuilding2Name: this.floorList2[0] });
          }
        }
      });
    } catch (error) {
      console.error("Error loading buildings:", error);
    }
  }
  
  async loadBuildingFloors(buildingCode: string): Promise<string[]> {
    try {
      const floors = await this.floorService.getBuildingFloors(buildingCode);
      let listFloorNames: string[] = [];
      
      floors.forEach((floor) => {
        listFloorNames.push(floor.name);
      });
  
      return listFloorNames;
    } catch (error) {
      console.error("Error loading floors:", error);
      return [];
    }
  }


  async createPassage() {
    this.submitted = true;

    if (this.createPassageForm.invalid) {
      return;
    }

    // Call createPassage method from PassageService
    const response = await this.passageService.createPassage(this.createPassageForm);
    if (response) {
      this.serverResponse = response;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/passage']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
  
}
