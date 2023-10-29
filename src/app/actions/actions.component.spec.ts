import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionsComponent } from './actions.component';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersonAttributes } from '../app.models';

describe('ActionsComponent', () => {
  let component: ActionsComponent;
  let fixture: ComponentFixture<ActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionsComponent],
      imports: [MatSelectModule, ReactiveFormsModule, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionsComponent);
    component = fixture.componentInstance;
    component.attributeControl = new FormControl('height') as FormControl<PersonAttributes>;
    component.PERSON_ATTRIBUTES = ['height', 'mass'];
    fixture.detectChanges();
  });

  describe('when tryAgain is called', () => {
    beforeEach(() => {
      spyOn(component.triedAgain, 'emit');
      component.tryAgain();
    });

    it('then should triedAgain.emit to have been called', () => {
      expect(component.triedAgain.emit).toHaveBeenCalled();
    });
  });
});
