import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CreatePassageComponent } from './create-passage.component';
import { PassageService } from './../passage.service';
import { BuildingService } from '../../building/building.service';
import { FloorService } from '../../floor/floor.service';
import { of } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

describe('CreatePassageComponent', () => {
  let component: CreatePassageComponent;
  let fixture: ComponentFixture<CreatePassageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let passageServiceSpy: jasmine.SpyObj<PassageService>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;
  let floorServiceSpy: jasmine.SpyObj<FloorService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    passageServiceSpy = jasmine.createSpyObj('PassageService', ['createPassage']);
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['listAllBuildings']);
    floorServiceSpy = jasmine.createSpyObj('FloorService', ['getBuildingFloors']);

    TestBed.configureTestingModule({
      declarations: [CreatePassageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: PassageService, useValue: passageServiceSpy },
        { provide: BuildingService, useValue: buildingServiceSpy },
        { provide: FloorService, useValue: floorServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(CreatePassageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load building list on ngOnInit', fakeAsync(() => {
    const buildings = [{ code: 'Building1' }, { code: 'Building2' }];
    let data: any;
    data = buildings;
    const floors = ['Floor1', 'Floor2'];
    let dataFloors: any;
    dataFloors = floors;

    buildingServiceSpy.listAllBuildings.and.returnValue(of(data).toPromise());
    floorServiceSpy.getBuildingFloors.and.returnValue(of(dataFloors).toPromise());

    component.ngOnInit();
    tick();

    expect(component.buildingList).toEqual(['Building1', 'Building2']);
  }));

  /*it('should load building floors on building selection', fakeAsync(() => {
    const buildings = [{ code: 'Building1' }, { code: 'Building2' }];
    let dataBuildings: any;
    dataBuildings = buildings;
    const floors = ['Floor1', 'Floor2'];
    let dataFloors: any;
    dataFloors = floors;
    const floors2 = ['Floor3', 'Floor4'];
    let dataFloors2: any;
    dataFloors2 = floors2;


    buildingServiceSpy.listAllBuildings.and.returnValue(of(dataBuildings).toPromise());
    floorServiceSpy.getBuildingFloors.and.returnValues(of(dataFloors).toPromise(), of(dataFloors2).toPromise());

    component.createPassageForm.patchValue({ codeBuilding1: 'Building1' });
    component.createPassageForm.patchValue({ codeBuilding2: 'Building2' });
    component.ngOnInit();
    tick();

    expect(buildingServiceSpy.listAllBuildings).toHaveBeenCalledTimes(1);
    expect(floorServiceSpy.getBuildingFloors).toHaveBeenCalledTimes(2);
    expect(component.floorList1).toEqual(['Floor1', 'Floor2']);
  }));
  */

  it('should call createPassage method of PassageService', fakeAsync(() => {
    passageServiceSpy.createPassage.and.returnValue(of('success').toPromise());

    component.createPassageForm.setValue({
      codigo: 'B1',
      codeBuilding1: 'E1',
      codeBuilding2: 'F5',
      FloorBuilding1Name: 'Model',
      FloorBuilding2Name: '123456',
    });
    component.createPassage();
    tick();

    expect(passageServiceSpy.createPassage).toHaveBeenCalledTimes(1);
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
