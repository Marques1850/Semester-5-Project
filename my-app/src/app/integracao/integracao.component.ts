import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { integracaoService } from './integracao.service';

@Component({
  selector: 'app-integracao',
  templateUrl: './integracao.component.html',
  styleUrls: ['./integracao.component.scss']
})
export class IntegracaoComponent {
  
  visualizacaoForm = new FormGroup({
    FloorName1: new FormControl('', Validators.required),
    FloorName2: new FormControl('', Validators.required),
  });

  submitted = false;
  serverResponse = '';
  buildingList: string[] = [];
  floorList: string[] = [];
  selectedFloor: any;
  errorResponse: string | null = null;
  resultado: any;
  
  constructor(private service: integracaoService, private router: Router) {}

  ngOnInit() {
    this.loadFloorsList();
  }

  loadFloorsList() {
    this.service.getFloors()
      .then((floors: any[]) => {
        floors.forEach((floor) => {
          this.floorList.push(floor.name);
        });
        if (this.floorList.length > 0) { // set default value as first of the list by omisson
          this.visualizacaoForm.patchValue({ FloorName1: this.floorList[0] });
        }
      });
  }

  async integracao() {
    this.submitted = true;

    this.serverResponse = await this.service.getCaminhoEdificios(this.visualizacaoForm.controls.FloorName1.value, this.visualizacaoForm.controls.FloorName2.value);
      
  }

  goBackToMenu() {
    this.router.navigate(['/startMenu']);
  }

  // Function to update the floor list when a floor is selected
  updateFloorList(floor: string) {
    this.floorList = this.floorList.filter(item => item !== floor);
  }
}
