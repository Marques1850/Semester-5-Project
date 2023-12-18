import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FloorService } from '../floor.service';
import { BuildingService } from '../../building/building.service';

@Component({
  selector: 'app-get-building-floors',
  templateUrl: './get-building-floors.component.html',
  styleUrls: ['./get-building-floors.component.scss']
})
export class GetBuildingFloorsComponent {
  floors: any[] = [];
  buildingList: string[] = [];
  submitted = false;
  serverResponse = '';
  errorResponse: string | null = null;

  codeForm = new FormGroup({
    code: new FormControl('', Validators.required),
  });

  constructor(
    private floorService: FloorService, 
    private buildingService: BuildingService,
    private router: Router) {}

  ngOnInit() {
    this.loadBuildingList();
  }

  loadBuildingList() {
    this.buildingService.listAllBuildings().then((buildings: any[]) => {
      buildings.forEach((building) => {
        this.buildingList.push(building.code);
      });
      if (this.buildingList.length > 0) {
        this.codeForm.patchValue({ code: this.buildingList[0] });
      }
    });
  }

  async getBuildingFloors() {
    this.submitted = true;
    this.errorResponse = null;
    this.floors = [];

    if (this.codeForm.invalid) {
      return;
    }

    const code = this.codeForm.get('code')?.value;
    let codeStr = '';
    if (code != null) {
      codeStr = code.toString();
    }

    this.floors = await this.floorService.getBuildingFloors(codeStr);
    if (this.floors.length === 0) {
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
