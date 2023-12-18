import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RobotTypeService } from './../robot-type.service';

@Component({
  selector: 'app-create-robot-type',
  templateUrl: './create-robot-type.component.html',
  styleUrls: ['./create-robot-type.component.scss']
})
export class CreateRobotTypeComponent {
  robotTypeForm = new FormGroup({
    code: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    tasksCode: new FormControl('', Validators.required),
  });


  submitted = false;
  serverResponse = '';

  constructor(private robotTypeService: RobotTypeService, private router: Router) {}

  async createRobotType() {
    this.submitted = true;

    const response = await this.robotTypeService.createRobotType(this.robotTypeForm);
    if (response) {
      this.serverResponse = response;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/robotType']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
}
