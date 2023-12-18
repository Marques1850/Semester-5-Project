import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class visualizacao3dService {
  constructor(private http: HttpClient) {}
  errorResponse: string | null = null;

  getUrl(visualizacaoForm: FormGroup) {
    console.log(visualizacaoForm.value);
    if (visualizacaoForm.invalid) {
      return;
    }
    try {
      const params = new HttpParams()
        .set('buildingCode', visualizacaoForm.value.buildingCode)
        .set('floorName', visualizacaoForm.value.floorName);
      return this.http.get<string>('http://localhost:3000/api/floor/getPlant', {params}).toPromise().then((response: any) => {
        console.log(visualizacaoForm.value);
        return "plant"+response.plant;
      });
    } catch (error: any) {
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
      let allBuildings: any[] = [];
      return this.http.get<any[]>('http://localhost:3000/api/building/buildingsList').toPromise().then((response: any) => {
        allBuildings = response;
        return allBuildings;
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

  async getBuildingFloors(code: string): Promise<any[]> {
    const url = 'http://localhost:3000/api/building/getBuildingFloors';
    let floors: any[] = [];
  
    let codeStr = '';
    if (code != null) {
      codeStr = code.toString();
    }
    const params = new HttpParams().set('code', codeStr);
  
    try {
      const response = await this.http.get<any>(url, { params }).toPromise();
      floors = response;
      return floors;
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
