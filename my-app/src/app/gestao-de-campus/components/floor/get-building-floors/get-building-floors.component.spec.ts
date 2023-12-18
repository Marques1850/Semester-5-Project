import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GetBuildingFloorsComponent } from './get-building-floors.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FloorService } from '../floor.service';
import { BuildingService } from '../../building/building.service';
import { of } from 'rxjs';

describe('GetBuildingFloorsComponent', () => {
  let component: GetBuildingFloorsComponent;
  let fixture: ComponentFixture<GetBuildingFloorsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let floorServiceSpy: jasmine.SpyObj<FloorService>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    floorServiceSpy = jasmine.createSpyObj('FloorService', ['getBuildingFloors']);
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['listAllBuildings']);

    TestBed.configureTestingModule({
      declarations: [GetBuildingFloorsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: FloorService, useValue: floorServiceSpy },
        { provide: BuildingService, useValue: buildingServiceSpy },
      ],
      imports: [ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(GetBuildingFloorsComponent);
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

    expect(component.codeForm.get('code')?.value).toEqual('B1');
  }));

  it('should get building floors and set floors array on successful request', fakeAsync(() => {
    const mockFloors = [{ id: 1, name: 'Floor 1' }, { id: 2, name: 'Floor 2' }];
    let data:any;
    data = mockFloors;
    floorServiceSpy.getBuildingFloors.and.returnValue(of(data).toPromise());

    // Preencha o formulário com valores válidos
    component.codeForm.setValue({ code: 'B1' });

    component.getBuildingFloors();
    tick();

    expect(floorServiceSpy.getBuildingFloors).toHaveBeenCalledWith('B1');
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
