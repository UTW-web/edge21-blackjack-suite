import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  
  active_screen = "rules";
  
  StartGame(type: string) {
    this.active_screen = type;
    this.startGame();
  }
  ngOnInit(): void {
  };

startGame() {
    this.DealNotActive = false;
    this.gameOver=false;
    this.playerHand = [];
    this.playerHand2 = [];
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
    this.playerValue2 = this.sum_card_value(this.playerHand2);
    this.dealerValue = this.sum_card_value(this.dealerHand);
    
    this.SPLC()
    this.INST();

    this.cdr.detectChanges();

    if (this.playerValue === 21 && this.DealNotActive) {
      this.Stand();
    }
}
endGame (message:string) {
  this.gameOver=true;
  this.gameResult = message;
  this.cdr.detectChanges();
};

  gameOver: boolean=false;
  gameResult: string = "";
  PlayersTurn: boolean=true;

  BET:boolean = true;
  BET2:boolean = this.BET;

  NOD: number=8;
  DHS17: boolean = true;
  CDAS: boolean = true;
  DA: boolean = true;
  RA: boolean = false;
  SURR: boolean = true;
  INSY: boolean = true;

  playerHand: any[] = [];
  playerHand2: any[] = [];
  dealerHand: any[] = [];
  deck: any[] = [];

  playerValue: number=0;
  playerValue2: number=0;
  dealerValue: number=0;

  isShuffling: boolean = false;
  private idCounter = 0;
  cards() {
    
    //card objects
    const card_patterns = ['❤️', '♦️', '♠️', '♣️'];
    const card_value: Record<string, number> = {
     /*  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 10, 'Q': 10, 'K': 10,  */
      'A': 11
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
ToggleH17(value: boolean) {
  console.log("Dealer hits soft 17:", value? "ENABLED" : "DISABLED")
}
ToggleBet(value: boolean) {
  console.log("Betting:", value? "ENABLED" : "DISABLED")
  this.BET2 = value;
}
ToggleSplitAfterDouble(value: boolean) {
  console.log("Spliting after double:", value? "ENABLED" : "DISABLED")
}
ToggleDouble(value: boolean) {
  console.log("Double:", value? "ENABLED" : "DISABLED")
}
ToggleSplitAces(value: boolean) {
  console.log("Spliting Aces:", value? "ENABLED" : "DISABLED")
}
ToggleSurrender(value: boolean) {
  console.log("Surrender:", value? "ENABLED" : "DISABLED")
}
ToggleInsurance(value: boolean) {
  console.log("Insurance:", value? "ENABLED" : "DISABLED")
}

bet = 0;
BankRoll:number = 100000;
Betting(value: number) {
  this.bet += value;
}
ClearBet() {
  this.bet = 0;
}
DealNotActive:boolean = false;
Deal() {
  if (this.bet <= 0) {
    console.log("Bet cannot be 0 or below");
    return;
  }

  if (this.BankRoll < this.bet) {
    console.log("Not enough Bank Roll");
    return;
  }

  this.BET2 = false;
  if (this.playerValue === 21) {
        this.Stand();
      }
  this.DealNotActive = true;
}
EndDrill() {
  this.router.navigate(['/'])
}
Double() {
  this.bet = this.bet*2;
  this.drawCard(this.playerHand);
  this.Stand();
}
Surr:boolean = false;
Surrender() {
  this.bet = this.bet/2;
  this.Surr = true;
  this.Stand();
}
INS:boolean = false;
INST() {
  this.INS = this.dealerHand[1]?.value === 'A';
}
insuranceBet = 0;

Insurance(yes: boolean) {
  if (yes) {
    const insuranceCost = this.bet / 2;
    this.BankRoll -= insuranceCost;   
    this.insuranceBet = insuranceCost;

    this.INSC();
  }

  this.INS = false;
}
INSC() {
  for (const cards of this.dealerHand) {
      if (
      cards.value === '10' ||
      cards.value === 'J' ||
      cards.value === 'Q' ||
      cards.value === 'K'
    ) {
          this.BankRoll += this.insuranceBet * 3;
      }
    }
    this.insuranceBet = 0;
}
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
    if (sum_value === 17 && (aces === 1 || aces===2)) {
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

  if (this.playerValue === 21) {
    this.gameResult = "WON - BlackJack";
    this.BankRoll += this.bet*2.5;
  }else if (this.Surr) {
    this.gameResult = "Surrenderd"
  }else if (playerValue === 21) {
    this.gameResult = "WON - BlackJack"
    this.BankRoll += this.bet*2.5
  }else if (dealerValue > 21) {
    this.gameResult = "DEALER BUST - WON"; 
    this.BankRoll += this.bet*2
  } else if (playerValue > dealerValue) {
    this.gameResult = "WON"
    this.BankRoll += this.bet*2
  } else if (playerValue < dealerValue) {
    this.gameResult = "LOST"
  } else {
    this.gameResult = "PUSH (Tie)"
    this.BankRoll += this.bet;
  }

  this.gameOver = true;
  this.cdr.detectChanges();
};
resetHand() {
  this.DealNotActive = false;
  this.gameOver=false;
  this.PlayersTurn=true;

  this.playerHand = [];
  this.playerHand2 = [];
  this.dealerHand = [];

  this.playerValue = 0;
  this.dealerValue = 0;

  this.drawCard(this.playerHand);
  this.drawCard(this.playerHand);
  this.drawCard(this.dealerHand);
  this.drawCard(this.dealerHand);

  this.BankRoll -= this.bet;
  if (this.BET) {
    this.BET2 = true;
  }
  this.SPLC()
  this.INST()

  this.cdr.detectChanges();

  if (this.playerValue === 21 && this.DealNotActive) {
    this.Stand();
  }
};
Hit () {
  if (!this.PlayersTurn || this.isShuffling) return;

  this.drawCard(this.playerHand);
};
SPL:boolean = false;
SPLC () {
      if (this.playerHand.length === 2 && this.playerHand[0].value === this.playerHand[1].value) {
        this.SPL = true;
      }
}
SPLH:boolean = false;
SPLL:boolean = false;
SPLCount = 0;
Split () {
  
  this.SPLH = true;
  if (this.SPLCount === 4) {
    this.SPLL = true;
    return;
  }
  
  this.drawCard(this.playerHand2);
  this.drawCard(this.playerHand2);
  this.SPLCount++;
  
}

};

