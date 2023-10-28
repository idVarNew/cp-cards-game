import { Injectable } from '@angular/core';
import { RandomNumbers } from '../app.models';

@Injectable({
    providedIn: 'root',
})
export class AppService {
    getTwoRandomNumber(min: number, max: number): RandomNumbers {
        const num1 = this.getRandomNumber(min, max)
        const num2 = this.getRandomNumber(min, max)
        return (num1 === num2) ? this.getTwoRandomNumber(min, max) : {num1, num2}
    }

    getRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * max) + min;
    }
}