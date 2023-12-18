import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BuildingService } from './../building.service';

@Component({
  selector: 'app-list-all-buildings',
  templateUrl: './list-all-buildings.component.html',
  styleUrls: ['./list-all-buildings.component.scss']
})
export class ListAllBuildingsComponent {
  buildings: any[] = [];
  serverResponse = '';

  constructor(private http: HttpClient, private router: Router, private BuildingService: BuildingService) {}

  async listAllBuildings() {
    this.buildings = await this.BuildingService.listAllBuildings();
  }

  goBackToMenu() {
    this.router.navigate(['/building']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }
}

