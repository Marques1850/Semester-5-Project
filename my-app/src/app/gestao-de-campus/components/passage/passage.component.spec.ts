import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PassageComponent } from './passage.component';

describe('PassageComponent', () => {
  let component: PassageComponent;
  let fixture: ComponentFixture<PassageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [PassageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
      ],
    });

    fixture = TestBed.createComponent(PassageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /createPassage when openCreatePassagePage is called', () => {
    component.openCreatePassagePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/createPassage']);
  });

  it('should navigate to /updatePassage when openUpdatePassagePage is called', () => {
    component.openUpdatePassagePage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/updatePassage']);
  });

  it('should navigate to /listPassagesBetweenBuildings when openListPassagesBetweenBuildingsPage is called', () => {
    component.openListPassagesBetweenBuildingsPage();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/listPassagesBetweenBuildings']);
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
