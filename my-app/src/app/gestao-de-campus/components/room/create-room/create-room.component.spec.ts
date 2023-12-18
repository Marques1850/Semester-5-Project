import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CreateRoomComponent } from './create-room.component';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RoomService } from './../room.service';
import { FloorService } from './../../floor/floor.service';
import { BuildingService } from './../../building/building.service';
import { of } from 'rxjs';

describe('CreateRoomComponent', () => {
  let component: CreateRoomComponent;
  let fixture: ComponentFixture<CreateRoomComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let roomServiceSpy: jasmine.SpyObj<RoomService>;
  let floorServiceSpy: jasmine.SpyObj<FloorService>;
  let buildingServiceSpy: jasmine.SpyObj<BuildingService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    roomServiceSpy = jasmine.createSpyObj('RoomService', ['createRoom']);
    floorServiceSpy = jasmine.createSpyObj('FloorService', ['getBuildingFloors']);
    buildingServiceSpy = jasmine.createSpyObj('BuildingService', ['listAllBuildings']);

    TestBed.configureTestingModule({
      declarations: [CreateRoomComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: RoomService, useValue: roomServiceSpy },
        { provide: FloorService, useValue: floorServiceSpy },
        { provide: BuildingService, useValue: buildingServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(CreateRoomComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a room when createRoom is called', fakeAsync(() => {
    const mockResponse = 'Room created successfully';
    roomServiceSpy.createRoom.and.returnValue(Promise.resolve(mockResponse));
    buildingServiceSpy.listAllBuildings.and.returnValue(Promise.resolve(['B1', 'B2']));
    floorServiceSpy.getBuildingFloors.and.returnValue(Promise.resolve(['Floor 1', 'Floor 2']));
    component.roomForm.patchValue({
      buildingCode: 'B1',
      floorName: 'Floor 1',
      name: 'Room 101',
      description: 'This is a test room',
      roomtype: 'Classroom',
    });
  
    component.createRoom();
    tick();
  
    let newRoomForm = {
      floorName: component.roomForm.get('floorName')?.value,
      name: component.roomForm.get('name')?.value,
      description: component.roomForm.get('description')?.value,
      roomtype: component.roomForm.get('roomtype')?.value,
    };
  
    expect(roomServiceSpy.createRoom.calls.mostRecent().args[0].value).toEqual(newRoomForm);
    expect(component.serverResponse).toEqual(mockResponse);
  }));
  
  
});
