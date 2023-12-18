import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DefaultPageComponent } from '../default-page/default-page.component';
import { StartMenuComponent } from '../start-menu/start-menu.component';
import { MenuGestorDeUtilizadoresComponent } from './components/menu-gestor-de-utilizadores/menu-gestor-de-utilizadores.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { AcceptUtentComponent } from './components/accept-utent/accept-utent.component';
import { CancelUserComponent } from './components/cancel-user/cancel-user.component';
import { ChangeUserDataComponent } from './components/change-user-data/change-user-data.component';




const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'menuGestorDeUtilizadores', component: MenuGestorDeUtilizadoresComponent},
  {path: 'createUser', component: CreateUserComponent},
  {path: 'acceptUser', component: AcceptUtentComponent},
  {path: 'cancelUser', component: CancelUserComponent},
  {path: 'changeUser', component: ChangeUserDataComponent},
  
  {path: '', component:DefaultPageComponent },
  {path: 'startMenu', component: StartMenuComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestaoDeUtilizadoresRoutingModule { }
