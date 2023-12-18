import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GetRobotsComponent } from './get-robots.component';
import { Router } from '@angular/router';
import { RobotService } from '../robot.service';
import { of } from 'rxjs';

describe('GetRobotsComponent', () => {
  let component: GetRobotsComponent;
  let fixture: ComponentFixture<GetRobotsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let robotServiceSpy: jasmine.SpyObj<RobotService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    robotServiceSpy = jasmine.createSpyObj('RobotService', ['getRobots']);

    TestBed.configureTestingModule({
      declarations: [GetRobotsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RobotService, useValue: robotServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(GetRobotsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get robots on init', fakeAsync(() => {
    const mockRobots = [{ code: 'R1', nickname: 'RoboBot', status: 'Active' }];
    let data: any = mockRobots;
    robotServiceSpy.getRobots.and.returnValue(of(data).toPromise());

    component.getRobots();
    tick();

    expect(robotServiceSpy.getRobots).toHaveBeenCalledTimes(1);
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
