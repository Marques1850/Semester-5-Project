import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MenuGestorDeCampusComponent } from './components/menu-gestor-de-campus/menu-gestor-de-campus.component';
import { CreateBuildingComponent } from './components/building/create-building/create-building.component';
import { UpdateBuildingComponent } from './components/building/update-building/update-building.component';
import { ListAllBuildingsComponent } from './components/building/list-all-buildings/list-all-buildings.component';
import { ListBuildingsWithFloorRangeComponent } from './components/building/list-buildings-with-floor-range/list-buildings-with-floor-range.component';
import { GetBuildingFloorsComponent } from './components/floor/get-building-floors/get-building-floors.component';
import { ListPassagesBetweenBuildingsComponent } from './components/passage/list-passages-between-buildings/list-passages-between-buildings.component';
import { CreatePassageComponent } from './components/passage/create-passage/create-passage.component';
import { ListFloorsWithElevatorsComponent } from './components/floor/list-floors-with-elevators/list-floors-with-elevators.component';
import { CreateFloorComponent } from './components/floor/create-floor/create-floor.component';
import { UpdateElevatorComponent } from './components/elevator/update-elevator/update-elevator.component';
import { CreateRoomComponent } from './components/room/create-room/create-room.component';
import { UpdateFloorComponent } from './components/floor/update-floor/update-floor.component';
import { CreateElevatorComponent } from './components/elevator/create-elevator/create-elevator.component';
import { ListElevatorsComponent } from './components/elevator/list-elevators/list-elevators.component';
import { GetFloorsWithPassageComponent } from './components/floor/get-floors-with-passage/get-floors-with-passage.component';
import { UpdatePassageComponent } from './components/passage/update-passage/update-passage.component';
import { BuildingComponent } from './components/building/building.component';
import { FloorComponent } from './components/floor/floor.component';
import { PassageComponent } from './components/passage/passage.component';
import { ElevatorComponent } from './components/elevator/elevator.component';
import { RoomComponent } from './components/room/room.component';
import { MapfloorComponent } from './components/floor/mapfloor/mapfloor.component';
import { BuildingService } from './components/building/building.service';
import { FloorService } from './components/floor/floor.service';
import { PassageService } from './components/passage/passage.service';
import { ElevatorService } from './components/elevator/elevator.service';
import { RoomService } from './components/room/room.service';
import { GestaoDeCampusRoutingModule } from './gestaoDeCampusRouting.module';


@NgModule({
  declarations: [
    MenuGestorDeCampusComponent,
    CreateBuildingComponent,
    UpdateBuildingComponent,
    ListAllBuildingsComponent,
    ListBuildingsWithFloorRangeComponent,
    GetBuildingFloorsComponent,
    ListPassagesBetweenBuildingsComponent,
    CreatePassageComponent,
    ListFloorsWithElevatorsComponent,
    CreateFloorComponent,
    UpdateElevatorComponent,
    CreateRoomComponent,
    UpdateFloorComponent,
    CreateElevatorComponent,
    ListElevatorsComponent,
    GetFloorsWithPassageComponent,
    UpdatePassageComponent,
    BuildingComponent,
    FloorComponent,
    PassageComponent,
    ElevatorComponent,
    RoomComponent,
    MapfloorComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    GestaoDeCampusRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [BuildingService, FloorService, PassageService, ElevatorService, RoomService]
})
export class GestaoDeCampusModule { }
