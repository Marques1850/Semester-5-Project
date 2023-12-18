import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passage',
  templateUrl: './passage.component.html',
  styleUrls: ['./passage.component.scss']
})
export class PassageComponent {

  constructor(private router: Router) { }

  openCreatePassagePage() {
    this.router.navigate(['/createPassage']);
  }

  openUpdatePassagePage() {
    this.router.navigate(['/updatePassage']);
  }

  openListPassagesBetweenBuildingsPage() {
    this.router.navigate(['/listPassagesBetweenBuildings']);
  }

  goBackToMenu() {
    this.router.navigate(['/menuGestorDeCampus']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
