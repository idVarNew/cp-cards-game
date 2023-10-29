import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { People, PersonResult } from '../app.models';

@Injectable({
  providedIn: 'root',
})
export class AppApiService {
  constructor(private httpClient: HttpClient) { }

  getPeople(): Observable<People> {
    return this.httpClient.get<People>(`https://www.swapi.tech/api/people/`);
  }

  getPerson<T extends PersonResult>(id: number): Observable<T> {
    return this.httpClient.get<T>(`https://www.swapi.tech/api/people/${id}`);
  }
}
