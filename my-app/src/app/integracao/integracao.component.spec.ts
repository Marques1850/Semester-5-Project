import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegracaoComponent } from './integracao.component';
import { integracaoService } from './integracao.service';
import { Router } from '@angular/router';

describe('IntegracaoComponent', () => {
  let component: IntegracaoComponent;
  let fixture: ComponentFixture<IntegracaoComponent>;
  let integracaoServiceSpy: jasmine.SpyObj<integracaoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {

    integracaoServiceSpy = jasmine.createSpyObj('integracaoService', ['getUrl', 'getFloors']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [IntegracaoComponent],
      providers:[
        { provide: integracaoService, useValue: integracaoServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    fixture = TestBed.createComponent(IntegracaoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
