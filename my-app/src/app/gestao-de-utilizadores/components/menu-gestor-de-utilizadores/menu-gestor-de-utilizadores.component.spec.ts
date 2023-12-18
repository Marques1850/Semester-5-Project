import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGestorDeUtilizadoresComponent } from './menu-gestor-de-utilizadores.component';

describe('MenuGestorDeUtilizadoresComponent', () => {
  let component: MenuGestorDeUtilizadoresComponent;
  let fixture: ComponentFixture<MenuGestorDeUtilizadoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuGestorDeUtilizadoresComponent]
    });
    fixture = TestBed.createComponent(MenuGestorDeUtilizadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
