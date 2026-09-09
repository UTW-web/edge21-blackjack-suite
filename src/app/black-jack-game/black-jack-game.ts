import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DataItem {
  y: number;
  x: number;
}

@Component({
  selector: 'app-black-jack-game',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './black-jack-game.html',
  styleUrl: './black-jack-game.css',
})
export class BlackJackGame implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  
  active_screen = "rules";
  
  StartGame(type: string) {
    this.active_screen = type;
    this.startGame();
  }
  ngOnInit(): void {
  };

startGame() {
    this.gameOver=false;
    this.playerHand = [];
    this.dealerHand = [];
    this.deck = [];
    
    this.cards();
    this.shuffle();
    
    this.drawCard(this.playerHand);
    this.drawCard(this.playerHand);
    this.drawCard(this.dealerHand);
    this.drawCard(this.dealerHand);
    
    this.rules();
    this.playerValue = this.sum_card_value(this.playerHand);
    this.dealerValue = this.sum_card_value(this.dealerHand);

    this.cdr.detectChanges();
}
endGame (message:string) {
  this.gameOver=true;
  this.gameResult = message;
  this.cdr.detectChanges();
};

  gameOver: boolean=false;
  gameResult: string = "";
  PlayersTurn: boolean=true;

  BET: boolean = true;
  NOD: number=8;
  DHS17: boolean = true;
  CDAS: boolean = true;
  DA: boolean = true;
  RA: boolean = false;
  SURR: boolean = true;

  playerHand: any[] = [];
  dealerHand: any[] = [];
  deck: any[] = [];

  playerValue: number=0;
  dealerValue: number=0;

  isShuffling: boolean = false;
  private idCounter = 0;
  cards() {
    
    //card objects
    const card_patterns = ['❤️', '♦️', '♠️', '♣️'];
    const card_value: Record<string, number> = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 10, 'Q': 10, 'K': 10, 'A': 11
    };

    const values = Object.keys(card_value);

    const singleDeck = card_patterns.flatMap(card_pattern =>
      values.map(value => ({
        card_pattern,
        value,
        points: card_value[value]
      }))
    );

  this.deck = [];

  for (let i = 0; i < Number(this.NOD); i++) {
    const deckWithIds = singleDeck.map(card => ({
      ...card,
      id: this.idCounter++
    }));
    this.deck.push(...deckWithIds);
  }

  };

  shuffle() {
  // shuffle(Fisher-Yates algorithm)
      for (let i = this.deck.length-1;i>0;i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
      }
  };

//Hands and deal
drawCard(hand: any[]) {
  console.log("Število kart v kupu:", this.deck.length);
  if (this.isShuffling) return;
  if (this.deck.length === 0) {
    console.log("Deck is empty")
    this.cards()
    this.shuffle()
    this.isShuffling = true;
    setTimeout(() => {
      this.isShuffling = false;
      this.cdr.detectChanges();
      this.drawCard(hand);
    },2000);
    return;
  }
  const card=this.deck.pop();
  if (card) {

    hand.push(card);
    this.playerValue = this.sum_card_value(this.playerHand);
    this.dealerValue = this.sum_card_value(this.dealerHand);

    this.rules()
    this.cdr.detectChanges();
  }
};


sum_card_value(hand:any []) {
    let sum_value=0;
    let aces=0;

    for (const cards of hand) {
      sum_value+=cards.points;
      if (cards.value === 'A') aces+=1;
    }

    while (sum_value>21 && aces>0) {
      sum_value-=10
      aces-=1
    }
    return sum_value;
};

rules() {
  const playerValue=this.sum_card_value(this.playerHand);
  const dealerValue=this.sum_card_value(this.dealerHand);

  if (playerValue > 21) {
    this.gameResult= "LOST - By BUST";
    this.gameOver=true;
    this.PlayersTurn=false;
    this.cdr.detectChanges();
  }
  this.cdr.detectChanges();
};
S17(hand:any []) {
    let S17 = null;
    let sum_value=0;
    let aces=0;

    for (const cards of hand) {
      sum_value+=cards.points;
      if (cards.value === 'A') aces+=1;
    }

    while (sum_value>21 && aces>0) {
      sum_value-=10
      aces-=1
    }
    if (sum_value === 17 && (aces === 1|| aces===2)) {
      S17 = true;
    }

    return S17;

};
Stand() {
  this.PlayersTurn=false;

  while (this.sum_card_value(this.dealerHand) < 17 ||
   this.sum_card_value(this.dealerHand) === 17 && this.DHS17 && this.S17(this.dealerHand)) {
    this.drawCard(this.dealerHand);
  }

  const playerValue=this.sum_card_value(this.playerHand);
  const dealerValue=this.sum_card_value(this.dealerHand);

  if (dealerValue > 21) {
    this.gameResult = "DEALER BUST - WON";
  } else if (playerValue > dealerValue) {
    this.gameResult = "WON"
  } else if (playerValue < dealerValue) {
    this.gameResult = "LOST"
  } else {
    this.gameResult = "PUSH (Tie)"
  }

  this.gameOver = true;
  this.cdr.detectChanges();
};
resetHand() {
  this.gameOver=false;
  this.PlayersTurn=true;

  this.playerHand = [];
  this.dealerHand = [];

  this.playerValue = 0;
  this.dealerValue = 0;

  this.drawCard(this.playerHand);
  this.drawCard(this.playerHand);
  this.drawCard(this.dealerHand);
  this.drawCard(this.dealerHand);

  this.cdr.detectChanges();
};
Hit () {
  if (!this.PlayersTurn || this.isShuffling) return;

  this.drawCard(this.playerHand);
};

};

