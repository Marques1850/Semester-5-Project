import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent} from "./login.component";
import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule],
      declarations: [LoginComponent]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let email = component.loginForm.controls['email'];
    expect(email.valid).toBeFalsy();

    email.setValue("");
    expect(email.hasError('required')).toBeTruthy();

    email.setValue("test");
    expect(email.hasError('email')).toBeTruthy();

    email.setValue("test@example.com");
    expect(email.errors).toBeNull();
  });

  it('password field validity', () => {
    let password = component.loginForm.controls['password'];
    expect(password.valid).toBeFalsy();

    password.setValue("");
    expect(password.hasError('required')).toBeTruthy();

    password.setValue("test");
    expect(password.errors).toBeNull();
  });

  it('should login and navigate on success', () => {
    spyOn(router, 'navigate');
    component.loginForm.controls['email'].setValue("test@example.com");
    component.loginForm.controls['password'].setValue("test");
    component.login();

    const req = httpMock.expectOne('http://localhost:3000/api/auth/signin');
    expect(req.request.method).toEqual('POST');
    req.flush({ userDTO: { role: 'admin' } });

    expect(localStorage.getItem('userRole')).toEqual('admin');
    expect(router.navigate).toHaveBeenCalledWith(['/startMenu']);
  });

  it('should log error on login failure', () => {
    spyOn(console, 'error');
    component.loginForm.controls['email'].setValue("test@example.com");
    component.loginForm.controls['password'].setValue("test");
    component.login();

    const req = httpMock.expectOne('http://localhost:3000/api/auth/signin');
    expect(req.request.method).toEqual('POST');
    req.error(new ErrorEvent('Network error'));

    expect(console.error).toHaveBeenCalled();
  });
});
