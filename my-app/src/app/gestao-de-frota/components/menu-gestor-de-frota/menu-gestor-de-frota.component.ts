import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-gestor-de-frota',
  templateUrl: './menu-gestor-de-frota.component.html',
  styleUrls: ['./menu-gestor-de-frota.component.scss']
})
export class MenuGestorDeFrotaComponent {
  constructor(private router: Router) { }

  navigateToRobotTypeMenu() {
    this.router.navigate(['/robotType']);
  }

  navigateToRobotMenu() {
    this.router.navigate(['/robot']);
  }

  goBack() {
    this.router.navigate(['/startMenu']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
  
}
