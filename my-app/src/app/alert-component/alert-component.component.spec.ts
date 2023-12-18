import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponentComponent } from './alert-component.component';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('AlertComponentComponent', () => {
  let component: AlertComponentComponent;
  let fixture: ComponentFixture<AlertComponentComponent>;
  let mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  let mockDialogData = {
    message: 'Test message'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertComponentComponent],
      imports: [MatDialogModule], // add this line
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    });
    fixture = TestBed.createComponent(AlertComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog when closeDialog is called', () => {
    component.closeDialog();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should have correct data', () => {
    expect(component.data).toEqual(mockDialogData);
  });

  it('should render dialog content correctly', () => {
    const de = fixture.debugElement.query(By.css('.content'));
    const el = de.nativeElement;
    expect(el.textContent).toContain(mockDialogData.message);
  });
});
