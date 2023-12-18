import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DefaultPageComponent } from '../default-page/default-page.component';
import { StartMenuComponent } from '../start-menu/start-menu.component';


import { MenuGestorDeFrotaComponent } from './components/menu-gestor-de-frota/menu-gestor-de-frota.component';
import { GetRobotsByTaskComponent } from './components/robot/get-robots-by-task/get-robots-by-task.component';
import { GetRobotsComponent } from './components/robot/get-robots/get-robots.component';
import { CreateRobotTypeComponent } from './components/robot-type/create-robot-type/create-robot-type.component';
import { InhibitRobotComponent } from './components/inhibit-robot/inhibit-robot.component';
import { CreateRobotComponent } from './components/robot/create-robot/create-robot.component';
import { RobotTypeComponent } from './components/robot-type/robot-type.component';
import { RobotComponent } from './components/robot/robot.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'menuGestorDeFrota', component: MenuGestorDeFrotaComponent},
  {path: 'getRobotsByTask', component: GetRobotsByTaskComponent},
  {path: 'getRobots', component: GetRobotsComponent},
  {path: 'createRobotType', component: CreateRobotTypeComponent},
  {path: 'inhibitRobot', component: InhibitRobotComponent},
  {path: 'createRobot', component: CreateRobotComponent},
  {path: 'robotType', component: RobotTypeComponent},
  {path: 'robot', component: RobotComponent},
  
  {path: '', component:DefaultPageComponent },
  {path: 'startMenu', component: StartMenuComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestaoDeFrotaRoutingModule { }
