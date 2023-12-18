import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GetFloorsWithPassageComponent } from './get-floors-with-passage.component';
import { Router } from '@angular/router';
import { FloorService } from '../floor.service';
import { of } from 'rxjs';

describe('GetFloorsWithPassageComponent', () => {
  let component: GetFloorsWithPassageComponent;
  let fixture: ComponentFixture<GetFloorsWithPassageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let floorServiceSpy: jasmine.SpyObj<FloorService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    floorServiceSpy = jasmine.createSpyObj('FloorService', ['getFloorsWithPassage']);

    TestBed.configureTestingModule({
      declarations: [GetFloorsWithPassageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: FloorService, useValue: floorServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(GetFloorsWithPassageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get floors with passage on init', fakeAsync(() => {
    const mockFloors = [{ id: 1, name: 'Floor 1' }, { id: 2, name: 'Floor 2' }];
    let data: any;
    data = mockFloors;
    floorServiceSpy.getFloorsWithPassage.and.returnValue(of(data).toPromise());

    component.ngOnInit();
    tick();

    expect(floorServiceSpy.getFloorsWithPassage).toHaveBeenCalledTimes(1);
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
