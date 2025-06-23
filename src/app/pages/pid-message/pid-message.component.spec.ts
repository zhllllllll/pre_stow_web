import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIDMessageComponent } from './pid-message.component';

describe('PIDMessageComponent', () => {
  let component: PIDMessageComponent;
  let fixture: ComponentFixture<PIDMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PIDMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PIDMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
