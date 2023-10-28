import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from 'rxjs';
import { People, PersonrResult } from '../app.models';

@Injectable({
    providedIn: 'root',
})
export class AppApiService {

    constructor(private httpClient: HttpClient) { }

    getPeople(): Observable<People> {
        return this.httpClient.get<People>(`https://www.swapi.tech/api/people/`).pipe(
            catchError((response: HttpErrorResponse) => throwError(() => response.error))
        );
    }

    getPerson<T extends PersonrResult>(id: number): Observable<T> {
        return this.httpClient.get<T>(`https://www.swapi.tech/api/people/${id}`).pipe(
            catchError((response: HttpErrorResponse) => throwError(() => {
                console.log(response)
                return response.error}
                ))
        );
    }
} 