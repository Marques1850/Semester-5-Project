import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BuildingService } from './../building.service';

@Component({
  selector: 'app-list-buildings-with-floor-range',
  templateUrl: './list-buildings-with-floor-range.component.html',
  styleUrls: ['./list-buildings-with-floor-range.component.scss']
})

export class ListBuildingsWithFloorRangeComponent {
  buildings: any[] = [];
  submitted = false;
  serverResponse = '';
  errorResponse: string | null = null;
  
  minMaxForm = new FormGroup({
    min: new FormControl('', [Validators.required , Validators.pattern('^[0-9]*$')]),
    max: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$')]),
  });

  constructor(private buildingService: BuildingService, private router: Router) {} // Inject BuildingService and Router

  async listBuildingsWithFloorRange() {
    this.submitted = true;
    this.errorResponse = null;
    this.buildings = [];
    if (this.minMaxForm.invalid) {
      return;
    }

    this.buildings = await this.buildingService.listBuildingsWithFloorRange(this.minMaxForm);
    if (this.buildings.length === 0) {
      this.errorResponse = this.buildingService.errorResponse;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/building']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
}
