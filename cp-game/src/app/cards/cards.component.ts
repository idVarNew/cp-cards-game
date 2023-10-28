import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent {
  @Input() people: any[] | null
  @Input() currentAttribute: any

  WINNER = "And the winner is"
}
