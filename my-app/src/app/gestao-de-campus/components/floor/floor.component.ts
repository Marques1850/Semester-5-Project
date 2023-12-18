import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent {

  constructor(private router: Router) { }

  openCreateFloorPage() {
    this.router.navigate(['/createFloor']);
  }

  openUpdateFloorPage(){
    this.router.navigate(['/updateFloor']);
  }

  openGetAllBuildingFloorsPage(){
    this.router.navigate(['/getBuildingFloors']);
  }

  openGetFloorsWithPassagePage(){
    this.router.navigate(['/getFloorsWithPassage']);
  }

  openlistFloorsWithElevatorsPage() {
    this.router.navigate(['/listFloorsWithElevators']);
  }

  openUploadMapPage() {
    this.router.navigate(['/uploadMap']);
  }

  goBackToMenu() {
    this.router.navigate(['/menuGestorDeCampus']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
