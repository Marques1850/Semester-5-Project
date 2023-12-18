import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RobotService } from '../robot/robot.service';

@Component({
  selector: 'app-inhibit-robot',
  templateUrl: './inhibit-robot.component.html',
  styleUrls: ['./inhibit-robot.component.scss']
})
export class InhibitRobotComponent {
  inhibitRobotForm = new FormGroup({
    code: new FormControl('', Validators.required),
  });


  submitted = false;
  serverResponse = '';
  codeList: string[] = [];
  selectedRobot: any;

  constructor(private robotService: RobotService, private router: Router) {}

  ngOnInit() {
    this.loadRobotList();
    console.log(this.codeList);
  }

  async inhibitRobot() {
    this.submitted = true;

    const response = await this.robotService.inhibitRobot(this.inhibitRobotForm);
    if (response) {
      this.serverResponse = response;
    }
  }

  loadRobotList() {
    this.robotService.getRobots().then((robots: any[]) => {
      robots.forEach((robot) => {
        this.codeList.push(robot.code);
      });
  }
)}

  goBackToMenu() {
    this.router.navigate(['/robot']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
