import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdateElevatorComponent } from './update-elevator.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ElevatorService } from './../elevator.service';
import { of } from 'rxjs';

describe('UpdateElevatorComponent', () => {
  let component: UpdateElevatorComponent;
  let fixture: ComponentFixture<UpdateElevatorComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let elevatorServiceSpy: jasmine.SpyObj<ElevatorService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    elevatorServiceSpy = jasmine.createSpyObj('ElevatorService', ['updateElevator', 'loadlist']);

    TestBed.configureTestingModule({
      declarations: [UpdateElevatorComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ElevatorService, useValue: elevatorServiceSpy },
      ],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(UpdateElevatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load elevator list on component initialization', () => {
    const mockElevatorList = ["Elevator 1", "Elevator 2", "Elevator 3"];
    elevatorServiceSpy.loadlist.and.returnValue(mockElevatorList);

    component.ngOnInit();

    expect(elevatorServiceSpy.loadlist).toHaveBeenCalledTimes(1);
    expect(component.ElevatorList).toEqual(mockElevatorList);
  });

  it('should update elevator on valid form submission', fakeAsync(() => {
    const mockResponse = 'Elevator updated successfully';
    elevatorServiceSpy.updateElevator.and.returnValue(of(mockResponse).toPromise());

    component.updateelevatorForm.setValue({
      BuildingCode: 'B1',
      ElevatorCode: 'E1',
      FloorsAttended: '5',
      ElevatorType: { marca: 'Brand', modelo: 'Model' },
      NumSerie: '123456',
      Description: 'Updated Elevator Description',
    });

    component.updateElevator();
    tick();

    expect(elevatorServiceSpy.updateElevator).toHaveBeenCalledTimes(1);
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
