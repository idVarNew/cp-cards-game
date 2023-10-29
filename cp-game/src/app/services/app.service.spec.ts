import { RandomNumbers } from '../app.models';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  const minNum = 1;
  const maxNum = 10;

  beforeEach(async () => {
    service = new AppService();
  });

  describe('when getRandomNumber is called', () => {
    let result: number;
    const expectedResult = 10;

    beforeEach(() => {
      result = service.getRandomNumber(minNum, maxNum);
    });
    it('then should result to be less than or equal expectedResult', () => {
      expect(result).toBeLessThanOrEqual(expectedResult);
    });
  });

  describe('when getTwoRandomNumber is called', () => {
    let result: RandomNumbers;
    const num1 = 4;
    const num2 = 8;
    const num3 = 1;

    describe('and random numbers are different', () => {
      const expectedResult = { num1, num2 };

      beforeEach(() => {
        spyOn(service, 'getRandomNumber').and.returnValues(num1, num2);
        result = service.getTwoRandomNumber(minNum, maxNum);
      });
      it('then should call getRandomNumber 2 times', () => {
        expect(service.getRandomNumber).toHaveBeenCalledTimes(2);
      });
      it('then should result to equal expectedResult', () => {
        expect(result).toEqual(expectedResult);
      });
    });

    describe('and random numbers are the same', () => {
      const expectedResult = { num1, num2 };

      beforeEach(() => {
        spyOn(service, 'getRandomNumber').and.returnValues(num3, num3, num1, num2);
        result = service.getTwoRandomNumber(minNum, maxNum);
      });
      it('then should result to have been called 4 times', () => {
        expect(service.getRandomNumber).toHaveBeenCalledTimes(4);
      });
      it('then should result to equal expectedResult', () => {
        expect(result).toEqual(expectedResult);
      });
    });
  });
});
