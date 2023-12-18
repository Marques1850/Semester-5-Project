import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomComponent } from './room.component';
import { Router } from '@angular/router';
import { RoomService } from './../room/room.service';

describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [RoomComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(RoomComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /createRoom when openCreateRoomPage is called', () => {
    component.openCreateRoomPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/createRoom']);
  });

  it('should navigate to /menuGestorDeCampus when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/menuGestorDeCampus']);
  });

  it('should navigate to /startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });
});
