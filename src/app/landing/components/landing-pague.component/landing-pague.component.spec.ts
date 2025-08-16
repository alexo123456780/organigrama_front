import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPagueComponent } from './landing-pague.component';

describe('LandingPagueComponent', () => {
  let component: LandingPagueComponent;
  let fixture: ComponentFixture<LandingPagueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingPagueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
