import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CreateRobotTypeComponent } from './create-robot-type.component';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RobotTypeService } from './../robot-type.service';
import { of } from 'rxjs';

describe('CreateRobotTypeComponent', () => {
  let component: CreateRobotTypeComponent;
  let fixture: ComponentFixture<CreateRobotTypeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let robotTypeServiceSpy: jasmine.SpyObj<RobotTypeService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    robotTypeServiceSpy = jasmine.createSpyObj('RobotTypeService', ['createRobotType']);

    TestBed.configureTestingModule({
      declarations: [CreateRobotTypeComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RobotTypeService, useValue: robotTypeServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(CreateRobotTypeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a robot type when createRobotType is called', fakeAsync(() => {
    const mockResponse = 'Robot type created successfully';
    robotTypeServiceSpy.createRobotType.and.returnValue(Promise.resolve(mockResponse));

    component.robotTypeForm.patchValue({
      code: 'RT1',
      description: 'Test Robot Type',
      tasksCode: 'Task1',
    });

    component.createRobotType();
    tick();

    expect(robotTypeServiceSpy.createRobotType).toHaveBeenCalledWith(component.robotTypeForm);
    expect(component.serverResponse).toEqual(mockResponse);
  }));

  it('should navigate to /robotType when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/robotType']);
  });

  it('should navigate to /startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });
});
