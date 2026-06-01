import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DataItem {
  y: number;
  x: number;
}

@Component({
  selector: 'app-black-jack-game',
  imports: [FormsModule],
  templateUrl: './black-jack-game.html',
  styleUrl: './black-jack-game.css',
})
export class BlackJackGame implements OnInit {
  
  active_screen = "rules";
  
  StartGame(type: string) {
    this.active_screen = type;
  }
  ngOnInit(): void {
    this.engine();
  };

  BET: boolean = true;
  NOD: number=8;
  DHS17: boolean = true;
  CDAS: boolean = true;
  DA: boolean = true;
  RA: boolean = false;
  SURR: boolean = true;
  
  engine() {
    
    //card objects
    const card_patterns = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
    const card_value: Record<string, number> = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 10, 'Q': 10, 'K': 10, 'A': 11
    };

    const values = Object.keys(card_value);

    const deck = card_patterns.flatMap(card_pattern =>
      values.map(value => ({
        card_pattern,
        value,
        points: card_value[value]
      }))
    );

    // shuffle(FIsher-Yates algorithm)
    function shuffle(array: any[]) {
      for (let i = array.length-1;i>0;i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffle(deck)

    //Hands and deal
    let playerHand: any[] = [];
    let dealerHand: any[] = [];

    function drawCard(hand: any[]) {
      if (deck.length > 0) {
        const card=deck.pop();
        if (card) {
          hand.push(card);
        } else {
          console.log("Deck is empty")
        }
      }
    }







  };
};
