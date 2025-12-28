import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitFaibles } from './produit-faibles';

describe('ProduitFaibles', () => {
  let component: ProduitFaibles;
  let fixture: ComponentFixture<ProduitFaibles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitFaibles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitFaibles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
