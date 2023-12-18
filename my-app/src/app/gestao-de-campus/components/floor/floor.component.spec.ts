import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FloorComponent } from './floor.component';

describe('FloorComponent', () => {
  let component: FloorComponent;
  let fixture: ComponentFixture<FloorComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [FloorComponent],
      providers: [
        { provide: Router, useValue: routerSpyObj },
      ],
    });

    fixture = TestBed.createComponent(FloorComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /createFloor when openCreateFloorPage is called', () => {
    component.openCreateFloorPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/createFloor']);
  });

  it('should navigate to /updateFloor when openUpdateFloorPage is called', () => {
    component.openUpdateFloorPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/updateFloor']);
  });

  it('should navigate to /getBuildingFloors when openGetAllBuildingFloorsPage is called', () => {
    component.openGetAllBuildingFloorsPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/getBuildingFloors']);
  });

  it('should navigate to /getFloorsWithPassage when openGetFloorsWithPassagePage is called', () => {
    component.openGetFloorsWithPassagePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/getFloorsWithPassage']);
  });

  it('should navigate to /listFloorsWithElevators when openlistFloorsWithElevatorsPage is called', () => {
    component.openlistFloorsWithElevatorsPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listFloorsWithElevators']);
  });

  it('should navigate to /uploadMap when openUploadMapPage is called', () => {
    component.openUploadMapPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/uploadMap']);
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