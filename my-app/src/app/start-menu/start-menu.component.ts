import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponentComponent } from './../alert-component/alert-component.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { DataService } from '../dataService';
import { AuthService } from '@auth0/auth0-angular';



@Component({
  selector: 'app-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrls: ['./start-menu.component.scss']
})
export class StartMenuComponent {
  userRole: string;
  profileJson: string = '';

  constructor(private router: Router, private dialog: MatDialog, private dataService: DataService,public auth:AuthService) { 
    this.userRole = localStorage.getItem('userRole') || '';
    this.auth.idTokenClaims$.subscribe(
      (token) => {
       
        localStorage.setItem('token', JSON.stringify(token));
      
        if(token){
        localStorage.setItem('userRole', token['http://localhost:4200/startMenuuserRole']);
     
        }
      
      },
      (error) => {
        console.log('Error:', error);
      }
    );
    
  
  }

  
    
  openGestaoDeCampusPage() {
    if (this.userRole === 'CampusManager' || this.userRole === 'Admin') {
      this.router.navigate(['/menuGestorDeCampus']);
    } else {
      // use this.dialog.open(...) instead of this.openAlertDialog(...)
      this.dialog.open(AlertComponentComponent, {
        width: '250px',
        data: { message: 'Access Denied. You do not have permission to access this page.' },
        panelClass: 'my-custom-dialog',
        disableClose: true // Ensure this property is set to true
      });
      console.log('Access Denied. You do not have permission to access this page.');
    }
  }

  openGestaoDeFrotaPage() {
    if (this.userRole === 'FleetManager' || this.userRole === 'Admin') {
      this.router.navigate(['/menuGestorDeFrota']);
    } else {
      // use this.dialog.open(...) instead of alert(...)
      this.dialog.open(AlertComponentComponent, {
        width: '250px',
        data: { message: 'Access Denied. You do not have permission to access this page.' },
        disableClose: true // Ensure this property is set to true
      });
    }
  }

  openGestaoDeUtilizadoresPage() {
    if (this.userRole === 'Admin') {
      this.router.navigate(['/menuGestorDeUtilizadores']);
    } else {
      // use this.dialog.open(...) instead of alert(...)
      this.dialog.open(AlertComponentComponent, {
        width: '250px',
        data: { message: 'Access Denied. You do not have permission to access this page.' },
        disableClose: true // Ensure this property is set to true
      });
    }
  }

  downloadUserData(event: Event): void{
    event.preventDefault();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '30%',
      data: { 
        title: 'Download Confirmation', 
        message: 'Do you want to download a copy of your personal data?' 
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const email = localStorage.getItem('email') || '';
        this.dataService.downloadUserData(email).subscribe(
          (data) => {
            const blob = new Blob([data], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'userData.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          },
          (error) => {
            console.error('Error downloading data:', error);
          }
        );
      }
    });
  }

 

  navigato3DVisualizationPage() {
    this.router.navigate(['/visualizacao3d']);
  }

  navigateToTeamInfoPage() {
    this.router.navigate(['/about-us']);
  }

  navigatoIntegrationPage() {
    this.router.navigate(['/integracao']);
  }

  goBackToMenu() {
    this.router.navigate(['/login']);
  }
}
