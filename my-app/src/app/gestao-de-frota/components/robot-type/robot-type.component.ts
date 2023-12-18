import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-robot-type',
  templateUrl: './robot-type.component.html',
  styleUrls: ['./robot-type.component.scss']
})
export class RobotTypeComponent {

  constructor(private router: Router) { }

  openCreateRobotTypePage() {
    this.router.navigate(['/createRobotType']);
  }

  goBackToMenu() {
    this.router.navigate(['/menuGestorDeFrota']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
  
}
