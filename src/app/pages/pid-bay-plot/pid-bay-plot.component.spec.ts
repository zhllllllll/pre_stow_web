import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PidBayPlotComponent } from './pid-bay-plot.component';

describe('PidBayPlotComponent', () => {
  let component: PidBayPlotComponent;
  let fixture: ComponentFixture<PidBayPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PidBayPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PidBayPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
