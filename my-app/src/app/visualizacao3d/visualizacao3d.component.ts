import { Component, NgZone, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { visualizacao3dService } from './visualizacao3d.service';

declare var window: any;

@Component({
  selector: 'app-visualizacao3d',
  templateUrl: './visualizacao3d.component.html',
  styleUrls: ['./visualizacao3d.component.scss']
})
export class Visualizacao3dComponent {

  visualizacaoForm = new FormGroup({
    buildingCode: new FormControl('', Validators.required),
    floorName: new FormControl('', Validators.required),
  });


  submitted = false;
  serverResponse = '';
  buildingList: string[] = [];
  floorList: string[] = [];
  selectedFloor: any;
  errorResponse: string | null = null;

  constructor(private service: visualizacao3dService, private router: Router, public zone: NgZone) { }

  ngAfterViewInit() {
    window['angularComponentRef'] = {component: this, zone: this.zone};
  }

  updateForm(floorName: string, buildingCode: string) {
    console.log("updateForm" + floorName + " " + buildingCode);

    this.visualizacaoForm.patchValue({ floorName: floorName, buildingCode: buildingCode });
  }

  ngOnInit() {
    this.loadBuildingList();
  }

  loadBuildingList() {
    this.service.listAllBuildings()
      .then((buildings: any[]) => {
        buildings.forEach((building) => {
          this.buildingList.push(building.code);
        });
        if (this.buildingList.length > 0) { // set default value as first of the list by omisson
          this.visualizacaoForm.patchValue({ buildingCode: this.buildingList[0] });
        }
      });

    this.visualizacaoForm.get('buildingCode')?.valueChanges.subscribe((selectedBuilding: any) => {
      this.floorList = [];
      if (selectedBuilding) {
        this.loadBuildingFloors(selectedBuilding);
      }
    });
  }

  loadBuildingFloors(buildingCode: string) {
    this.service.getBuildingFloors(buildingCode)
      .then((floors: any[]) => {
        floors.forEach((floor) => {
          this.floorList.push(floor.name);
        });
        if (this.floorList.length > 0) { // set default value as first of the list by omisson
          this.visualizacaoForm.patchValue({ floorName: this.floorList[0] });
        }
      });
  }

   visualizacao() {
    this.submitted = true;
    console.log("name=" + this.visualizacaoForm.value.floorName);
    let message =  this.service.getUrl(this.visualizacaoForm);
    console.log("message: " + message);
    if (message) {
      console.log("name=" + this.visualizacaoForm.value.floorName);
      let path = "./../../assets/mazes/" + this.visualizacaoForm.value.floorName + ".json";
      console.log("path: " + path);
      this.router.navigate(['/plant'], { queryParams: { 'url': path, 'buildingCode': this.visualizacaoForm.value.buildingCode } });
    }
  }

  goBackToMenu() {
    this.router.navigate(['/startMenu']);
  }
}
