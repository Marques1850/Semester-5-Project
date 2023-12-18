import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RobotTypeService {
  constructor(private http: HttpClient) {}
  errorResponse: string | null = null;

  async createRobotType(robotTypeForm: FormGroup) {
    if (robotTypeForm.invalid) {
      return;
    }

    const tasksCodeControl = robotTypeForm.get('tasksCode');
    let tasksCodeArray: string[]
    if (tasksCodeControl?.value) {
      tasksCodeArray = tasksCodeControl.value.split('\n');
    } else {
      tasksCodeArray = [];
    }

    const formValues = {
      ...robotTypeForm.value,
      tasksCode: tasksCodeArray,
    };

    try {
      return this.http.post('http://localhost:3000/api/robotType/createRobotType', formValues).toPromise().then((response: any) => {
        return `Robot Type Created: \nCode: ${response.code}\nDescription: ${response.description}\nTasks Code: ${response.tasksCode}`;
      }).catch(error => console.error(error));
    }catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return;
    }
  }

  async getRobotTypes() {
    try {
      return this.http.get('http://localhost:3000/api/robotType/getRobotTypes').toPromise().then((response: any) => {
        return response;
      }).catch(error => console.error(error));
    }catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return;
    }
  }
  
}