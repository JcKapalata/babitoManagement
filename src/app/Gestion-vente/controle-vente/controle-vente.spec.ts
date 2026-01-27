import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleVente } from './controle-vente';

describe('ControleVente', () => {
  let component: ControleVente;
  let fixture: ComponentFixture<ControleVente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControleVente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControleVente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
