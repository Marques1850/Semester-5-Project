import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ElevatorService {
  constructor(private http: HttpClient) {}
  floors: any[] = [];
  errorResponse: string | null = null;

  async createElevator(createelevatorForm: FormGroup) {
    if (createelevatorForm.invalid) {
      return;
    }
  
    let floorsString = createelevatorForm.get('FloorsAttended')?.value;
    let floorsArray = floorsString ? floorsString.split(',').map(Number) : [];
  
    let elevatorData: { [key: string]: any; } = {};
  
    for (let control in createelevatorForm.controls) {
      let value = createelevatorForm.get(control)?.value;
      elevatorData[control] = value;
    }
  
    if (floorsArray && floorsArray.length > 0) {
      elevatorData['FloorsAttended'] = floorsArray;
    }
  
    try {
      return this.http.post('http://localhost:3000/api/elevator/createElevator', elevatorData).toPromise().then((response: any) => {
        return `Elevator Created: \nElevatorCode: ${response.ElevatorCode}\nDescription: ${response.Description}\nmarca: ${response.ElevatorType['marca']}\nmodelo: ${response.ElevatorType['modelo']}\nFloorsAttended: ${response.FloorsAttended}\nNumSerie: ${response.NumSerie}\n`;
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

  async updateElevator(updateelevatorForm: FormGroup) {
    if (updateelevatorForm.invalid) {
      return;
    }

    let floorsString = updateelevatorForm.get('FloorsAttended')?.value;
    let floorsArray = floorsString ? floorsString.split(',').map(Number) : [];
  
    let elevatorData: { [key: string]: any; } = {};
     
    for (let control in updateelevatorForm.controls) {
      let value = updateelevatorForm.get(control)?.value;
      if(control == 'ElevatorType'){
      if(value.marca != '' && value.modelo != ''){
        elevatorData[control] = value;
      }
      }else if( value != '' ){
      elevatorData[control] = value;
     }
    }
  
    if (floorsArray && floorsArray.length > 0) {
      elevatorData['FloorsAttended'] = floorsArray;
    }
      console.log(elevatorData);
    try {
      return this.http.patch('http://localhost:3000/api/elevator/updateElevator', elevatorData).toPromise().then((response: any) => {
        return `Elevator Updated: \nElevatorCode: ${response.ElevatorCode}\nDescription: ${response.Description}\nmarca: ${response.ElevatorType['marca']}\nmodelo: ${response.ElevatorType['modelo']}\nFloorsAttended: ${response.FloorsAttended}\nNumSerie: ${response.NumSerie}\n`;
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

  async listAllElevators(code: string) {
    let BuildingCodeStr = '';
    if (code != null) {
      BuildingCodeStr = code.toString();
    }
  
    const params = new HttpParams().set('BuildingCode', BuildingCodeStr);
    try {
      return this.http.get<any[]>('http://localhost:3000/api/elevator/getElevator', {params}).toPromise().then((response: any) => {
        return `Elevator in building: ${response.BuildingCode}\nElevatorCode: ${response.ElevatorCode}\nDescription: ${response.Description}\nmarca: ${response.ElevatorType['marca']}\nmodelo: ${response.ElevatorType['modelo']}\nFloorsAttended: ${response.FloorsAttended}\nNumSerie: ${response.NumSerie}\n`;
      }).catch(error => console.error(error));
    } catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return;
    }
  }

  async listFloorsWithElevators(code: string): Promise<any[]> {
    const url = 'http://localhost:3000/api/floor/listFloorsWithElevators';
    if (!code) {
      return [];
    }

    let codeStr = '';
    if (code != null) {
      codeStr = code.toString();
    }

    const params = new HttpParams().set('buildingCode', codeStr.toString());

    // Send a GET request to your Express server
    try {
      const response = await this.http.get<any>(url, { params }).toPromise();
      this.floors = response;
      return this.floors;
    } catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return [];
    }
  }
  
  loadlist(ElevatorList: string[]):string[] {
  
    this.http.get<any[]>('http://localhost:3000/api/elevator/getElevators')
    .subscribe((Elevators: any[]) => {
      Elevators.forEach((Elevator) => {
        ElevatorList.push(Elevator.BuildingCode);
      });
    });
  return ElevatorList;

  }

  loadlistCreate(BuildingList: string[]):string[] {
  
    this.http.get<any[]>('http://localhost:3000/api/elevator/getBuildingWithoutElevators')
    .subscribe((Buildings: any[]) => {
      Buildings.forEach((Building) => {
        BuildingList.push(Building.props.code);
      });
    });

  return BuildingList;

  }
}