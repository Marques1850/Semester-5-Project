import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultPageComponent } from './default-page.component';

describe('DefaultPageComponent', () => {
  let component: DefaultPageComponent;
  let fixture: ComponentFixture<DefaultPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultPageComponent],
      imports: [RouterTestingModule]
    });
    fixture = TestBed.createComponent(DefaultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test to check if the title is defined
  it('should have title defined', () => {
    expect(component.title).toBeDefined();
  });

  // Test to check if the title is 'my-app'
  it(`should have as title 'my-app'`, () => {
    expect(component.title).toEqual('my-app');
  });

  // Test to check if the HTML template is loaded
  it('should render title in a h1 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('robdroneGO');
  });

  // Test to check if the footer is rendered
  it('should render footer', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('footer')).toBeTruthy();
  });

  // Test to check if the header is rendered
  it('should render header', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('header')).toBeTruthy();
  });

  // Test to check if the form is rendered
  it('should render form', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('form')).toBeTruthy();
  });

  // Test to check if the login button is rendered
  it('should render login button', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button')).toBeTruthy();
  });

});
