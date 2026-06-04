import { Component, signal, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { EVCalculator } from "./ev-calculator/ev-calculator";
import { BlackJackGame } from './black-jack-game/black-jack-game';
import { Charts } from "./charts/charts";
import { Info } from "./info/info";
import { Home } from "./home/home";
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
  
})
export class App implements OnInit {
  Main=false;
  constructor(
    private router: Router,
    private swUpdate: SwUpdate
  ) {
    this.router.events.subscribe(event=> {
      if (event instanceof NavigationEnd) {
        this.Main = event.url !== '/'
      }
    })
  };
  Back () {
    this.router.navigate(['/'])
  };

  ngOnInit() {
    // active checking for updates
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {
        if (confirm('New version  of EDGE 21: BlackJack is available! Refresh app?')) {
          window.location.reload();
        };
      });
    }
  }
}