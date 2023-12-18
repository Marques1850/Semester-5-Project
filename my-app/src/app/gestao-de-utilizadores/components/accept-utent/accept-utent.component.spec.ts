import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptUtentComponent } from './accept-utent.component';

describe('AcceptUtentComponent', () => {
  let component: AcceptUtentComponent;
  let fixture: ComponentFixture<AcceptUtentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcceptUtentComponent]
    });
    fixture = TestBed.createComponent(AcceptUtentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
