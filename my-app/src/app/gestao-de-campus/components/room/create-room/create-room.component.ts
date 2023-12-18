import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RoomService } from './../room.service';
import { BuildingService } from './../../building/building.service';
import { FloorService } from './../../floor/floor.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {
  roomForm = new FormGroup({
    buildingCode: new FormControl('', Validators.required),
    floorName: new FormControl('', Validators.required),
    name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    description: new FormControl('', Validators.required),
    roomtype: new FormControl('', Validators.required),
  });

  submitted = false;
  serverResponse = '';
  buildingList: string[] = [];
  selectedBuildingFloors: string[] = [];
  selectedFloor: any;
  selectedType: any;
  selectedRoomTypes: string[]=[];

  constructor(private roomService: RoomService, private router: Router,private floorService: FloorService, 
    private buildingService: BuildingService) {}

  ngOnInit() {
    this.loadBuildingList();
    this.selectedRoomTypes.push.apply(this.selectedRoomTypes, ['gabinete', 'Laboratorio', 'Ànfiteatro', 'Outro']);
    this.roomForm.patchValue({ roomtype: "" });
  }
  loadBuildingList() {
    this.buildingService.listAllBuildings().then((buildings: any[]) => {
      buildings.forEach((building) => {
        this.buildingList.push(building.code);
      });
    });
    

    this.roomForm.get('buildingCode')?.valueChanges.subscribe((selectedBuilding: any) => {
      this.selectedBuildingFloors = [];
      if (selectedBuilding) {
        this.loadBuildingFloors(selectedBuilding);
      }
    });
  }
  loadBuildingFloors(buildingCode: string) {
    this.floorService.getBuildingFloors(buildingCode).then((floors: any[]) => {
      floors.forEach((floor) => {
        this.selectedBuildingFloors.push(floor.name);
      });
      if (this.selectedBuildingFloors.length > 0) { // set default value as first of the list by omisson
        this.roomForm.patchValue({ floorName: this.selectedBuildingFloors[0] });
      }
    });
  }

  async createRoom() {
    this.submitted = true;
    let newRoomForm = new FormGroup({
      floorName: new FormControl(this.roomForm.get('floorName')?.value, Validators.required),
      name: new FormControl(this.roomForm.get('name')?.value, [Validators.required, Validators.maxLength(255)]),
      description: new FormControl(this.roomForm.get('description')?.value, Validators.required),
      roomtype: new FormControl(this.roomForm.get('roomtype')?.value, Validators.required),
  });
    const response = await this.roomService.createRoom(newRoomForm);
    if (response) {
      this.serverResponse = response;
    }
  }

  goBackToMenu() {
    this.router.navigate(['/room']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
