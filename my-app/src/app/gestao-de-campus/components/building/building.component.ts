import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BuildingService } from './building.service';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.scss']
})
export class BuildingComponent {

  constructor(private router: Router, private BuildingService: BuildingService) { }

  openCreateBuildingPage() {
    this.router.navigate(['/createBuilding']);
  }

  openUpdateBuildingPage() {
    this.router.navigate(['/updateBuilding']);
  }

  navigateToListAllBuildingsPage() {
    this.router.navigate(['/listAllBuildings']);
  }

  navigateToListBuildingsWithFloorRange() {
    this.router.navigate(['/listBuildingsWithFloorRange']);
  }

  goBackToMenu() {
    this.router.navigate(['/menuGestorDeCampus']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
}
