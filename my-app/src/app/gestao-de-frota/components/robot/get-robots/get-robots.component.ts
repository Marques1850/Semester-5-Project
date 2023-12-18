import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RobotService } from '../robot.service';

@Component({
  selector: 'app-get-robots',
  templateUrl: './get-robots.component.html',
  styleUrls: ['./get-robots.component.scss']
})
export class GetRobotsComponent {
  serverResponse = '';
  robots: any[] = [];

  constructor(private robotService: RobotService, private router: Router) {}

  async getRobots() {
    this.robots = await this.robotService.getRobots();
  }

  goBackToMenu() {
    this.router.navigate(['/robot']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
