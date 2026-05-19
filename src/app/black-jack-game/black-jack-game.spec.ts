import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackJackGame } from './black-jack-game';

describe('BlackJackGame', () => {
  let component: BlackJackGame;
  let fixture: ComponentFixture<BlackJackGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlackJackGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlackJackGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
