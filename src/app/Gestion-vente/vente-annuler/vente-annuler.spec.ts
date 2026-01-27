import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenteAnnuler } from './vente-annuler';

describe('VenteAnnuler', () => {
  let component: VenteAnnuler;
  let fixture: ComponentFixture<VenteAnnuler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenteAnnuler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenteAnnuler);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
