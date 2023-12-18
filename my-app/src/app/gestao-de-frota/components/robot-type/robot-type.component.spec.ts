import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RobotTypeComponent } from './robot-type.component';
import { Router } from '@angular/router';

describe('RobotTypeComponent', () => {
  let component: RobotTypeComponent;
  let fixture: ComponentFixture<RobotTypeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [RobotTypeComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(RobotTypeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /createRobotType when openCreateRobotTypePage is called', () => {
    component.openCreateRobotTypePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/createRobotType']);
  });

  it('should navigate to /menuGestorDeFrota when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/menuGestorDeFrota']);
  });

  it('should navigate to /startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });
});
