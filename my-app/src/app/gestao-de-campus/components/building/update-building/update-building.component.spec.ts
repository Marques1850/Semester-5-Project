import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdateBuildingComponent } from './update-building.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BuildingService } from './../building.service';
import { of } from 'rxjs';

describe('UpdateBuildingComponent', () => {
  let component: UpdateBuildingComponent;
  let fixture: ComponentFixture<UpdateBuildingComponent>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['loadBuildingList', 'updateBuilding']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [UpdateBuildingComponent],
      providers: [
        { provide: BuildingService, useValue: buildingServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(UpdateBuildingComponent);
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

  it('should load building list on init', fakeAsync(() => {
    const mockBuildings = ["Building1","Building2"];
    buildingServiceSpy.loadBuildingList.and.returnValue(mockBuildings);

    component.ngOnInit();
    tick();

    expect(buildingServiceSpy.loadBuildingList).toHaveBeenCalledTimes(1);
    expect(component.buildingList).toEqual(mockBuildings);
  }));

  it('should update building and set server response on successful update', fakeAsync(() => {
    const mockResponse = "Building updated successfully";
    buildingServiceSpy.updateBuilding.and.returnValue(of(mockResponse).toPromise());

    component.updatebuildingForm.setValue({ 
      code: '123', 
      name: 'Building 123', 
      description: 'Updated description', 
      width: '50', 
      length: '75' 
    });

    component.updateBuilding();
    tick();

    expect(buildingServiceSpy.updateBuilding).toHaveBeenCalledTimes(1);
    expect(component.serverResponse).toEqual(mockResponse);
  }));

});
