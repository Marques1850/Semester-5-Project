import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListFloorsWithElevatorsComponent } from './list-floors-with-elevators.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ElevatorService } from './../../elevator/elevator.service';
import { BuildingService } from './../../building/building.service';
import { of } from 'rxjs';

describe('ListFloorsWithElevatorsComponent', () => {
  let component: ListFloorsWithElevatorsComponent;
  let fixture: ComponentFixture<ListFloorsWithElevatorsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let elevatorServiceSpy: jasmine.SpyObj<ElevatorService>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    elevatorServiceSpy = jasmine.createSpyObj('ElevatorService', ['listFloorsWithElevators']);
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['listAllBuildings']);

    TestBed.configureTestingModule({
      declarations: [ListFloorsWithElevatorsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ElevatorService, useValue: elevatorServiceSpy },
        { provide: BuildingService, useValue: buildingServiceSpy}
      ],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(ListFloorsWithElevatorsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list floors with elevators on valid form submission', fakeAsync(() => {
    const mockFloors = [{ id: 1, name: 'Floor 1' }, { id: 2, name: 'Floor 2' }];
    let data: any;
    data = mockFloors;
    elevatorServiceSpy.listFloorsWithElevators.and.returnValue(of(data).toPromise());

    // Preencha o formulário com valores válidos
    component.codeForm.setValue({ code: 'E1' });

    component.listFloorsWithElevators();
    tick();

    expect(elevatorServiceSpy.listFloorsWithElevators).toHaveBeenCalledWith('E1');
    expect(component.floors).toEqual(mockFloors);
  }));


  it('should navigate to /floor when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/floor']);
  });

  it('should navigate to /startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });
});
