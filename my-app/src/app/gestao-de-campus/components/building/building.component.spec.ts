import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BuildingComponent } from './building.component';
import { BuildingService } from './building.service';
import { Router } from '@angular/router';


describe('BuildingComponent', () => {
  let component: BuildingComponent;
  let fixture: ComponentFixture<BuildingComponent>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [BuildingComponent],
      providers: [
        { provide: BuildingService, useValue: buildingServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      imports: [RouterTestingModule]
    });

    fixture = TestBed.createComponent(BuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to /createBuilding when openCreateBuildingPage is called', () => {
    component.openCreateBuildingPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/createBuilding']);
  });

  it('should navigate to /updateBuilding when openUpdateBuildingPage is called', () => {
    component.openUpdateBuildingPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/updateBuilding']);
  });

  it('should navigate to /listAllBuildings when navigateToListAllBuildingsPage is called', () => {
    component.navigateToListAllBuildingsPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listAllBuildings']);
  });

  it('should navigate to /listBuildingsWithFloorRange when navigateToListBuildingsWithFloorRange is called', () => {
    component.navigateToListBuildingsWithFloorRange();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listBuildingsWithFloorRange']);
  });

  it('should navigate to /menuGestorDeCampus when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/menuGestorDeCampus']);
  });

  it('should navigate to /startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });

});
