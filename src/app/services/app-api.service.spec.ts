import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';
import { peopleMock, personResultMock } from '../mocks';
import { People, PersonResult } from '../app.models';
import { AppApiService } from './app-api.service';

describe('AppApiService', () => {
  let service: AppApiService;
  let httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

  beforeEach(() => {
    service = new AppApiService(httpClientSpy);
  });

  describe('when getPerson is called', () => {
    let result: Observable<PersonResult>;
    let expectedMassResult = '200';
    const id = 1;

    describe('and there is no error', () => {
      let mock = personResultMock;

      beforeEach(() => {
        httpClientSpy.get.and.returnValue(of(mock));
        result = service.getPerson(id);
      });

      it('then should property mass to equal expectedMassResult', () => {
        service.getPerson(id).subscribe((data) => {
          expect(data.result.properties.mass).toEqual(expectedMassResult);
        });
      });
    });
  });

  describe('when getPeople is called', () => {
    let result: Observable<People>;

    describe('and there is no error', () => {
      let expectedTotalRecordsResult = 82;
      let mock = peopleMock;

      beforeEach(() => {
        httpClientSpy.get.and.returnValue(of(mock));
        result = service.getPeople();
      });

      it('then should total_records to equal expectedTotalRecordsResult', () => {
        service.getPeople().subscribe((data) => {
          expect(data.total_records).toEqual(expectedTotalRecordsResult);
        });
      });
    });
  });
});
