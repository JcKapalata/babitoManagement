import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteEnCours } from './vente-en-cours';

describe('VenteEnCours', () => {
  let component: VenteEnCours;
  let fixture: ComponentFixture<VenteEnCours>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenteEnCours]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenteEnCours);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
