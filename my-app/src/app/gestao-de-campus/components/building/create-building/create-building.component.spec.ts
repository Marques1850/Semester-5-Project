import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateBuildingComponent } from './create-building.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BuildingService } from './../building.service';
import { of, throwError } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('CreateBuildingComponent', () => {
  let component: CreateBuildingComponent;
  let fixture: ComponentFixture<CreateBuildingComponent>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['createBuilding']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [CreateBuildingComponent],
      providers: [
        { provide: BuildingService, useValue: buildingServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [ReactiveFormsModule]
    });

    fixture = TestBed.createComponent(CreateBuildingComponent);
    component = fixture.componentInstance;
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /building when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/building']);
  });

  it('should navigate to /startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });
  
  it('should set submitted to true', () => {
    component.createBuilding();
    expect(component.submitted).toBeTruthy();
  });

  it('should call createBuilding method of BuildingService', fakeAsync(() => {
    buildingServiceSpy.createBuilding.and.returnValue(of('success').toPromise());
    component.createBuilding();
    tick();
    expect(buildingServiceSpy.createBuilding).toHaveBeenCalledTimes(1);
  }));

});