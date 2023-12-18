import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GetRobotsByTaskComponent } from './get-robots-by-task.component';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RobotService } from './../robot.service';
import { of } from 'rxjs';

describe('GetRobotsByTaskComponent', () => {
  let component: GetRobotsByTaskComponent;
  let fixture: ComponentFixture<GetRobotsByTaskComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let robotServiceSpy: jasmine.SpyObj<RobotService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    robotServiceSpy = jasmine.createSpyObj('RobotService', ['getAllTasks', 'getRobotsByTask']);

    TestBed.configureTestingModule({
      declarations: [GetRobotsByTaskComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RobotService, useValue: robotServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(GetRobotsByTaskComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', fakeAsync(() => {
    const mockTasks = [{ code: 'Task1' }, { code: 'Task2' }];
    robotServiceSpy.getAllTasks.and.returnValue(Promise.resolve(mockTasks));

    component.ngOnInit();
    tick();

    expect(robotServiceSpy.getAllTasks).toHaveBeenCalledTimes(1);
    expect(component.tasksList).toEqual(['Task1', 'Task2']);
  }));

  it('should get robots by task when getRobotsByTask is called', fakeAsync(() => {
    const mockRobots = [{ code: 'R1', nickname: 'RoboBot', status: 'Active' }];
    let data:any = mockRobots;
    robotServiceSpy.getRobotsByTask.and.returnValue(of(data).toPromise());

    component.codeForm.patchValue({
      tasksCode: 'Task1',
    });

    component.getRobotsByTask();
    tick();

    expect(robotServiceSpy.getRobotsByTask).toHaveBeenCalledWith(component.codeForm);
    expect(component.robots).toEqual(mockRobots);
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
