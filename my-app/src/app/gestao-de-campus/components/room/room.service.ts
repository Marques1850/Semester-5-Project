import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(private http: HttpClient) {}
  errorResponse: string | null = null;

  async createRoom(roomForm: FormGroup) {
    if (roomForm.invalid) {
      return;
    }
  
    try {
      return this.http.post('http://localhost:3000/api/room/createRoom', roomForm.value).toPromise().then((response: any) => {
        return `Room Created: \nFloor Name: ${roomForm.value.floorName}\nName: ${response.name}\nDescription: ${response.description}\nRoom Type: ${response.roomtype}`;
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