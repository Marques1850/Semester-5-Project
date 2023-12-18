import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RobotService {
  constructor(private http: HttpClient) {}
  buildings: any[] = [];
  allBuildings: any[] = [];
  errorResponse: string | null = null;

  async createRobot(robotForm: FormGroup) {
    if (robotForm.invalid) {
      return;
    }

    try {
      return this.http.post('http://localhost:3000/api/robot/createRobot', robotForm.value).toPromise().then((response: any) => {
        return `Robot Created: \nNickname: ${ response.nickname }\nRobot Type Code: ${ response.robotTypeCode }\nSerial Number: ${ response.serialNumber }\nDescription: ${ response.description }\nStatus: ${ response.status }`;
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

  async inhibitRobot(inhibitRobotForm: FormGroup) {
    if (inhibitRobotForm.invalid) {
      return;
    }

    try {
      return this.http.patch('http://localhost:3000/api/robot/inhibitRobot', inhibitRobotForm.value).toPromise().then((response: any) => {
          return `Robot Inhibited: \nCode: ${response.code}\nNickname: ${response.nickname}\nRobot Type Code: ${response.robotTypeCode}\nSerial Number: ${response.serialNumber}\nDescription: ${response.description}\nStatus: ${response.status}`;
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

  async getRobots(): Promise<any[]> {
    try {
      return this.http.get<any[]>('http://localhost:3000/api/robot/getRobots').toPromise().then((response: any) => {
        this.allBuildings = response;
        return this.allBuildings;
      });
    } catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getRobotsByTask(tasksCodeForm: FormGroup): Promise<any[]> {
    if (tasksCodeForm.invalid) {
      return [];
    }
  
    const tasksCode = tasksCodeForm.get('tasksCode')?.value;
    let tasksCodeStr = '';
    if (tasksCode != null) {
      tasksCodeStr = tasksCode.toString();
    }
  
    const params = new HttpParams()
      .set('tasksCode', tasksCodeStr.toString());
  
    const url = 'http://localhost:3000/api/robot/getRobotsByTask';
  
    try {
      return this.http.get<any[]>(url, { params }).toPromise().then((response: any) => {
        this.buildings = response;
        return this.buildings;
      });
    } catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getAllTasks(): Promise<any[]> {
    try {
      return this.http.get<any[]>('http://localhost:3000/api/task/getAllTasks').toPromise().then((response: any) => {
        this.allBuildings = response;
        return this.allBuildings;
      });
    } catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return [];
    }

  }
  
  
}