import { Routes } from '@angular/router';
import { EVCalculator } from "./ev-calculator/ev-calculator";
import { BlackJackGame } from './black-jack-game/black-jack-game';
import { Charts } from "./charts/charts";
import { Info } from "./info/info";
import { Home } from "./home/home";

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'game', component: BlackJackGame },
    { path: 'charts', component: Charts },
    { path: 'calculator', component: EVCalculator },
    { path: 'info', component: Info }
];
