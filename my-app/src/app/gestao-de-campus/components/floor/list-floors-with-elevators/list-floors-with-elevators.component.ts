import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ElevatorService } from './../../elevator/elevator.service';
import { BuildingService } from './../../building/building.service';

@Component({
  selector: 'app-list-floors-with-elevators',
  templateUrl: './list-floors-with-elevators.component.html',
  styleUrls: ['./list-floors-with-elevators.component.scss']
})
export class ListFloorsWithElevatorsComponent {
  floors: any[] = [];
  submitted = false;
  serverResponse = '';
  errorResponse: string | null = null;

  buildingList: string[] = [];
  selectedBuilding: any;

  codeForm = new FormGroup({
    code: new FormControl('', Validators.required),
  });

  constructor(private elevatorService: ElevatorService, private router: Router, private buildingService: BuildingService,) {}

  ngOnInit() {
    this.loadBuildingList();
  }

  async loadBuildingList() {
    try {
      const buildings = await this.buildingService.listAllBuildings();

      if (this.buildingList.length > 0) {
        this.codeForm.patchValue({ code: this.buildingList[0] });
      }

      buildings.forEach((building) => {
        this.buildingList.push(building.code);
      });
    } catch (error) {
      console.error("Error loading buildings:", error);
    }
  }

  async listFloorsWithElevators() {
    this.submitted = true;
    if (this.codeForm.invalid) {
      return;
    }

    const code = this.codeForm.get('code')?.value;

    if (!code) {
      return;
    }

    this.floors = await this.elevatorService.listFloorsWithElevators(code);
    if (this.floors.length === 0) {
      this.errorResponse = this.elevatorService.errorResponse;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/floor']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
