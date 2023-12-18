import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-gestor-de-campus',
  templateUrl: './menu-gestor-de-campus.component.html',
  styleUrls: ['./menu-gestor-de-campus.component.scss']
})
export class MenuGestorDeCampusComponent {
  constructor(private router: Router) { }

  navigateToBuildingMenu() {
    this.router.navigate(['/building']);
  }

  navigateToFloorMenu() {
    this.router.navigate(['/floor']);
  }

  navigateToPassageMenu() {
    this.router.navigate(['/passage']);
  }

  navigateToElevatorMenu() {
    this.router.navigate(['/elevator']);
  }

  navigateToRoomMenu() {
    this.router.navigate(['/room']);
  }
  
  navigateToUpdateElevator() {
    this.router.navigate(['/updateElevator']);
  }

  navigateToListElevators() {
    this.router.navigate(['/listElevators']);
  }
  
  navigateToListFloorsWithElevator() {
    this.router.navigate(['/listFloorsWithElevators']);
  }
  
  goBack() {
    this.router.navigate(['/startMenu']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
