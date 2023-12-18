import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PassageService {
  constructor(private http: HttpClient) {}
  floors: any[] = [];
  errorResponse: string | null = null;

  async createPassage(createPassageForm: FormGroup) {
    if (createPassageForm.invalid) {
      return;
    }

    try {
      return this.http.post('http://localhost:3000/api/passage/createPassage', createPassageForm.value).toPromise().then((response: any) => {
        return `Passage Created: \nCode Building1: ${response.codeBuilding1}\nCode Building2: ${response.codeBuilding2}\nFloor Building1 Name: ${response.FloorBuilding1Name}\nFloor Building2 Name: ${response.FloorBuilding2Name}`;
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

  async updatePassage(passageForm: FormGroup) {
    try {
      console.log("Passed?");
      return this.http.put('http://localhost:3000/api/passage/updatePassage', passageForm.value).toPromise().then((response: any) => {
          return `Passage Updated: \nCode Building1: ${response.codeBuilding1}\nCode Building2: ${response.codeBuilding2}\nFloor Building1 Name: ${response.FloorBuilding1Name}\nFloor Building2 Name: ${response.FloorBuilding2Name}`;
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

  async getAllPassages(){
    try {
      return this.http.get('http://localhost:3000/api/passage/getAllPassages').toPromise().then((response: any) => {
        return response;
      }).catch(error => console.error(error));
    }catch (error: any) {
      if (error.status === 400) {
        this.errorResponse = error.error;
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async listPassagesBetweenBuildings(ListPassagesForm: FormGroup): Promise<any[]> {
    const url = 'http://localhost:3000/api/passage/getPassagesBuildings';
    if (ListPassagesForm.invalid) {
      return [];
    }
  
    const building1:any = ListPassagesForm.get('building1')?.value;
    const building2 :any = ListPassagesForm.get('building2')?.value;
    let building1Str = '';
    let building2Str = '';
    if (building1 != null && building2 != null) {
      building1Str = building1.toString();
      building2Str = building2.toString();
    }
  
    const params = new HttpParams()
      .set('codeBuilding1', building1Str.toString())
      .set('codeBuilding2', building2Str.toString());
  
    try {
      return this.http.get<any>(url, { params }).toPromise().then((response: any) => {
        return response;
      }).catch(error => console.error(error));
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