import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CreateRobotComponent } from './create-robot.component';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RobotService } from '../robot.service';
import { of } from 'rxjs';

describe('CreateRobotComponent', () => {
  let component: CreateRobotComponent;
  let fixture: ComponentFixture<CreateRobotComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let robotServiceSpy: jasmine.SpyObj<RobotService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    robotServiceSpy = jasmine.createSpyObj('RobotService', ['createRobot']);

    TestBed.configureTestingModule({
      declarations: [CreateRobotComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RobotService, useValue: robotServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(CreateRobotComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a robot when createRobot is called', fakeAsync(() => {
    const mockResponse = 'Robot created successfully';
    robotServiceSpy.createRobot.and.returnValue(Promise.resolve(mockResponse));

    component.robotForm.patchValue({
      code: 'R1',
      nickname: 'RoboBot',
      robotTypeCode: 'RT1',
      serialNumber: 'SN123',
      description: 'This is a test robot',
      status: 'Active',
    });

    component.createRobot();
    tick();

    expect(robotServiceSpy.createRobot).toHaveBeenCalledWith(component.robotForm);
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
