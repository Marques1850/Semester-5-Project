import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { CubeComponent } from './cube/cube.component';
import { DefaultPageComponent } from './default-page/default-page.component';
import { PlantComponent } from './plant/plant.component';
import { Visualizacao3dComponent } from './visualizacao3d/visualizacao3d.component';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { AlertComponentComponent } from './alert-component/alert-component.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { DataConsentComponent } from './data-consent/data-consent.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { IntegracaoComponent } from './integracao/integracao.component';
import { SingUpComponent } from './sing-up/sing-up.component';
import { DataService } from './dataService';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { AuthInterceptor } from './AuthHeader';
import { AuthModule } from '@auth0/auth0-angular';
import {environment as env} from '../environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CubeComponent,
    DefaultPageComponent,
    PlantComponent,
    Visualizacao3dComponent,
    StartMenuComponent,
    AlertComponentComponent,
    AboutUsComponent,
    PrivacyPolicyComponent,
    IntegracaoComponent,
    SingUpComponent,
    DataConsentComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    AuthModule.forRoot({
      ...env.auth,
     }),
  ],
  bootstrap: [AppComponent],
  providers: [ DataService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, ]
})
export class AppModule { }
