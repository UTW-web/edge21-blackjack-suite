import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-ev-calculator',
  imports: [DecimalPipe],
  templateUrl: './ev-calculator.html',
  styleUrl: './ev-calculator.css',
})
export class EVCalculator implements OnInit {
  // expected value per hour
  public EVPH:number=0;
  // total expected value
  public TEV:number=0;
  // risk of ruin
  public ROR:number=100;
  // bankroll life
  public BKRL:number=0;

ngOnInit () {
  this.count()
};

count() {

  const listCount= document.getElementsByClassName("input-EV-calc");
  const ArrayCount = Array.from(listCount);

  interface DataItem {
    edge:number;
    frequency:number;
  }
  const Data: Record<number, DataItem> = {
    0: { edge: -0.0054, frequency: 0.745 },
    1: { edge:  0.0003, frequency: 0.131 },
    2: { edge:  0.0051, frequency: 0.064 },
    3: { edge:  0.0102, frequency: 0.031 },
    4: { edge:  0.0153, frequency: 0.015 },
    5: { edge:  0.0203, frequency: 0.007 },
    6: { edge:  0.0254, frequency: 0.004 },
    7: { edge:  0.0305, frequency: 0.003 }
  }
  // expected value equation sum
  let EV_EQ_SUM=0;
  // variance per hand equation sum
  let VPH_EQ_SUM=0;

  let D17_g =document.getElementById("D17") as HTMLSelectElement;
  let NOD_g =document.getElementById("NOD") as HTMLSelectElement;
  let DPEN_g = document.getElementById("DPEN") as HTMLInputElement;  
  // number of decks
  let NOD = Number(NOD_g.value) || 8;
  // Decision 17
  let D17 = Number(D17_g.value === "H17") ? 0.0022 : 0;
  // Deck Penetration
  let DPEN = Number(DPEN_g?.value) || 10;
  // Deck penetration decimal
  let DPEN_D = (100 - DPEN) / 100;
  // table penalty
  let tablePenalty = D17 + ((NOD - 1) * 0.00015) 
  for (let i: number=0; i<=7; i++) {
    const InputElement = ArrayCount[i] as HTMLInputElement
    let bet:number=Number(InputElement?.value)|| 0;
    let edge= Data[i].edge - tablePenalty;
    let frequency= Data[i].frequency;
    let ev_equation=bet*edge*frequency;
    EV_EQ_SUM+=ev_equation;

    let vph_equation= (bet * bet) * (1.15 + (NOD - 1) * 0.015) * frequency;
    VPH_EQ_SUM+=vph_equation;
  }

  let HPH_g=document.getElementById("HPH") as HTMLInputElement;
  let HP_g=document.getElementById("HP") as HTMLInputElement;
  let BKR_g=document.getElementById("BKR") as HTMLInputElement;
  // hands per hour
  let HPH=Number(HPH_g?.value) || 200;
  // hands played
  let HP=Number(HP_g?.value) || 1;
  // bank roll
  let BKR=Number(BKR_g?.value) || 0;
  // hourly variance
  let HV:number=VPH_EQ_SUM*HPH;

  this.EVPH=EV_EQ_SUM*HPH * (DPEN_D * DPEN_D);
  this.TEV=this.EVPH*HP;

  this.ROR=100;
  this.BKRL=0;
  if (this.EVPH>0 && BKR>0 && HV>0) {
    // risk of ruin equation
    let ROR_EQ=Math.exp((-2*this.EVPH*BKR)/HV);
    this.ROR=Math.min(ROR_EQ*100, 100);
  }

  // for BKRL
  if (this.EVPH<0 && BKR>0) {
    this.BKRL=BKR/Math.abs(this.EVPH);
  }
console.log("VPH_EQ_SUM:", VPH_EQ_SUM, "NOD:", NOD);
};



}
