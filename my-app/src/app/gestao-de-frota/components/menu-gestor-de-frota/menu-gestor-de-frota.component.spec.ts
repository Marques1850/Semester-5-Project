import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGestorDeFrotaComponent } from './menu-gestor-de-frota.component';

describe('MenuGestorDeFrotaComponent', () => {
  let component: MenuGestorDeFrotaComponent;
  let fixture: ComponentFixture<MenuGestorDeFrotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuGestorDeFrotaComponent]
    });
    fixture = TestBed.createComponent(MenuGestorDeFrotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
