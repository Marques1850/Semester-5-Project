import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutUsComponent } from './about-us.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('AboutUsComponent', () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutUsComponent],
      providers: [
        { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } },
        { provide: Location, useClass: class { back = jasmine.createSpy("back"); } }
      ]
    });
    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on goToHome call', () => {
    component.goToHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
