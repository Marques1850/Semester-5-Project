import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListAllBuildingsComponent } from './list-all-buildings.component';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BuildingService } from './../building.service';
import { of } from 'rxjs';

describe('ListAllBuildingsComponent', () => {
  let component: ListAllBuildingsComponent;
  let fixture: ComponentFixture<ListAllBuildingsComponent>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['listAllBuildings']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ListAllBuildingsComponent],
      providers: [
        { provide: BuildingService, useValue: buildingServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [HttpClientTestingModule], 
    });

    fixture = TestBed.createComponent(ListAllBuildingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call listAllBuildings method of BuildingService and populate buildings array', fakeAsync(() => {
    const mockBuildings = [{ id: 1, name: 'Building 1' }, { id: 2, name: 'Building 2' }];
    let data:any;
    data = mockBuildings;
    buildingServiceSpy.listAllBuildings.and.returnValue(of(data).toPromise());

    component.listAllBuildings();
    tick();

    expect(buildingServiceSpy.listAllBuildings).toHaveBeenCalledTimes(1);
    expect(component.buildings).toEqual(mockBuildings);
  }));

  it('should navigate to /building when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/building']);
  });

  it('should navigate to /startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });
});
