import { Component, signal } from '@angular/core';

import { EVCalculator } from "./ev-calculator/ev-calculator";
import { BlackJackGame } from './black-jack-game/black-jack-game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EVCalculator, BlackJackGame],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  Active_screen = "main"
}