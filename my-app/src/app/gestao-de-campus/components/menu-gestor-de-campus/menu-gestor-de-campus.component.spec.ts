import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGestorDeCampusComponent } from './menu-gestor-de-campus.component';

describe('MenuGestorDeCampusComponent', () => {
  let component: MenuGestorDeCampusComponent;
  let fixture: ComponentFixture<MenuGestorDeCampusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuGestorDeCampusComponent]
    });
    fixture = TestBed.createComponent(MenuGestorDeCampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
