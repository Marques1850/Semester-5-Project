import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GestaoDeUtilizadoresRoutingModule } from './gestaoDeUtilizadoresRouting.module';

import { CreateUserComponent } from './components/create-user/create-user.component';
import { AcceptUtentComponent } from './components/accept-utent/accept-utent.component';
import { CancelUserComponent } from './components/cancel-user/cancel-user.component';
import { MenuGestorDeUtilizadoresComponent } from './components/menu-gestor-de-utilizadores/menu-gestor-de-utilizadores.component';
import { ChangeUserDataComponent } from './components/change-user-data/change-user-data.component';

import { UserService } from './components/user.service';

@NgModule({
  declarations: [
    CreateUserComponent,
    AcceptUtentComponent,
    CancelUserComponent,
    MenuGestorDeUtilizadoresComponent,
    ChangeUserDataComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    GestaoDeUtilizadoresRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ UserService ]
})
export class GestaoDeUtilizadoresModule { }
