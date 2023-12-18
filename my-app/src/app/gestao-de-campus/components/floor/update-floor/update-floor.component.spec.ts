import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdateFloorComponent } from './update-floor.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FloorService } from '../floor.service';
import { BuildingService } from '../../building/building.service';
import { of } from 'rxjs';

describe('UpdateFloorComponent', () => {
  let component: UpdateFloorComponent;
  let fixture: ComponentFixture<UpdateFloorComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let floorServiceSpy: jasmine.SpyObj<FloorService>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    floorServiceSpy = jasmine.createSpyObj('FloorService', ['updateFloor', 'getBuildingFloors']);
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['listAllBuildings']);

    TestBed.configureTestingModule({
      declarations: [UpdateFloorComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: FloorService, useValue: floorServiceSpy },
        { provide: BuildingService, useValue: buildingServiceSpy },
      ],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(UpdateFloorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load building list on init', fakeAsync(() => {
    const mockBuildingList = [{ code: "B1" }, { code: "B2" }];
    let data: any;
    data = mockBuildingList;
    buildingServiceSpy.listAllBuildings.and.returnValue(of(data).toPromise());
    floorServiceSpy.getBuildingFloors.and.returnValue(Promise.resolve([]));

    component.ngOnInit();
    tick();

    expect(buildingServiceSpy.listAllBuildings).toHaveBeenCalledTimes(1);
    expect(component.buildingList).toEqual(["B1","B2"]);
  }));

  it('should set default building code value on init', fakeAsync(() => {
    const mockBuildingList = [{ code: "B1" }, { code: "B2" }];
    buildingServiceSpy.listAllBuildings.and.returnValue(Promise.resolve(mockBuildingList));
    floorServiceSpy.getBuildingFloors.and.returnValue(Promise.resolve([]));

    component.ngOnInit();
    tick();

    expect(component.floorForm.get('buildingCode')?.value).toEqual("B1");
  }));

  it('should load building floors on buildingCode change', fakeAsync(() => {
    const mockFloors = [{ id: 1, name: "Floor 1" }, { id: 2, name: "Floor 2" }];
    const mockBuildingList = [{ code: "B1" }];
    buildingServiceSpy.listAllBuildings.and.returnValue(Promise.resolve(mockBuildingList));
    floorServiceSpy.getBuildingFloors.and.returnValue(Promise.resolve(mockFloors));

    component.floorForm.get('buildingCode')?.setValue("B1");
    component.ngOnInit();
    tick();

    expect(floorServiceSpy.getBuildingFloors).toHaveBeenCalledWith("B1");
    expect(component.selectedBuildingFloors).toEqual(["Floor 1", "Floor 2"]);
  }));

  it('should update floor on valid form submission', fakeAsync(() => {
    const mockResponse = 'Floor updated successfully';
    floorServiceSpy.updateFloor.and.returnValue(of(mockResponse).toPromise());

    component.floorForm.setValue({
      name: 'Floor 1',
      description: 'Description',
      buildingCode: 'B1',
      level: '1',
      width: '100',
      length: '100',
    });

    component.updateFloor();
    tick();

    expect(floorServiceSpy.updateFloor).toHaveBeenCalledTimes(1);
    expect(component.serverResponse).toEqual(mockResponse);
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
