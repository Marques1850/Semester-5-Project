import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateFloorComponent } from './create-floor.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FloorService } from '../floor.service';
import { BuildingService } from '../../building/building.service';
import { of } from 'rxjs';

describe('CreateFloorComponent', () => {
  let component: CreateFloorComponent;
  let fixture: ComponentFixture<CreateFloorComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let floorServiceSpy: jasmine.SpyObj<FloorService>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    floorServiceSpy = jasmine.createSpyObj('FloorService', ['createFloor']);
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['listAllBuildings']);

    TestBed.configureTestingModule({
      declarations: [CreateFloorComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: FloorService, useValue: floorServiceSpy },
        { provide: BuildingService, useValue: buildingServiceSpy },
      ],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(CreateFloorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load building list on init', fakeAsync(() => {
    const mockBuildingList = [{ code: 'B1' }, { code: 'B2' }];
    buildingServiceSpy.listAllBuildings.and.returnValue(Promise.resolve(mockBuildingList));

    component.ngOnInit();
    tick();

    expect(buildingServiceSpy.listAllBuildings).toHaveBeenCalledTimes(1);
    expect(component.buildingList).toEqual(['B1', 'B2']);
  }));

  it('should set default building code value on init', fakeAsync(() => {
    const mockBuildingList = [{ code: 'B1' }, { code: 'B2' }];
    buildingServiceSpy.listAllBuildings.and.returnValue(Promise.resolve(mockBuildingList));

    component.ngOnInit();
    tick();

    expect(component.floorForm.get('buildingCode')?.value).toEqual('B1');
  }));

  it('should create floor and set server response on successful creation', fakeAsync(() => {
    const mockResponse = 'Floor created successfully';
    floorServiceSpy.createFloor.and.returnValue(of(mockResponse).toPromise());

    component.floorForm.setValue({
      name: 'Floor 1',
      description: 'Description',
      buildingCode: 'B1',
      level: '1',
      width: '50',
      length: '75',
    });

    component.createFloor();
    tick();

    expect(floorServiceSpy.createFloor).toHaveBeenCalledTimes(1);
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
