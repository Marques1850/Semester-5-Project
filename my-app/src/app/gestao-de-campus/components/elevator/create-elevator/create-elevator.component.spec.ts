import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateElevatorComponent } from './create-elevator.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ElevatorService } from './../elevator.service';
import { of } from 'rxjs';

describe('CreateElevatorComponent', () => {
  let component: CreateElevatorComponent;
  let fixture: ComponentFixture<CreateElevatorComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let elevatorServiceSpy: jasmine.SpyObj<ElevatorService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    elevatorServiceSpy = jasmine.createSpyObj('ElevatorService', ['createElevator']);

    TestBed.configureTestingModule({
      declarations: [CreateElevatorComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ElevatorService, useValue: elevatorServiceSpy },
      ],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(CreateElevatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create elevator on valid form submission', fakeAsync(() => {
    const mockResponse = 'Elevator created successfully';
    elevatorServiceSpy.createElevator.and.returnValue(of(mockResponse).toPromise());

    component.createelevatorForm.setValue({
      BuildingCode: 'B1',
      ElevatorCode: 'E1',
      FloorsAttended: '5',
      ElevatorType: { marca: 'Brand', modelo: 'Model' },
      NumSerie: '123456',
      Description: 'Elevator Description',
    });

    component.createElevator();
    tick();

    expect(elevatorServiceSpy.createElevator).toHaveBeenCalledTimes(1);
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
