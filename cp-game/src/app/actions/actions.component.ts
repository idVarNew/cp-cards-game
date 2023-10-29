import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonAttributes } from '../app.models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  @Input() PERSON_ATTRIBUTES: PersonAttributes[];
  @Input() attributeControl: FormControl<PersonAttributes>;
  @Output() triedAgain: EventEmitter<any> = new EventEmitter();

  TRY_AGAIN = 'Try Again';

  tryAgain(): void {
    this.triedAgain.emit();
  }
}
