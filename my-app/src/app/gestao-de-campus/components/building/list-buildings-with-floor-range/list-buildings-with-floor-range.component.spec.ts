import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListBuildingsWithFloorRangeComponent } from './list-buildings-with-floor-range.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BuildingService } from './../building.service';
import { of } from 'rxjs';

describe('ListBuildingsWithFloorRangeComponent', () => {
  let component: ListBuildingsWithFloorRangeComponent;
  let fixture: ComponentFixture<ListBuildingsWithFloorRangeComponent>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['listBuildingsWithFloorRange']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ListBuildingsWithFloorRangeComponent],
      providers: [
        { provide: BuildingService, useValue: buildingServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [ReactiveFormsModule], // Importando o módulo de formulários reativos
    });

    fixture = TestBed.createComponent(ListBuildingsWithFloorRangeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call listBuildingsWithFloorRange method of BuildingService and populate buildings array', fakeAsync(() => {
    const mockBuildings = [{ id: 1, name: 'Building 1' }, { id: 2, name: 'Building 2' }];
    let data:any;
    data = mockBuildings;
    buildingServiceSpy.listBuildingsWithFloorRange.and.returnValue(of(data).toPromise());

    // Preencha o formulário com valores válidos
    component.minMaxForm.setValue({ min: '1', max: '10' });

    component.listBuildingsWithFloorRange();
    tick();

    expect(buildingServiceSpy.listBuildingsWithFloorRange).toHaveBeenCalledTimes(1);
    expect(component.buildings).toEqual(mockBuildings);
  }));

  it('should not call listBuildingsWithFloorRange method if form is invalid', fakeAsync(() => {
    // Não preencha o formulário, deixando-o inválido
    component.listBuildingsWithFloorRange();
    tick();

    expect(buildingServiceSpy.listBuildingsWithFloorRange).not.toHaveBeenCalled();
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
