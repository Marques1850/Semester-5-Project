import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FloorService {
  constructor(private http: HttpClient) {}
  floors: any[] = [];
  floor: any;
  errorResponse: string | null = null;

  async createFloor(floorForm: FormGroup) {
    if (floorForm.invalid) {
      return;
    }

    try {
      return this.http.post('http://localhost:3000/api/floor/createFloor', floorForm.value).toPromise().then((response: any) => {
        return `Floor Created: \nCode: ${response.code}\nName: ${response.name}\nDescription: ${response.description}\nBuilding Code: ${response.buildingCode}\nLevel: ${response.level}\nWidth: ${response.width}\nLength: ${response.length}`;
      }).catch(error => console.error(error));
    }catch (error: any) {
      if (error.status == 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return;
    }
  }

  async updateFloor(floorForm: FormGroup) {
    if (floorForm.invalid) {
      return;
    }
    let floorData: { [key: string]: any; } = {};
     
    for (let control in floorForm.controls) {
      let value = floorForm.get(control)?.value;
      if( value != '' ){
        floorData[control] = value;
      }
    }

    try {
      const response = await this.http.patch('http://localhost:3000/api/floor/updateFloor', floorData).toPromise();
      this.floor = response;
      return this.floor;
    } catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return;
    }
  }

  async getBuildingFloors(code: string): Promise<any[]> {
    const url = 'http://localhost:3000/api/building/getBuildingFloors';
    this.errorResponse = null;
    this.floors = [];
  
    let codeStr = '';
    if (code != null) {
      codeStr = code.toString();
    }
  
    const params = new HttpParams().set('code', codeStr);
  
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

  async getFloorsWithPassage(): Promise<any[]> {
    const url = 'http://localhost:3000/api/passage/getFloorsWithPassage';
    this.errorResponse = null;
    this.floors = [];
  
    try {
      const response = await this.http.get<any>(url).toPromise();
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

  async uploadMap(mapForm: FormData) {
    if (mapForm.get('name') == null || mapForm.get('plant') == null) {
      return;
    }

    try {
      return this.http.patch('http://localhost:3000/api/floor/uploadMap', mapForm).toPromise().then((response: any) => {
        return `Uplaod Map was successful!`;
      }).catch(error => console.error(error));
    }catch (error: any) {
      if (error.status == 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return;
    }
  }
  
}