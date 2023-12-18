import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RobotComponent } from './robot.component';
import { Router } from '@angular/router';

describe('RobotComponent', () => {
  let component: RobotComponent;
  let fixture: ComponentFixture<RobotComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [RobotComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(RobotComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /createRobot when openCreateRobotPage is called', () => {
    component.openCreateRobotPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/createRobot']);
  });

  it('should navigate to /inhibitRobot when openInhibitRobotPage is called', () => {
    component.openInhibitRobotPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/inhibitRobot']);
  });

  it('should navigate to /getRobotsByTask when openNavigateToGetRobotsByTaskPage is called', () => {
    component.openNavigateToGetRobotsByTaskPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/getRobotsByTask']);
  });

  it('should navigate to /getRobots when openNavigateToGetRobotsPage is called', () => {
    component.openNavigateToGetRobotsPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/getRobots']);
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
