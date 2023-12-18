import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { async } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class integracaoService {
  constructor(private http: HttpClient) {}
  errorResponse: string | null = null;

  async getCaminhoEdificios(floor1:string | null, floor2:string | null): Promise<any> {
    /*
    return new Promise( (resolve, reject) => {
      const url = 'http://localhost:5000/uniao?param1='+floor1+'&param2='+floor2;
      const httprequest = new XMLHttpRequest();
      httprequest.open('GET', url, true);
      httprequest.onload = function () {
        resolve(httprequest.responseText);
      }
      httprequest.send();
    });
    */

    try {
      let caminho: any = [];
      return this.http.get<any[]>('http://localhost:3000/api/floor/uniao?floor1='+floor1+'&floor2='+floor2).toPromise().then((response: any) => {
        caminho = response;
        return caminho;
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
  
  

  async getFloors(): Promise<any[]> {
    try {
      let allFloors: any[] = [];
      return this.http.get<any[]>('http://localhost:3000/api/floor/getFloors').toPromise().then((response: any) => {
        allFloors = response;
        return allFloors;
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
