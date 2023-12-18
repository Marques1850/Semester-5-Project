import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListPassagesBetweenBuildingsComponent } from './list-passages-between-buildings.component';
import { Router } from '@angular/router';
import { BuildingService } from '../../building/building.service';
import { PassageService } from './../passage.service';
import { of } from 'rxjs';

describe('ListPassagesBetweenBuildingsComponent', () => {
  let component: ListPassagesBetweenBuildingsComponent;
  let fixture: ComponentFixture<ListPassagesBetweenBuildingsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let passageServiceSpy: jasmine.SpyObj<PassageService>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    passageServiceSpy = jasmine.createSpyObj('PassageService', ['listPassagesBetweenBuildings']);
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['listAllBuildings']);

    TestBed.configureTestingModule({
      declarations: [ListPassagesBetweenBuildingsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: PassageService, useValue: passageServiceSpy },
        { provide: BuildingService, useValue: buildingServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(ListPassagesBetweenBuildingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load building list on init', fakeAsync(() => {
    const mockBuildings = [{ code: 'B1' }, { code: 'B2' }];
    buildingServiceSpy.listAllBuildings.and.returnValue(Promise.resolve(mockBuildings));

    component.ngOnInit();
    tick();

    expect(buildingServiceSpy.listAllBuildings).toHaveBeenCalledTimes(1);
    expect(component.buildingList).toEqual(['B1', 'B2']);
  }));

  it('should list passages between buildings', fakeAsync(() => {
    const mockPassages = [{ /* your passage data */ }];
    passageServiceSpy.listPassagesBetweenBuildings.and.returnValue(Promise.resolve(mockPassages));

    component.listPassagesForm.patchValue({ building1: 'B1', building2: 'B2' });
    component.listPassagesBetweenBuildings();
    tick();

    expect(passageServiceSpy.listPassagesBetweenBuildings).toHaveBeenCalledTimes(1);
    expect(component.Passages).toEqual(mockPassages);
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
