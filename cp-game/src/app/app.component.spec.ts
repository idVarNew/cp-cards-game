import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MockComponents } from 'ng-mocks';
import { CardsComponent } from './cards/cards.component';
import { ActionsComponent } from './actions/actions.component';
import { PersonAttributes } from './app.models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppApiService, AppService } from './services';
import { of, throwError } from 'rxjs';
import { errorNotFoundMock, peopleMock, personMock, personResult1Mock, personResultMock } from './mocks';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let appApiServiceMock: jasmine.SpyObj<AppApiService>;
  let appServiceMock: jasmine.SpyObj<AppService>;

  beforeEach(async () => {
    appApiServiceMock = jasmine.createSpyObj(['getPeople', 'getPerson']);
    appServiceMock = jasmine.createSpyObj(['getTwoRandomNumber']);
    appApiServiceMock.getPeople.and.returnValue(of(peopleMock));

    await TestBed.configureTestingModule({
      declarations: [AppComponent, MockComponents(CardsComponent, ActionsComponent)],
      imports: [
        MatSelectModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatProgressSpinnerModule,
      ],
      providers: [{ provide: AppApiService, useValue: appApiServiceMock }, { provide: AppService, useValue: appServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when ngOnInit is called', () => {
    beforeEach(() => {
      component.attributeControl = new FormControl('mass') as FormControl<PersonAttributes>;
      spyOn<any>(component, 'getTwoPeople').and.returnValue(of([personMock, personMock]))
    });

    describe('and there is no error', () => {
      beforeEach(() => {
        component.ngOnInit();
      });

      it('then should getPeople to have been called', () => {
        expect(appApiServiceMock.getPeople).toHaveBeenCalled();
      });
      it('then should isLoading to equal false', () => {
        expect(component.isLoading).toEqual(false);
      });
      it('then should people$ to equal [personMock, personMock]', () => {
        component.people$.subscribe(response => {
          expect(component['getTwoPeople']).toHaveBeenCalled();
          expect(response).toEqual([personMock, personMock]);
        });
      });
    });

    describe('and there is an error', () => {
      beforeEach(() => {
        appApiServiceMock.getPeople.and.returnValue(throwError(() => errorNotFoundMock));
        component.ngOnInit();
      });

      it('then should getPeople to have been called', () => {
        expect(appApiServiceMock.getPeople).toHaveBeenCalled();
      });
      it('then should isLoading to equal false', () => {
        expect(component.isLoading).toEqual(false);
      });
      it('then should handle errors', () => {
        appApiServiceMock.getPeople().subscribe({
          next: (data) => {
            fail('Should have failed with 404 error' + data);
          },
          error: (response) => {
            expect(response.error.status).toEqual(404);
            expect(response.error.error.message).toEqual('Not Found');
          }
        });
      });
    });
  });

  describe('when tryAgain is called', () => {
    const attributes: PersonAttributes[] = ['mass', "height"];

    beforeEach(() => {
      appApiServiceMock.getPerson.and.returnValues(of(personResultMock), of(personResult1Mock));
      appServiceMock.getTwoRandomNumber.and.returnValue({ num1: 1, num2: 2 })
      spyOn<any>(component, 'getTwoPeople').and.callThrough();

    });

    describe('and attribute is the default one', () => {
      beforeEach(() => {
        component.tryAgain();
      });

      it('then should getTwoPeople to have been called', () => {
        expect(component['getTwoPeople']).toHaveBeenCalled();
      });
      it('then should getTwoRandomNumber to have been called', () => {
        expect(appServiceMock.getTwoRandomNumber).toHaveBeenCalled();
      });
      it('then should currentAttribute changed', () => {
        expect(component.currentAttribute).toEqual(attributes[1]);
      });
      it('then should winner to true, and losser to false', () => {
        component.people$.subscribe((data) => {
          expect(data[0].winner).toEqual(false);
          expect(data[1].winner).toEqual(true);
        });
      });
    })

    describe('and attribute was changed', () => {
      beforeEach(() => {
        component.currentAttribute = attributes[0];
        component.attributeControl.setValue(attributes[1])
        component.tryAgain();
      });

      it('then should currentAttribute changed', () => {
        expect(component.currentAttribute).toEqual(attributes[1]);
      });
      it('then should winner to true, and losser to false', () => {
        component.people$.subscribe((data) => {
          expect(data[0].winner).toEqual(false);
          expect(data[1].winner).toEqual(true);
        });
      });
    })
  });
});
