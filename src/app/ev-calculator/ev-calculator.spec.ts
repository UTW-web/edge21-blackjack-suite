import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EVCalculator } from './ev-calculator';

describe('EVCalculator', () => {
  let component: EVCalculator;
  let fixture: ComponentFixture<EVCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EVCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EVCalculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
