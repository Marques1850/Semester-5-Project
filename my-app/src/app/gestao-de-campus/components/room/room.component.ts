import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent {

  constructor(private router: Router) { }

  openCreateRoomPage() {
    this.router.navigate(['/createRoom']);
  }

  goBackToMenu() {
    this.router.navigate(['/menuGestorDeCampus']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
