import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PassageService } from './../passage.service';
import { BuildingService } from '../../building/building.service';
import { FloorService } from '../../floor/floor.service';

@Component({
  selector: 'app-update-passage',
  templateUrl: './update-passage.component.html',
  styleUrls: ['./update-passage.component.scss']
})
export class UpdatePassageComponent {

  passageForm = new FormGroup({
    codigo: new FormControl('', Validators.required),
    codeBuilding1: new FormControl('', Validators.required),
    codeBuilding2: new FormControl('', Validators.required),
    FloorBuilding1Name: new FormControl('', Validators.required),
    FloorBuilding2Name: new FormControl('', Validators.required),
  });


  submitted = false;
  serverResponse = '';
  errorResponse: string | null = null;

  selectedPassage: any;
  passageList: string[] = [];
  buildingList: string[] = [];
  floorList1: string[] = [];
  floorList2: string[] = [];
  selectedBuilding1: any;
  selectedBuilding2: any;
  selectedFloor1: any;
  selectedFloor2: any;

  constructor(
    private router: Router,
    private passageService: PassageService,
    private buildingService: BuildingService,
    private floorService: FloorService,
  ) { }

  ngOnInit() {
    this.loadPassageList();
  }

  async loadPassageList() {
    try {
      const passages = await this.passageService.getAllPassages();
      const buildings = await this.buildingService.listAllBuildings();

      passages.forEach((passage) => {
        this.passageList.push(passage.codigo);
      });

      buildings.forEach((building) => {
        this.buildingList.push(building.code);
      });

      this.passageForm.get('codeBuilding1')?.valueChanges.subscribe(async (selectedBuilding1: any) => {
        this.selectedBuilding1 = selectedBuilding1;
        this.floorList1 = await this.loadBuildingFloors(selectedBuilding1);
      });

      this.passageForm.get('codeBuilding2')?.valueChanges.subscribe(async (selectedBuilding2: any) => {
        this.selectedBuilding2 = selectedBuilding2;
        this.floorList2 = await this.loadBuildingFloors(selectedBuilding2);
      });
      
    } catch (error) {
      console.error("Error loading passages:", error);
    }

  }

  async loadBuildingFloors(buildingCode: string): Promise<string[]> {
    let floorList: string[] = [];
    await this.floorService.getBuildingFloors(buildingCode).then((floors: any[]) => {
      floors.forEach((floor) => {
        floorList.push(floor.name);
      });
    });
    return floorList;
  }

  async updatePassage() {
    this.submitted = true;
    this.errorResponse = null;

    if (this.passageForm.invalid) {
      console.log(this.passageForm)
      console.log("invalid form");
      return;
    }

    // Call updatePassage method from PassageService
    const response = await this.passageService.updatePassage(this.passageForm);
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
