import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BayPlotComponent } from './bay-plot.component';

describe('BayPlotComponent', () => {
  let component: BayPlotComponent;
  let fixture: ComponentFixture<BayPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BayPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BayPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
