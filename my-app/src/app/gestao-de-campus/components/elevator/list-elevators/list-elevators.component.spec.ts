import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListElevatorsComponent } from './list-elevators.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ElevatorService } from './../elevator.service';
import { of } from 'rxjs';

describe('ListElevatorsComponent', () => {
  let component: ListElevatorsComponent;
  let fixture: ComponentFixture<ListElevatorsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let elevatorServiceSpy: jasmine.SpyObj<ElevatorService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    elevatorServiceSpy = jasmine.createSpyObj('ElevatorService', ['listAllElevators']);

    TestBed.configureTestingModule({
      declarations: [ListElevatorsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ElevatorService, useValue: elevatorServiceSpy },
      ],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(ListElevatorsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list all elevators on valid form submission', fakeAsync(() => {
    const mockResponse = 'Elevator 1\nElevator 2\nElevator 3';
    elevatorServiceSpy.listAllElevators.and.returnValue(of(mockResponse).toPromise());

    component.getelevatorForm.setValue({
      BuildingCode: 'B1',
    });

    component.listAllElevators();
    tick();

    expect(elevatorServiceSpy.listAllElevators).toHaveBeenCalledOnceWith('B1');
    expect(component.serverResponse).toEqual(mockResponse);
  }));

  it('should navigate to /elevator when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/elevator']);
  });

  it('should navigate to /startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });
});
