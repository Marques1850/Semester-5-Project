import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RobotService } from './../robot.service';

@Component({
  selector: 'app-get-robots-by-task',
  templateUrl: './get-robots-by-task.component.html',
  styleUrls: ['./get-robots-by-task.component.scss']
})
export class GetRobotsByTaskComponent {
  robots: any[] = [];
  tasksList: any[] = [];
  selectedTask: any;
  submitted = false;
  serverResponse = '';

  codeForm = new FormGroup({
    tasksCode: new FormControl('', Validators.required),
  });

  constructor(private robotService: RobotService, 
    private router: Router) {}

  ngOnInit() {
    this.loadAllTasks();
  }

  async loadAllTasks() {
    try {
      const tasks = await this.robotService.getAllTasks();

      if (this.tasksList.length > 0) {
        this.codeForm.patchValue({ tasksCode: this.robots[0] });
      }

      tasks.forEach((task) => {
        this.tasksList.push(task.code);
      });
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  async getRobotsByTask() {
    this.submitted = true;
    if (this.codeForm.invalid) {
      return;
    }

    try {
      this.robots = await this.robotService.getRobotsByTask(this.codeForm);
    } catch (error) {
      console.error(error);
    }
  }

  goBackToMenu() {
    this.router.navigate(['/robot']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}