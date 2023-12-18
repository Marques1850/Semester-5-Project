import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MapfloorComponent } from './mapfloor.component';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FloorService } from './../floor.service';
import { of } from 'rxjs';

describe('MapfloorComponent', () => {
  let component: MapfloorComponent;
  let fixture: ComponentFixture<MapfloorComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let floorServiceSpy: jasmine.SpyObj<FloorService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    floorServiceSpy = jasmine.createSpyObj('FloorService', ['uploadMap']);

    TestBed.configureTestingModule({
      declarations: [MapfloorComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: FloorService, useValue: floorServiceSpy },
      ],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
    });

    fixture = TestBed.createComponent(MapfloorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle file input and update selectedFileName', () => {
    const mockFile = new File([''], 'test.txt');
    const event: unknown = {
      target: {
        files: {
          item: () => mockFile,
        },
      },
    };

    component.handleFileInput(event as Event);
    expect(component.fileToUpload).toEqual(mockFile);
    expect(component.selectedFileName).toEqual('test.txt');
  });

  it('should upload map on valid form submission', fakeAsync(() => {
    const mockResponse = 'Map uploaded successfully';
    floorServiceSpy.uploadMap.and.returnValue(of(mockResponse).toPromise());

    component.mapForm.setValue({
      name: 'Map 1',
      buildingCode: null
    });
    component.fileToUpload = new File([''], 'test.txt');

    component.uploadMap();
    tick();

    expect(floorServiceSpy.uploadMap).toHaveBeenCalledOnceWith(jasmine.any(FormData));
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
