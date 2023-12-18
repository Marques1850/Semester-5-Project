import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { InhibitRobotComponent } from './inhibit-robot.component';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RobotService } from '../robot/robot.service';
import { of } from 'rxjs';

describe('InhibitRobotComponent', () => {
  let component: InhibitRobotComponent;
  let fixture: ComponentFixture<InhibitRobotComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let robotServiceSpy: jasmine.SpyObj<RobotService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    robotServiceSpy = jasmine.createSpyObj('RobotService', ['inhibitRobot']);

    TestBed.configureTestingModule({
      declarations: [InhibitRobotComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RobotService, useValue: robotServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(InhibitRobotComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inhibit robot when inhibitRobot is called', fakeAsync(() => {
    const mockResponse = 'Robot inhibited successfully';
    robotServiceSpy.inhibitRobot.and.returnValue(Promise.resolve(mockResponse));

    component.inhibitRobotForm.patchValue({
      code: 'R1',
    });

    component.inhibitRobot();
    tick();

    expect(robotServiceSpy.inhibitRobot).toHaveBeenCalledWith(component.inhibitRobotForm);
    expect(component.serverResponse).toEqual(mockResponse);
  }));

  it('should navigate to /robot when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/robot']);
  });

  it('should navigate to /startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });
});
