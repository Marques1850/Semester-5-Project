import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-gestor-de-utilizadores',
  templateUrl: './menu-gestor-de-utilizadores.component.html',
  styleUrls: ['./menu-gestor-de-utilizadores.component.scss']
})
export class MenuGestorDeUtilizadoresComponent {
  constructor(private router: Router) { }

  navigateToCreateUser() {
    this.router.navigate(['/createUser']);
  }
  navigateToAcceptUser(){
    this.router.navigate(['/acceptUser']);
  }
  navigateToCancelUser(){
    this.router.navigate(['/cancelUser']);
  }
  navigateToChangeUser(){
    this.router.navigate(['/changeUser']);
  }

  goBack() {
    this.router.navigate(['/startMenu']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
}
