import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DefaultPageComponent } from '../default-page/default-page.component';
import { StartMenuComponent } from '../start-menu/start-menu.component';

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


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'menuGestorDeCampus', component: MenuGestorDeCampusComponent},
  {path: 'createBuilding', component: CreateBuildingComponent},
  {path: 'updateBuilding', component: UpdateBuildingComponent},
  {path: 'listAllBuildings', component: ListAllBuildingsComponent},
  {path: 'listBuildingsWithFloorRange', component: ListBuildingsWithFloorRangeComponent},
  {path: 'getBuildingFloors', component: GetBuildingFloorsComponent},
  {path: 'listPassagesBetweenBuildings', component: ListPassagesBetweenBuildingsComponent},
  {path: 'createPassage', component: CreatePassageComponent},
  {path: 'listFloorsWithElevators', component: ListFloorsWithElevatorsComponent},
  {path: 'createFloor', component: CreateFloorComponent},
  {path: 'updateElevator', component: UpdateElevatorComponent},
  {path: 'createRoom', component: CreateRoomComponent},
  {path: 'updateFloor', component: UpdateFloorComponent},
  {path: 'createElevator', component: CreateElevatorComponent},
  {path: 'listElevators', component: ListElevatorsComponent},
  {path: 'getFloorsWithPassage', component: GetFloorsWithPassageComponent},
  {path: 'updatePassage', component: UpdatePassageComponent},
  {path: 'building', component: BuildingComponent},
  {path: 'floor', component: FloorComponent},
  {path: 'passage', component: PassageComponent},
  {path: 'elevator', component: ElevatorComponent},
  {path: 'room', component: RoomComponent},
  {path: 'uploadMap', component: MapfloorComponent},
  {path: '', component:DefaultPageComponent },
  {path: 'startMenu', component: StartMenuComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestaoDeCampusRoutingModule { }
