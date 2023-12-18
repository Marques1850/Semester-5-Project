import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdatePassageComponent } from './update-passage.component';
import { Router } from '@angular/router';
import { PassageService } from './../passage.service';
import { BuildingService } from '../../building/building.service';
import { FloorService } from '../../floor/floor.service';
import { of } from 'rxjs';

describe('UpdatePassageComponent', () => {
  let component: UpdatePassageComponent;
  let fixture: ComponentFixture<UpdatePassageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let passageServiceSpy: jasmine.SpyObj<PassageService>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;
  let floorServiceSpy: jasmine.SpyObj<FloorService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    passageServiceSpy = jasmine.createSpyObj('PassageService', ['getAllPassages', 'updatePassage']);
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['listAllBuildings']);
    floorServiceSpy = jasmine.createSpyObj('FloorService', ['getBuildingFloors']);

    TestBed.configureTestingModule({
      declarations: [UpdatePassageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: PassageService, useValue: passageServiceSpy },
        { provide: BuildingService, useValue: buildingServiceSpy },
        { provide: FloorService, useValue: floorServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(UpdatePassageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load passage list and building list on init', fakeAsync(() => {
    const mockPassages = [{ codigo: 'P1' }, { codigo: 'P2' }];
    let data1 : any = mockPassages;
    const mockBuildings = [{ code: 'B1' }, { code: 'B2' }];
    let data2 : any = mockBuildings;
    const mockFloors1 = [{ name: 'Floor 1' }];
    let data3 : any = mockFloors1;
    const mockFloors2 = [{ name: 'Floor 2' }];
    let data4 : any = mockFloors2;

    passageServiceSpy.getAllPassages.and.returnValue(Promise.resolve(data1));
    buildingServiceSpy.listAllBuildings.and.returnValue(Promise.resolve(data2));
    floorServiceSpy.getBuildingFloors.and.returnValues(
      Promise.resolve(data3),
      Promise.resolve(data4)
    );
    

    component.ngOnInit();
    tick();

    expect(passageServiceSpy.getAllPassages).toHaveBeenCalledTimes(1);
    expect(buildingServiceSpy.listAllBuildings).toHaveBeenCalledTimes(1);

    expect(component.passageList).toEqual(['P1', 'P2']);
    expect(component.buildingList).toEqual(['B1', 'B2']);
    
  }));

  it('should update passage and navigate when updatePassage is called', fakeAsync(() => {
    const mockResponse = 'Passage updated successfully';
    passageServiceSpy.updatePassage.and.returnValue(Promise.resolve(mockResponse));

    component.passageForm.patchValue({
      codigo: 'P1',
      codeBuilding1: 'B1',
      codeBuilding2: 'B2',
      FloorBuilding1Name: 'Floor 1',
      FloorBuilding2Name: 'Floor 2',
    });

    component.updatePassage();
    tick();

    expect(passageServiceSpy.updatePassage).toHaveBeenCalledTimes(1);
    expect(component.serverResponse).toEqual(mockResponse);
  }));

  it('should navigate to /passage when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/passage']);
  });

  it('should navigate to /startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });
});
