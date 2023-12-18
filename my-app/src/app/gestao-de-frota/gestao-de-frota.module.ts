import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { GestaoDeFrotaRoutingModule } from './gestaoDeFrotaRouting.module';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MenuGestorDeFrotaComponent } from './components/menu-gestor-de-frota/menu-gestor-de-frota.component';
import { GetRobotsByTaskComponent } from './components/robot/get-robots-by-task/get-robots-by-task.component';
import { GetRobotsComponent } from './components/robot/get-robots/get-robots.component';
import { CreateRobotTypeComponent } from './components/robot-type/create-robot-type/create-robot-type.component';
import { InhibitRobotComponent } from './components/inhibit-robot/inhibit-robot.component';
import { CreateRobotComponent } from './components/robot/create-robot/create-robot.component';
import { RobotTypeComponent } from './components/robot-type/robot-type.component';
import { RobotComponent } from './components/robot/robot.component';
import { RobotTypeService } from './components/robot-type/robot-type.service';
import { RobotService } from './components/robot/robot.service';


@NgModule({
  declarations: [
    MenuGestorDeFrotaComponent,
    GetRobotsByTaskComponent,
    GetRobotsComponent,
    CreateRobotTypeComponent,
    InhibitRobotComponent,
    CreateRobotComponent,
    RobotTypeComponent,
    RobotComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    GestaoDeFrotaRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [RobotTypeService, RobotService]
})
export class GestaoDeFrotaModule { }
