import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElevatorComponent } from './elevator.component';
import { Router } from '@angular/router';

describe('ElevatorComponent', () => {
  let component: ElevatorComponent;
  let fixture: ComponentFixture<ElevatorComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ElevatorComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(ElevatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /createElevator when openCreateElevatorPage is called', () => {
    component.openCreateElevatorPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/createElevator']);
  });

  it('should navigate to /updateElevator when openUpdateElevatorPage is called', () => {
    component.openUpdateElevatorPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/updateElevator']);
  });

  it('should navigate to /listElevators when openListAllElevatorPage is called', () => {
    component.openListAllElevatorPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listElevators']);
  });

  it('should navigate to /listFloorsWithElevators when openlistFloorsWithElevatorsPage is called', () => {
    component.openlistFloorsWithElevatorsPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listFloorsWithElevators']);
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
