import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-elevator',
  templateUrl: './elevator.component.html',
  styleUrls: ['./elevator.component.scss']
})

export class ElevatorComponent {

  constructor(private router: Router) { }

  openCreateElevatorPage() {
    this.router.navigate(['/createElevator']);
  }

  openUpdateElevatorPage() {
    this.router.navigate(['/updateElevator']);
  }

  openListAllElevatorPage() {
    this.router.navigate(['/listElevators']);
  }

  openlistFloorsWithElevatorsPage() {
    this.router.navigate(['/listFloorsWithElevators']);
  }

  goBackToMenu() {
    this.router.navigate(['/menuGestorDeCampus']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
