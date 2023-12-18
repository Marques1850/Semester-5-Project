import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { CreateUserComponent } from './create-user.component';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { of } from 'rxjs';

describe('CreateUserComponent', () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getRoles', 'createUser']);

    TestBed.configureTestingModule({
      declarations: [CreateUserComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles list on init', fakeAsync(() => {
    const roles = [{ name: 'Admin' }, { name: 'Manager' }];
    userServiceSpy.getRoles.and.returnValue(Promise.resolve(roles));

    component.loadRolesList();
    tick();

    expect(component.roleList).toEqual(['Admin', 'Manager']);
  }));

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();

    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();

    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });


  it('should create user', fakeAsync(() => {
    const mockResponse = "success";
    userServiceSpy.createUser.and.returnValue(Promise.resolve(mockResponse));

    component.userForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '123456789'
    });

    component.createUser();
    tick();

    expect(userServiceSpy.createUser).toHaveBeenCalledWith( component.userForm );
    expect(component.serverResponse).toEqual(mockResponse);
  }));

  it('should navigate to menuGestorDeUtilizadores when goBackToMenu is called', () => {
    component.goBackToMenu();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/menuGestorDeUtilizadores']);
  });

  it('should navigate to startMenu when goToHome is called', () => {
    component.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/startMenu']);
  });
});
