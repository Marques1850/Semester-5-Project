import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CubeComponent } from './cube/cube.component';
import { DefaultPageComponent } from './default-page/default-page.component';
import { PlantComponent } from './plant/plant.component';
import { Visualizacao3dComponent } from './visualizacao3d/visualizacao3d.component';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { AlertComponentComponent } from './alert-component/alert-component.component';
import { GestaoDeFrotaRoutingModule } from './gestao-de-frota/gestaoDeFrotaRouting.module';
import { GestaoDeCampusRoutingModule } from './gestao-de-campus/gestaoDeCampusRouting.module';
import { GestaoDeUtilizadoresRoutingModule } from './gestao-de-utilizadores/gestaoDeUtilizadoresRouting.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { IntegracaoComponent } from './integracao/integracao.component';
import { SingUpComponent } from './sing-up/sing-up.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';



const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'cube', component: CubeComponent},
  {path: '', component:DefaultPageComponent },
  {path: 'plant', component: PlantComponent},
  {path: 'visualizacao3d', component: Visualizacao3dComponent},
  {path: 'startMenu', component: StartMenuComponent},
  {path: 'alertComponet', component: AlertComponentComponent},
  {path: 'gestaoDeFrota', loadChildren: () => import('./gestao-de-frota/gestao-de-frota.module').then(m => m.GestaoDeFrotaModule)},
  {path: 'gestaoDeCampus', loadChildren: () => import('./gestao-de-campus/gestao-de-campus.module').then(m => m.GestaoDeCampusModule)},
  {path: 'gestaoDeUtilizadores', loadChildren: () => import('./gestao-de-utilizadores/gestao-de-utilizadores.module').then(m => m.GestaoDeUtilizadoresModule)},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  {path: 'integracao', component: IntegracaoComponent},
  {path: 'singup', component: SingUpComponent},
  {path: 'confirmationDialog', component: ConfirmationDialogComponent}
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes), 
    GestaoDeFrotaRoutingModule,
    GestaoDeCampusRoutingModule,
    GestaoDeUtilizadoresRoutingModule
  ], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
