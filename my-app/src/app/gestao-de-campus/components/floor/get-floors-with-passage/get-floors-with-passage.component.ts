import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FloorService } from '../floor.service';

@Component({
  selector: 'app-get-floors-with-passage',
  templateUrl: './get-floors-with-passage.component.html',
  styleUrls: ['./get-floors-with-passage.component.scss']
})
export class GetFloorsWithPassageComponent {

  floors: any[] = [];
  submitted = false;

  constructor(private floorService: FloorService, private router: Router) {}

  ngOnInit(): void {
    this.getFloorsWithPassage();
  }

  async getFloorsWithPassage() {
    this.submitted = true;
    
    // Call the function from the service
    this.floors = await this.floorService.getFloorsWithPassage();
  }

  goBackToMenu() {
    this.router.navigate(['/floor']);
  }

  goToHome() {
    this.router.navigate(['/startMenu']);
  }

}
