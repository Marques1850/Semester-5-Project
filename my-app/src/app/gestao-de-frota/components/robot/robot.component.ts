import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss']
})
export class RobotComponent {

  constructor(private router: Router) { }

  openCreateRobotPage() {
    this.router.navigate(['/createRobot']);
  }

  openInhibitRobotPage() {
    this.router.navigate(['/inhibitRobot']);
  }

  openNavigateToGetRobotsByTaskPage() {
    this.router.navigate(['/getRobotsByTask']);
  }

  openNavigateToGetRobotsPage() {
    this.router.navigate(['/getRobots']);
  }

  goBackToMenu() {
    this.router.navigate(['/menuGestorDeFrota']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
  
}
