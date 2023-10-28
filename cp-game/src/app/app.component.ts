import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EMPTY, Observable, catchError, finalize, forkJoin, map, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Counter, ErrorMsg, People, Person, PersonAttributes } from './app.models';
import { AppApiService, AppService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  TRY_AGAIN_MSG = 'Please try again'
  NO_WINNER_MSG = 'The winner is undecided - some attributes are unknown.'
  APP_TITLE = "CP GAME";
  BASED_ON_ATTRIBUTE = "Winner is based on attribute"
  PERSON_ATTRIBUTES: PersonAttributes[] = ['height', 'mass']

  people$: Observable<Person[]>
  currentAttribute: PersonAttributes = this.PERSON_ATTRIBUTES[0];
  attributeControl = new FormControl(this.currentAttribute) as FormControl<PersonAttributes>
  isWinner = false;
  isLoading = true;
  totalRecords: number;
  errorMessage: string = ''
  counter: Counter = { user1: 0, user2: 0 };

  constructor(private appApiService: AppApiService, private appService: AppService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.people$ = this.appApiService.getPeople().pipe(
      switchMap((response: People): Observable<Person[]> => {
        this.totalRecords = response.total_records;

        this.getTwoPeople();
        return this.getTwoPeople();
      }),
      catchError((error: ErrorMsg) => {
        this.errorMessage = error.message
        return EMPTY;
      }),
      finalize(() => {
        this.isLoading = false
      }))
  }

  tryAgain(): void {
    this.people$ = this.getTwoPeople();
  }

  private getTwoPeople(): Observable<Person[]> {
    const randomNumbers = this.appService.getTwoRandomNumber(1, this.totalRecords);
    this.currentAttribute = this.attributeControl.value;
    this.errorMessage = ''
    this.isLoading = true;

    return forkJoin([
      this.appApiService.getPerson(randomNumbers.num1),
      this.appApiService.getPerson(randomNumbers.num2),
      // this.appApiService.getPerson(17),
      //   this.appApiService.getPerson(45)
    ]).pipe(
      map(([response1, response2]) => {
        const [person1, person2] = [response1.result.properties, response2.result.properties]
        this.checkWhoWin(person1, person2, this.currentAttribute);
        return [person1, person2]
      }),
      catchError((error: ErrorMsg) => {
        this.errorMessage = error.message
        return EMPTY;
      }),
      finalize(() => {
        this.isLoading = false
      })
    )
  }

  private checkWhoWin(person1: Person, person2: Person, attr: PersonAttributes): void {
    const attr1 = Number(person1[attr]);
    const attr2 = Number(person2[attr]);
    const isPersonValue1 = isNaN(attr1)
    const isPersonValue2 = isNaN(attr2);
    const winnerDoNotExists = attr1 === attr2;

    this.isWinner = isPersonValue1 || isPersonValue2 || winnerDoNotExists

    if (this.isWinner) return;

    const isPersonTheWinner = attr1 > attr2;
    person1.winner = isPersonTheWinner;
    person2.winner = !isPersonTheWinner;
    this.counter.user1 += Number(isPersonTheWinner);
    this.counter.user2 += Number(!isPersonTheWinner);
  }
}
