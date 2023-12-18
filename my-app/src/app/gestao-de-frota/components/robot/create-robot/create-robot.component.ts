import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RobotService } from '../robot.service';
import { RobotTypeService } from '../../robot-type/robot-type.service';

@Component({
  selector: 'app-create-robot',
  templateUrl: './create-robot.component.html',
  styleUrls: ['./create-robot.component.scss']
})
export class CreateRobotComponent {
  robotForm = new FormGroup({
    code: new FormControl('', Validators.required),
    nickname: new FormControl('', Validators.required),
    robotTypeCode: new FormControl('', Validators.required),
    serialNumber: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    status: new FormControl('', Validators.required),
  });


  submitted = false;
  serverResponse = '';
  errorResponse: string | null = null;
  robot: any;
  selectedRobotType: any;
  selectedStatus: any;
  robotTypes: string[] = [];
  statusList: string[] = [];

  constructor(
    private robotService: RobotService,
    private robotTypeService: RobotTypeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.listRobotTypes();
    this.statusList.push.apply(this.statusList, ['Active', 'Inhibited', 'Inactive', 'Maintenance']);
  }

  listRobotTypes(){
     this.robotTypeService.getRobotTypes().then((robotTypes: any[]) => {
        robotTypes.forEach((robotType) => {
          this.robotTypes.push(robotType.code);
        });
      }
  )}

  async createRobot() {
    this.submitted = true;

    const response = await this.robotService.createRobot(this.robotForm);
    if (response) {
      this.serverResponse = response;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/robot']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
