import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  constructor(private http: HttpClient) {}
  buildings: any[] = [];
  allBuildings: any[] = [];
  errorResponse: string | null = null;

  async createBuilding(buildingForm: FormGroup) {
    if (buildingForm.invalid) {
      return;
    }

    try {
      return this.http.post('http://localhost:3000/api/building/createBuilding', buildingForm.value).toPromise().then((response: any) => {
        return `Floor Created: \nCode: ${response.code}\nName: ${response.name}\nDescription: ${response.description}\nWidth: ${response.width}\nLength: ${response.length}`;
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

  async updateBuilding(buildingForm: FormGroup) {
    if (buildingForm.invalid) {
      return;
    }

    let buildingData: { [key: string]: any; } = {};
     
    for (let control in buildingForm.controls) {
      let value = buildingForm.get(control)?.value;
      if (value != '') {
        buildingData[control] = value;
      }
    }

    console.log(buildingForm.value);

    try {
      return this.http.put('http://localhost:3000/api/building/updateBuilding', buildingData).toPromise().then((response: any) => {
          return `Building Updated: \nCode: ${response.code}\nName: ${response.name}\nDescription: ${response.description}\nWidth: ${response.width}\nLength: ${response.length}`;
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

  async listAllBuildings(): Promise<any[]> {
    try {
      return this.http.get<any[]>('http://localhost:3000/api/building/buildingsList').toPromise().then((response: any) => {
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

  async listBuildingsWithFloorRange(minMaxForm: FormGroup): Promise<any[]> {
    if (minMaxForm.invalid) {
      return Promise.resolve([]);
    }

    const min = minMaxForm.get('min')?.value;
    const max = minMaxForm.get('max')?.value;
    let minStr = '';
    let maxStr = '';
    if (min != null && max != null) {
      minStr = min.toString();
      maxStr = max.toString();
    }

    const params = new HttpParams()
      .set('min', minStr.toString())
      .set('max', maxStr.toString());
    const url = 'http://localhost:3000/api/building/listBuildingsWithFloorRange';
    return this.http.get<any>(url, { params }).toPromise().then((response: any) => {
      this.buildings = response;

      return this.buildings;
    }).catch((error: any) => {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return [];
    });
  }

  loadBuildingList(buildingsList: any[]):string[] {
    this.http.get<any[]>('http://localhost:3000/api/building/buildingsList').subscribe((buildings: any[]) => {
      buildings.forEach((building) => {
        buildingsList.push(building.code);
      });
    });
    return buildingsList;
  }

  
}