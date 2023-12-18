import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SingUpComponent } from '../sing-up/sing-up.component';


@Component({
  selector: 'data-consent-component',
  templateUrl: './data-consent.component.html',
  styleUrls: ['./data-consent.component.scss']
})
export class DataConsentComponent {
  constructor( private dialogRef: MatDialogRef<DataConsentComponent>) {}

  onSubmit(consent:boolean){
    
    this.dialogRef.close(consent);
  
  }
}
